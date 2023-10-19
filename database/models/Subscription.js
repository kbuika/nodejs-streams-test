const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  business_id: String,
  email: String,
  plan_id: mongoose.Schema.Types.ObjectId,
  payment_platform: {
    token: String,
    external_id: String,
    name: { type: String, enum: ["Stripe", "Paypal"] },
  },
});

subscriptionSchema.set("timestamps", true);

const Subscription = mongoose.model("Subscriptions", subscriptionSchema);

module.exports = Subscription;
