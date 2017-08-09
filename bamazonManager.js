var mysql = require('mysql');
var inquirer = require('inquirer');
var items = [];

var connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'UltraMagnus86',
    database: 'bamazon_rm_db'
});

connection.connect(function(err){
    if(err){
        console.log(err);
    }
    console.log("Connected as id: " + connection.threadId);
    grabItems();
    startMenu();

});

function grabItems(){
	connection.query('SELECT * FROM bamazonitems', function(err, result){
		for(i = 0; i < result.length; i++){
			items.push(result[i]);
		}
	});
}
function startMenu(){
	inquirer.prompt([
		{
			name: 'startChoice',
			type: 'rawlist',
			message: 'Welcome, what would you like to do.',
			choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
		}
	]).then(function(result){
		var menuChosen = result.startChoice;
		switch(result.startChoice){
			case 'View Products for Sale':
				showItems();
				break;
			case 'View Low Inventory':
				lowInventory();
				break;
			case 'Add to Inventory':
				addInventory();
				break;
			case 'Add New Product':
				addProduct();
				break;
		}

	})
}
function showItems(){
	console.log('show Items');
	for(i = 0; i < items.length; i++){
		console.log(items[i].item_id + ' ' + '|' + items[i].product_name + ' |' + ' department: ' + items[i].department_name + ' |' + ' Price: $' + items[i].price + ' |' + ' Quantity: ' + items[i].stock_quantity);
		console.log('__________________________________________________________________________');
	}
}

function lowInventory(){
	console.log('The following items are below their reorder threshold: ');
	for(i = 0; i < items.length; i++){
		if(items[i].stock_quantity < 5){
			console.log(items[i].item_id + ' | ' + items[i].product_name + ' |' + ' Currently left in stock: ' + items[i].stock_quantity);
			console.log('________________________________________________________________________');
		}
	}
}

function addInventory(){
	console.log('Add Inventory');
}

function addProduct(){
	console.log('Add Product');
}