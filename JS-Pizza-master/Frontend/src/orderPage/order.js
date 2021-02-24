var api = require('../API');

$("#further-btn").click(function(){
    var typedName = $('#name').val();
    var everythingValid = true;
    var invalid = false;
    for (var j = 0; j < typedName.length; j++) {
        var ch = typedName.charAt(j);
        if ((ch < 'A' || ch > 'Z') && (ch < 'a' || ch > 'z') && (ch < 'А' || ch > 'Я') && (ch < 'а' || ch > 'я')
            && ch !== '-' && ch !== ' ' && ch !== "'"
            && ch !== 'і' && ch !== 'І' && ch !== 'ї' && ch !== 'Ї' && ch !== 'є' && ch !== 'Є'
            && ch !== 'ґ' && ch !== 'Ґ') {
            invalid = true;
            console.log(ch);
        }
    }
    if (typedName.length === 0) {
        invalid = true;
    }
    if (invalid) {
        $('#invalid-name').show();
        $('#name-label').css('color', 'red');
        everythingValid = false;
    } else {
        $('#invalid-name').hide();
        $('#name-label').css('color', 'green');
    }

    var typedPhone = $('#phone').val();
    invalid = false;
    for (var j = 1; j < typedPhone.length; j++) {
        var ch = typedPhone.charAt(j);
        if (ch < '0' || ch > '9') {
            invalid = true;
            console.log(ch);
        }
    }
    if (typedPhone.charAt(0) !== '0' && (typedPhone.length < 4 || typedPhone.substr(0, 4) !== '+380')) {
        invalid = true;
    }
    if (invalid) {
        $('#invalid-phone').show();
        $('#phone-label').css('color', 'red');
        everythingValid = false;
    } else {
        $('#invalid-phone').hide();
        $('#phone-label').css('color', 'green');
    }

    var typedAddress = $('#address').val();
    if (typedAddress.length === 0) {
        $('#invalid-address').show();
        $('#address-label').css('color', 'red');
        everythingValid = false;
    } else {
        $('#invalid-address').hide();
        $('#address-label').css('color', 'green');
    }

    if (everythingValid) {
        var order_info = {
            name: typedName,
            phone: typedPhone,
            address: typedAddress
        };
        api.createOrder(order_info, function (err, data) {
            if (err) {
                console.log("An error occurred!!!");
                return;
            }
        });
    }
});