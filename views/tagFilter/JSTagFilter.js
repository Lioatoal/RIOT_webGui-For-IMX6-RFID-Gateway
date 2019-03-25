getData(dbtagFilter);

$('#submit').click(postData);

for (var i = 0; i < 10; i++) {
    $('#select_'+i).change(function(){
        var index = this.id.split('_')[1];
        if (index == $('#xs-selectOption').val()) {
            $('#xs-select')[0].checked = this.checked;
        }
    });
    $('#sessionID_'+i).change(function () {
        var index = this.id.split('_')[1];
        if (index == $('#xs-selectOption').val()) {
            $('#xs-sessionID').val(this.value);
        }
    });
    $('#EPCFilter_'+i).change(function(){
        var index = this.id.split('_')[1];
        if (index ==  $('#xs-selectOption').val()) {
            $('#xs-EPCFilter').val(this.value);
        }
    });
    $('#TIDFilter_'+i).change(function(){
        var index = this.id.split('_')[1];
        if (index ==  $('#xs-selectOption').val()) {
            $('#xs-TIDFilter').val(this.value);
        }
    });
}
$('#xs-select').change(function(){
    var index = $('#xs-selectOption').val();
    $("#select_"+index)[0].checked = $('#xs-select')[0].checked;
});
$('#xs-selectOption').change(function(){
    xs_syncFilter();
});
$('#xs-sessionID').change(function () {
    var index = $('#xs-selectOption').val();
    var value = $('#xs-sessionID').val();
    $("#sessionID_"+index).val(value);
})
$('#xs-EPCFilter').change(function () {
    var index = $('#xs-selectOption').val();
    var value = $('#xs-EPCFilter').val();
    $("#EPCFilter_"+index).val(value);
})
$('#xs-TIDFilter').change(function () {
    var index = $('#xs-selectOption').val();
    var value = $('#xs-TIDFilter').val();
    $("#TIDFilter_"+index).val(value);
})

function xs_syncFilter(){
    var index = $('#xs-selectOption').val();
    var select = $("#select_"+index)[0].checked;
    var session = $('#sessionID_'+index).val();
    var EPCFilter = $('#EPCFilter_'+index).val();
    var TIDFilter = $('#TIDFilter_'+index).val();
    $('#xs-select')[0].checked = select;
    $('#xs-sessionID').val(session);
    $('#xs-EPCFilter').val(EPCFilter);
    $('#xs-TIDFilter').val(TIDFilter);
}

function getData(data){
//Mod by Roy for show error log if get method return error, 2018-03-28.
    if (getCheckForm()) {
        return;
    }
    for (var i = 0; i < data.length; i++) {
        $('#select_' + i)[0].checked = data[i].Selection;
        $('#sessionID_' + i).val(data[i].SessionID);
        $('#EPCFilter_' + i).val(data[i].EPC_Filter);
        $('#TIDFilter_' + i).val(data[i].TID_Filter)
    }
    xs_syncFilter();
}

function postData() {
    var filterData = [];
    for (var i = 0; i < 10; i++) {
        filterData.push({
            ID: i+1,
            Selection: $('#select_' + i)[0].checked,
            SessionID: $('#sessionID_' + i).val(),
            EPC_Filter: $('#EPCFilter_' + i).val(),
            TID_Filter: $('#TIDFilter_' + i).val(),
        });
    }
    filterData = JSON.stringify(filterData);
    $.post('/tagFilter', {filterData: filterData} ,function (result) {
        location.reload();
    });
}
function getCheckForm() {
    if (dbtagFilter.length == 0) {
        alert('get tag Filter failed!');
        return true;
    }
    return false;
}
//End by Roy for show error log if get method return error, 2018-03-28.
