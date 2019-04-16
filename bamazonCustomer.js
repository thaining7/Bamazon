var mysql = require("mysql");
var inquirer = require("inquirer");
var itemArray = [];
var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    inquirer
        .prompt({
            name: "welcome",
            type: "list",
            message: "Welcome to Bamazon, your source for certified ACME goods. Would you like to place an order?",
            choices: ["YES", "NO"]
        })
        .then(function (answer) {
            if (answer.welcome === "YES") {
                placeOrder();
            }
            else {
                connection.end();
            }
        });
}

function placeOrder() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var itemArray = [];
                        for (var i = 0; i < results.length; i++) {
                            console.log("Item ID: " + results[i].item_id, "Product Name: " + results[i].product_name, "Price: $" + results[i].price);
                            itemArray.push(results[i].product_name);

                        }
                        
                        return itemArray;

                    },
                    message: "What is the ID of the item you would like to order?"
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "How many units of the item would you like to order?"
                }

            ])
            .then(function (answer) {
                var userChoice;
                for (var i = 0; i < results.length; i++) {
                    
                    if (results[i].product_name == answer.choice) {
                        userChoice = results[i];

                    }

                }

                if (userChoice.stock_quantity >= answer.quantity) {
                    var newQuantity = userChoice.stock_quantity - answer.quantity;
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: newQuantity
                            },
                            {
                                item_id: userChoice.item_id
                            }
                        ],
                        function (error) {
                            if (error) throw error;
                            console.log("Order placed successfully!");
                            console.log("Your total is: $" + answer.quantity * userChoice.price);
                            start();
                        }
                    );
                }
                else {
                    console.log("Not enough of the item in stock!");
                    start();
                }
            });
    });
}