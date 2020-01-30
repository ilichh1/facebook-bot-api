const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    nombre:String,
    status: Boolean,
    creationDate: mongoose.Schema.Types.Date,
    changedDate: mongoose.Schema.Types.Date,
});

const SettingModel = mongoose.model('Setting', SettingSchema);

module.exports = SettingModel;