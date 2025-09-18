// routes/qnaRoutes.js
const express = require("express");
const Question = require("../models/qna");

const router = express.Router();

/**
 * @route   GET /api/qna
 * @desc    Fetch all QnAs (optional filter by type)
 */
router.get("/", async (req, res) => {
  try {
    const { type } = req.query; // "farmer-farmer" or "farmer-shopowner"
    const filter = type ? { type } : {};
    const qnas = await Question.find(filter).populate(
      "authorId",
      "name email"
    );
    res.json(qnas);
  } catch (err) {
    console.log(err);
    
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   POST /api/qna
 * @desc    Create new QnA (question)
 */
router.post("/", async (req, res) => {
  try {
    const { subject, body, tags, category, type, authorId } = req.body;

    const newQna = new Question({
      subject,
      body,
      tags,
      category,
      type,
      authorId,
    });

    await newQna.save();
    res.status(201).json(newQna);
  } catch (err) {
    console.log(err);
    
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   POST /api/qna/:id/answers
 * @desc    Add an answer to a question
 */
router.post("/:id/answers", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, userRole, text } = req.body;
    console.log(req.body);
    console.log(id);
    
    

    if (!userId || !userRole || !text) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ error: "Question not found" });

    const newAnswer = {
      userId,
      userRole,
      text,
      createdAt: new Date(),
    };

    question.answers.push(newAnswer);
    await question.save();

    res.status(201).json({
      message: "Answer added successfully",
      question,
    });
  } catch (err) {
    console.log(err);
    
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
