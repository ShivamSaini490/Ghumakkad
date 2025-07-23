// ===========================================

// LOGIN / SIGNUP BY THE EMAIL ID AND PASSWORD

// ===========================================


// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// const userSchema = new mongoose.Schema({
  // fullName: {
  //   firstName: {
  //     type: String,
  //     required: true,
  //     minlength: [3, 'First Name must be at least 3 characters']
  //   },
  //   lastName: {
  //     type: String,
  //     minlength: [3, 'Last Name must be at least 3 characters']
  //   }
  // },
  // email: {
  //   type: String,
  //   required: true,
  //   unique: true,
  //   lowercase: true,
  //   minlength: [5, 'Email must be atleast 5 characters long']
  // },
//   password: {
//     type: String,
//     required: true,
//     select: false,
//     minlength: [6, 'Password must be atleast 6 characters'],
//   },
//   otp: {
//     code: String,
//     expires: Date,
//   },
//   // socketId: {
//   //   type: String,
//   // }
// })

// userSchema.methods.generateAuthToken = function () {
//   const token = jwt.sign({ _id: this._id}, process.env.JWT_SECRET, {expiresIn: '24h'});
//   return token;
// }

// userSchema.methods.comparePassword = async function (password) {
//   return await bcrypt.compare(password, this.password);
// }

// userSchema.statics.hashPassword = async function (password) {
//   return await bcrypt.hash(password, 10);
// }

// const userModel = mongoose.model('user', userSchema);

// module.exports = userModel;






// ====================================

// LOGIN / SIGNUP BY EMAIL ID AND OTP

// ====================================




const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  fullName: {
    firstName: {
      type: String,
      required: true,
      minlength: [3, 'First Name must be at least 3 characters']
    },
    lastName: {
      type: String,
      minlength: [3, 'Last Name must be at least 3 characters']
    }
  },
 email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    minlength: [5, 'Email must be atleast 5 characters long']
  },
mobile: {
  type: String,
  unique: true,
  sparse: true, // only enforces uniqueness on non-null values
},
  gender: {
    type: String,
    enum: ['Male', 'Female']
  },
  dob: {
    type: String // dd-mm-yyyy
  },
  otp: {
    code: String,
    expires: Date,
  },
  // emailVerify: {
  //   type: Boolean,
  //   default: false,
  // },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

userSchema.statics.hashOTP = async function (otp) {
  return await bcrypt.hash(otp, 10);
};

userSchema.statics.compareOTP = async function (otp, hashedOtp) {
  if (!otp || !hashedOtp) return false; 
  return await bcrypt.compare(otp, hashedOtp);
};

userSchema.index({ mobile: 1 }, { unique: true, sparse: true });

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;

