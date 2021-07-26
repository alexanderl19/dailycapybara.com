// @ts-ignore
module.exports = async (req, res) => {
  const MongoClient = require("mongodb").MongoClient;
  const Jimp = require("jimp");
  const { readFileSync } = require("fs");
  const { join } = require("path");
  const rectangle = readFileSync(join(__dirname, "_files", "Rectangle.png"));
  let day, credit;

  const imagePromise = new Promise((resolve, reject) => {
    const agg = [
      {
        $sort: {
          _id: -1,
        },
      },
    ];

    MongoClient.connect(
      process.env.MONGO_URI,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (connectErr, client) {
        if (connectErr) reject(connectErr);
        const coll = client
          .db(process.env.MONGO_DB)
          .collection(process.env.MONGO_COLLECTION);
        coll
          .aggregate(agg)
          .toArray()
          .then((result) => {
            credit = `Photo by ${result[0].photographer} on Pexels`;
            day = new Intl.DateTimeFormat("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(new Date(result[0]._id.getTimestamp()));
            resolve(result[0].src.large);
          })
          .catch((err) => {
            reject(err);
          })
          .finally(() => {
            client.close();
          });
      }
    );
  });
  const imageUrl = await imagePromise;
  Jimp.loadFont(
    join(__dirname, "_files", "open-sans-64-black", "open-sans-64-black.fnt")
  ).then((font) => {
    Jimp.read(imageUrl).then((image) => {
      Jimp.read(rectangle).then((rectangle) => {
        let textWidth = Jimp.measureText(font, credit);
        image
          .cover(2000, 1500)
          .crop(0, 1300, 2000, 200)
          .blur(10)
          .composite(rectangle, 0, 0, [
            {
              mode: Jimp.BLEND_SOURCE_OVER,
              opacitySource: 1,
              opacityDest: 1,
            },
          ])
          .print(font, 80, 65, {
            text: day,
            alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
          })
          .print(font, 2000 - 80 - textWidth, 65, {
            text: credit,
            alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
          })
          .getBuffer(Jimp.AUTO, (err, buffer) => {
            Jimp.read(buffer, (err, bottomRectangle) => {
              Jimp.read(imageUrl).then((image) => {
                image
                  .cover(2000, 1500)
                  .composite(bottomRectangle, 0, 1300, [
                    {
                      mode: Jimp.BLEND_SOURCE_OVER,
                      opacitySource: 1,
                      opacityDest: 1,
                    },
                  ])
                  .getBuffer(Jimp.MIME_JPEG, function (err, buffer) {
                    res.setHeader(
                      "Cache-Control",
                      "s-maxage=600, stale-while-revalidate"
                    );
                    res.setHeader("Content-Type", Jimp.MIME_JPEG);
                    res.send(buffer);
                  });
              });
            });
          });
      });
    });
  });
};
