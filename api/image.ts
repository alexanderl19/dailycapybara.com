// @ts-ignore
module.exports = (req, res) => {
  const MongoClient = require("mongodb").MongoClient;
  const assert = require("assert");

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
      assert.equal(null, connectErr);
      const coll = client
        .db(process.env.MONGO_DB)
        .collection(process.env.MONGO_COLLECTION);
      coll
        .aggregate(agg)
        .toArray()
        .then((result) => {
          const response = {
            date: result[0]._id.getTimestamp(),
            url: result[0].url,
            imageUrl: result[0].src.large,
            photographer: result[0].photographer,
            photographerUrl: result[0].photographer_url,
          };
          res.setHeader(
            "Cache-Control",
            "s-maxage=600, stale-while-revalidate"
          );
          res.setHeader("Content-Type", "application/json");
          res.status(200).json(response);
        })
        .catch((err) => {
          assert.equal(null, err);
        })
        .finally(() => {
          client.close();
        });
    }
  );
};
