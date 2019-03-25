var textareaValue = "";

$("#backButton").click(function () {
    history.back();
});
$('#transButton').click(function () {
    //R2 epc transfer
    var tag, epcData = $("#tagData").html();
    //Mod by Roy for change the input logic of HEX and ASCII trans function, 2018-03-28.
    //tag = transfer(epcData, $('#transButton Button').text());
    if ($('#transButton Button').text() == "ASCII") {
        tag = transfer(epcData, "HEX");
    } else {
        tag = transfer(epcData, "ASCII");
    }
    $("#tagData").html(tag.epc);
    //R3C2 Write Data transfer
    epcData = $("#writeData").val();
    //if (epcData) {
        //tag = transfer(epcData, $('#transButton Button').text());
    if ($('#transButton Button').text() == "ASCII") {
        tag = transfer(epcData, "HEX");
    } else {
        tag = transfer(epcData, "ASCII");
    }

    $("#writeData").val(tag.epc);
    //}
    $('#transButton Button').html(tag.format);
});
$('#readTag').click(function(){
    disableButton(true);
    //Mod by Roy for insert tag data to database without HEX translation, 2018-04-13.
    // var tag={}, epc = $("#tagData").html();
    // if ($('#transButton Button').text() == "ASCII") {
    //     //tag = transfer(epc, "ASCII");
    //     tag = transfer(epc, "HEX");
    // } else {
    //     tag.epc = epc;
    // }
    var tagFormat = $('#transButton Button').text();
    var epc = $("#tagData").html();
    //Mod by Roy for follow Tom's decision to modify HEX/ASCII translation, 2018-04-23.
    if (tagFormat == "HEX") {
        var tag = transfer(epc, "ASCII");
        epc = tag.epc;
    }
    var membank = $("[name='readMemBank']:checked").val();
    var pwd = $("#readPWD").val();
//Mod by Roy for add OFFSET & LENGTH of webGui to read table and write table, 2018-03-07.
    var length = $("#readLength").val();
    var offset = $("#readOffset").val();

    var postData = {
        // EPC: tag.epc,
        TagFormat: tagFormat,
        EPC: epc,
        AccessPwd: pwd,
        BANK: parseInt(membank),
        LENGTH: parseInt(length),
        OFFSET: parseInt(offset)
    }

    $.post('/cb2AdvanceRead', {postData: JSON.stringify(postData)}, function (res) {
        // $("#readResult").val(res.tag);
        // $("textarea").val(res.error);
        // $('#writeTag').attr("disabled", "false");
        // $('#setCB2Tag').attr("disabled", "false");
        // if (res.tag) {
        //     var tagInfo = res.tag;
        //     $("#readResult").val(tagInfo.RESULT);
        //     $('#transButton Button').html(tagInfo.TagFormat);
        //     textareaValue += res.error + "\r\n";
        //     $("textarea").val(textareaValue);
        // }
        disableButton(false);
        if (res.error) {
            textareaValue += res.error + "\r\n";
            $("textarea").val(textareaValue);
            return;
        }
        $("#readResult").val(res.result);
        $('#transButton Button').html(res.tagFormat);
    });
});
$('#writeTag').click(function () {
    disableButton(true);
    var membank = $("[name='writeMemBank']:checked").val();
    //Mod by Roy for write EPC value to tblWriteTable for selection, 2018-04-11.
    var epc = $("#tagData").html();
    var tagFormat = $('#transButton Button').text();
    var writeData = $("#writeData").val();
    //Mod by Roy for follow Tom's decision to modify HEX/ASCII translation, 2018-04-23.
    if (tagFormat == "HEX") {
        var tag = transfer(epc, "ASCII");
        epc = tag.epc;
        tag = transfer(writeData, "ASCII");
        writeData = tag.epc;
    }
    //Add by Roy for set EPC/USER in HEX to database forcibly, 2018-03-28.
    // if ($('#transButton Button').text() == "ASCII") {
    //     tag = transfer(epc, "HEX");
    //     epc = tag.epc
    //     tag = transfer(wirteData, "HEX");
    //     wirteData = tag.epc;
    // }
    //End by Roy for set EPC/USER in HEX to database forcibly, 2018-03-28.
    var pwd = $("#writePWD").val();
    //Mod by Roy for calculate data length by user key in, 2018-04-23.
    // var length = $("#writeLength").val();
    var length = writeData.length;
    //End by Roy for calculate data length by user key in, 2018-04-23.
    var offset = $("#writeOffset").val();

    var postData = {
        TagFormat: tagFormat,
        EPC: epc,
        AccessPwd: pwd,
        DATA: writeData,
        BANK: parseInt(membank),
        OFFSET: parseInt(offset),
        // LENGTH: parseInt(length),
        LENGTH: length,
    };
    if (checkForm(postData, "write")) {
        disableButton(false);
        return;
    }

    $.post('/cb2AdvanceWrite', {postData: JSON.stringify(postData)}, function (res) {
        disableButton(false);
//         if (postData.BANK == 1) {
        if (res.error) {
            textareaValue += res.error + "\r\n";
            $("textarea").val(textareaValue);
            return;
        }
        if (tagFormat == "ASCII") {
            var head = epc.substr(0, (offset*2));
            var end = epc.substr((offset*2)+writeData.length, epc.length);
            var content = epc.substr((offset*2), writeData.length);
            if (!content) {
                epc += writeData;
            } else {
                epc = head + writeData + end;
            }
        } else {
            var head = epc.substr(0, (offset*4));
            var end = epc.substr((offset*4)+writeData.length, epc.length);
            var content = epc.substr((offset*4), writeData.length);
            if (!content) {
                epc += writeData;
            } else {
                epc = head + writeData + end;
            }
            var tag = transfer(res.result, "HEX");
            res.result = tag.epc;
        }
//             postData = {
//                 TagFormat: tagFormat,
//                 EPC: epc,
//                 AccessPwd: pwd,
//     //End by Roy for write EPC value to tblWriteTable for selection, 2018-04-11.
//                 BANK: parseInt(membank),
//                 OFFSET: parseInt(offset),
//                 LENGTH: parseInt(length)
// //End by Roy for add OFFSET & LENGTH of webGui to read table and write table of database, 2018-03-07.
//             }
//             $.post('/cb2AdvanceRead', {postData: JSON.stringify(postData)}, function (res) {
//                 // if ($('#transButton Button').text() == "ASCII") {
//                 //     //var tag = transfer(res.tag, "HEX");
//                 //     var tag = transfer(res.tag, "ASCII");
//                 //     $("#tagData").html(tag.epc);
//                 // } else {
//                 //     $("#tagData").html(res.tag);
//                 // }
//                 // $("textarea").val(res.error);
//                 textareaValue += res.error + "\r\n";
//                 $("textarea").val(textareaValue);
//                 disableButton(false);
//                 if (res.tag) {
//                     var tagInfo = res.tag, epcData = "";
//                     epcData = head + tagInfo.RESULT + end;
//                     $("#tagData").html(epcData);
//                     $('#transButton Button').html(tagInfo.TagFormat);
//                 }
//             });
//         }
        // $("textarea").val(res.error);
	// textareaValue += res.error + "\r\n";
        // $("textarea").val(textareaValue);
        if (res.result == epc) {
            $("#writeResult").val('Write EPC sucessfully');
        } else {
            $("#writeResult").val('Write EPC failed');
        }
        $('#transButton Button').html(res.tagFormat);
    });
});
$('#setCB2Tag').click(function () {
    disableButton(true);
    var postData= [];
    var tagFormat = $('#transButton Button').text();
    var tagData = $('#tagData').html();
    //Add by Roy for set EPC/USER in HEX to database forcibly, 2018-03-28.
    // if ($('#transButton Button').text() == "ASCII") {
    //     //var tag = transfer(tagData, "ASCII");
	// var tag = transfer(tagData, "HEX");
    //     tagData = tag.epc;
    // }
    //End by Roy for set HEX EPC to database forcibly, 2018-03-28.
    if (tagFormat == "HEX") {
        var tag = transfer(tagData, "ASCII");
        tagData = tag.epc;
    }
    var light = $("[name='light']:checked").val();
    var intervalVal = $('#interval_'+light).val();
    var bettery = $("[name='battery']:checked").val();
    var antenna = $("[name='antenna']:checked").val();

    var postData = [];
    var cb2write ={
        TagFormat: tagFormat,
        EPC:tagData,
        Blink:intervalVal,
        Color:light,
        Battery: parseInt(bettery),
        Antenna: parseInt(antenna)
    };
    postData.push(cb2write);

    $.post('/cb2write', {postData: JSON.stringify(postData)}, function (res) {
        if (res.error) {
            // $("textarea").val(res.error);
            textareaValue += res.error + "\r\n";
            $("textarea").val(textareaValue);
        } else {
            // $("textarea").val("Set CB2 Successful!")
            textareaValue += "Set CB2 Successful!" + "\r\n";
            $("textarea").val(textareaValue);
        }

        disableButton(false);
    })
});
$('#refresh').click(function () {
    $('textarea').val("");
});

function transfer(epc, format) {
    var data = {epc: epc, format : format};
    var transData = "";
    //if (data.format == "ASCII") {
    if (data.format == "HEX") {
        for (var i = 0; i < data.epc.length; i++) {
            transData += data.epc.charCodeAt(i).toString(16);
        }
        transData = transData.toUpperCase();
        data.epc = transData;
        data.format = "HEX";
    //} else if (data.format == "HEX") {
    } else if (data.format == "ASCII") {
    //End by Roy for change the input logic of HEX and ASCII trans function, 2018-03-28.
        for (var i = 0; i < data.epc.length; i+=2) {
            transData += String.fromCharCode(parseInt(epc.substr(i,2),16));
        }
        data.epc = transData;
        data.format = "ASCII";
    }
    return data;
}
function disableButton(flag) {
    if (flag) {
        $('#readTag').attr("disabled", true);
        $('#writeTag').attr("disabled", true);
        $('#setCB2Tag').attr("disabled", true);
    } else {
        $('#readTag').attr("disabled", false);
        $('#writeTag').attr("disabled", false);
        $('#setCB2Tag').attr("disabled", false);
    }
}
function checkForm(data, flag) {
    switch (flag) {
        case "write":
            var format = $('#transButton Button').html();
            var check=/^[a-fA-F0-9]+$/;

            // if (format == "HEX" && check.test(data.DATA) == false) {
            if (format == "HEX" && check.test($("#writeData").val()) == false) {
                alert("Please input HEX Data!");
                return true;
            };
            //Del by Roy for remove the checking method for date length in writing tag, 2018-09-14.
            /*if (format == "ASCII") {
                // if (data.DATA.length != (data.LENGTH*2)) {
                if ($("#writeData").val().length % 2) {
                    alert("Please input correct Data to match the Length!");
                    return true;
                }
            } else {
                // if (data.DATA.length != (data.LENGTH*4)) {
                if ($("#writeData").val().length % 4) {
    //End by Roy for follow Tom's decision to modify HEX/ASCII translation, 2018-04-23.
                    alert("Please input correct Data to match the Length!");
                    return true;
                }
            }*/
            //End by Roy for remove the checking method for date length in writing tag, 2018-09-14.
    //End by Roy for insert tag data to database without HEX translation, 2018-04-13.
        default:
    }
    return false;
}
