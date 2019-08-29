var express = require('express');
var router = express.Router();
var artist = require("../controllers/ArtistController.js");
var listen = require("../controllers/ListenController.js");
//sign in
router.get('/login', artist.login);

//first page
router.get('/', artist.home);

//princing page
router.get('/pricing', artist.princing);

//terms page
router.get('/terms', artist.terms);

//privacy page
router.get('/privacy', artist.privacy);

//cookie privacy page
router.get('/cookie', artist.cookie1);

//sign up
router.get('/signup', artist.signup);

//create user
router.post('/create_user', artist.createUser);

//login user
router.post('/login_user', artist.loginUser);

//user dashboard
router.get('/dashboard', artist.dashboard);

//show pages
router.get('/pages', artist.pages);

//create page
router.get('/create_page', artist.create_page);

//create page
router.post('/create_page_action', artist.create_page_action);

//user setting page
router.get('/settings', artist.settings);

//register history page
router.post('/register_history', listen.register_history);

//register history page
router.get('/get_page_list', artist.get_page_list);

//get anaysis data request
router.post('/get_analysis_data', artist.get_analysis_data);

//get dash data request
router.get('/get_dashboard_data', artist.get_dashboard_data);

//get user infomation request
router.get('/get_user_info', artist.get_user_info);

//get user infomation request
router.post('/update_user', artist.update_user);

// Get all artists
router.get('/list', artist.list);

// Get single artist by id
router.get('/show/:id', artist.show);

// Create artist
router.get('/create', artist.create);

// Save artist
router.post('/save', artist.save);

// Edit artist
router.get('/edit/:id', artist.edit);

// Edit update
router.post('/update/:id', artist.update);

// Edit update
router.post('/delete/:id', artist.delete);

module.exports = router;