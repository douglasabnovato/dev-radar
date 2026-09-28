/*
 * PointSchema.js · ponto GeoJSON: coordinates = [longitude, latitude] (ordem exigida pelo MongoDB).
 */
const mongoose = require('mongoose');

const PointSchema = new mongoose.Schema(
    {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true },
    },
    { _id: false },
);

module.exports = PointSchema;
/* fim de PointSchema.js */
