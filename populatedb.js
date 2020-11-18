var userArgs = process.argv.slice(2);

var async = require('async')
var Category = require('./models/category')
var Item = require('./models/item')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var categories = []
var items = []


function categoryCreate(name, cb) {
  var category = new Category({ name: name });  
       
  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category);
  });
}

function itemCreate(name, category, price, quantity, description, cb) {
  itemdetail = { 
    name: name,
    category: category,
    price: price,
    quantity: quantity,
    description: description
  }
    
  var item = new Item(itemdetail);
  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Item: ' + item);
    items.push(item);
    cb(null, item);
  });
}

function createCategories(cb) {
    async.parallel([
        function(callback) {
          categoryCreate('Tea', callback);
        },
        function(callback) {
          categoryCreate('Coffee', callback);
        },
        function(callback) {
          categoryCreate('Yerba', callback);
        },
        function(callback) {
          categoryCreate('Accessories', callback);
        },
      ],
      cb);
    }    
    
  
function createItems(cb) {
    async.parallel([
        function(callback) {
          itemCreate('Organic Vanilla Rooibos', categories[0], 9.9, 41, 'This organic South African Rooibos is blended with Bourbon vanilla bits, marigold petals and natural flavoring. Delicious hot or iced, you may enjoy this herbal infusion neat or with your favorite milk and sweetener.', callback)
        },
        function(callback) {
          itemCreate('Oolong Standard Grade', categories[0], 14.9, 0, 'A classic restaurant grade tea, with a smooth character, and classic Formosa Oolong flavors. Priced for everyday use, this selection is an excellent choice for its value and quality.', callback)
        },
        function(callback) {
          itemCreate('Colombian White Tea Organic', categories[0], 16.9, 0, 'This unique white tea from Colombia exhibits very bold, handcrafted leaves that produce a light golden liquor with a sweet vegetal character. The cup is smooth and complex with hints of melon and wildflower honey. A whisper of vanilla leads to a lingering finish.', callback)
        },
        function(callback) {
          itemCreate('Mango Indica Black Tea', categories[0], 8.9, 127, 'A natural mango-flavored black tea base is decorated with dried mango pieces and sunflower petals. The dark copper liquor has a pronounced mango aroma and flavor, juicy and sweet.', callback)
        },
        function(callback) {
          itemCreate('Earl Gray Creme Vanilla Black Tea', categories[0], 11.9, 59, 'This naturally  flavored black tea selection provides a wonderful balance of a classic Earl Grey with creamy vanilla notes. The rich cup is smooth and satisfying.', callback)
        },
        function(callback) {
          itemCreate('Apricot Black Tea', categories[0], 9.9, 0, 'The natural flavor of apricot lends a sweet, juicy flavor to the black tea base. Contains dried apricot bits (apricots, sugar).', callback)
        },
        function(callback) {
          itemCreate('Colombia', categories[1], 15.9, 66, 'Also known as Variedad Colombia, you’ll taste the classic caramel and chocolate with hints of cherry in the sweet, bright, full-bodied bean. This hybrid of the Caturra was developed in Colombia. ', callback)
        },
        function(callback) {
          itemCreate('Pacamara', categories[1], 14.9, 25, 'The flavor profile is outstanding, with sweet citrus notes, wonderful balance and hints of floral aromas. We like to source Pacamara from the highest possible elevations, which leads to the highest cup quality.', callback)
        },
        function(callback) {
          itemCreate('Villa Sarchi', categories[1], 12.9, 76, 'This Bourbon mutation has elegant acidity, intense fruit tones and excellent sweetness. First grown in the Costa Rican town of Sarchi, this tree is sturdy, healthy and a top choice for organic farming.', callback)
        },
        function(callback) {
          itemCreate('Argentine', categories[2], 12.9, 71, 'Argentine yerba mate in the most popular style of yerba. It has a fluffy composition that is made up of broad cut leaves, lots of palos (stems), and a low amount of polvo (yerba powder). Argentine yerba is aged anywhere from 8 months up to 3 years and has a light to medium intensity flavor.', callback)
        },
        function(callback) {
          itemCreate('Gaucho', categories[2], 16.9, 11, 'Gaucho style yerba is a robust yerba composed of fine cut leaves, moderate to heavy amounts of powder and pulverized stems. Like espresso, gaucho style yerba is full bodied and ranges from medium to bold in flavor.', callback)
        },
        function(callback) {
          itemCreate('Tea infuse', categories[3], 7.9, 168, 'A tea infuser is a device which helps to brew loose leaf teas expertly. It performs the same function as a teabag because it allows the flavour of the tea to be extracted without pieces of the tea leaves spilling into the water.', callback)
        },
        function(callback) {
          itemCreate('Milk frother', categories[3], 7.9, 54, 'Enjoy an authentic coffee with milk frothers. When it comes to enjoying a hot beverage, nothing quite beats the exquisite feeling of sampling coffee shop-style frothy milk.', callback)
        },
        function(callback) {
          itemCreate('Bombilla', categories[3], 7.9, 120, 'A bombilla is a straw used to drink mate. It has a specific design that prevents accidentally drinking the yerba mate leaves and stems as well as burning with hot water while drinking.', callback)
        }
        ],
        cb);
}

async.series([
    createCategories,
    createItems
],
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    mongoose.connection.close();
});