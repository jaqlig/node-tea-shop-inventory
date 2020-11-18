var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema(
    {
      name: {type: String, required: true, minlength: 3, maxlength: 100},
    }
  );

module.exports = mongoose.model('Category', CategorySchema);