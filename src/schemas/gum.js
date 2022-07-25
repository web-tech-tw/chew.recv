"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

module.exports = new Schema({
    content: String,
    author: String,
    doc_type: String,
    created_at: Number,
    updated_at: Number,
});
