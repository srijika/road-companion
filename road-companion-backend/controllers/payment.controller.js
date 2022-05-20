const {
  UserLogins,
  UserTrip,
  UserVehicle,
  Rider,
  WithdrawRequest,
  AddCash,
} = require("../_helper/db");
const mongoose = require("mongoose");
// const { sendNotificationSingle, sendNotificationSingleTest } = require('../_helper/firebase/helper');
const request = require("request");

let stripe_secret_key = process.env.STRIPE_SECRET_KEY;

const stripe = require("stripe")(stripe_secret_key);
const client_id = process.env.STRIPE_CLIENT_ID;
const client_secret = process.env.STRIPE_SECRET_KEY;

module.exports = {
  addCardStripe: async (req, res, next) => {
    console.log("app card stripe api calling");
    try {
      const { email, name } = req.body;
      // validation--------------------------
      if (!email) {
        return res.send({ status: 400, message: "Email is Required" });
      }
      if (!name) {
        return res.send({ status: 400, message: "Name is Required" });
      }

      let customerId;

      //Gets the customer who's email id matches the one sent by the client
      const customerList = await stripe.customers.list({
        email: email,
        limit: 1,
      });

      //Checks the if the customer exists, if not creates a new customer

      if (customerList.data.length !== 0) {
        console.log("customer already");
        customerId = customerList.data[0].id;

        return res.send({
          status: 400,
          message: "This email address already added in stripe account!",
        });
      } else {
        const customer = await stripe.customers.create({
          email: req.body.email,
          name: req.body.name,
        });
        customerId = customer.id;
      }

      const isBarber = await UserLogins.findOneAndUpdate(
        { email: email },
        { stripe_customer_id: customerId }
      );

      if (!isBarber) {
        return res.send({ status: 400, message: "Something went wrong!" });
      }

      console.log("working url send");

      const url =
        "https://connect.stripe.com/express/oauth/authorize?redirect_uri=http://3.145.117.190:8080/api/create-stripe-account&client_id=" +
        client_id +
        "&state=" +
        customerId +
        "&stripe_user[email]=" +
        email +
        "&suggested_capabilities[]=card_payments&scope=read_write&always_prompt=true&stripe_user[name]=" +
        name;

      return res.send({ status: 200, customerId: customerId, url: url });
    } catch (error) {
      return res.send({ status: 400, message: error.message });
    }
  },

  createStripeAccount: async (req, res, next) => {
    console.log("create stripe account 1 api calling working");

    console.log("req.query ===");
    console.log(req.query);

    try {
      const { code, state } = req.query;

      await UserLogins.findOneAndUpdate(
        { stripe_customer_id: state },
        { $set: { stripe_account: code } }
      );

      const options = {
        method: "POST",
        url: "https://connect.stripe.com/oauth/token",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_secret: client_secret,
          code: code,
          grant_type: "authorization_code",
        }),
      };
      request(options, async function (error, response) {
        if (error) throw new Error(error);
        let responseBody = JSON.parse(response.body);
        console.log("responseBody");
        console.log(responseBody);
        const barber = await UserLogins.findOneAndUpdate(
          { stripe_customer_id: state },
          { stripe_account: responseBody.stripe_user_id }
        );
      });

      return res.status(200).send({
        status: 200,
        data: "success",
        message: "Account Created successfully",
      });
    } catch (error) {
      console.log("catch error");
      return res.status(400).send({ status: 400, message: error.message });
    }
  },

  getAddCashTransactions: async (req, res, next) => {
    try {
      const { user_id } = req.body;
      console.log("req.body", req.body);

      let transactions = await AddCash.find({ user_id, status: "SUCCESS" })
      // .sort({'_id': -1}).get();
      let userWallet = await UserLogins.findById(user_id).select("wallet_amount name email");

      return res.status(200).send({ status: 200, transactions, userWallet });
    } catch (error) {
      console.log("catch error");
      return res.status(400).send({ status: 400, message: error.message });
    }
  },

  driverPaymentRequest: async (req, res, next) => {
    try {
      const { user_id, requested_amount } = req.body;

      let user = await UserLogins.findById(user_id);
      if (requested_amount > user.wallet_amount) {
        return res.send({
          status: 400,
          message: "Withdraw amount request not sufficient",
        });
      }

      let amount = user.wallet_amount - requested_amount;

      var randomNumber = Math.floor(1000 + Math.random() * 9000);
      req.body['withdraw_id'] =  Date.now() + `${randomNumber}`
      await WithdrawRequest(req.body).save();

      await UserLogins.findOneAndUpdate(
        { _id: user_id },
        { $set: { wallet_amount: amount } }
      );


      return res.status(200).send({
        status: 200,
        message: "Amount request has been successfully sent.",
      });
    } catch (error) {
      console.log("catch error");
      return res.status(400).send({ status: 400, message: error.message });
    }
  },

  getWithdrawHistory: async (req, res, next) => {
    try {
      const { user_id } = req.body;

      let data = await WithdrawRequest.find({ user_id: user_id }).sort("-_id");
      let userWallet = await UserLogins.findById(user_id).select(
        "wallet_amount name email"
      );

      return res.status(200).send({ status: 200, data, userWallet });
    } catch (error) {
      console.log("catch error", error.message);
      return res.status(400).send({ status: 400, message: error.message });
    }
  },

  addCashUser: async (req, res, next) => {
    try {
      const { user_id, amount } = req.body;
      let user = await UserLogins.findById(user_id).select(
        "wallet_amount name email"
      );

      // INITIAL STRIPE PAYMENT DETAILS AND REDIRECT TO STRIPE PAYMENT SCREEN
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: "usd",
        payment_method_types: ["card"],
        metadata: {
          email: user.email,
          type: "ADD_CASH",
        },
      });

      const clientSecret = paymentIntent.client_secret;
      req.body["client_secret"] = clientSecret;
      req.body["payment_intent_id"] = paymentIntent.id;
      req.body["currency"] = paymentIntent.currency;

      let addCash = await AddCash(req.body).save();

      let stripeData = {
        stripe_payment_id: addCash._id,
        add_cash_id: addCash._id
      };

      return res.status(200).send({ status: 200, stripeData, clientSecret });
    } catch (error) {
      console.log("catch error", error.message);
      return res.status(400).send({ status: 400, message: error.message });
    }
  },

  addCashUserCallback: async (req, res, next) => {
    try {

      let reqBody = req.body;
      let add_cash_id = reqBody.add_cash_id;
      
      await AddCash.updateOne({ _id: add_cash_id }, { $set: { status: reqBody.status } });

      if (reqBody.status == "FAILED") {
        return res.status(200).send({ status: 400, message: "Payment Failed." });
      }

      let addCash = await AddCash.findOne({ _id: add_cash_id });
      console.log('addCash', addCash);
      
      let user = await UserLogins.findOne({ _id: addCash.user_id }).select("wallet_amount");
      let walletAmount = 0;

      console.log('user.wallet_amount', user.wallet_amount);
      if (user.wallet_amount) {
        walletAmount =  parseInt(user.wallet_amount)
      }

      let totalAmount = walletAmount + addCash.amount;

      await UserLogins.updateOne({ _id: addCash.user_id }, { $set: { wallet_amount: totalAmount } })

      return res.status(200).send({ status: 400, message: "Amount Added Successfully." });
    } catch (error) {
      console.log("catch error", error.message);
      return res.status(400).send({ status: 400, message: error.message });
    }
  },

  // ADMIN PANEL ROUTES
  getAllWithdrawRequests: async (req, res, next) => {
    try {
      let data = await WithdrawRequest.find({})
        .populate("user_id", "name email")
        .sort("-_id");
      return res.status(200).send({ status: 200, data });
    } catch (error) {
      console.log("catch error");
      return res.status(400).send({ status: 400, message: error.message });
    }
  },

  sendDriverRequestPayment: async (req, res, next) => {
    try {
      let { request_id } = req.body;
      console.log("request_id", request_id);

      const withdrawRequest = await WithdrawRequest.findOne({
        _id: request_id,
      }).populate("user_id", "stripe_customer_id stripe_account");

      if (withdrawRequest.status === "completed") {
        return res.status(200).send({
          status: 400,
          message: "Your payment request already seneded.",
        });
      }

      if (!withdrawRequest.user_id.stripe_account) {
        return res
          .status(200)
          .send({ status: 400, message: "Please add your account to stripe." });
      }

      let amount = Number(withdrawRequest.requested_amount);
      let stripeAccount = withdrawRequest.user_id.stripe_account;

      // CHECK FUND IS SUFFICIENT OR NOT
      let amountData = await stripe.balance.retrieve({});
      let remaningBalance = amountData.available[0].amount;
      if (amount > remaningBalance) {
        return res.send({ status: 400, message: "Insufficient Fund!" });
      }

      // TRANSFER AMOUNT
      const transferStatus = await stripe.transfers.create({
        amount: amount,
        currency: "usd",
        destination: stripeAccount,
        transfer_group: "ORDER_95",
      });

      await WithdrawRequest.findByIdAndUpdate(
        { _id, request_id },
        {
          status: "completed",
        }
      );

      return res.send({
        status: 200,
        message: "Payment successfully appreoved.",
      });
    } catch (error) {
      console.log("catch error");
      return res.status(400).send({ status: 400, message: error.message });
    }
  },


  addCashList: async (req, res, next) => {

    try {
      const data = await AddCash.find({}).sort({'_id': 'desc'}).populate('user_id', 'name email')

      return res.status(200).send({ status: 200, data });
    } catch (error) {
      console.log("catch error");
      return res.status(400).send({ status: 400, message: error.message });
    }

  },


};
