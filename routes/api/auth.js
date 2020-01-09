const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const {
    check,
    validationResult
} = require('express-validator');


const User = require('../../models/User');


// @route  GET api/auth
// @desc   return auth info 
// @access Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route  POST api/Auth
// @desc   Authenticate user and get Token
// @access Public
router.post('/', [
    check('email', 'Please use a valid Email')
        .isEmail(),
    check('password', 'Password is required')
        .exists()
],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // check if user exists
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res
            .status(400)
            .json({ errors: [{ msg: 'invalid credentials'}] });
        }

        //checking credentals for token signing
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res
            .status(400)
            .json({ errors: [{msg: 'invalid credentials'}] });
        }

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