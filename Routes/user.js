const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const {isLogged} = require("../middleware");
const {saveRedirectUrl} = require("../middleware");

router.get("/signup",(req,res) => {
    res.render("user/signup.ejs");
})

router.post("/signup", async(req,res) => {
    try{
        const {username,email, location, category, password} = req.body;
        const newUser = new User({username, email, location, category});
        const userRegister = await User.register(newUser,password);
        console.log(userRegister);
        req.login(userRegister,(err) => {
            if(err) return next(err);
            res.redirect("/");
        });
        req.flash("success","Welcome to the AgriMart family");
    }
    catch(err){
        req.flash("error","User already exists");
        res.redirect("/signup");
    }
});

router.get("/login",(req,res) => {
    res.render("user/login.ejs");
})

router.post("/login",saveRedirectUrl, passport.authenticate("local",{failureRedirect:"/login", failureFlash:true}),(req,res) => {
  
    req.flash("success","Logged in successfully");
    res.redirect("/");
})

router.get("/logout",(req,res) => {
    req.logout((err) => {
      if(err){
        return next(err);
      }else{
        req.flash("success","Logged out successfully");
        res.redirect("/");
      }
    });
   
})

module.exports = router;

