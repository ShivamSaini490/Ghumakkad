// const express = require ('express');
// const router = express.Router();
// const {body} = require('express-validator');
// const captainController = require('../controllers/CaptainControllers');
// const authmiddlewares = require('../middlewares/AuthMiddlewares');

// // Create Captain

// router.post('/register', [
//   body('email').isEmail().withMessage('Invalid Email'),
//   body('fullName.firstName').isLength({min: 3}).withMessage('First Name must be at least 3 characters'),
//   body('password').isLength({min: 5}).withMessage('Password must be at least 6 characters'),
//   body('vehicle.color').isLength({min: 3}).withMessage('Vehicle Color must be at least 3 characters'),
//   body('vehicle.plate').isLength({min: 3}).withMessage('Vehicle Plate Number must be at least 3 characters'),
//   body('vehicle.capacity').isInt({ min: 1 }).withMessage('Vehicle capacity must be at least 1'),
//   body('vehicle.vehicleType').isLength({min: 3}).withMessage('Vehicle Type must be atleast 3 characters'),
// ],
// captainController.registerCaptain
// );

// // Login Captain

// router.post('/login', [
//   body('email').isEmail().withMessage('Invalid Email'),
//   body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters')
// ],
// captainController.loginCaptain
// );

// // Captain Profile

// router.get('/profile', authmiddlewares.authCaptain, captainController.profile);

// //Logout Captain

// // Logout

// router.get('/logout', authmiddlewares.authCaptain, captainController.logoutCaptain);

// module.exports = router;




