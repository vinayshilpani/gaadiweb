const mongoose = require("mongoose");
const adminDetails = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique:true
    },
    usermail: {
      type: String,
      required: true,
      unique:true
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
  },
  { versionKey: false }
);

const adminDetail = mongoose.model("adminDetails", adminDetails);
module.exports = adminDetail;