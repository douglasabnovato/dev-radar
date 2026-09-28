/*
 * Dev.js · desenvolvedor com localização GeoJSON (índice 2dsphere) e usuário do GitHub único.
 */
const mongoose = require('mongoose');
const PointSchema = require('./utils/PointSchema');

const DevSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        github_username: { type: String, required: true, unique: true, lowercase: true, trim: true },
        bio: { type: String, default: '' },
        avatar_url: { type: String, required: true },
        techs: { type: [String], index: true },
        location: { type: PointSchema, required: true, index: '2dsphere' },
    },
    { timestamps: true },
);

module.exports = mongoose.model('Dev', DevSchema);
/* fim de Dev.js */
