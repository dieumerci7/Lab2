/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');
var api = require('../API');

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];

    Pizza_List.forEach(function(pizza){
        //Якщо піка відповідає фільтру
        //pizza_shown.push(pizza);

        if (filter in pizza.content) {
            pizza_shown.push(pizza);
        }
    });

    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

$("#filter-all").click(function(){
    showPizzaList(Pizza_List);
});

$("#filter-meat").click(function(){
    filterPizza('meat');
});

$("#filter-pineapple").click(function(){
    filterPizza('pineapple');
});

$("#filter-mushroom").click(function(){
    filterPizza('mushroom');
});

$("#filter-ocean").click(function(){
    filterPizza('ocean');
});

function initialiseMenu() {

    api.getPizzaList(function (err, data) {
        if (err) {
            console.log("An error occurred!!!");
            return;
        }

        Pizza_List = data;

        //Показуємо усі піци
        showPizzaList(Pizza_List)
    });
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;