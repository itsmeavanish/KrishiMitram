// routes/queryRoutes.js
const express = require("express");
const {
  createQuery,
  getAllQueries,
  answerQuery,
  getQueriesByFarmer,
} = require("../controllers/queryController");

const router = express.Router();

// Create a new query (Farmer only)
router.post("/createquery", createQuery);

// Get all queries with farmer + answers (for admin/agri-officer dashboard)
router.get("/", getAllQueries);

// Answer a query (Agri-officer only)
router.post("/:queryId/answer", answerQuery);

// Get all queries posted by a specific farmer
router.get("/farmer/:farmerId", getQueriesByFarmer);

module.exports = router;
