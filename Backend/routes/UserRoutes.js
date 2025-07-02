// const express = require ('express');
// const router = express.Router();
// const {body} =  require('express-validator');
// const userController  = require('../controllers/UserControllers');
// const authmiddlewares = require('../middlewares/AuthMiddlewares');

// // Create User

// router.post('/register', [
//   body('email').isEmail().withMessage('Invalid Email'),
//   body('fullName.firstName').isLength({min: 3}).withMessage('First Name must be at least 3 characters'),
//   body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters')
// ],
//   userController.registerUser
// );

// //Login

// router.post('/login', [
//   body('email').isEmail().withMessage('Invalid Email'),
//   body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters')
// ],
// userController.loginUser
// );

// // Profile

// router.get('/profile', authmiddlewares.authUser, userController.profile);

// // Logout

// router.get('/logout', authmiddlewares.authUser, userController.logoutUser);

// module.exports = router;


//...........................................................................................................//


const express = require('express');
const { body } = require('express-validator');
const userControllers = require('../controllers/UserControllers');

const authentication = require('../middlewares/AuthMiddlewares');

const router = express.Router();

router.post(
  '/send-otp',
  body('input')
    .notEmpty()
    .withMessage('Input is required')
    .custom((v) => {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      const isIndianMobile = /^(\+91)?[6-9]\d{9}$/.test(v);
      if (!isEmail && !isIndianMobile) {
        throw new Error('Must be valid Indian mobile or email');
      }
      return true;
    }),
 userControllers.sendOtp
);

router.post(
  '/verify-otp',
  body('input').notEmpty(),
  body('otp').isLength({ min: 4, max: 6 }).withMessage('Enter correct OTP'),
  userControllers.verifyOtp
);

router.get('/profile', authentication.authUser, userControllers.profile);
router.get('/logout', authentication.authUser, userControllers.logoutUser);

module.exports = router;
