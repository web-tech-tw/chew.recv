"use strict";

const mongoose = require("mongoose");
const {Schema} = mongoose;

module.exports = new Schema({
    content: String,
    author: String,
    type: String,
    created_at: Number,
    updated_at: Number,
});
