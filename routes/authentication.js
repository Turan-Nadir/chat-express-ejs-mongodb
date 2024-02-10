const express = require('express');
const User = require('../models/user.js');
const router = express.Router();

router.get('/', (req,res)=>{
  res.render('index');
})
router.get('/register', (req, res) => {
  res.render('register', { title: 'Registration', mainh1: 'Create an Account', mainp1: 'Join the community!', error: 'Registration failed. Please try again.' });
  });

router.post('/register', async (req, res) => {
  try {
    const { userName, firstName, surname, email, password, age } = req.body;
    const newUser = new User({ userName,firstName,surname, email, password: password, age,});
    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.render('register', { title: 'Registration', mainh1: 'Create an Account', mainp1: 'Join the community!', error: 'Registration failed. Please try again.' });
  }
});

  router.get('/login', (req, res) => {
    res.render('login', { title: 'Login', mainh1: 'Welcome Back', mainp1: 'Log in to your account' });
  });

  router.post('/login', async (req, res) => {
    try {
      const { userName, password } = req.body;
      const user = await User.findOne({ userName });
      if (!user || password !== user.password) {
        return res.render('login', { title: 'Login', mainh1: 'Welcome Back', mainp1: 'Invalid Password or Username', error: 'Invalid username or password. Please try again.' });
      }
  
      res.redirect(`/dashboard/${user.userName}`);
    } catch (error) {
      console.error(error);
      res.render('login', { title: 'Login', mainh1: 'Welcome Back', mainp1: 'Log in to your account', error: 'Login failed. Please try again.' });
    }
  });

module.exports = router;