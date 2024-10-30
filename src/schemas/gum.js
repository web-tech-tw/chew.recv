"use strict";

const mongoose = require("mongoose");
const {Schema} = mongoose;

module.exports = new Schema({
    content: String,
    author: String,
    type: String,
}, {
    timestamps: true,
});
