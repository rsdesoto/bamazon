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
/////////////// CONNECTION /////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Upon running the program and connecting to the server, display all available actions managers can take
 */
connection.connect(function(err) {
    if (err) throw err;
    displayOptions();
});

////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////// HELPER FUNCTIONS ///////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Using inquirer, walk the user through generating a new item. Once the inputs have been generated,
 * pass into a function that runs the query.
 */
function addItems() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "addName",
                message: "What is the name of your new item?"
            },
            {
                type: "input",
                name: "addDepartment",
                message: "What department is this item in?"
            },
            {
                type: "input",
                name: "addPrice",
                message: "How much is this item?",
                validate: function(value) {
                    var pass = value.match(/[0-9]/i);
                    if (pass) {
                        return true;
                    }

                    return "Please enter a valid price";
                }
            },
            {
                type: "input",
                name: "addQuantity",
                message: "How many items are available?",
                validate: function(value) {
                    var pass = value.match(/[0-9]/i);
                    if (pass) {
                        return true;
                    }

                    return "Please enter a valid quantity";
                }
            }
        ])
        .then(answers => {
            addItemQuery(answers);
        });
}

/**
 * Using the object passed into the function, create a SQL query and run the query.
 * @param {object} obj
 */
function addItemQuery(obj) {
    connection.query(
        "INSERT INTO products SET ?",
        [
            {
                prod_name: obj.addName,
                dept_name: obj.addDepartment,
                price: parseFloat(obj.addPrice),
                stock: parseInt(obj.addQuantity)
            }
        ],
        function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " product added!\n");
        }
    );
    connection.end();
}

/**
 * This creates an inquirer prompt showing the current items and quantity. Once the item and the number of
 * items have been input from the user, information is passed to a function to create and run
 * a SQL query.
 */
function addToInventory() {
    connection.query("SELECT * FROM PRODUCTS", function(error, data) {
        if (error) throw error;
        optionArr = [];

        data.forEach(item => {
            var optionText = `${item.prod_name}: ${item.stock} in stock`;
            optionArr.push(optionText);
        });

        inquirer
            .prompt([
                {
                    type: "list",
                    name: "updateItem",
                    message: "Which item would you like to update?",
                    choices: optionArr
                },
                {
                    type: "input",
                    name: "updateNum",
                    message: "How many additional items would you like to add?",
                    validate: function(value) {
                        var pass = value.match(/[0-9]*$/i);
                        if (pass) {
                            return true;
                        }

                        return "Please enter a valid number";
                    }
                }
            ])
            .then(answers => {
                var item = answers.updateItem.split(":")[0];

                var objToUpdate = data[findID(item, data)];
                numToUpdate = objToUpdate.stock + parseInt(answers.updateNum);

                updateValues(objToUpdate, numToUpdate);
            });
    });
}

/**
 * This creates a query to update the mysql product table -- taking in an integer value to update the information
 * in the table associated with the object
 * @param {object} obj
 * @param {integer} numToUpdate
 */
function updateValues(obj, numToUpdate) {
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock: numToUpdate
            },
            {
                item_id: obj.item_id
            }
        ],
        function(err, res) {
            if (err) throw err;

            console.log(res.affectedRows + " products updated!\n");
        }
    );
    connection.end();
}

/**
 * This takes an item name and finds the object associated with that item name. It then returns the item_id for use in creating
 * a mySQL query.
 * @param {string} item
 * @param {array} data
 */
function findID(item, data) {
    var arrID = -1;
    data.forEach((element, index) => {
        if (element.prod_name === item) {
            arrID = index;
        }
    });
    return arrID;
}

/**
 * This prints out all items available for purchase, and calls the function to start the shopping process.
 * Note: for the managers, all stock shown.
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
    });
    connection.end();
}

/**
 * This prints out all items with stock of 4 or less
 */
function displayLowItems() {
    connection.query("SELECT * FROM PRODUCTS WHERE stock < 5", function(
        error,
        data
    ) {
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
    });
    connection.end();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////// MAIN LOGIC CONTROL /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * This creates a menu via inquirer, walking users through the options available.
 */
function displayOptions() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "managerAction",
                message: "What would you like to do?",
                choices: [
                    "View products for sale",
                    "View low inventory",
                    "Add to inventory",
                    "Add new product"
                ]
            }
        ])
        .then(answers => {
            console.log(answers);
            if (answers.managerAction === "View products for sale") {
                console.log("All items available: \n");
                displayItems();
            } else if (answers.managerAction === "View low inventory") {
                console.log("These items have 4 or fewer units in stock: \n");
                displayLowItems();
            } else if (answers.managerAction === "Add to inventory") {
                console.log("Adding to inventory... \n");
                addToInventory();
            } else if (answers.managerAction === "Add new product") {
                console.log("Adding item to store.... \n");
                addItems();
            }
        });
}

/**
 * Pseudocode:
 *
 * 0. create connection to server, bring in dependencies (inquirer), etc.
 * 1. create inquirer prompt tree
 * 2. products for sale function: port over what is in bamazonCustomer
 * 3. view low inventory: create a function that SELECT * FROM products WHERE stock < 5. print each on a new line.
 * 4. add to inventory: create a function that lists all items (name, current quantity). scroll through list and let manager update (note:
 *      allow positive numbers only; this is an ADD more)
 *      Note: will need some kind of a program to switch back and forth between SQL and not SQL ID -- can use similar logic to customer
 *      Will use inquirer list for this -- this will not allow the manager to sally forth with IDs that don't exist
 * 5. add new product: walk the manager through each item. there should be an input for name, department, price, and stock. include
 *      error handling -- do not let the manager keep adding values that are not correct
 *      If all the inputs are good, update SQL. otherwise, keep giving error messages explaining what went wrong
 */
