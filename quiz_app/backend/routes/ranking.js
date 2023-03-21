const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

recordRoutes.route("/quizzes/play/:id").patch(async function (req, res) {
  try {
    const quizzesCollection = dbo.getDb("quiz").collection('quizzes');
    const id = req.params.id;
    const newRanking = req.body;
    const existing = await quizzesCollection.findOne({ _id: ObjectId(id), "ranking.playerName": newRanking.playerName }, { "ranking.$": 1 });
    if (!existing) {
      await quizzesCollection.updateOne(
        { _id: ObjectId(id) },
        { $push: { ranking: newRanking } }
      );
    }
    else {
      const existingHigherScore = await quizzesCollection.aggregate([
        { $match: { _id: ObjectId(id) } },
        { $unwind: "$ranking" },
        { $match: { "ranking.playerName": newRanking.playerName, "ranking.score": { $gt: newRanking.score } } },
        { $sort: { "ranking.score": -1 } },
      ]).toArray();
      const existingEqualScore = await quizzesCollection.findOne({
        _id: ObjectId(id),
        "ranking": { $elemMatch: { playerName: newRanking.playerName, score: newRanking.score } }
      });

      if (existingHigherScore.length == 0 && !existingEqualScore) {
        await quizzesCollection.updateOne(
          {
            _id: ObjectId(id), "ranking.playerName": newRanking.playerName,
            "ranking.score": { $lt: newRanking.score }
          },
          { $set: { "ranking.$": newRanking } }
        );
      }
    }

    console.log("Updated quiz ranking");
    res.send("Successfully updated quiz ranking");
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = recordRoutes;