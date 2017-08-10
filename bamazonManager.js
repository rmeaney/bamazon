var mysql = require('mysql');
var inquirer = require('inquirer');
var items = [];
var smallItems = [];

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
    //startMenu();

});

function grabItems(){
	connection.query('SELECT * FROM bamazonitems', function(err, result){
		for(i = 0; i < result.length; i++){
			items.push(result[i]);
			smallItems.push(result[i].item_id + ' ' + result[i].product_name + ' ' + result[i].stock_quantity);

		}

	});
	startMenu();
}
function startMenu(){
	inquirer.prompt([
		{
			name: 'startChoice',
			type: 'rawlist',
			message: 'Welcome, what would you like to do.',
			choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Quit']
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
			case 'Quit':
				console.log('Have a Wonderful Day!');
				connection.end();
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
	anotherTransaction();
}

function lowInventory(){
	console.log('The following items are below their reorder threshold: ');
	for(i = 0; i < items.length; i++){
		if(items[i].stock_quantity < 5){
			console.log(items[i].item_id + ' | ' + items[i].product_name + ' |' + ' Currently left in stock: ' + items[i].stock_quantity);
			console.log('________________________________________________________________________');
		}
	}
	anotherTransaction();
}

function addInventory(){
	console.log('Add Inventory');
	inquirer.prompt([
	{
		type: 'list',
		name: 'selectItem',
		message: 'Please select an item that you would like to update.',
		choices: smallItems
	},{
		type: 'input',
		name: 'numToAdd',
		message: 'Please enter the amount you would like to add (numbers only, please).'
	}
	]).then(function(result){
		var chosenItem = items[result.selectItem[0] - 1].stock_quantity;
			//console.log(chosenItem);
		//console.log(items[result.selectItem[0] - 1].stock_quantity);
		var newQuantity = parseInt(result.numToAdd) + parseInt(chosenItem);
		var tableItem = items[result.selectItem[0] - 1];
		
		connection.query("UPDATE bamazonitems set stock_quantity = " + newQuantity + ' WHERE item_id = ' + tableItem.item_id, function(err, result){
				
					if(err) throw err;
					
					console.log(tableItem.product_name + ' Has been updated. Currently ' + newQuantity + ' in stock.')
				
					anotherTransaction();
				})

	});
}

function addProduct(){
	inquirer.prompt([
			{
				type: 'input',
				name: 'newItemName',
				message: 'Please enter the name of your new item.'
			},
			{
				type: 'input',
				name: 'newItemDepartment',
				message: 'Please enter the category of your new item.'
			},
			{
				type: 'input',
				name: 'newItemPrice',
				message: 'Please enter the price of your new item.'
			},
			{
				type: 'input',
				name: 'newItemQuantity',
				message: 'Please enter the starting quantity of the new item.'
			}
		]).then(function(answer){
			var sql = "INSERT INTO bamazonitems (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)";
			var inserts = [answer.newItemName, answer.newItemDepartment, answer.newItemPrice, answer.newItemQuantity];
			preparedSqlQuery = mysql.format(sql, inserts);
			console.log(preparedSqlQuery);
			connection.query(preparedSqlQuery, function(err, result){
				if(err) throw err;
				console.log(answer.newItemName + ' has been added to the our database! It is now available to be viewed, and edited');
				anotherTransaction();
			});
		});
}

function anotherTransaction(){
		inquirer.prompt([
			{
				type:'list',
				name:'startOver',
				message: 'Would you like to make another Transaction?',
				choices:['Yes', 'No']
			}
			]).then(function(result){
				if(result.startOver === 'Yes'){
					smallItems =[];
					items =[];
					grabItems();
				}else{
					console.log('Have a wonderful day!');
					connection.end();
				}
			});
	}