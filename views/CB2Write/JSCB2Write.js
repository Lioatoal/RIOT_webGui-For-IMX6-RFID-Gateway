var $footable;
var postData = [];
// $footable = $('#tbl_data_grid').footable();

var cb2TagEPCcount = 0, cb2TagEPC;
var firstPage = 1, rowSizeValue = 15;
var rowStart;
var rowEnd;

//Click 'Scan' button
$('#btn_gettag').on('click', function() {
    var runtime = $("#btn_getInterval").val();
    if (!runtime) {
        alert("Please input a search time");
        return;
    }
    $.get('/cb2Write/cb2TagEPC', {runTime:runtime}, function(result) {
        if (result.error) {
            alert(result.error);
        } else {
            cb2TagEPCcount = result.length;
            cb2TagEPC = result;
            goToPage(firstPage, rowSizeValue);
        }
    });
});
//Click 'Clear' button
$('#btn_clear').on('click', function() {
     $('#tbl_data_grid tbody tr td').remove();
     $.ajax({
        url: '/cb2write',
        type: 'DELETE',
        success: function(result) {
            // alert(result.error);
            location.reload();
        }
    });
});
//Click 'Set' button
$('#btn_set').click(function() {
    var selectedRowData = [];
    var isCheckItem = false;
    var isCheckcount = 0;
    postData = [];
    //Add by Roy for set EPC/USER in HEX to database forcibly, 2018-03-28.
    //Mod by Roy for follow Tom's decision to modify HEX/ASCII translation, 2018-04-23.
    // if ($('#btn_transtag strong').text() == "ASCII") {
    if ($('#btn_transtag strong').text() == "HEX") {
    //End by Roy for follow Tom's decision to modify HEX/ASCII translation, 2018-04-23.
        $('#btn_transtag').click();
    }
    //Add by Roy for set EPC/USER in HEX to database forcibly, 2018-03-28.
    if(tbl_cb2_topic.rows.length > 0){
        for(var i = rowStart; i < rowEnd; i++){
            if($('#checkbox_'+i)[0].checked){
                isCheckItem = true;
                var epcVal = $('#epc_'+i).text();
                var intervalVal = $('#interval_'+i).val();
                var bettery = $("[name='battery_"+ i + "']").val();
                var antenna = $("[name='antenna_"+ i + "']").val();
                if(!validInterval(intervalVal)){
                    // $("#description").html("The valid interval value is 1 to 180").show();
                    alert("The valid interval value is 1 to 180");
                    return;
                }
                var lightVal;
                var lightRadioArray = $('[name=light_'+i+']');
                for(var j = 0; j < lightRadioArray.length; j++){
                    if(lightRadioArray[j].checked){
                        ightVal = j;
                    }
                }

                selectedRowData = {
                     EPC: epcVal,
                     Blink: parseInt(intervalVal),
                     Color: lightVal,
                     Battery: parseInt(bettery),
                     Antenna: parseInt(antenna),
                };
                postData[isCheckcount] = selectedRowData;
                isCheckcount++;
            }
        }

        if(!isCheckItem){
            alert("Please select one item at least!");
        }else {
            $.post('/cb2write',{postData: JSON.stringify(postData)}, function(result) {
                if (result.error) {
                    alert(result.error);
                }
            });
        }

    } else {
        alert("Please click \"Get Tag\" and select one item at least!");
    }
});
$('#btn_transtag').click(function () {
    var transData="", epcLen = tbl_cb2_topic.rows.length;
    if (epcLen == 0) {
        return;
    }
    if ($('#btn_transtag strong').text() == "ASCII") {
        for (var i = 0; i < epcLen; i++) {
            var epc = $("#epc_"+i).text();
            for (var j = 0; j < epc.length; j++) {
                transData += epc.charCodeAt(j).toString(16);
            }
            transData = transData.toUpperCase();//轉大寫
            $("#epc_"+i + " a").text(transData);
            transData="";
        }
        $('#btn_transtag strong').text("HEX");
    } else if ($('#btn_transtag strong').text() == "HEX") {
        for (var i = 0; i < epcLen; i++) {
            var epc = $("#epc_"+i).text();
            for (var j = 0; j < epc.length; j+=2) {
                transData += String.fromCharCode(parseInt(epc.substr(j,2),16));
            }
            $("#epc_"+i + " a").text(transData);
            transData="";
        }
        $('#btn_transtag strong').text("ASCII");
    }
})


function goToPage(curPage, rowSize) {
    var totalPage = 0;
    var pageRowSize = rowSize;
    var pageLength;
    if (cb2TagEPCcount / pageRowSize > parseInt(cb2TagEPCcount / pageRowSize)) {
        totalPage = parseInt(cb2TagEPCcount / pageRowSize) + 1;
    } else {
        totalPage = parseInt(cb2TagEPCcount / pageRowSize);
    }

    if (totalPage > 5) {
        pageLength = 5;
    } else {
        pageLength = totalPage;
    }

    var currentPage = curPage;
    rowStart = (currentPage - 1) * pageRowSize;
    rowEnd = currentPage * pageRowSize;
    rowEnd = (rowEnd > cb2TagEPCcount) ? cb2TagEPCcount : rowEnd;

    var tempStr = "";
    if (currentPage > 1) {
        tempStr += "<a href=\"#\" onClick=\"goToPage(" + (currentPage - 1) + "," + pageRowSize + ")\">Prev&nbsp;&nbsp;</a>"

        if (currentPage < 5) {
            for (var j = 1; j <= pageLength ; j++) {
                if ( j == currentPage ) {
                    tempStr += "<a href=\"#\" onClick=\"goToPage(" + j + "," + pageRowSize + ")\"><span style=\"font-weight:bold; color:orange;\">" + j + "</span>&nbsp;&nbsp;</a>"
                } else {
                    tempStr += "<a href=\"#\" onClick=\"goToPage(" + j + "," + pageRowSize + ")\">" + j + "&nbsp;&nbsp;</a>"
                }
            }
        } else {
            if (currentPage < totalPage) {
                pageLength = currentPage+1;
            } else {
                pageLength = currentPage;
            }
            for (var j = currentPage - 3; j <= pageLength ; j++) {
                if ( j == currentPage ) {
                    tempStr += "<a href=\"#\" onClick=\"goToPage(" + j + "," + pageRowSize + ")\"><span style=\"font-weight:bold; color:orange;\">" + j + "</span>&nbsp;&nbsp;</a>"
                } else {
                    tempStr += "<a href=\"#\" onClick=\"goToPage(" + j + "," + pageRowSize + ")\">" + j + "&nbsp;&nbsp;</a>"
                }
            }
        }
    } else {
        tempStr += "Prev&nbsp;&nbsp;";
        for (var j = currentPage; j <= pageLength; j++) {
            if ( j == currentPage ) {
                tempStr += "<a href=\"#\" onClick=\"goToPage(" + j + "," + pageRowSize + ")\"><span style=\"font-weight:bold; color:orange;\">" + j + "</span>&nbsp;&nbsp;</a>"
            }else {
                tempStr += "<a href=\"#\" onClick=\"goToPage(" + j + "," + pageRowSize + ")\">" + j + "&nbsp;&nbsp;</a>"
            }
        }
    }
    if (currentPage < totalPage) {
          tempStr += "<a href=\"#\" onClick=\"goToPage(" + (currentPage + 1) + "," + pageRowSize + ")\">Next&nbsp;&nbsp;</a>";
          for (var j = 1; j <= totalPage; j++) {
          }
    } else {
          tempStr += "Next&nbsp;&nbsp;";
          for (var j = 1; j <= totalPage; j++) {
          }
    }
    $("#barcon").html(tempStr);
    tempStr = "";
    for(var i = rowStart; i < rowEnd; i ++){
        tempStr += "<tr id=\"row_" + i + "\" name=\"name_" + i +"\">" +
        "<td>" +
            "<div class=\"row\" >" +
                "<div class=\"col-md-12 col-sm-12 col-xs-3 text-center\">" +
                    "<input type=\"checkbox\" id=\"checkbox_" + i + "\">" +
                "</div>" +
            "</div>" +
        "</td>" +
        "<td data-th=\"EPC:\" id=\"epc_" + i + "\">" +
	    //Mod by Roy for fix the EPC display abnormal bug in Advance tag page, 2018-03-28
            //"<a href=\"/cb2Advance?" + cb2TagEPC[i].epc + "\">" +
	    "<a href=\"/cb2Advance?EPC=" + cb2TagEPC[i].epc + "\">" +
	    //End by Roy for fix the EPC display abnormal bug in Advance tag page, 2018-03-28
                cb2TagEPC[i].epc +
            "</a>"+
        "</td>" +
        "<td data-th=\"Alert light:\">" +
            "<input type=\"radio\" name=\"light_" + i + "\" value=0   checked > <img src=\"public/images/led_r.png\">Red&nbsp;&nbsp;" +
            "<input type=\"radio\" name=\"light_" + i + "\" value=1  > <img src=\"public/images/led_g.png\">Green&nbsp;&nbsp;" +
            "<input type=\"radio\" name=\"light_" + i + "\" value=2  > <img src=\"public/images/led_b.png\">Blue&nbsp;&nbsp;" +
        "</td>" +
        "<td data-th=\"Bettery\">" +
            "<input type=\"radio\" name=\"battery_" + i + "\" value=0 checked> On " +
            "<input type=\"radio\" name=\"battery_" + i + "\" value=1> Off " +
        "</td>" +
        "<td data-th=\"Antenna\">" +
            "<input type=\"radio\" name=\"antenna_" + i + "\" value=0 checked> NF " +
            "<input type=\"radio\" name=\"antenna_" + i + "\" value=1> FF " +
            "<input type=\"radio\" name=\"antenna_" + i + "\" value=2> NF+FF " +
        "</td>" +
        "<td data-th=\"Flashing Interval (1s - 180s):\">" +
            "<input type=\"text\" id=\"interval_" + i + "\" size=\"6\" maxlength=\"3\" name=\"interval\" value=\"10\">" +
        "</td>" +
        "</tr>";
    }
    $("#tbl_cb2_topic").html(tempStr);
}

function validInterval(interval){
    if(interval >= 1 && interval <= 180)
        return true;
}
