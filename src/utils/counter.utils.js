const mongoose = require("mongoose");

async function getNextSequence(name, session) {
  const counterCollection = mongoose.connection.collection("counters");
  const result = await counterCollection.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { returnDocument: "after", upsert: true, session: session }
  );

  return result.seq;
}

module.exports = { getNextSequence };
