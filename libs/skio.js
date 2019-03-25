/* MTI CONFIDENTIAL INFORMATION */
var net = require('net'); //Add by Roy for modifing the RFID data source from the database to the socket, 2018-08-07.
const async = require('async'); //Add by Roy for change the socket method for getting RFID data, 2018-09-14.
var libInvResults = require('../libs/libInvResults');
var libRFTest = require('../libs/libRFTest') //Add by Roy for add RFTest function for RFTest page, 2018-08-07.
// Mod by Roy for change interval of inventory by output thread sleep timer, 2018-03-07.
var libUtility = require('../libs/libUtility');
var libInventoryLogging = require('../libs/libInventoryLogging'); //Add by Roy for change the socket method for getting RFID data, 2018-09-14.
var socketInvData = {};

exports.init = function(io, passportSocketIo, expressSessionStore) {
    io.use(passportSocketIo.authorize({
        // key:          'express.sid',       // the name of the cookie where express/connect stores its session_id
        secret: 'keyboard cat', // the session_secret to parse the cookie
        store: expressSessionStore, // we NEED to use a sessionstore. no memorystore please
        success: onAuthorizeSuccess, // *optional* callback on success - read more below
        fail: onAuthorizeFail, // *optional* callback on fail/error - read more below
    }));

    io.on('connection', function(socket) {
        socketInvData[socket.id] = socket;
        socket.on('disconnect', function() {
            delete socketInvData[socket.id];
            console.log("\r\nSocket client disconnect : " + socket.id + "\r\n");
        });
	//Mod by Roy for get a interval inventory result, 2018-02-22.
	//socket.on("updateInvData", function(currentTime, ack){
        //Mod by Roy for change the socket method for getting RFID data, 2018-09-14.
	      socket.on("updateInvData", function(ack){
        //socket.on("updateInvData", function(invTimer, ack){
        // var currentTime = new Date().getTime();
        //     var interval = {
	    	//start: "default",
                //end: new Date()
            //     start: currentTime-(invTimer*1000),
            //     end: currentTime
            // }
// End by Roy for change interval of inventory by output thread sleep timer, 2018-03-07.
            //Mod by Roy for modifing the RFID data source from the database to the socket, 2018-08-07.
            // libInvResults.getDBinvResults(interval, function(data){
                // ack(data);
            //Mod by Roy for fix socket crash when riot engine stop, 2018-08-29.
            // let socketENG = net.connect('/riot/riot_socket');
            async.waterfall([
                (next)=>{
                    let invTimer=0;
                    libInventoryLogging.getDBinventorylogging((result)=>{
                		if (result.length != 0) {
                			invTimer = result[0].TIMER_Output;
                		}
                		next(null, invTimer);
                	});
                },
                (invTimer, next)=>{
                    let res = [];
                    const socketENG = net.createConnection("/riot/riot_socket", () => {
                        socketENG.write('INV');
                    });
                    socketENG.on("error", function(err){
                        //console.log("error code : " + err.code + ", address : " + err.address);
                        console.log("INV error : " + err.code + ", address : " + err.address);
                    });
            //End by Roy for fix socket crash when riot engine stop, 2018-08-29.
                    socketENG.on('data', function(data){
                        let invMsg = data.toString().split('\n');
                        //Mod by Roy for fixing undefined field on font-end when inventory scan, 2018-12-25.
                        let invData = [];
                        invMsg.splice(invMsg.length-1, 1);
                        if (invMsg[0] != 'Inventory Stopped') {
                            //let invData = invMsg.map(element =>{
                            invData = invMsg.map(element =>{
                                //let temp = element.replace('INV: ', '').split(', ');
                                let temp = element.replace('INV: ', '').replace('\n\r', '').split(',');
                                //return res = {
                                return {
                                    SessionID: temp[0],
                                    EPC: temp[1],
                                    ReadCount: temp[2],
                                    TID: temp[3],
                                    pAnt: temp[4],
                                    avgRssi: temp[5],
                                    avgsTemp: temp[6],
                                    firstSeen: temp[7],
                                    lastSeen: temp[8]
                                };
                            });
                        }
                        //End by Roy for fixing undefined field on font-end when inventory scan, 2018-12-25.
                        res = res.concat(invData);
                    });
                    setTimeout(()=>{
                        socketENG.end();
                        next(null, res);
                    }, (invTimer * 1000));
                }
            ],(errs, result)=>{
                //ack(invData);
                ack(result);
            //End by Roy for change the socket method for getting RFID data, 2018-09-14.
            //End by Roy for modifing the RFID data source from the database to the socket, 2018-08-07.
            });
        });

        socket.on("updateGpsData", function(ack){
        //Mod by Roy for modifing the GPS data source from the database to the socket, 2018-09-14.
            /*libInvResults.getGPSResults(function(data){
	//End by Roy for get a interval inventory result, 2018-02-22.
		//Mod by Roy for show error log if get method return error, 2018-03-28.
                var gpsResults = [];
                if (data.length != 0) {
                    gpsResults.push(data[0]);
                }
                ack(gpsResults);
		//ack(data);
		//End by Roy for show error log if get method return error, 2018-03-28.
            });*/

            async.waterfall([
                (next)=>{
                    let gpsTimer=0;
                    libInventoryLogging.getDBinventorylogging((result)=>{
                		if (result.length != 0) {
                			gpsTimer = result[0].TIMER_GPS;
                		}
                		next(null, gpsTimer);
                	});
                },
                (gpsTimer, next)=>{
                    let res = {};
                    const socketENG = net.createConnection("/riot/riot_socket", () => {
                        socketENG.write('GPS');
                        // console.log('Unit Socket connected! GPS Run');
                    });
                    socketENG.on("error", function(err){
                        console.log("GPS error : " + err.code + ", address : " + err.address);
                    });
                    socketENG.on('data', function(data){
                        let gpsMsg = data.toString().replace('GPS: ', '').replace('\n', '').split(',');
                        let gpsData = {
                            latitude: gpsMsg[0],
                            longitude: gpsMsg[1],
                            altitude: gpsMsg[2],
                            datetime: gpsMsg[3],
                            heading: gpsMsg[4],
                            speed: gpsMsg[5],
                            fix: gpsMsg[6],
                            //Mod by Roy for add quality field for GPS table, 2018-09-27
                            quality3D: gpsMsg[7],
                            hdop: gpsMsg[8],
                            satellites: gpsMsg[9]
                            //End by Roy for add quality field for GPS table, 2018-09-27
                        };
                        res = gpsData;
                    //End by Roy for modifing the RFID data source from the database to the socket, 2018-08-07.
                    });
                    setTimeout(()=>{
                        socketENG.end();
                        next(null, res);
                    }, (gpsTimer * 1000));
                }
            ],(errs, result)=>{
                ack(result);
        //End by Roy for modifing the GPS data source from the database to the socket, 2018-09-14.
            });
        });

        socket.on("updateInvRUN", function(ack){
// Mod by Roy for move the function control code to utility.js, 2018-03-07.
            var functionID = 1;
            // libInvResults.updateDBinvRun(function(data){
            libUtility.getDBfunctions(functionID, function(data){
                ack(data.run);
// End by Roy for move the function control code to utility.js, 2018-03-07.
            });
        });
        //Add by Roy for add RFTest function for RFTest page, 2018-08-07.
        socket.on('updateRFTestPING', function (ack) {
            libRFTest.getRFTest(function (result) {
				        PINGResult = result;
				        ack(PINGResult);
			      });
        })
        //End by Roy for add RFTest function for RFTest page, 2018-08-07.
    });

    /**
     *  Socket Authorize
    */
    function onAuthorizeSuccess(data, accept) {
        console.log('successful connection to socket.io');
        accept();
    }

    function onAuthorizeFail(data, message, error, accept) {
        console.log('failed connection to socket.io:', message);
        console.log('data:', data.socket._peername);
        if (error)
            accept(new Error(message));
        // this error will be sent to the user as a special error-package
        // see: http://socket.io/docs/client-api/#socket > error-object
    }
}
