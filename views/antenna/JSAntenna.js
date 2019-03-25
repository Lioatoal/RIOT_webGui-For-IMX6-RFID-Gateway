
//antenna singulation
$("#profile").change(function () {
    var value = $("#profile").val();
    $("#xs-profile").val(value);
});

$("#xs-profile").change(function () {
    var value = $("#xs-profile").val();
    $("#profile").val(value);
});

//Algorithm
$("#dynQ").click(function () {
    $('#xs-dynQ')[0].checked = true;
    $("#fixQ")[0].checked = false;
    $('#xs-fixQ')[0].checked = false;
    $("#DynRow input").attr("disabled", false);
    $("#DynRow input").attr("class", "enableInput");
    $("#FixRow input").attr("disabled", true);
    $("#FixRow input")[0].disabled = false;
    $("#FixRow input").attr("class", "disableInput");
    algorithmDisplay();
});
$('#xs-dynQ').click(function(){
    $("#dynQ")[0].checked = true;
    $("#fixQ")[0].checked = false;
    $('#xs-fixQ')[0].checked = false;
    algorithmDisplay();
});

$("#fixQ").click(function () {
    $('#xs-fixQ')[0].checked = true;
    $("#dynQ")[0].checked = false;
    $('#xs-dynQ')[0].checked = false;
    $("#DynRow input").attr("disabled", true);
    $("#DynRow input").attr("class", "disableInput");
    $("#FixRow input").attr("disabled", false);
    $("#DynRow input")[0].disabled = false;
    $("#FixRow input").attr("class", "enableInput");
    algorithmDisplay();
});
$("#xs-fixQ").click(function () {
    $("#fixQ")[0].checked = true;
    $("#dynQ")[0].checked = false;
    $('#xs-dynQ')[0].checked = false;
    algorithmDisplay();
});

$('#startQ').change(function () {
    var value = $('#startQ').val();
    $('#xs-startQ').val(value);
});
$('#xs-startQ').change(function () {
    var value = $('#xs-startQ').val();
    $('#startQ').val(value);
});

$('#minQ').change(function () {
    var value = $('#minQ').val();
    $('#xs-minQ').val(value);
});
$('#xs-minQ').change(function () {
    var value = $('#xs-minQ').val();
    $('#minQ').val(value);
});

$('#maxQ').change(function () {
    var value = $('#maxQ').val();
    $('#xs-maxQ').val(value);
});
$('#xs-maxQ').change(function () {
    var value = $('#xs-maxQ').val();
    $('#maxQ').val(value);
});

$('#dynRetry').change(function () {
    var value = $('#dynRetry').val();
    $('#xs-dynRetry').val(value);
});
$('#xs-dynRetry').change(function () {
    var value = $('#xs-dynRetry').val();
    $('#dynRetry').val(value);
});

$('#dynToggle').change(function () {
    var value = $('#dynToggle').val();
    $('#xs-dynToggle').val(value);
});
$('#xs-dynToggle').change(function () {
    var value = $('#xs-dynToggle').val();
    $('#dynToggle').val(value);
});

$('#dynThreshold').change(function () {
    var value = $('#dynThreshold').val();
    $('#xs-dynThreshold').val(value);
});
$('#xs-dynThreshold').change(function () {
    var value = $('#xs-dynThreshold').val();
    $('#dynThreshold').val(value);
});

$('#qValue').change(function () {
    var value = $('#qValue').val();
    $('#xs-qValue').val(value);
});
$('#xs-qValue').change(function () {
    var value = $('#xs-qValue').val();
    $('#qValue').val(value);
});

$('#fixRetry').change(function () {
    var value = $('#fixRetry').val();
    $('#xs-fixRetry').val(value);
});
$('#xs-fixRetry').change(function () {
    var value = $('#xs-fixRetry').val();
    $('#fixRetry').val(value);
});

$('#fixToggle').change(function () {
    var value = $('#fixToggle').val();
    $('#xs-fixToggle').val(value);
});
$('#xs-fixToggle').change(function () {
    var value = $('#xs-fixToggle').val();
    $('#fixToggle').val(value);
});

$('#fixRetryN').change(function () {
    var value = $('#fixRetryN').val();
    $('#xs-fixRetryN').val(value);
});
$('#xs-fixRetryN').change(function () {
    var value = $('#xs-fixRetryN').val();
    $('#fixRetryN').val(value);
});

//Mod by Roy for change link profile to test mode, 2019-02-15.
//Add by Roy for add link profile field to antenna page, 2018-12-25
// $('#linkProfile').change(function () {
//     var value = $('#linkProfile').val();
//     $('#xs-linkProfile').val(value);
// });
// $('#xs-linkProfile').change(function () {
//     var value = $('#xs-linkProfile').val();
//     $('#linkProfile').val(value);
// });
//End by Roy for add link profile field to antenna page, 2018-12-25
$('#mode').change(function () {
    var value = $('#mode').val();
    $('#xs-mode').val(value);
});
$('#xs-mode').change(function () {
    var value = $('#xs-mode').val();
    $('#mode').val(value);
});
$('#timeToRun').change(function () {
    var value = $('#timeToRun').val();
    $('#xs-timeToRun').val(value);
});
$('#xs-timeToRun').change(function () {
    var value = $('#xs-timeToRun').val();
    $('#timeToRun').val(value);
});
//End by Roy for change link profile to test mode, 2019-02-15.
//Antenna Selection
for (var i = 0; i < 16; i++) {
    $('#logic_'+i).change(function(){
        var index = this.id.split('_')[1];
        if (index == $('#xs-antSelect').val()) {
            $('#xs-logic')[0].checked = this.checked;
        }
    });
    $('#physic_'+i).change(function () {
        var index = this.id.split('_')[1];
        if (index == $('#xs-antSelect').val()) {
            $('#xs-physic').val(this.value);
        }
    });
    $('#power_'+i).change(function(){
        var index = this.id.split('_')[1];
        if (index ==  $('#xs-antSelect').val()) {
            $('#xs-power').val(this.value);
        }
    });
    $('#dwell_'+i).change(function(){
        var index = this.id.split('_')[1];
        if (index ==  $('#xs-antSelect').val()) {
            $('#xs-dwell').val(this.value);
        }
    });
    $('#cycle_'+i).change(function(){
        var index = this.id.split('_')[1];
        if (index ==  $('#xs-antSelect').val()) {
            $('#xs-cycle').val(this.value);
        }
    });
}

$('#xs-logic').change(function(){
    var index = $('#xs-antSelect').val();
    $("#logic_"+index)[0].checked = $('#xs-logic')[0].checked;
});
$('#xs-antSelect').change(function(){
    xs_syncSelection();
});
$('#xs-power').change(function () {
    var index = $('#xs-antSelect').val();
    var value = $('#xs-power').val();
    $("#power_"+index).val(value);
})
$('#xs-dwell').change(function () {
    var index = $('#xs-antSelect').val();
    var value = $('#xs-dwell').val();
    $("#dwell_"+index).val(value);
})
$('#xs-cycle').change(function () {
    var index = $('#xs-antSelect').val();
    var value = $('#xs-cycle').val();
    $("#cycle_"+index).val(value);
})

//Support function
function getData(dbProID, singuData, antData) {
    //Mod by Roy for show error log if get method return error, 2018-03-28.
    if (getCheckForm()) {
        return;
    }
    //End by Roy for show error log if get method return error, 2018-03-28.
    var profileText = "";
    for (var i = 0; i < dbProID.length; i++) {
        if (false) {
            profileText += "<option selected>" + dbProID[i].RIOT_ProfileID + "</option>"
        } else {
            profileText += "<option>" + dbProID[i].RIOT_ProfileID + "</option>"
        }
    }
    $('#profile').html(profileText);
    $('#xs-profile').html(profileText);

    $("#startQ").val(singuData[0].StartQValue);
    $("#minQ").val(singuData[0].MinQ);
    $("#maxQ").val(singuData[0].MaxQ);
    $("#dynRetry").val(singuData[0].RetryCount);
    $("#dynToggle").val(singuData[0].ToggleTarget);
    $("#dynThreshold").val(singuData[0].ThresholdMultiplier);
    $("#qValue").val(singuData[0].StartQValue);
    $("#fixRetry").val(singuData[0].RetryCount);
    $("#fixToggle").val(singuData[0].ToggleTarget);
    $("#fixRetryN").val(singuData[0].RetryUntilNoTags);
    // $('#linkProfile').val(singuData[0].LinkProfile); ////Add by Roy for add link profile field to antenna page, 2018-12-25.
    $('#mode').val(singuData[0].Mode);
    $('#timeToRun').val(singuData[0].TimeToRun);

    $("#xs-startQ").val(singuData[0].StartQValue);
    $("#xs-minQ").val(singuData[0].MinQ);
    $("#xs-maxQ").val(singuData[0].MaxQ);
    $("#xs-dynRetry").val(singuData[0].RetryCount);
    $("#xs-dynToggle").val(singuData[0].ToggleTarget);
    $("#xs-dynThreshold").val(singuData[0].ThresholdMultiplier);
    $("#xs-qValue").val(singuData[0].StartQValue);
    $("#xs-fixRetry").val(singuData[0].RetryCount);
    $("#xs-fixToggle").val(singuData[0].ToggleTarget);
    $("#xs-fixRetryN").val(singuData[0].RetryUntilNoTags);
    //Mod by Roy for change link profile to test mode, 2019-02-15.
    //$('#xs-linkProfile').val(singuData[0].LinkProfile); //Add by Roy for add link profile field to antenna page, 2018-12-25.
    $('#xs-mode').val(singuData[0].Mode);
    $('#xs-timeToRun').val(singuData[0].TimeToRun);
    //End by Roy for change link profile to test mode, 2019-02-15.
    if (singuData[0].Algorithm == true) {
        $("#dynQ")[0].checked = true;
        $("#xs-dynQ")[0].checked = true;
        $("#fixQ")[0].checked = false;
        $("#xs-fixQ")[0].checked = false;
        $("#FixRow input").attr("disabled", true);
        $("#FixRow input")[0].disabled = false;
        $("#FixRow input").attr("class", "disableInput");
    } else if (singuData[0].Algorithm == false) {
        $("#dynQ")[0].checked = false;
        $("#xs-dynQ")[0].checked = false;
        $("#fixQ")[0].checked = true;
        $("#xs-fixQ")[0].checked = true;
        $("#DynRow input").attr("disabled", true);
        $("#DynRow input")[0].disabled = false;
        $("#DynRow input").attr("class", "disableInput");
    }
    algorithmDisplay();

    for (var i = 0; i < 16; i++) {
        if (antData[i].State == true) {
            $("#logic_"+i)[0].checked = true;
        } else {
            $("#logic_"+i)[0].checked = false;
        }
        $("#physic_"+i).val(antData[i].PhysicalAnt);
        $("#power_"+i).val(antData[i].Power);
        $("#dwell_"+i).val(antData[i].Dwell);
        $("#cycle_"+i).val(antData[i].InventoryCycles);
    }
    xs_syncSelection();
}

function setData() {
    var singuSet, antSet = [], profileID;

    if ( $("#dynQ")[0].checked == true ) {
        singuSet = {
            Algorithm: 1,
            StartQValue: $("#startQ").val(),
            MinQ: $("#minQ").val(),
            MaxQ: $("#maxQ").val(),
            RetryCount: $("#dynRetry").val(),
            ToggleTarget: $("#dynToggle").val(),
            ThresholdMultiplier: $("#dynThreshold").val(),
        }
    } else if( $("#fixQ")[0].checked == true ) {
        singuSet = {
            Algorithm: 0,
            StartQValue: $("#qValue").val(),
            RetryCount: $("#fixRetry").val(),
            ToggleTarget: $("#fixToggle").val(),
            RetryUntilNoTags: $("#fixRetryN").val(),
        }
    }
    // singuSet.LinkProfile = $('#linkProfile').val(); //Add by Roy for add link profile field to antenna page, 2018-12-25.
    singuSet.Mode = $('#mode').val();
    singuSet.TimeToRun = $('#timeToRun').val();

    var state, antRow;
    for (var i = 0; i < 16; i++) {
        if ($("#logic_"+i)[0].checked == true){
            state = 1;
        } else {
            state = 0;
        }

        antRow = {
            ID: i+1,
            State: state,
            PhysicalAnt: $("#physic_"+i).val(),
            Power: $("#power_"+i).val(),
            Dwell: $("#dwell_"+i).val(),
            InventoryCycles: $("#cycle_"+i).val(),
        }
        antSet.push(antRow);
    }

    var postData = {
        singulation: [singuSet],
        antenna: antSet,
    };
    postData = JSON.stringify(postData);

    $.post('/antenna',{postData: postData}, function(result) {
        location.reload();
    });
}

function algorithmDisplay (){
    if($('#xs-dynQ')[0].checked == true){
        $('#xs-DynRow').show();
        $('#xs-FixRow').hide();
    } else if($('#xs-fixQ')[0].checked == true){
        $('#xs-DynRow').hide();
        $('#xs-FixRow').show();
    }
}

function xs_syncSelection(){
    var index = $('#xs-antSelect').val();
    var select = $("#logic_"+index)[0].checked;
    var physic = $('#physic_'+index).val();
    var power = $('#power_'+index).val();
    var dwell = $('#dwell_'+index).val();
    var cycle = $('#cycle_'+index).val();
    $('#xs-logic')[0].checked = select;
    $('#xs-physic').val(physic);
    $('#xs-power').val(power);
    $('#xs-dwell').val(dwell);
    $('#xs-cycle').val(cycle);
}
//Add by Roy for show error log if get method return error, 2018-03-28.
function getCheckForm() {
    if (dbSinguData.length == 0) {
        alert('Get Singulation failed!');
        return true;
    }
    if (dbAntData.length == 0) {
        alert('Get Antanna failed!');
        return true;
    }
    if (dbProID.length == 0) {
        alert('Get Profile ID failed!');
        return true;
    }
    return false;
}
//End by Roy for show error log if get method return error, 2018-03-28.
