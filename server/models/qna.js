const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userRole: { type: String, enum: ["farmer", "shopowner"], required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const QuestionSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  body: { type: String, required: true },
  tags: [{ type: String }],
  category: { 
    type: String, 
    enum: ["Pest Control", "Soil Health", "Government Schemes", "Crop Management"], 
    required: true 
  },
  type: { 
    type: String, 
    enum: ["farmer-farmer", "farmer-shopowner"], 
    required: true 
  },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true },
  answers: [AnswerSchema],
}, { timestamps: true });

module.exports= mongoose.model("Question", QuestionSchema);
