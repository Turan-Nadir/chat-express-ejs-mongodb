const express = require('express');
const router = express.Router();
const User = require('../models/user.js');  

router.get('/:userName', async (req, res) => {
  try {
    const userName = req.params.userName;
    const currentUser = await User.findOne({userName});
    res.render('dashboard', { title: `Dashboard ${currentUser.userName}`,  user: currentUser });
  } catch (error) {
    console.error(error);
  }
});
router.post('/:userName/sendRequest', async (req, res) => {
  try {
    const { sendRequestUsername } = req.body;
    const paramsName = req.params.userName;
    const senderUser = await User.findOne({userName:paramsName});
    const receiverUser = await User.findOne({ userName: sendRequestUsername });
    if (!receiverUser) return res.redirect(`/dashboard/${senderUser.userName}`); // Redirect with a message indicating that the user doesn't exist
    const existingRequest = receiverUser.connectionRequests.find(request => request.user.equals(senderUser.userName));
    if (existingRequest)  return res.redirect(`/dashboard/${senderUser.userName}`); // Redirect with a message indicating that the friend request already exists
    receiverUser.connectionRequests.push({ user: senderUser.userName, type: 'received' });
    senderUser.connectionRequests.push({ user: receiverUser.userName, type: 'sent' });
    await receiverUser.save();
    await senderUser.save();
    res.redirect(`/dashboard/${senderUser.userName}`);
  } catch (error) {
    console.error(error);
  }
});

router.post('/:userName/acceptRequest', async (req, res) => {
  try {
    const { requestId } = req.body;
    const paramsName = req.params.userName;
    const currentUser = await User.findOne({ userName: paramsName });
    const requestIndex = currentUser.connectionRequests.findIndex(request => request._id.equals(requestId));
    if (requestIndex === -1)  return res.redirect('back'); 
    const senderUser = await User.findOne({userName:currentUser.connectionRequests[requestIndex].user});
    senderUser.connections.push({ user: currentUser.userName, status: 'connected' });
    currentUser.connections.push({ user: senderUser.userName, status: 'connected' });
    currentUser.connectionRequests.splice(requestIndex, 1);
    senderUser.connectionRequests.splice(requestIndex, 1);
    await currentUser.save();
    await senderUser.save();
    res.redirect(`/dashboard/${currentUser.userName}`);
  } catch (error) {
    console.error(error);
  }
});

router.post('/:userName/rejectRequest', async (req, res) => {
  try {
    const { requestId } = req.body;
    const paramsName = req.params.userName;
    const currentUser = await User.findOne({ userName: paramsName });
    const requestIndex = currentUser.connectionRequests.findIndex(request => request._id.equals(requestId));
    if (requestIndex === -1) return res.redirect(`/dashboard/${senderUser.userName}`); 
    const senderUser = await User.findOne({userName:currentUser.connectionRequests[requestIndex].user});
    const senderConnectionIndex = senderUser.connections.findIndex(connection => connection.user.equals(currentUser.userName));
    if (senderConnectionIndex !== -1) senderUser.connections.splice(senderConnectionIndex, 1);
    currentUser.connectionRequests.splice(requestIndex, 1);
    senderUser.connectionRequests.splice(requestIndex, 1);
    await currentUser.save();
    await senderUser.save();
    res.redirect(`/dashboard/${currentUser.userName}`);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;