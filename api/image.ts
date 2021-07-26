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
          res.redirect(result[0].src.medium);
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
