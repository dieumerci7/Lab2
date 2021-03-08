/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');

var storage = require('../localStorage');

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");

function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок

    var toPush = true;
    for (var j = 0; j < Cart.length; j++) {
        if (Cart[j].pizza.id === pizza.id && Cart[j].size === size) {
            Cart[j].quantity += 1;
            toPush = false;
        }
    }

    //Приклад реалізації, можна робити будь-яким іншим способом
    if (toPush) Cart.push({
        pizza: pizza,
        size: size,
        quantity: 1
    });

    //Оновити вміст кошика на сторінці
    updateCart();
}

function removeFromCart(cart_item) {
    //Видалити піцу з кошика

    for (var j = 0; j < Cart.length; j++) {
        if (Cart[j] === cart_item) {
            Cart.splice(j, 1);
        }
    }

    //Після видалення оновити відображення
    updateCart();
}

$("#cart-1-right").click(function(){
    while (Cart.length > 0) {
        removeFromCart(Cart[0]);
    }
});

var cart_visible = false;
$("#nav-button-cart").click(function(){
    if (!cart_visible) {
        $("#cart-holder").show();
        cart_visible = true;
        $("#nav-button-cart").text("Сховати кошик");
    }
    else {
        $("#cart-holder").hide();
        cart_visible = false;
        $("#nav-button-cart").text("Показати кошик");
    }
});

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його

    var cartSaved = storage.get('cart');
    if (cartSaved) {
        Cart = cartSaved;
    }

    updateCart();

    // console.log(Cart);
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage

    //Очищаємо старі піци в кошику
    $cart.html("");

    var sum = 0;
    var total_price = 0;
    for (var j = 0; j < Cart.length; j++) {
        sum += Cart[j].quantity;
        if (Cart[j].size === 'big_size') {
            total_price += Cart[j].quantity * Cart[j].pizza.big_size.price;
        } else {
            total_price += Cart[j].quantity * Cart[j].pizza.small_size.price;
        }
        // total_price += Cart[j].quantity * Cart[j].pizza.big_size.price;
    }
    $("#cart-1-span").text(sum);
    $("#price").text(total_price);
    $("#price").trigger("change");

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

        $node.find(".plus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;

            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".minus").click(function(){
            //Зменшуємо кількість замовлених піц
            if (cart_item.quantity === 1) removeFromCart(cart_item);
            else {
                cart_item.quantity -= 1;
            }

            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".remove-btn").click(function(){
            //Видаляємо піццу
            removeFromCart(cart_item);

            //Оновлюємо відображення
            updateCart();
        });

        $cart.append($node);
    }

    Cart.forEach(showOnePizzaInCart);

    storage.set("cart",	Cart);

}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;