const express = require('express');
const User = require('../models/user.js');
const Message = require('../models/message.js');
const router = express.Router();

router.get('/:sender/:receiver', async (req, res) => {
    const sender = await User.findOne({ userName: req.params.sender });
    const receiver = await User.findOne({ userName: req.params.receiver });
    const messages = await Message.find({ $or: [
            { sender: sender.userName, receiver: receiver.userName }, { sender: receiver.userName, receiver: sender.userName }
        ]});
    res.render('chat',{sender, receiver, messages});
});

router.post('/:sender/:receiver', async (req,res)=>{
    const sender = await User.findOne({userName:req.params.sender});
    const receiver = await User.findOne({userName:req.params.receiver});
    const {text} = req.body;
    const message = new Message({sender:sender.userName, receiver:receiver.userName, text});
    await message.save();
    const messages = await Message.find({ $or: [
        { sender: sender.userName, receiver: receiver.userName }, { sender: receiver.userName, receiver: sender.userName }
    ]});
        res.render('chat', {sender, receiver, messages});
});
module.exports = router;