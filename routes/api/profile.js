const express = require('express');
const router = express.Router();


const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const {
    check,
    validationResult
} = require('express-validator');


// @route  GET api/profile/me
// @desc   Get current users profile
// @access Private
router.get('/me', auth, async(req, res) => {
    try{
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['username', 'avatar']);

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user'})
        }

        res.json(profile);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route  GET api/profile
// @desc   Create or Update a profile
// @access Private
router.post(
    '/',
     [ 
        auth, 
        [
            check('status', 'Status is required')
            .not()
            .isEmpty(),
            check('skills', 'Skills is required')
            .not()
            .isEmpty(),
         ]
    ],
    async (req, res) => { //this is checking if the errors array is full return a error file
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;

        // Build Profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }

        // build social object
        profileFields.social = {}
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;


        try {
            let profile = await Profile.findOne({ user: req. user.id });

            if (profile) {
            //update
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id}, 
                { $set: profileFields}, 
                { new: true }
                );

                return res.json(profile);
            } 


            //create a profile
            profile = new Profile(ProfileFields);

            await Profile.save();
            res.json(profile);   
        } catch {
            console.error(err.message);
            res.status(500).send ('Server Error')
        }

});
module.exports = router;