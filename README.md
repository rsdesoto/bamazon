# bamazon

An inventory management system, running on mysql.

## Instructions:

##### Installing the Program

Please note: this game requires [Node.js](https://nodejs.org/en/) and [mySQL](https://www.mysql.com/) in order to be played. Make sure they are both installed on your computer!

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

Managers can add more items to the inventory. When choosing this option,

![Gameplay Example](https://raw.githubusercontent.com/rsdesoto/hangman-node/master/images/gameplay.png)

##### Replay or Exit

Once the game has been finished, the game will provide a prompt to replay, or to quit.

![Lose Screen](https://raw.githubusercontent.com/rsdesoto/hangman-node/master/images/endgame.png)

**Good luck!**

## Credits:

## IMPORTANT

Before you can proceed, make sure you have both [mySQL](https://www.mysql.com/) and [Node.js](https://nodejs.org/en/) installed on your computer!
