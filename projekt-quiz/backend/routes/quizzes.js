const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

recordRoutes.route("/quizzes").get(async function (req, res) {
  try {
    const quizzesCollection = dbo.getDb("quiz").collection('quizzes');
    const results = await new Promise((resolve, reject) => {
      quizzesCollection.find().toArray((err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    console.log('Fetched all quizzes');
    res.send(results);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

recordRoutes.route("/quizzes").post(async function (req, res) {
  try {
    const quizzesCollection = dbo.getDb("quiz").collection('quizzes');
    const result = await new Promise((resolve, reject) => {
      quizzesCollection.insertOne(req.body, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    console.log('Added quiz to quizzes collection');
    res.send(result.insertedId);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

recordRoutes.route("/quizzes/:id").get(async function (req, res) {
  try {
    const quizzesCollection = dbo.getDb("quiz").collection('quizzes');
    const id = req.params.id;
    const quiz = await new Promise((resolve, reject) => {
      quizzesCollection.findOne({ _id: ObjectId(id) }, (err, quiz) => {
        if (err) {
          reject(err);
        } else {
          resolve(quiz);
        }
      });
    });
    console.log('Fetched quiz info');
    res.send(quiz);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

recordRoutes.route("/quizzes/edit/:id").put(async function (req, res) {
  try {
    const quizzesCollection = dbo.getDb("quiz").collection('quizzes');
    const id = req.params.id;
    const updatedQuiz = req.body;
    const quiz = await new Promise((resolve, reject) => {
      quizzesCollection.updateOne({ _id: ObjectId(id) }, { $set: updatedQuiz }, (err, quiz) => {
        if (err) {
          reject(err);
        } else {
          resolve(quiz);
        }
      });
    });
    console.log('Updated quiz');
    res.send(quiz);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

recordRoutes.route("/quizzes/:id").delete(async function (req, res) {
  try {
    const quizzesCollection = dbo.getDb("quiz").collection('quizzes');
    const id = req.params.id;
    const quiz = await new Promise((resolve, reject) => {
      quizzesCollection.deleteOne({ _id: ObjectId(id) }, (err, quiz) => {
        if (err) {
          reject(err);
        } else {
          resolve(quiz);
        }
      });
    });
    console.log('Deleted quiz');
    res.send(quiz);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = recordRoutes;