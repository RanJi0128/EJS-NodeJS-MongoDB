var mongoose = require("mongoose");
require('../models/Artist');
require('../models/ListenPage');
var Artist = mongoose.model("Artist");
var ListenPage = mongoose.model("ListenPage");
var md5 = require('md5');
var shortid = require('shortid');
//var Employee = require('../models/Employee.js');

var artistController = {};

artistController.login = function(req, res) {
    res.render("../views/artists/login");
};

artistController.home = function(req, res) {
    res.render("../views/artists/index");
};

artistController.princing = function(req, res) {
    res.render("../views/artists/landing-pricing");
};

artistController.terms = function(req, res) {
    res.render("../views/artists/terms");
};

artistController.privacy = function(req, res) {
    res.render("../views/artists/privacy");
};

artistController.cookie1 = function(req, res) {
    res.render("../views/artists/cookie");
};

artistController.signup = function(req, res) {
    res.render("../views/artists/signup");
};


artistController.createUser = function(req, res) {
    var saveData = {};

    saveData.name = req.body.name;
    saveData.email = req.body.email;
    saveData.password = md5(req.body.password);

    var artist = new Artist(saveData);
  
    artist.save(function(err, result) {
        var returnData;

        if(err) {
            returnData = {
                error: true,
                msg: err.message
            };
        } else {
            returnData = {
                error: false,
                data: result
            };
        }

        res.send(returnData);
    });
};

artistController.loginUser = function(req, res) {

    Artist.findOne({ email: req.body.email, password:  md5(req.body.password)}).exec(function (err, result) {
        if (err) {
            res.send(err.message);
        } else {
            var returnData;
            if (!result) {
                returnData = {
                    error: true,
                    msg: 'No matching Result with email and password'
                };

            } else {
                returnData = {
                    error: false,
                    data: result
                };
            }

            res.send(returnData);
        }
    });
};

artistController.dashboard = function(req, res) {
    res.render("../views/artists/dashboard");
};

artistController.pages = function(req, res) {
    res.render("../views/artists/pages");
};

artistController.create_page = function(req, res) {
    res.render("../views/artists/create_page");
};

artistController.create_page_action = function(req, res) {
    var saveData = {};

    
    saveData.name = req.body.name;
    saveData.content_type = req.body.content_type;
    saveData.max_event_time = req.body.max_event_time * 1000;
    saveData.embeded_url = req.body.content_embed_code;
    saveData.short_id = shortid.generate();
    saveData.history = [];
    saveData.user_id = req.body.user_id;
    saveData.text_header = req.body.text_header;
    saveData.text_body = req.body.text_body;
    saveData.button_text = req.body.button_text;
    saveData.button_link = req.body.button_link;
    saveData.sale_amount = req.body.sale_amount;
    saveData.maximum_sale = req.body.maximum_sale;

    var page = new ListenPage(saveData);
    
    page.save(function(err, result) {
        var returnData;

        if(err) {
            returnData = {
                error: true,
                msg: err.message
            };
        } else {
            if (result.content_type == 4) {
                var pixel = 'var guid=function(){var e=window.navigator,t=window.screen,n=e.mimeTypes.length;return n+=e.userAgent.replace(/\\D+/g,""),n+=e.plugins.length,n+=t.height||"",n+=t.width||"",n+=t.pixelDepth||""},afterPurchase=function(){var a=new XMLHttpRequest;a.open("GET","https://ipapi.co/json/"),a.send(),a.onreadystatechange=function(e){if(4==a.readyState&&200==a.status){var t=new XMLHttpRequest,n="page_id=' + result._id + '&ipAddr="+JSON.parse(a.responseText).ip+"&guid="+guid()+"&status=cult&content_type=4";t.open("POST","https://listenpages.com/register_history",!0),t.setRequestHeader("Content-type","application/x-www-form-urlencoded"),t.send(n)}}};afterPurchase();';

                returnData = {
                    error: false,
                    data: {
                        short_id: "listenpages.com/" + result.short_id,
                        pixel: pixel
                    }
                };

            } else {

                returnData = {
                    error: false,
                    data: {
                        short_id: "listenpages.com/" + result.short_id,
                        pixel: ''
                    }
                };

            }
        }

        res.send(returnData);
    });
};

artistController.settings = function(req, res) {
    res.render("../views/artists/settings");
};

artistController.get_page_list = function(req, res) {
    var user_id = req.query.user_id;

    ListenPage.find({user_id: user_id}).exec(function (err, result) {
        if (err) {
            console.log("Error:", err);
        } else {
            res.send(result);
        }
    });
};

artistController.get_analysis_data = function(req, res) {

    ListenPage.findById(req.body.page_id, function(err, result) {

        if (err) {
            var sendData = {
                error : true,
                msg : err.message
            }

            res.send(sendData);
        } else {
            var historyList = result.history.filter(function (el) {
                if (req.body.region == "")
                    return el.enteredTime >= req.body.start && el.enteredTime <= req.body.end;
                else
                    return el.enteredTime >= req.body.start && el.enteredTime <= req.body.end && el.continent_code == req.body.region;
            });

            var fbList = historyList.filter(function (el) {
                return el.referrer == 'facebook'
            });
            var ttList = historyList.filter(function (el) {
                return el.referrer == 'twitter'
            });
            var inList = historyList.filter(function (el) {
                return el.referrer == 'instagram'
            });
            var piList = historyList.filter(function (el) {
                return el.referrer == 'pinterest'
            });
            var wsList = historyList.filter(function (el) {
                return el.referrer == 'website'
            });
    
            var fbRate = getRateByReferrer(fbList, parseInt(result.max_event_time), result.content_type);
            var ttRate = getRateByReferrer(ttList, parseInt(result.max_event_time), result.content_type);
            var inRate = getRateByReferrer(inList, parseInt(result.max_event_time), result.content_type);
            var piRate = getRateByReferrer(piList, parseInt(result.max_event_time), result.content_type);
            var wsRate = getRateByReferrer(wsList, parseInt(result.max_event_time), result.content_type);

            var sendData = {
                error: false,
                fbNum: fbList.length,
                fbRate: fbRate,
                fbLevel: getLevel(fbRate, result.content_type),
                ttNum: ttList.length,
                ttRate: ttRate,
                ttLevel: getLevel(ttRate, result.content_type),
                inNum: inList.length,
                inRate: inRate,
                inLevel: getLevel(inRate, result.content_type),
                piNum: piList.length,
                piRate: piRate,
                piLevel: getLevel(piRate, result.content_type),
                wsNum: wsList.length,
                wsRate: wsRate,
                wsLevel: getLevel(wsRate, result.content_type),
            }

            res.send(sendData);
        }
    });
};

artistController.get_dashboard_data = function(req, res) {
    var user_id = req.query.user_id;
    var region = req.query.region;

    ListenPage.find({user_id: user_id}).exec(function (err, pages) {
        if (err) {
            console.log("Error:", err);
            var sendData = {
                error: true,
                msg: err.message
            }

            res.send(sendData);
        } else {
            var graphData = [0, 0, 0, 0, 0]; //send data
            var allListners = 0; // send data
            var totalHistory = [];
            var maxEvents = 0; // send data

            for (var i = 0; i < pages.length; i ++) {
                var historyList = pages[i].history;

                if (region != "") {
                    historyList = pages[i].history.filter(function(el) {
                        return el.continent_code == region;
                    });
                }

                allListners += historyList.length;

                for (var j = 0; j < historyList.length; j ++) {
                    totalHistory.push(historyList[j]);
                    var percent = 0;

                    var duringTime = parseInt(historyList[j].goOutTime) - parseInt(historyList[j].enteredTime);

                    if (pages[i].content_type != 4) {
                        
                        if (duringTime >= pages[i].max_event_time) {
                            percent = 100;
                        } else {
                            percent = ( duringTime / pages[i].max_event_time ) * 100;
                        }

                        if (percent < 35)
                            graphData[1] ++;
                        else if (percent >= 35 && percent < 70)
                            graphData[2] ++;
                        else
                            graphData[3] ++;

                    } else {

                        percent = ( duringTime / 4 ) * 100;

                        if (percent == 50)
                            graphData[2] ++;
                        else if (percent >= 75 && percent < 85)
                            graphData[3] ++;
                        else
                            graphData[4] ++;
                    }

                    if (percent >= 90)
                        maxEvents ++;
                }
            }

            var maxEventRate = parseInt((maxEvents / allListners) * 10000) / 100; // send data

            if (!maxEventRate)
                maxEventRate = 0;

            // var hist = {};
            // totalHistory.map( function (a) { if (a.referrer in hist) hist[a.referrer] ++; else hist[a.referrer] = 1; } );
            
            var maxRefferer = '';  // send data

            var groupedHistory = groupBy(totalHistory, function(item){
                return [item.ipAddr, item.guid];
            });

            var maxReffererRate = groupedHistory.length;

            // var maxReffererListners = 0;  // send data
            // var maxReffererRate = 0;

            // if (hist['website']) {
            //     if (hist['website'] > maxReffererListners) {
            //         maxReffererListners = hist['website'];
            //         maxRefferer = 'website';
            //     }
            // }

            // if (hist['facebook']) {
            //     if (hist['facebook'] > maxReffererListners) {
            //         maxReffererListners = hist['facebook'];
            //         maxRefferer = 'facebook';
            //     }
            // }

            // if (hist['twitter']) {
            //     if (hist['twitter'] > maxReffererListners) {
            //         maxReffererListners = hist['twitter'];
            //         maxRefferer = 'twitter';
            //     }
            // }

            // if (hist['instagram']) {
            //     if (hist['instagram'] > maxReffererListners) {
            //         maxReffererListners = hist['instagram'];
            //         maxRefferer = 'instagram';
            //     }
            // }

            // if (hist['pinterest']) {
            //     if (hist['pinterest'] > maxReffererListners) {
            //         maxReffererListners = hist['pinterest'];
            //         maxRefferer = 'pinterest';
            //     }
            // }

            // maxReffererRate = parseInt((maxReffererListners / allListners) * 10000) / 100; // send data

            // if (!maxReffererRate)
            //     maxReffererRate = 0;
            
            var sendData = {
                error: false,
                graphData: graphData,
                allListners: allListners,
                maxEvents: maxEvents,
                maxEventRate: maxEventRate,
                maxRefferer: maxRefferer,
                maxReffererRate: maxReffererRate
                //maxReffererListners: maxReffererListners,
            };

            res.send(sendData);
        }
    });
}

var groupBy = function (array, f) {
    var groups = {};

    array.forEach( function( o )
    {
        var group = JSON.stringify( f(o) );
        groups[group] = groups[group] || [];
        groups[group].push( o );  
    });

    return Object.keys(groups).map( function( group )
    {
        return groups[group]; 
    })
}

var getRateByReferrer = function(referrer, max_time, content_type) {
    var totalTime = 0;

    for (var i = 0; i < referrer.length; i ++) {
        var duringTime = referrer[i].goOutTime - referrer[i].enteredTime;

        if (content_type != 4) {

            if (duringTime > max_time)
                totalTime += max_time;
            else
                totalTime += duringTime;

        } else {
            
            totalTime += duringTime;
        }
    }

    if (content_type == 4)
        max_time = 4;

    var value = Math.round((totalTime/(max_time * referrer.length)) * 1000) / 10;

    if (!value || value == 0) {
        return 0;
    } else {
        return value;
    }
}

var getLevel = function(rate, content_type) {

    if (content_type != 4) {

        if (rate >= 0 && rate < 35)
            return 'Cold';
        else if (rate >= 35 && rate < 70)
            return 'Curious';
        else
            return 'Converted';

    } else {
        if (rate >= 0 && rate < 50)
            return 'Cold';
        else if (rate >= 50 && rate < 75)
            return 'Curious';
        else if (rate >= 75 && rate < 85)
            return 'Converted';
        else
            return 'Cult';

    }
    
}

artistController.get_user_info = function(req, res) {
    var user_id = req.query.user_id;

    Artist.findOne({_id: user_id}).exec(function (err, result) {
        if (err) {
            console.log("Error:", err);
        } else {
            var sendData = {
                name: result.name,
                email: result.email
            }

            res.send(sendData);
        }
    });
}

artistController.update_user = function(req, res) {

    Artist.findByIdAndUpdate(req.body.user_id, { $set: {maximum_sale: req.body.maximum_sale }}, { new: true }, function (err, artist) {
        res.send(artist);
    });
}

//===========================================//

artistController.list = function(req, res) {
    Artist.find({}).exec(function (err, artists) {
        if (err) {
            console.log("Error:", err);
        } else {
            res.render("../views/artists/index", {employees: artists});
        }
    });
};

artistController.show = function(req, res) {
    Artist.findOne({_id: req.params.id}).exec(function (err, artists) {
        if (err) {
            console.log("Error:", err);
        } else {
            res.render("../views/artists/show", {employee: artists});
        }
    });
};

artistController.create = function(req, res) {
    res.render("../views/artists/create");
};

artistController.save = function(req, res) {
    var artist = new Artist(req.body);
  
    artist.save(function(err) {
        if(err) {
            console.log(err);
            res.render("../views/artists/create");
        } else {
            console.log("Successfully created an artists.");
            res.redirect("/show/"+artist._id);
        }
    });
};

artistController.edit = function(req, res) {
    Artist.findOne({_id: req.params.id}).exec(function (err, artist) {
        if (err) {
            console.log("Error:", err);
        } else {
            res.render("../views/artists/edit", {employee: artist});
        }
    });
};

artistController.update = function(req, res) {
    Artist.findByIdAndUpdate(req.params.id, { $set: { name: req.body.name, address: req.body.address, position: req.body.position, salary: req.body.salary }}, { new: true }, function (err, artist) {
        if (err) {
            console.log(err);
            res.render("../views/artists/edit", {employee: req.body});
        }
        res.redirect("/show/"+artist._id);
    });
};

artistController.delete = function(req, res) {
    Artist.remove({_id: req.params.id}, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("artists deleted!");
            res.redirect("/");
        }
    });
};

module.exports = artistController;