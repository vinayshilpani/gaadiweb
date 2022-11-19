const mongoose = require("mongoose");
const purchForm = new mongoose.Schema(
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
    desc: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

const purWithUs = mongoose.model("purchasewithus", purchForm);
module.exports = purWithUs;