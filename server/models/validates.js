import mongoose from 'mongoose';

const assert = require('assert');

const Schema = mongoose.Schema;
//validation

var catSchema = new Schema({
  name: {
    type: String,
    required: true
  }
});
var Catness = mongoose.model('Catness', catSchema);

// This cat has no name :(
var littleCat = new Catness();
/*littleCat.save(function(error) {
  assert.equal(error.errors['name'].message,
    'Path `name` is required.');

  error = littleCat.validateSync();
  assert.equal(error.errors['name'].message,
    'Path `name` is required.');
});
*/
var breakfastSchema = new Schema({
  eggs: {
    type: Number,
    min: [6, 'Too few eggs'],
    max: 12
  },
  bacon: {
    type: Number,
    required: [true, 'Why no bacon?']
  },
  drink: {
    type: String,
    enum: ['Coffee', 'Tea'],
    required: function() {
      return this.bacon > 3;
    }
  }
});
var Breakfast = mongoose.model('Breakfast', breakfastSchema);

var badBreakfast = new Breakfast({
  eggs: 2,
  bacon: 0,
  drink: 'Milk'
});
var error = badBreakfast.validateSync();

assert.equal(error.errors['eggs'].message,
  'Too few eggs');
assert.ok(!error.errors['bacon']);
assert.equal(error.errors['drink'].message,
  '`Milk` is not a valid enum value for path `drink`.');

badBreakfast.bacon = 5;
badBreakfast.drink = null;

error = badBreakfast.validateSync();
assert.equal(error.errors['drink'].message, 'Path `drink` is required.');

badBreakfast.bacon = null;
error = badBreakfast.validateSync();
assert.equal(error.errors['bacon'].message, 'Why no bacon?');
