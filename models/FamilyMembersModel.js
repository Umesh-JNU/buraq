const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const familyMemberSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Please provide name."],
    },
    mobile: {
      type: String,
      required: [true, "Please provide mobile number."],
      unique: true,
    },
    age: {
      type: String,
      required: [true, "Please provide age."],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FamilyMembers", familyMemberSchema);
