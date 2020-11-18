const { nextTick } = require('async');
var Item = require('../models/item');
var Order = require('../models/order');
var async = require('async');
const validator = require('express-validator');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all orders
exports.orders_list = function (req, res, next) {
    Order.find()
        .populate('item')
        .exec(function (err, allOrders) {
            if (err) return next(err);
            res.render('orders_list', { title: 'Orders List', orders_list: allOrders });
        });
}

// Display order creation form on GET
exports.order_create_get = function (req, res, next) {
    Item.find().exec(function (err, items) {
        if (err) return next(err);
        res.render('order_form', { title: 'Create new order', items: items });
    })
};

// Handle order creation form on POST
exports.order_create_post = [

    body('quantity', 'quantity must not be empty.').trim().isLength({ min: 1 }),

    (req, res, next) => {

        const errors = validationResult(req);

        var order = new Order(
            {
                item: req.body.item,
                quantity: req.body.quantity
            });

        if (!errors.isEmpty()) {
            async.parallel({
                items: function (callback) {
                    Item.find(callback);
                },
            }, function (err, results) {
                if (err) { return next(err); }
                res.render('order_form', { title: 'Create new order', items: results.items, order: order, errors: errors.array() });
            });
            return;
        }
        else {
            var item = new Item(
                {
                    name: req.body.item.name,
                    category: req.body.item.category,
                    price: req.body.item.price,
                    quantity: req.body.item.quantity-req.body.quantity,
                    description: req.body.item.description,
                    _id: req.body.item.id
                });
                
            Item.findByIdAndUpdate(req.body.item.id, item, {}, function (err, theitem) {
                if (err) { return next(err); }
            });

            order.save(function (err) {
                if (err) { return next(err); }
                res.redirect(order.url);
            });
        }
    }
];

// Display order detail
exports.order_detail = function (req, res, next) {
    Order.findById(req.params.id)
        .populate('item')
        .exec(function (err, order) {
            if (err) return next(err);
            res.render('order_detail', { title: 'Order detail', order: order });
        });
}

// Display order delete form on GET.
exports.order_delete_get = function (req, res) {
    Order.findById(req.params.id).exec(function (err, order, next) {
        if (err) { return next(err); }
        if (order === null) { // No results.
            res.redirect('/');
        }
        res.render('order_delete', { title: 'Delete order', order: order });
    });
};

// Handle order delete on POST.
exports.order_delete_post = function (req, res) {
    Order.findById(req.params.id).exec(function (err, results) {
        if (err) { return next(err); }
        else {
            Order.findByIdAndRemove(req.body.orderid, function deleteOrder(err) {
                if (err) { return next(err); }
                res.redirect('/orders')
            })
        }
    });
};