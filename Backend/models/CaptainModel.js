const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const captainSchema = new mongoose.Schema({

  fullName: {
    firstName: {
      type: String,
      required: true,
      minlength: [3, 'First Name must be at least 3 characters long']
    },
    lastName: {
      type: String,
      minlength: [3, 'Last Name must be at least 3 characters long']
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: [5, 'Email must be at least 5 characters long']
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: [5, 'Password must be at least 5 characters long']
  },
  socketId: {
    type: String,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive',
  },
  vehicle: {
    color: {
      type: String,
      required: true,
      minlength: [3, 'Color must be at least 3 characters long']
    },
    plate: {
      type: String,
      required: true,
      minlength: [3, 'Plate must be at least 3 characters long']
    },
    capacity: {
      type: Number,
      required: true,
      minlength: [1, 'Capacity must be at least 1 characters long']
    },
    vehicleType: {
      type: String,
      required: true,
      enum: ['car', 'bike', 'auto']
    }
    },
    location: {
      lat: {
        type: Number,
      },
      long: {
        type: Number,
      },
  }
})

captainSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
  return token;
}

captainSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
}

captainSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
}

const captainModel = mongoose.model('captain', captainSchema);

module.exports = captainModel;