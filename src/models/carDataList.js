const mongoose = require("mongoose");
const carData = new mongoose.Schema(
    {
        fuel_engine: {
            type: String,
        },
        year_range: {
            type: String,
        },
        make: {
            type: String,
        },
        model: {
            type: String,
        },
        sku_category: {
            type: String,
        },
    },
    { versionKey: false }
);

const carDataList = mongoose.model("carDataList", carData);
module.exports = carDataList;