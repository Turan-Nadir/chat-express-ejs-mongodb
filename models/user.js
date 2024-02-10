const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = new Schema({
    userName:String,
    password:String,
    email:String,
    firstName:String,
    surname:String,
    age:Number,
    subscribed:{type:Date, default:Date.now},
    connectionRequests: [{
      user: { type: String, ref: 'User' },
      type: { type: String, enum: ['sent', 'received'] },
      status:{type: String, enum:["pending",'accepted', 'rejected']},
      createdAt: { type: Date, default: Date.now }
    }],
    connections: [{
      user: { type: String, ref: 'User' },
      status: { type: String, enum: ['connected', 'blocked'] },
      connectedAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('User',User);