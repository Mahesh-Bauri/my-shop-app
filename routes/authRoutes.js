const express = require('express');
const User = require('../models/user');
const router = express.Router();
const passport = require('passport');


router.get('/register',(req,res)=>{
    res.render('./auth/signup');
})

// signup
router.post('/register', async(req,res)=>{

    try{
    const {username, password, email} = req.body;
    
    const user = new User({username,email});
    const newUser = await User.register(user,password);
    req.flash('success',"Please login to continue.");
    res.redirect('/login')
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
})

// display login form to the user
router.get('/login', (req,res)=>{
    res.render('./auth/login');
})

// login the user into the sessions
router.post('/login',passport.authenticate('local',
     {
     failureRedirect: '/login',
     failureMessage: true
      }
), (req,res)=>{
    const {username} = req.user;
    
    req.flash('success',`Welcome back ${username}`);
   res.redirect('/products');
})


// Logout the user from the session
router.get('/logout', (req,res)=>{
    req.logout();

    req.flash('success',"You have logged out Successfully!!");
    res.redirect('/login');
})

module.exports = router;









