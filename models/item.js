var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = new Schema(
  {
    name: {type: String, required: true, minlength: 3, maxlength: 100},
    category: [{type: Schema.Types.ObjectId, ref: 'Category'}],
    price: {type: Number, required: true},
    quantity: {type: Number, required: true},
    description: {type: String},
    when: {type: Date}
  }
);

ItemSchema
.virtual('url')
.get(function () {
    return '/item/' + this._id;
});

module.exports = mongoose.model('Item', ItemSchema);