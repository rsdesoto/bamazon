var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 8889,

    // Your username
    user: "root",
    // Your password
    password: "root",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
    displayItems();
});

/** Pseudocode:
 *
 * 0. connect up mysql, inquirer, and the database.
 *
 * 1. if the database loads correctly, display all items.
 * 2. prompt the user to enter an item ID.
 * 3. convert item ID from the SQL ID to the index value of the data array
 *      (note: you need to do this with a for loop in order to accurately
 *       translate the ID values -- items may be added/subtracted from the
 *       original table)
 * 4. prompt the user to enter a quantity
 * 5. check to make sure the ID entered by the user exists. If not,
 *    send them back to enter a new ID
 * 6. make sure the quantity entered by the user is available. If not,
 *    send them back to enter a new quantity
 * ####### NOTE - this is why we have two different inquirers -- so once you
 * have entered the ID you want, you don't need to keep entering it #######
 * 7. if all inputs are good: update mysql
 *      (UPDATE quantity = q - whatever
 *       WHERE ITEM_ID = USERINPUT)
 * 8. show customer total
 */

function displayItems() {
    connection.query("SELECT * FROM PRODUCTS", function(error, data) {
        if (error) throw error;
        data.forEach(item => {
            console.log(
                `######################
Item ID: ${item.item_id}
Product: ${item.prod_name}
Department: ${item.dept_name}
Price: ${item.price}
Items Available: ${item.stock}
######################\n`
            );
        });
        userProdID = getProdID(data);
    });
}

function getProdID(data) {
    inquirer
        .prompt([
            {
                type: "input",
                name: "id_chosen",
                message: "What is the ID of the product you would like to buy?"
            }
        ])
        .then(answers => {
            // connection.end();
            // console.log(answers);
            userProdID = parseInt(answers.id_chosen);
            arrID = getIndexVal(userProdID, data);

            // console.log(arrID);

            if (arrID === -1) {
                console.log("Sorry, I don't recognize that ID!");
                getProdID(data);
            } else {
                getProdQuantity(data, data[arrID]);
            }
        });
}

function getProdQuantity(data, item) {
    inquirer
        .prompt([
            {
                type: "input",
                name: "quantity_chosen",
                message: `How many ${item.prod_name}s would you like to buy?`
            }
        ])
        .then(answers => {
            userQuantity = parseInt(answers.quantity_chosen);
            if (userQuantity > item.stock) {
                console.log(
                    `Sorry, I don't have enough ${
                        item.prod_name
                    }s! Please insert a smaller quantity!`
                );
                getProdQuantity(data, item);
            } else {
                var newQuant = item.stock - userQuantity;
                // console.log(userQuantity);
                var total = userQuantity * item.price;
                removeStock(item.item_id, newQuant, total);
            }
        });
}

function removeStock(item_id, quantity, total) {
    // var query =
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock: quantity
            },
            {
                item_id: item_id
            }
        ],
        function(err, res) {
            if (err) throw err;

            console.log(res.affectedRows + " products updated!\n");
            console.log(`Your total is: $${total}`);
        }
    );
    connection.end();

    // logs the actual query being run
    // console.log(query.sql);
}

// note: we need to do it this way to account for the possibility
// of adding/deleting information in the sql table
function getIndexVal(sqlIndex, arr) {
    var arrIndex = -1;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].item_id === sqlIndex) {
            arrIndex = i;
        }
    }
    return arrIndex;
}

// arrT = [{ item_id: 3 }, { item_id: 7 }];

// console.log(getIndexVal(9, arrT));
