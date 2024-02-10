const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const dashboard = require('./routes/dashboard.js');
const auth = require('./routes/authentication.js');
const chat = require('./routes/chat.js');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3060;
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public')); 
app.set('view engine', 'ejs');
app.use('/dashboard', dashboard);
app.use('/chat', chat);
app.use('/', auth);

mongoose.connect('mongodb://localhost/Messenger')
 .then(()=>{console.log("connected to local mongodb")})
 .catch(err=>console.log('error happened ', err));


app.listen(port, ()=>{
    console.log(`listening on port http://localhost:${port}`);
});