const mongoose = require("mongoose");
const partForm = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobile: {
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
    carBrand: {
      type: String,
      required: true,
    },
    carModel: {
      type: String,
      required: true,
    },
    carYear: {
      type: String,
      required: true,
    },
    carParts: {
      type: Array,
      required: true,
    },
  },
  { versionKey: false }
);

const partsForm = mongoose.model("partForm", partForm);
module.exports = partsForm;
