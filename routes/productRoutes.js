const express = require('express');
const Product = require('../models/product');
const router = express.Router();
const Review = require('../models/review');
const {isLoggedIn} = require('../middleware');


// To get all the products
router.get("/products", async (req,res)=>{
   
    try{
    const products = await Product.find({});
    res.render('index',{products});
    }catch(e){
        req.flash('error', "Oops, Something Went Wrong .Try Again ");
        res.redirect('/error');
    }
})


// Get the form for a new product
router.get("/product/new",isLoggedIn,(req,res)=>{
    res.render('./products/new');

})


// Create a new product
router.post("/products",isLoggedIn, async(req,res)=>{

    try{
    const newProduct = req.body;
    await Product.create(newProduct);
    req.flash('success', 'Product Created Successfuly');
    res.redirect('/products');
    }catch(e){
        req.flash('error', "Oops, Something Went Wrong .Try Again ");
        res.redirect('/error');
    }
})


// show a particular product
router.get("/products/:id", async(req,res)=>{
   
    try{
   const {id} = req.params;
   const product =  await Product.findById(id).populate('reviews');
   const success = req.flash('success');
   res.render('./products/show',{product});
    }catch(e){
        req.flash('error', "Oops, Something Went Wrong .Try Again ");
        res.redirect('/error');
    }
})


// To get the edit page
router.get("/products/:id/edit",isLoggedIn, async(req,res)=>{

    try{
    const {id} = req.params;
    const product = await Product.findById(id);
    res.render('./products/edit',{product});
    }catch(e){
        req.flash('error', "Oops, Something Went Wrong .Try Again ");
        res.redirect('/error');
    }
})


// Updating a particular product with the given id
router.patch("/products/:id", async(req,res)=>{

    try{
    const {id} = req.params;
    await Product.findByIdAndUpdate(id,req.body);
    req.flash('success','Updated Your Product Successfuly!')
    res.redirect(`/products/${id}`);
    }catch(e){
        req.flash('error', "Oops, Something Went Wrong .Try Again ");
        res.redirect('/error');
    }
})


// Delete a particular product
router.delete("/products/:id", isLoggedIn,async (req,res)=>{

    try{
    const {id } = req.params;

    await Product.findByIdAndDelete(id);
    req.flash('success', 'You have deleted successfully');
    res.redirect("/products");
    }catch(e){
        req.flash('error', "Oops, Something Went Wrong .Try Again ");
        res.redirect('/error');
    }

})

router.post("/products/:id/review",isLoggedIn, async(req,res)=>{

   try{
    const {id} = req.params;
    const {rating,comment,} = req.body;
    const review = new Review({rating:rating,comment:comment,user:req.user.username});
    const product = await Product.findById(id);

    if(comment.length === 0){
        req.flash('warning', 'Please add some comment');
     res.redirect(`/products/${id}`);
     return;
    }
    product.reviews.unshift(review);
    review.save();
    product.save();
    req.flash('success', 'You have successfully created your review');
    res.redirect(`/products/${id}`);
   }catch(e){
    req.flash('error', "Oops, Something Went Wrong .Try Again ");
    res.redirect('/error');
   }
})


router.delete("/products/:productid/review/:reviewid",isLoggedIn, async(req,res) =>{

    try{
    const {productid,reviewid} = req.params;
    await Product.findByIdAndUpdate(productid,{ $pull: {reviews : reviewid}});
    await Review.findByIdAndDelete(reviewid);
 
    req.flash('success', 'You have deleted review successfully');
    res.redirect(`/products/${productid}`);
    }catch(e){
        req.flash('error', "Oops, Something Went Wrong .Try Again ");
        res.redirect('/error');
    }
})

module.exports= router;