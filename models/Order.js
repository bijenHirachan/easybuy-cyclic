import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    customerId: String,
    paymentIntentId: String,
    products: [
      {
        poster: {
          public_id: String,
          url: String,
        },
        _id: String,
        title: String,
        price: Number,
        description: String,
        inStock: Number,
        category: String,
        quantity: Number,
      },
    ],
    subTotal: {
      type: Number,
    },
    total: {
      type: Number,
      required: true,
    },
    shipping: {
      type: Object,
      required: true,
    },
    delivery_status: {
      type: String,
      default: "pending",
    },
    payment_status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model("Order", orderSchema);
