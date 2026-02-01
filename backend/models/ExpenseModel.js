import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    paidTo: {
      type: String,
      required: true,
    //   trim: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    category: {
      type: String,
      required: true
    },

    subCategory: {
      type: String
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "UPI", "Card", "NetBanking"],
      default: "Cash"
    },

    // ✅ OPTIONAL transaction reference
    transactionId: {
      type: String,
      trim: true
    },

    // ✅ OPTIONAL bill / receipt image
    billImage: {
      type: String, // store URL (Cloudinary / S3 / server)
      trim: true
    },

    isRecurring: {
      type: Boolean,
      default: false
    },

    recurringType: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly", "Yearly"],
      required: function () {
        return this.isRecurring;
      }
    },

    expenseDate: {
      type: Date,
      required: true
    },

    notes: {
      type: String,
      trim: true
    },

    // userId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true
    // }
    userName: {
      type:String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);
