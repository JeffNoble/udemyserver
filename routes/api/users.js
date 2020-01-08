const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator');

// @route  post api/users
// @desc   Register Route
// @access Public
router.post('/', [
    check('username', 'Username is Required')
        .not()
        .isEmpty(),
    check('email', 'Please use a valid Email')
        .isEmail(),
    check('password', 'Please enter a password with 8 or more characters')
        .isLength({ min: 8})
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    res.send('User Route')
    });

module.exports = router;