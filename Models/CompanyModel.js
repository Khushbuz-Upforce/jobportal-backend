const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
    recruiterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: false,
    },
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    logo: { type: String }, // file path or URL
    website: { type: String },
    description: { type: String },
    industry: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Company", companySchema);
