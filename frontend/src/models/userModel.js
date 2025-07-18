
/**
 * User Model
 * Represents the user structure used across the app (frontend).
 */

/**
 * @typedef {Object} User
 * @property {string} _id - Unique ID of the user (from MongoDB)
 * @property {string} email - User email
 * @property {string} mobile - Mobile number
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {string} gender - Gender
 * @property {string} dob - Date of birth
 * @property {string} role - Role: "user", "captain", "admin"
 * @property {string} token - JWT token
 */

// Default user object for initial values in forms
export const defaultUser = {
  _id: '',
  email: '',
  mobile: '',
  firstName: '',
  lastName: '',
  gender: '',
  dob: '',
  role: 'user',
  token: '',
};

/**
 * Create a new user object from payload
 * @param {Partial<User>} payload
 * @returns {User}
 */
export const createUser = (payload = {}) => ({
  ...defaultUser,
  ...payload,
});
