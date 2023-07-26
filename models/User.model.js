const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    username: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      unique:true,
    },
    isAdmin: {
      type:Boolean,
      default:false,
    },
    firstName:{
      type: String,
      default:null,
      trim: true     
    },
    lastName:{
      type:String,
      default:null,
      trim: true
    },
    address:{
      type:String,
      default:null,
      trim: true
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
