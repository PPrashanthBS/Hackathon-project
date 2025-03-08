const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const cors = require("cors");
const Razorpay = require("razorpay");
app.use(express.urlencoded({ extended: true })); 

const port = process.env.PORT || 8080;
const host = process.env.HOST || '0.0.0.0';
const url = `http://${host}:${port}`; 


app.listen(port, host, () => {
    console.log(`Server running at ${url}`);
});


app.use(cors());
app.use(express.json());

app.set("view engine" , "ejs");
app.set("views",path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req,res) => {
    res.render("index");
 });

 app.get("/donate", (req,res) => {
   res.render("donate");
 });

 app.get("/ngos",(req,res) => {
   res.render("ngo");
 });

 const razorpay = new Razorpay({
   key_id: "rzp_test_L7OsWq5L4XGjna",
   key_secret: "TJ7Tgjaa7Fdj1iU1nJ8u7xvU"
});

app.get("/payment",(req,res) => {
   res.render("create-order", { 
      razorpayKey: "rzp_test_L7OsWq5L4XGjna"
    });
})

app.post("/create-order", async (req, res) => {
   try {
       const { amount } = req.body;
       
       if (!amount || isNaN(amount) || amount < 1) {
           return res.status(400).json({ error: "Invalid amount" });
       }
       const amountInPaise = Math.round(amount * 100);

       const options = {
           amount: amountInPaise.toString(),
           currency: "INR",
           receipt: `receipt_${Date.now()}` 
       };

       const order = await razorpay.orders.create(options);
       
       res.json({
           id: order.id,
           amount: order.amount,
           currency: order.currency
       });
       
   } catch (error) {
       console.error('Order creation error:', error);
       res.status(500).json({ error: error.message || 'Could not create order' });
   }
});

app.get("/requests", (req,res) => {
  res.render("requests");
});

app.get("/approved",(req,res) => {
  res.render("approved")
})

 app.listen(port, () => {
    console.log("server listening on 8080")
 });