const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
// const initSchema = require("./models/home");
const ejs_mate = require("ejs-mate");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const mongoStore = require("connect-mongo");
const userRouter = require("./Routes/user.js");
const listing = require("./Routes/listing.js");
const HomeRouter = require("./Routes/home.js");
const product = require('./models/product');
const ProductRouter = require("./Routes/product.js");
const flash = require("connect-flash");
const Razorpay = require("razorpay");
const fs = require("fs");
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');
const {isLogged} = require("./middleware");
const {saveRedirectUrl} = require("./middleware");

require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname,"public")));
app.engine("ejs", ejs_mate);

main().then(() => {
    console.log("Connected to database");
}).catch((err) => {
    console.log(err);
})

async function main(){
    await mongoose.connect(process.env.MONGODB_URL);
}

//razorpay started
const razorpay = new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET,
})

// Function to read data from JSON file
const readData = () => {
    if (fs.existsSync('orders.json')) {
      const data = fs.readFileSync('orders.json');
      return JSON.parse(data);
    }
    return [];
   };
// Function to write data to JSON file
const writeData = (data) => {
    fs.writeFileSync('orders.json', JSON.stringify(data, null, 2));
   };

   // Initialize orders.json if it doesn't exist
if (!fs.existsSync('orders.json')) {
    writeData([]);
   }

app.post('/create-order', async (req, res) => {
    try {
      const amount = Number(req.body.amount); // Ensure number type
      if (isNaN(amount)) {
        throw new Error(`Invalid amount: ${req.body.amount}`);
      }
      console.log("Creating order with amount:", amount);
      if (!amount || amount <= 0) throw new Error("Invalid amount");
      const options = {
        amount: Math.round(amount), // Convert to paise
        currency: "INR",
        receipt: `order_${Date.now()}`
      };
  
      const order = await razorpay.orders.create(options);
      res.json(order);
    } catch (error) {
      console.error("Order creation failed:", error.error || error);
      res.status(400).json({ 
        error: "Payment failed",
        details: error.error?.description || error.message 
      });
    }
  });
  app.get('/payment-success', (req, res) => {
    res.sendFile(path.join(__dirname, 'success.html'));
  });
  app.post('/verify-payment', (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  
    const secret = razorpay.key_secret;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
  
    try {
      const isValidSignature = validateWebhookSignature(body, razorpay_signature, secret);
      if (isValidSignature) {
        // Update the order with payment details
        const orders = readData();
        const order = orders.find(o => o.order_id === razorpay_order_id);
        if (order) {
          order.status = 'paid';
          order.payment_id = razorpay_payment_id;
          writeData(orders);
        }
        res.status(200).json({ status: 'ok' });
        console.log("Payment verification successful");
      } else {
        res.status(400).json({ status: 'verification_failed' });
        console.log("Payment verification failed");
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Error verifying payment' });
    }
  });
  //razorpay ended

const store = mongoStore.create({
    mongoUrl:process.env.MONGODB_URL,
    crypto:{
        secret:process.env.SESSION_SECRET,
    },
    touchAfter:24 * 3600,
})

store.on("error", ()=>{
  console.log("Session store error",err);
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


app.use("/user",userRouter);
app.use("/products",listing);
app.use("/",HomeRouter);
// app.use("/product",ProductRouter);


app.get('/product/:productId',isLogged,async(req,res) => {
    let user = await User.findOne({email:req.user.email});
    user.cart.push(req.params.productId);
    await user.save();
    // console.log(user.cart);
    req.flash("success","Added to cart");
    res.redirect(req.get("Referer") || "/default-page");
})

app.get('/payment',(req,res) => {
    res.render('./listing/payment');
})

app.get("/:category/:productId",isLogged, async(req,res) => {
  let productId = req.params.productId;
  let category = req.params.category;
  let Product = await product.findById(productId);
  res.render("./listing/map",{Product});
})

app.get("/search",isLogged,async(req,res) => {
    let search = req.query.q;
    let Product = await product.find({title:{$regex:search,$options:"i"}});
    if(Product.length === 0){
        req.flash("error","No product found");
        return res.redirect("/");
    }
    res.render("./listing/search",{Product});
})
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});