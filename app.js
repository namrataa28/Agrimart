const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const initSchema = require("./models/home");
const ejs_mate = require("ejs-mate");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const mongoStore = require("connect-mongo");
const userRouter = require("./Routes/user.js");
const listing = require("./Routes/listing.js");
const productRouter = require("./Routes/home.js");
const product = require('./models/product');
const flash = require("connect-flash");

require('dotenv').config();

app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname,"public")));
app.engine("ejs", ejs_mate);

const store = mongoStore.create({
    mongoUrl:"mongodb://127.0.0.1:27017/Agrimart",
    crypto:{
        secret:process.env.SESSION_SECRET,
    },
    touchAfter:24 * 3600,
})

app.use(session(
 expressOption = {
    store,
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    }
}))

app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success'); 
    res.locals.error = req.flash('error'); 
    next();
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    next();
})


app.use("/",userRouter);
app.use("/products",listing);

main().then(() => {
    console.log("Connected to database");
}).catch((err) => {
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/Agrimart");
}


app.get("/",async(req,res) => {
    let all_image = await initSchema.find({});
    let spiceList = await product.find({category:"Spices"});
    let cashCrop = await product.find({category:"Cash crops"});
    let liveStock = await product.find({category:"Livestock and Plantation"});
    let cereal = await product.find({category:"Cereals and Grains"})
    let legumes = await product.find({category:"Legumes and Oil Seeds"});
    let fruits = await product.find({category:"Fruits and Vegetables"})
    res.render("./listing/home",{all_image, spiceList,cashCrop,liveStock,cereal,legumes,fruits});
})


app.listen(3000, () => {
    console.log("Server is running on port 3000");
})