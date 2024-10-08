"use strict";

const {useDatabase} = require("../init/database");
const database = useDatabase();

const schema = require("../schemas/gum");
module.exports = database.model("Gum", schema);
