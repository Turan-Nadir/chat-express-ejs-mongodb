const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    sender: String,
    text: String,
    receiver: String,
    createdAt:{type:Date, default:Date.now},
    readAt:{type:Date, default:Date.now}
});

module.exports = mongoose.model('Message', messageSchema);
