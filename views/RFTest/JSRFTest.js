var textareaTemp = "";

$('#region').on('change', function () {
    console.log(this.value);
    var band = this.value;
    $.get('/RFTest/Region2Freq', {band:band}, function (res) {
        var freq = res.freqData, text="";
        for (var i in freq) {
            text += '<option value="'+ freq[i].Frequency+ '">' + freq[i].Frequency + '</option>';
        }
        $('#freq').html(text);
    })
})
$('#Ping').on('click', function () {
    var PINGCount = parseInt($('#ipPingCount').val());
    var postData = {
        PingIP: $('#ipAddress').val(),
        PING: parseInt($('#ipPingCount').val())
    }
    updatePING(PINGCount);
    $.post('/RFTest/PING', {postData:JSON.stringify(postData)}, function (res) {
        if (res.error) {
            textareaTemp += res.error+"\r\n";
            $('textarea').val(textareaTemp);
        }
    })
})
$('#invON').on('click', function () {
    var postData = {
        InventoryOn: true,
    }
    $.post('RFTest', {postData:JSON.stringify(postData)}, function (res) {
        if (res.error) {
            textareaTemp += res.error+"\r\n";
            $('textarea').val(textareaTemp);
        }
    })
})
$('#RFON').on('click', function () {
    var postData = {
        RFOn: true,
    }
    $.post('RFTest', {postData:JSON.stringify(postData)}, function (res) {
        if (res.error) {
            textareaTemp += res.error+"\r\n";
            $('textarea').val(textareaTemp);
        }
    })
})
$('#ModuON').on('click', function () {
    var postData = {
        ModulationOn: true,
    }
    $.post('RFTest', {postData:JSON.stringify(postData)}, function (res) {
        if (res.error) {
            textareaTemp += res.error+"\r\n";
            $('textarea').val(textareaTemp);
        }
    })
})

$('#UPDATEON').on('click', function () {
    var postData = {
        Region: parseInt($('#region').val()),
        Frequency: parseInt($('#freq').val()),
        Channel: parseInt($('input[name=ChannelRadio]:checked')[0].value),
        AntennaPort: parseInt($('#antPort').val()),
        AntennaPower: parseInt($('#antPower').val()),
        OperationalMode: parseInt($('input[name=OpModeRadio]:checked')[0].value),
        Modulation: parseInt($('input[name=moduRadio]:checked')[0].value),
        OnTime: parseInt($('#onTime').val()),
        OffTime: parseInt($('#offTime').val()),
        RandomDataType: parseInt($('input[name=randomDTRadio]:checked')[0].value),
        GPIO_1: $('#GPIO1')[0].checked,
        GPIO_2: $('#GPIO2')[0].checked,
        GPIO_3: $('#GPIO3')[0].checked,
        GPIO_4: $('#GPIO4')[0].checked,
        tempSensor: parseInt($('input[name=tempRadio]:checked')[0].value),
    }
    $.post('RFTest', {postData:JSON.stringify(postData)}, function (res) {
        if (res.error) {
            textareaTemp += res.error+"\r\n";
            $('textarea').val(textareaTemp);
        }
    })
})

function updatePING(Count) {
    if (Count) {
        socket.emit('updateRFTestPING',function (res) {
            if (res.PING == 0) {
                return;
            }
            Count = res.PING;
            textareaTemp += res.RESULTS +"\r\n";
            $('textarea').val(textareaTemp);
            setTimeout(function () {updatePING(Count);}, 1000);
        });
    }
}
