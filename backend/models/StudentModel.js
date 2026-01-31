import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    //  Personal Information
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },

    //  Contact Information
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },

    //  Qualification Details
    lastInstitution: {
      type: String,
      required: true,
      trim: true,
    },
    yearOfPassout: {
      type: String,
      required: true,
      trim: true,
    },
    institutionAddress: {
      type: String,
      required: true,
      trim: true,
    },
    highestQualification: {
      type: String,
      required: true,
      trim: true,
    },

    //  Guardian Details
    guardianName: {
      type: String,
      required: true,
      trim: true,
    },
    guardianAddress: {
      type: String,
      required: true,
      trim: true,
    },
    guardianMobile: {
      type: String,
      required: true,
      trim: true,
    },

    //  Academic Information
    admissionNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    joiningYear: {
      type: String,
      default: new Date().getFullYear().toString(),
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    course: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    //  Financial Information

    payments: [
      {
        amount: { type: Number, required: true },
        month: { type: String, required: true },
        paidOn: { type: Date, default: Date.now },
        // paymentMode: {
        //   type: String,
        //   enum: ["Cash", "UPI", "Card", "Bank Transfer"],
        //   default: "Cash",
        // },
        // note: { type: String, trim: true },
      },
    ],
    courseFeesOriginal: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Student = mongoose.model("Student", studentSchema);
