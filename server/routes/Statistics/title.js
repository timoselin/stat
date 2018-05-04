// Require mongoose
var mongoose = require('mongoose');

// Define Schema
var titleSchema = new mongoose.Schema({
	title: { type: String, default: '' },
	trimTitle: { type: String, default: '' },
	keyTable: [{ type: String, default: '' }],
	dataEntry: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DataEntry' }]
});

// Export mongoose model based on schema
module.exports = mongoose.model('Title', titleSchema);
