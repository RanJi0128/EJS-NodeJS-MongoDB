var mongoose = require("mongoose");
var inbound = require('inbound');
require('../models/Artist');
require('../models/ListenPage');
var Artist = mongoose.model("Artist");
var ListenPage = mongoose.model("ListenPage");
var shortid = require('shortid');
URL = require('url')

var listenController = {};

listenController.show = function(req, res) {
    var shortUrl = req.originalUrl.split('/')[1];
    var href = req.headers.host + req.url;
    var referrer = req.header('referrer');
    
   
    // var aaa = URL.parse(req.header('referrer') || '');

    // console.log('referrer111 is ...', aaa);

    inbound.referrer.parse(href, referrer, function (err, description) {
        var referral_platform = 'website';
        
        if (description.referrer.type == 'social') {
            referral_platform = description.referrer.network;
        }

        if (description.referrer.type == 'link') {
            if (description.referrer.from.indexOf("instagram.com") != -1) {
                referral_platform = "instagram";
            }
        }

        if (shortid.isValid(shortUrl)) {
            ListenPage.findOne({ short_id: shortUrl}).exec(function (err, result) {
                var enteredTime = new Date().getTime();
                if (err) {
                    res.render("../views/listen/error");
                } else {
                    if (!result) {
                        res.render("../views/listen/not_found");
                    } else {
                        if (result.content_type == 1 || result.content_type == 2)
                            res.render("../views/listen/index", {data: result, referral: referral_platform, enteredTime: enteredTime});
                        else if (result.content_type == 3)
                            res.render("../views/listen/view_text", {data: result, referral: referral_platform, enteredTime: enteredTime});
                        else if (result.content_type == 4)
                            res.render("../views/listen/view_button", {data: result, referral: referral_platform, enteredTime: enteredTime});
                    }
                }
            });         
        } else {
            res.render("../views/listen/not_found");
        }
    });
};

listenController.register_history = function(req, res) {

    if (isJson(req.body))
        req.body = JSON.parse(req.body);

    console.log("request body is ....", req.body);
    
    if (req.body.content_type != 4) {
        var goOutTime = new Date().getTime();

        var pushData = {
            country: req.body.country,
            continent_code: req.body.continent_code,
            enteredTime: req.body.enteredTime,
            guid: req.body.guid,
            ipAddr: req.body.ipAddr,
            referrer: req.body.referrer,
            goOutTime: goOutTime
        };

        ListenPage.update( {_id: req.body.page_id }, {$push: {'history': pushData}}, function(err) {
            if (err) console.log(err);
        });

    } else {
        if (req.body.status == 'curious') {

            var pushData = {
                country: req.body.country,
                continent_code: req.body.continent_code,
                enteredTime: req.body.enteredTime,
                referrer: req.body.referrer,
                ipAddr: req.body.ipAddr,
                guid: req.body.guid,
                goOutTime: parseInt(req.body.enteredTime) + 2
            };

            ListenPage.findOneAndUpdate( {_id: req.body.page_id }, {$push: {'history': pushData}}, {new: true}, function(err, result) {
                if (err) console.log(err);
                else {
                    var lastId = result.history.sort(function (a, b) {
                        return a._id > b._id;
                    }).slice(-1)[0]._id;

                    res.send(lastId);
                }
            });
        } else if (req.body.status == 'converted') {

            ListenPage.findOneAndUpdate(
                { "_id": req.body.page_id, "history._id": req.body.history_id },
                { 
                    "$set": {
                        "history.$.goOutTime": parseInt(req.body.enteredTime) + 3
                    }
                },
                function(err,doc) {
            
                }
            );
        } else if (req.body.status == 'cult') {

            var enteredTime = 0;
            var rateIndex = 0;
            var maximum_sale = 0;
            var sale_amount = 0;

            ListenPage.findById(req.body.page_id, function(err, page) {
                if (err) {
                    res.send('error');
                    return false;
                }
                else {

                    maximum_sale = page.maximum_sale;
                    sale_amount = page.sale_amount;

                    if (maximum_sale < sale_amount) {
                        rateIndex = 1
                    } else {
                        rateIndex = Math.round( ( sale_amount / maximum_sale ) * 100 ) / 100;
                    }

                    var history = page.history.find(function(el) {
                        return el.ipAddr == req.body.ipAddr && el.guid == req.body.guid && el.goOutTime - el.enteredTime == 3;
                    });

                    if (!history) {
                        res.send('error');
                        return false;
                    }
                    else
                        enteredTime = history.enteredTime;

                    ListenPage.findOneAndUpdate(
                        { "_id": req.body.page_id, "history._id": history._id},
                        { 
                            "$set": {
                                "history.$.goOutTime": parseInt(enteredTime) + 3 + rateIndex
                            }
                        },
                        function(err,doc) {
                            res.send('success');
                        }
                    );

                }
            });

        }
    }
}

var isJson = function (str) {

    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;

}

module.exports = listenController;