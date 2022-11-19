const mongoose = require("mongoose");
const sellForm = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    formtype: {
        type: String,
        required: true,
      },
  },
  { versionKey: false }
);

const sellWithUs = mongoose.model("sellwithus", sellForm);
module.exports = sellWithUs;