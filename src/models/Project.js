const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 100
    },
    description: {
        type: String,
        default: ""
    }
}, { timestamps: true,
    collection: "PMS"});

module.exports = mongoose.model("Project", projectSchema);
