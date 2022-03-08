const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Review = require('../models/review');
const {isLoggedIn} = require('../middleware');
const User = require('../models/user');

//
router.get('/cart/products/:productId/add',isLoggedIn, async(req,res)=>{

    try{
    const {productId} = req.params; 
    const product = await Product.findById(productId);
    const user = req.user;

    await user.cart.push(product);
    await user.save();
    req.flash('success',`You have successfully added ${product.name}`);
    res.redirect('/products');
    }catch(e){
        req.flash('error', "Cannot add the product at the moment.Try Again ");
        res.redirect('/error');
    }
})


router.get('/cart/user',isLoggedIn,async(req, res) => {
    

    try{
    const userid = req.user._id;
    const user = await User.findById(userid).populate('cart');
    res.render('./cart/userCart',{cart:user.cart});
    }catch(e){
        req.flash('error', "Try Again ");
        res.redirect('/error');
    }
})


router.get('/cart/products/:productId/addto',isLoggedIn, async(req,res)=>{

    try{
    const {productId} = req.params; 
    const product = await Product.findById(productId);
    const user = req.user;
    
    await user.cart.push(product);
    await user.save();
    req.flash('success',`You have successfully added ${product.name}`);
    res.redirect(`/products/${product._id}`);
    }catch(e){
        req.flash('error', "Oops, Something Went Wrong .Try Again ");
        res.redirect('/error');
    }
    })
    


router.delete('/cart/:productId',isLoggedIn, async(req,res)=>{

    try{
const userid = req.user._id;
const {productId} = req.params;
const user = await User.findById(userid);

   await User.findByIdAndUpdate(userid,{$pull:{cart : productId}});
   req.flash('success',"Successfully Removed");
   res.redirect('/cart/user');
    }catch(e){
        req.flash('error', "Oops, Something Went Wrong .Try Again ");
        res.redirect('/error');
    }

})


module.exports = router;