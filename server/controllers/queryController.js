const Query = require("../models/Query");
// POST /api/queries
const createQuery = async (req, res) => {
  try {
    const { query, userId, geolocation } = req.body;

    const newQuery = await Query.create({
      query,
      userId,
      geolocation,
    });

    res.status(201).json(newQuery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// GET all queries with farmer details
const getAllQueries = async (req, res) => {
  try {
    const queries = await Query.find()
      .populate("userId", "name email phone address") // select only required farmer fields
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json(queries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching queries", error: error.message });
  }
};




// POST answer to a query
const answerQuery = async (req, res) => {
    try {
        const { id } = req.params; // queryId from URL
        const { answer, answeredBy } = req.body;
        
        if (!answer || !answeredBy) {
            return res.status(400).json({ message: "Answer and answeredBy are required" });
        }
        
    const updatedQuery = await Query.findByIdAndUpdate(
      id,
      {
          answer,
        answeredBy,
        answeredAt: new Date(),
    },
    { new: true } // return updated document
).populate("userId", "name email phone address");

    if (!updatedQuery) {
      return res.status(404).json({ message: "Query not found" });
    }

    res.status(200).json(updatedQuery);
  } catch (error) {
      res.status(500).json({ message: "Error posting answer", error: error.message });
  }
};

// GET all queries of a farmer by userId
const getQueriesByFarmer = async (req, res) => {
  try {
    const { userId } = req.params; // Farmer's ObjectId

    const queries = await Query.find({ userId })
      .populate("userId", "name email phone address") // fetch farmer details
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json(queries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching queries", error: error.message });
  }
};

module.exports = { createQuery, getAllQueries, answerQuery, getQueriesByFarmer };