# bamazon

An inventory management system, running on mySQL.

## Instructions:

##### Installing the Program

Please note: this application requires [Node.js](https://nodejs.org/en/) and [mySQL](https://www.mysql.com/) in order to be used. Make sure they are both installed on your computer!

Download the program, mySQL information, and all other files. Navigate to the file location using the terminal, or open the files with a code editor with a built-in terminal. Install all necessary packages using the command "npm i".

![Navigation and Instillation](https://raw.githubusercontent.com/rsdesoto/bamazon/master/images/location_and_installation.png)

##### Customer Screen

Bring up the customer screen by typing the command "node bamazonCustomer.js". The current available inventory to shop from will appear.

![Customer Inventory](https://raw.githubusercontent.com/rsdesoto/bamazon/master/images/customer_view.png)

In order to add items, enter the item ID and the number of items you want to buy. This will update the mySQL server.

![Customer Purchase](https://raw.githubusercontent.com/rsdesoto/bamazon/master/images/add_to_cart.png)

If there isn't enough inventory to fulfill a purchase, the user will be notified.

![Low Inventory](https://raw.githubusercontent.com/rsdesoto/bamazon/master/images/protection_value.png)

##### Manager Screen

To run the manager screen, type in "node bamazonManager.js". The four options for managers will be displayed.

![Manager Screen](https://raw.githubusercontent.com/rsdesoto/bamazon/master/images/manager_view.png)

The first option available is printing a list of all items in the store's inventory, including items not in stock.

The second item available is printing a list of all items with 4 or fewer units in stock.

![Low Inventory](https://raw.githubusercontent.com/rsdesoto/bamazon/master/images/low_inventory.png)

Managers can add more items to the inventory. When choosing this option, managers will be prompted to choose an item from a list. Once it has been chosen, they will be prompted to add the number of items being added to the inventory.

![Update Inventory](https://github.com/rsdesoto/bamazon/blob/master/images/add_to_inventory_1.png?raw=true)

![Update Inventory](https://raw.githubusercontent.com/rsdesoto/bamazon/master/images/add_to_inventory_2.png)

Finally, managers can add new items to store entirely. When choosing this option, managers will be walked through creating a new item.

![Add Item](https://raw.githubusercontent.com/rsdesoto/bamazon/master/images/add_new_product1.png)

Once the item has been created, it will show up in the shop's inventory and will be available for customers.

![Add Item](https://raw.githubusercontent.com/rsdesoto/bamazon/master/images/add_new_product2.png)

## Credits:

The code in Inquirer that uses regex to validate the user input was taken from some of the inquirer examples -- specifically [pizza.js](https://github.com/SBoudrias/Inquirer.js/blob/master/packages/inquirer/examples/pizza.js).

## Contact me:

if you run into bugs or have any questions, email me at ry.e.desoto@gmail.com
