var express = require('express');
const category = require('../models/category');
var router = express.Router();

var categoryController = require('../controllers/categoryController');
var itemController = require('../controllers/itemController');
var orderController = require('../controllers/orderController');


router.get('/', categoryController.overview);

router.get('/item/:id', itemController.detail);

router.get('/create', itemController.item_create_get);
router.post('/create', itemController.item_create_post);

router.get('/item/:id/update', itemController.item_update_get);
router.post('/item/:id/update', itemController.item_update_post);

router.get('/item/:id/delete', itemController.item_delete_get);
router.post('/item/:id/delete', itemController.item_delete_post);

router.get('/orders', orderController.orders_list);
router.get('/orders/create', orderController.order_create_get);
router.post('/orders/create', orderController.order_create_post);

router.get('/order/:id', orderController.order_detail);

router.get('/order/:id/delete', orderController.order_delete_get);
router.post('/order/:id/delete', orderController.order_delete_post);

router.get('/category/:category', categoryController.category_list);
// tea, coffee, yerba, accessories

module.exports = router;
