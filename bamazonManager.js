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
            message: "Welcome to Bamazon Manager(tm), your inventory management solution for certified ACME goods. Please select an option:",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
        })
        .then(function (answer) {
            switch (answer.welcome) {
                case "View Products for Sale":
                    viewProducts();
                    break;

                case "View Low Inventory":
                    viewLowInv();
                    break;

                case "Add to Inventory":
                    addInv();
                    break;

                case "Add New Product":
                    addProduct();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }

        });
}

function viewProducts() {
    connection.query("SELECT * FROM products", function (err, results) {
        for (var i = 0; i < results.length; i++) {
            console.log("Item ID: " + results[i].item_id, "Product Name: " + results[i].product_name, "Price: $" + results[i].price, "Quantity: " + results[i].stock_quantity);

        }
        start();
    })

}

function viewLowInv() {
    connection.query("SELECT product_name, stock_quantity FROM products WHERE stock_quantity <= 5 ORDER BY stock_quantity DESC, product_name ASC", function (err, results) {

        if (err) throw err;
        if (results.length > 0) {
            for (var i = 0; i < results.length; i++) {
                console.log("The following items are running low: " + results[i].product_name + ", qty=" + results[i].stock_quantity);
            }
        }
        else {
            console.log("All item inventory is above 5");
        }
        start();
    });
}

function addInv() {
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
                            console.log("Item ID: " + results[i].item_id, "Product Name: " + results[i].product_name, "Stock Quantity: " + results[i].stock_quantity);
                            itemArray.push(results[i].product_name);

                        }

                        return itemArray;

                    },
                    message: "What item would you like to add inventory to?"
                },
                {
                    name: "inventory",
                    type: "input",
                    message: "How many units of the item would you like to add?"
                }

            ])
            .then(function (answer) {
                var userChoice;
                for (var i = 0; i < results.length; i++) {

                    if (results[i].product_name == answer.choice) {
                        userChoice = results[i];

                    }

                }

                if (userChoice.stock_quantity > answer.inventory) {
                    var newInventory = userChoice.stock_quantity + parseInt(answer.inventory);
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: newInventory
                            },
                            {
                                item_id: userChoice.item_id
                            }
                        ],
                        function (error) {
                            if (error) throw error;
                            console.log("Inventory added successfully!");
                            console.log("New Inventory: " + newInventory);
                            start();
                        }
                    );
                }

            });
    })
}

function addProduct() {
    inquirer
        .prompt([
            {
                name: "itemId",
                type: "input",
                message: "What is the item ID of the product you would like to add?"
            },
            {
                name: "productName",
                type: "input",
                message: "What is the name of the product you would like to add?"
            },
            {
                name: "departmentName",
                type: "input",
                message: "What department would you like to add your product to?"
            },
            {
                name: "price",
                type: "input",
                message: "What is the price of your product?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "stockQuantity",
                type: "input",
                message: "What is the quantity of the product you would like to add?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
        ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO products SET ?",
                {
                    item_id: answer.itemId,
                    product_name: answer.productName,
                    department_name: answer.departmentName,
                    price: answer.price || 0,
                    stock_quantity: answer.stockQuantity || 0
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your product was added successfully!");
                    start();
                }
            );
        });
}