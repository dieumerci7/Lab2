var api = require('../API');
var my_map = require('./myMap');
let liq_pay = require('./liqPay');
let pizza_cart = require('../pizza/PizzaCart');

$("#price").change(function () {
    console.log(JSON.parse($("#price").text()));
    if (JSON.parse($("#price").text()) === 0) {
        $("#further-btn").prop('disabled', true);
        console.log("Disabled = true");
    } else {
        $("#further-btn").prop('disabled', false);
        console.log("Disabled = false");
    }
})

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
    /* invalid = false;
    if ($("#delivery-address").text() === "невідома") {
        invalid = true;
    }
    if (invalid) {
        $('#invalid-address').show();
        $('#address-label').css('color', 'red');
        everythingValid = false;
    } else {
        $('#invalid-address').hide();
        $('#address-label').css('color', 'green');
    } */

    my_map.geocodeAddress($("#address").val(), function (err, coordinates) {
        if (!err) {
            $('#invalid-address').hide();
            $('#address-label').css('color', 'green');
            my_map.calculateRoute(my_map.point, coordinates, function (err, time) {
                if (!err) {
                    if (everythingValid) {
                        let price = $("#price").text();
                        let cart = pizza_cart.getPizzaInCart();
                        let description = "Замовлення піцци: " + typedName + "\nАдреса доставки: " + $("#delivery-address").text() + "\nТелефон: " + typedPhone + "\nЗамовлення:\n";
                        for (let j = 0; j < cart.length; j++) {
                            description += "- " + cart[j].quantity + "шт. [" + (cart[j].size === "big_size" ? "Велика" : "Мала") + "] " + cart[j].pizza.title + ";\n"
                        }
                        description += "\nРазом " + price + "грн";
                        var order_info = {
                            name: typedName,
                            phone: typedPhone,
                            address: typedAddress,
                            amount: JSON.parse(price),
                            description: description
                        };
                        api.createOrder(order_info, function (err, data) {
                            if (err) {
                                console.log("An error occurred!!!");
                                return;
                            } else {
                                console.log(JSON.stringify(data));
                                liq_pay.initialize(data.data, data.signature);
                            }
                        });
                    }
                } else {
                    $('#invalid-address').show();
                    $('#address-label').css('color', 'red');
                }
            })
        } else {
            $('#invalid-address').show();
            $('#address-label').css('color', 'red');
        }
    })
});