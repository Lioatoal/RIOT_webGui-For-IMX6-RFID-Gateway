var express = require('express');
var router = express.Router();

var menus = require('../config/menus');
var libTagFilter = require('../libs/libTagFilter');
// Mod by Roy for move the function control code to utility.js, 2018-03-07.
//var libInvResult = require('../libs/libInvResults');
var libUtility = require('../libs/libUtility');
var response = function () {};
router.get('/tagFilter', function(req, res){
    var error = "";
	var DBNum = 1, DBCount = 0;
    var tagFilter;

    libTagFilter.getDBtagFilter(function (result) {
        tagFilter = result;
        DBCount++;
    });

    response = function () {
        if (DBCount < DBNum) {
            console.log("Set Processing...");
            setTimeout(response, 100);
        } else {
            DBCount = 0;
            res.render('./tagFilter/tagFilter.html', {
                target: 'tagFilter',
                menus: menus,
                tagFilter: tagFilter,
            });
        }
    }
    response();
});

router.post('/tagFilter', function (req, res) {
    var params = req.body;
    var filterData = JSON.parse(params.filterData);
    var DBNum = filterData.length, DBCount = 0;
    var error = "";
    var currentTime = new Date().toISOString().split('.')[0];
    //var configFuntionID = 14, configSet = false;
    var configRun = {
        state:false,
        RUN:1,
        StartTime:currentTime,
        errRetry:0,
        configOnce:false
    };
    // var setConfigFunction = function (data) {
    //     libInvResult.setDBfunctions(data, configFuntionID, function (err) {
    //         if (err != "") {
    //             if (data.errRetry < 5) {
    //                 console.log("Try to set Config Function for next 100ms..."+data.errRetry);
    //                 data.errRetry++;
    //                 setTimeout(function (){setConfigFunction(data)},200);
    //             } else {
    //                 error += err + "\r\n";
    //                 configSet = true;
    //             }
    //         } else {
    //             configSet = true;
    //         }
    //     });
    // };

    for (var i = 0; i < filterData.length; i++) {
        libTagFilter.setDBtagFilter(filterData[i] ,function (result) {
            DBCount++;
            if (result != "") {
                error += result + "\r\n";
            }
        });
    }

    response = function () {
        if (DBCount < DBNum) {
            console.log("Set Processing...");
            setTimeout(response, 100);
        } else {
	    //if (configSet) {
            if (configRun.state) {
                DBCount = 0;
                if (error == "") {
                    res.json({
                        error: "Set Tag Filter Successful!",
                    });
                } else {
                    res.json({
                        error: error
                    });
                }
            } else {
	    	//setConfigFunction(configRun);
                console.log("Set Config Processing...");
                if (!configRun.configOnce) {
					libUtility.setConfiguration(configRun, function (err) {
						error += err + "\r\n";
						configRun.state = true;
					});
					configRun.configOnce = true;
				}
// End by Roy for move the function control code to utility.js, 2018-03-07.
                setTimeout(response, 100);
            }
        }
    }
    response();
})

module.exports = router;
