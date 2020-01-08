const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {
    check,
    validationResult
} = require('express-validator');

// importing secrets
const config = require('config')
// importing the user model
const User = require('../../models/User')

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
],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // check if user exists
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email});

        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User already exists'}] });
        }
        // Get users Gravatar

        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        user = new User({
            username,
            email,
            avatar,
            password
        });

        const salt = await bcrypt.genSalt(13);

        user.password = await bcrypt.hash(password, salt);

        await user.save();
        // Return jsonwebtoken

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtToken'),
            { expiresIn: 360000}, //remove two zeros for production
            (err, token) => {
                if(err) throw err;
                res.json({ token});
            }
            );
        
    } catch(err) {
        console.error(err.message);
        res.status(500).send('server error');
    }

    // Return jsonwebtoken


    });

module.exports = router;