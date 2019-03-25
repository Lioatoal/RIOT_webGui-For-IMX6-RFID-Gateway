var run = 0, beep; //Add by Roy for add beep function, 2018-12-25.
// getGpsData(gpsData); //Del by Roy for modifing the GPS data source from the database to the socket, 2018-09-14
transferTagEvent(true);

socket.emit('updateInvRUN',function (dbData) {
    run = dbData;
    updateInvDB();
    updateGPSDB();
});

$("#start").click(function () {
    run = 1;
    transferTagEvent(false);
    $.post('/invResults',{run: run}, function (result) {
        if (result.error != "") {
            alert(result.error);
        }
    });
});
$("#stop").click(function () {
    run = 0;
    transferTagEvent(true);
    $.post('/invResults',{run: run}, function (result) {
        if (result.error != "") {
            alert(result.error);
        }
    });
});
$("#clear").click(function () {
    $("#stop").click();
    $("#rfidTableBody").html("");
    run = -1;
    $.post('/invResults',{run: run}, function (result) {
        if (result.error != "") {
            alert(result.error);
        }
    });
});
function stopRFID() {
    run = 0;
    $.post('/invResults',{run: run}, function (result) {
        if (result.error != "") {
            alert(result.error);
        }
    });
}
function getInvData(dbData) {
    if (dbData.length != 0) {
        textInvData(dbData);
    }
}
function getGpsData(dbData) {
    if (dbData.length != 0) {
        textGpsData(dbData);
    }
}

function updateInvDB() {
    //Mod by Roy for change the socket method for getting RFID data, 2018-09-14.
    // if (invTimer.length == 0) {
    //     alert('Get inventory Timer failed');
    //     return;
    // }
    if (run == true) {
        socket.emit('updateInvData', function (dbData) {
            getInvData(dbData);
            if (dbData.length && $('#trans strong').text() == "HEX") {
                transfer("HEX");
            }
            updateInvDB();
        });
    } else {
        setTimeout(updateInvDB, 200);
    }
    // setTimeout(updateInvDB, invTimer[0]*1000);
}
function updateGPSDB(){
    // if (gpsTimer.length == 0) {
    //     alert('Get GPS Timer failed');
    //     return;
    // }
    socket.emit('updateGpsData', function (dbData) {
        if (Object.keys(dbData).length) {
            getGpsData(dbData);
        }
        updateGPSDB();
    });

    // setTimeout(updateGPSDB, gpsTimer[0]*1000);
    //End by Roy for change the socket method for getting RFID data, 2018-09-14
}

function textInvData(data) {
    var text = "";
    for (var i = 0; i < data.length; i++) {
        text +=
        "<tr>" +
            "<td id=\"epc_"+ i +"\">" +
                "<a href=\"/cb2Advance?EPC=" + data[i].EPC + "\" onclick=\"stopRFID()\" >" +
                    data[i].EPC +
                "</a>" +
            "<td>" + data[i].TID + "</td>" +
            "<td>" + data[i].ReadCount + "</td>" +
            "<td>" + data[i].pAnt + "</td>" +
            "<td>" + data[i].avgRssi + "</td>" +
            "<td>" + data[i].avgsTemp + "</td>" +
            "<td>" + data[i].lastSeen + "</td>" +
        "</tr>";
    }
    $("#rfidTableBody").html(text);
    //Add by Roy for add beep function, 2018-12-25.
    if(beepConf){
        beep();
    }
    //End by Roy for add beep function, 2018-12-25.
}
function textGpsData(data) {
    var text = "";
    text +=
    /*"<tr>" +
        "<td>" + data.Latitude + "</td>" +
        "<td>" + data.Longitude + "</td>" +
        "<td>" + data.Altitude + "</td>" +
        "<td>" + data.DateTime + "</td>" +
        "<td>" + data.Heading + "</td>" +
        "<td>" + data.Speed + "</td>" +
        "<td>" + data.Fix + "</td>" +
        "<td>" + data.HDOP + "</td>" +
        "<td>" + data.Satellites + "</td>" +
    "</tr>";*/
    `<tr>
        <td>${data.latitude}</td>
        <td>${data.longitude}</td>
        <td>${data.altitude}</td>
        <td>${data.datetime}</td>
        <td>${data.heading}</td>
        <td>${data.speed}</td>
        <td>${data.fix}</td>
        <td>${data.quality3D}</td> //Add by Roy for add quality field for GPS table, 2018-09-27
        <td>${data.hdop}</td>
        <td>${data.satellites}</td>
    </tr>`;
    $("#gpsTableBody").html(text);
}

function transferTagEvent(flag) {
    if (flag) {
        $("#trans").attr("disabled", false);
        $("#trans").click(function () {
            var toFormat = "";
            if ($('#trans strong').text() == "ASCII") {
                toFormat = "HEX";
            } else {
                toFormat = "ASCII";
            }
            transfer(toFormat);
        });
    } else {
        $("#trans").attr("disabled", true);
        $("#trans").unbind("click");
    }
}
function transfer(format) {
    var transData="", epcLen = rfidTableBody.rows.length;
    if (epcLen == 0) {
        return;
    }
    if (format == "HEX") {
        for (var i = 0; i < epcLen; i++) {
            var epc = $("#epc_"+i).text();
            for (var j = 0; j < epc.length; j++) {
                transData += epc.charCodeAt(j).toString(16);
            }
            transData = transData.toUpperCase();
            $("#epc_"+i + " a").text(transData);
            transData="";
        }
        $('#trans strong').text("HEX");
    } else if (format == "ASCII") {
        for (var i = 0; i < epcLen; i++) {
            var epc = $("#epc_"+i).text();
            for (var j = 0; j < epc.length; j+=2) {
                transData += String.fromCharCode(parseInt(epc.substr(j,2),16));
            }
            $("#epc_"+i + " a").text(transData);
            transData="";
        }
        $('#trans strong').text("ASCII");
    }
}
