const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  home: {
    type: String,
  },
  work: {
    type: String,
  },
  saved: {
    type: String,
  },
});
