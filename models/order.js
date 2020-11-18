var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var OrderSchema = new Schema(
  {
    item: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
    quantity: { type: Number, required: true },
  }
);

OrderSchema
  .virtual('url')
  .get(function () {
    return '/order/' + this._id;
  });

module.exports = mongoose.model('Order', OrderSchema);
