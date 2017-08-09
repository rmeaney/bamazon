var mysql = require('mysql');
var inquirer = require('inquirer');
var items = [];
var fullItems =[];

var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'UltraMagnus86',
	database: 'bamazon_rm_db'
});
//connect to the mysql server and sql database
connection.connect(function(err){
	if (err) throw err;
	//run the start function after the connection is made to prompt the user
	grabItems();
})

function grabItems(){
	connection.query('SELECT * FROM bamazonitems', function(err, result){
		if(err){
			console.log(err);
		}
		for(var i = 0; i < result.length; i++){
			items.push(result[i].item_id + ' ' + result[i].product_name + ' ' + '$' + result[i].price);
			fullItems.push(result[i]);
		}
		showItems();
	});
}
function showItems(){
		inquirer.prompt([
			{
				type:'list',
				name:'buying',
				message:'select an item to purchase',
				choices:items
			},
			{
				type:'list',
				name:'quantity',
				message:'How many would you like to purchase',
				choices:['1','2','3','4','5','6','7','8','9','10']

			}
		]).then(function(result){
			var itemBuying = fullItems[result.buying[0] - 1];
			console.log(itemBuying);
			var itemQuantity = result.quantity;
			if(itemQuantity > itemBuying.stock_quantity){
				console.log('We\'re sorry. We currently do not have your desired quantity in storage, please check back at a later date.');
			}else{
				var endQuantity = itemBuying.stock_quantity - itemQuantity;
				var purchaseTotal = itemQuantity * itemBuying.price;
				
				//we must update the database so the
				connection.query("UPDATE bamazonitems set stock_quantity = " + endQuantity + ' WHERE item_id = ' + itemBuying.item_id, function(err, result){
				//connection.query("UPDATE bamazonitems set stock_quantity = " + endQuantity + " WHERE item_id = " + itemBuying.item_id, function(err, result){
					if(err) throw err;
					console.log('Your total comes to: ' + '$' + purchaseTotal);
				});
			}
		});
	}
