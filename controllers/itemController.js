const { nextTick } = require('async');
var Category = require('../models/category');
var Item = require('../models/item');
var async = require('async');
const validator = require('express-validator');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display item detail
exports.detail = function (req, res) {
    async.parallel({
        item: function (callback) {
            Item.findById(req.params.id)
                .exec(callback)
        }
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.item == null) {
            var err = new Error('Item not found');
            err.status = 404;
            return next(err);
        }
        res.render('item_detail', { item: results.item });
    });
}

// Display creation form on GET
exports.item_create_get = function (req, res, next) {
    async.parallel({
        categories: function (callback) {
            Category.find(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        res.render('create_form', { title: 'Create Item', categories: results.categories });
    });
};

// Handle Item create on POST.
exports.item_create_post = [

    // Validate fields.
    body('name', 'name must not be empty.').trim().isLength({ min: 1 }),
    body('price', 'price must not be empty.').trim().isLength({ min: 1 }),
    body('quantity', 'quantity must not be empty.').trim().isLength({ min: 1 }),
    body('description').trim(),

    (req, res, next) => {

        const errors = validationResult(req);

        var item = new Item(
            {
                name: req.body.name,
                category: req.body.category,
                price: req.body.price,
                quantity: req.body.quantity,
                description: req.body.description
            });

        if (!errors.isEmpty()) {
            async.parallel({
                categories: function (callback) {
                    Category.find(callback);
                },
            }, function (err, results) {
                if (err) { return next(err); }
                res.render('create_form', { title: 'Create Item', categories: results.categories, item: item, errors: errors.array() });
            });
            return;
        }
        else {
            item.save(function (err) {
                if (err) { return next(err); }
                res.redirect(item.url);
            });
        }
    }
];

// Display item delete form on GET.
exports.item_delete_get = function (req, res) {
    async.parallel({
        item: function (callback) {
            Item.findById(req.params.id).exec(callback)
        }
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.item === null) { // No results.
            res.redirect('/');
        }
        res.render('item_delete', { title: 'Delete Item', item: results.item });
    });
};


// Handle item delete on POST.
exports.item_delete_post = function (req, res) {
    async.parallel({
        item: function (callback) {
            Item.findById(req.params.id).exec(callback)
        }
    }, function (err, results) {
        if (err) { return next(err); }
        else {
            Item.findByIdAndRemove(req.body.itemid, function deleteItem(err) {
                if (err) { return next(err); }
                res.redirect('/')
            })
        }
    });
};

// Display item update form on GET.
exports.item_update_get = function (req, res, next) {
    async.parallel({
        item: function (callback) {
            Item.findById(req.params.id).exec(callback);
        },
        category: function (callback) {
            Category.find(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.item == null) { // No results.
            var err = new Error('Item not found');
            err.status = 404;
            return next(err);
        }
        for (var i = 0; i < results.category.length; i++) {
            for (var j = 0; j < results.item.category.length; j++) {
                if (results.category[i]._id.toString() == results.item.category[j]._id.toString()) {
                    results.category[i].checked = 'true';
                    break;
                }
            }
        }
        res.render('create_form', { title: 'Update Item', item: results.item, categories: results.category });
    });
};

// Handle item update on POST.
exports.item_update_post = [

    // Validate fields.
    body('name', 'name must not be empty.').trim().isLength({ min: 1 }),
    body('price', 'price must not be empty.').trim().isLength({ min: 1 }),
    body('quantity', 'quantity must not be empty.').trim().isLength({ min: 1 }),
    body('description').trim(),

    // Sanitize fields.
    sanitizeBody('name').escape(),
    sanitizeBody('price').escape(),
    sanitizeBody('quantity').escape(),
    sanitizeBody('description').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        var item = new Item(
            {
                name: req.body.name,
                category: req.body.category,
                price: req.body.price,
                quantity: req.body.quantity,
                description: req.body.description,
                _id: req.params.id
            });

        if (!errors.isEmpty()) {
            async.parallel({
                category: function (callback) {
                    Category.find(callback);
                },
            }, function (err, results) {
                if (err) { return next(err); }
                for (let i = 0; i < results.category.length; i++) {
                    if (item.category.indexOf(results.category[i]._id) > -1) {
                        results.category[i].checked = 'true';
                    }
                }
                res.render('create_form', { title: 'Update Item', item: results.item, categories: results.category, errors: errors.array() });
            });
            return;
        }
        else {
            Item.findByIdAndUpdate(req.params.id, item, {}, function (err, theitem) {
                if (err) { return next(err); }
                res.redirect(theitem.url);
            });
        }
    }
];