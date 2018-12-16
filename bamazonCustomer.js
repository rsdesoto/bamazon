////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////// DEPENDENCIES ///////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////

var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////// HELPER FUNCTIONS ///////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * This function is used to convert between the ID number of an item from a SQL database, and the index value
 * of that item in the array returned from querying the SQL database.
 *
 * This takes an array of data from SQL and searches each item to find the index value associated with a specific
 * item.item_id value. This way, an accurate index value will be returned even if items have been added or subtracted
 * from the SQL database and the automatically generated item IDs skip values.
 *
 * @param {integer} sqlIndex
 * @param {data array} arr
 */
function getIndexVal(sqlIndex, arr) {
    var arrIndex = -1;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].item_id === sqlIndex) {
            arrIndex = i;
        }
    }
    return arrIndex;
}

/**
 * This prints out all items available for purchase, and calls the function to start the shopping process.
 * Note: if an item has 0 stock, this item will not be displayed since the user cannot buy any of it!
 */
function displayItems() {
    connection.query("SELECT * FROM PRODUCTS", function(error, data) {
        if (error) throw error;
        data.forEach(item => {
            if (item.stock > 0) {
                console.log(
                    `######################
Item ID: ${item.item_id}
Product: ${item.prod_name}
Department: ${item.dept_name}
Price: ${item.price}
Items Available: ${item.stock}
######################\n`
                );
            }
        });
        userProdID = getProdID(data);
    });
}

/**
 * This uses Inquirer to ask the user for the ID of a product. If that ID exists in the data array returned from querying the
 * original SQL database, this walks the user through the rest of the purchasing process. If this ID does NOT exist,
 * it will rerun, prompting the user for a valid ID.
 * @param {array} data
 */
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
            userProdID = parseInt(answers.id_chosen);
            arrID = getIndexVal(userProdID, data);

            if (arrID === -1) {
                console.log("Sorry, I don't recognize that ID!");
                getProdID(data);
            } else {
                getProdQuantity(data[arrID]);
            }
        });
}

/**
 * This prompts the user, once they have chosen an item to purchase, to enter the number of items they wish to purchase. If the
 * number of items is larger than the available number, this will continue to ask the user for a valid number. If a valid number
 * is entered, the function calls the update function and provides the user with a total amount for their purchase.
 * @param {object} item
 */
function getProdQuantity(item) {
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
                getProdQuantity(item);
            } else if (userQuantity <= 0) {
                console.log("Please enter a value greater than 0!");
            } else {
                var newQuant = item.stock - userQuantity;
                var total = userQuantity * item.price;
                removeStock(item.item_id, newQuant, total);
            }
        });
}

/**
 * This creates the query used to update the value of items in the SQL table. Once the products have been updated within
 * the SQL table, the total cost to the customer is displayed and the connection is terminated.
 * @param {integer} item_id
 * @param {integer} quantity
 * @param {float} total
 */
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
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////// MAIN LOGIC CONTROL /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Upon running the program and connecting to the server, display all available items
 */
connection.connect(function(err) {
    if (err) throw err;
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
