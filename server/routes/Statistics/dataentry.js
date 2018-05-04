var mongoose = require('mongoose');

// Define Schema
var dataEntrySchema = new mongoose.Schema({
	key: {type: String, default: ''},
    val: {type: Number, default: ''},
    date: {type: Date, default: Date.now}
});

// Export mongoose model based on schema
module.exports = mongoose.model('DataEntry', dataEntrySchema);