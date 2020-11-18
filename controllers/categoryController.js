const { nextTick } = require('async');
var Category = require('../models/category');
var Item = require('../models/item');
var Order = require('../models/order');
var async = require('async');

// Display overview with stats
exports.overview = function (req, res) {

    async.parallel({
        item_count: function (callback) {
            Item.countDocuments({}, callback);
        },
        order_count: function (callback) {
            Order.countDocuments({}, callback);
        },
    },   function (err, results) {
        res.render('index', { title: 'Overview', error: err, data: results });
    });
}

// Display list of all items in specific category
exports.category_list = function (req, res, next) {
    Category.findOne({ 'name': req.params.category }, function (err, docs) {
        if (err) {
            return next(err);
        }
        else if (docs == null) {
            var err = new Error('Not found');
            err.status = 404;
            return next(err);
        }
        else {
            Item.find({ 'category': docs.id })
                .exec(function (err, allItems) {
                    if (err) {
                        var err = new Error('Item not found');
                        err.status = 404;
                        return next(err);
                    }
                    if (allItems == null) {
                        var err = new Error('Not found');
                        err.status = 404;
                        return next(err);
                    }
                    res.render('category_list', { item_list: allItems });
                });
        }
    });
}