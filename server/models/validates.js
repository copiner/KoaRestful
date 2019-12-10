import db from 'mongoose';
import assert from 'assert';

const Schema = db.Schema;
//validation

var catSchema = new Schema({
  name: {
    type: String,
    required: true
  }
});
var Catness = db.model('Catness', catSchema);

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

//Built-in Validators
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
var Breakfast = db.model('Breakfast', breakfastSchema);

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


//The unique Option is Not a Validator

var uniqueUsernameSchema = new Schema({
  username: {
    type: String,
    unique: true
  }
});
var UniqueUser1 = db.model('UniqueUser1', uniqueUsernameSchema);
var UniqueUser2 = db.model('UniqueUser2', uniqueUsernameSchema);

var dup = [{ username: 'Val' }, { username: 'Val' }];
/*
UniqueUser1.create(dup, function(error) {
  // Race condition! This may save successfully, depending on whether
  // MongoDB built the index before writing the 2 docs.
});
*/

// Need to wait for the index to finish building before saving,
// otherwise unique constraints may be violated.
UniqueUser2.once('index', function(error) {
  console.log(error);
  assert.ifError(error);
  // UniqueUser2.create(dup, function(error) {
  //   // Will error, but will *not* be a mongoose validation error, it will be
  //   // a duplicate key error.
  //   assert.ok(error);
  //   assert.ok(!error.errors);
  //   assert.ok(error.message.indexOf('duplicate key error') !== -1);
  // });
});

// There's also a promise-based equivalent to the event emitter API.
// The `init()` function is idempotent and returns a promise that
// will resolve once indexes are done building;

// UniqueUser2.init().then(function() {
//   UniqueUser2.create(dup, function(error) {
//     // Will error, but will *not* be a mongoose validation error, it will be
//     // a duplicate key error.
//     assert.ok(error);
//     assert.ok(!error.errors);
//     assert.ok(error.message.indexOf('duplicate key error') !== -1);
//   });
// });

//Custom Validators

var userSchema = new Schema({
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
  }
});

var User = db.model('user', userSchema);
var user = new User();
var error;

user.phone = '555.0123';
error = user.validateSync();
assert.equal(error.errors['phone'].message,
  '555.0123 is not a valid phone number!');

user.phone = '';
error = user.validateSync();
assert.equal(error.errors['phone'].message,
  'User phone number required');

user.phone = '201-555-0123';
// Validation succeeds! Phone number is defined
// and fits `DDD-DDD-DDDD`
error = user.validateSync();
//console.log(error);
assert.equal(error, null);

//async Custom Validators

const stuSchema = new Schema({
  name: {
    type: String,
    // You can also make a validator async by returning a promise.
    validate: () => Promise.reject(new Error('Oops!'))
  },
  email: {
    type: String,
    // There are two ways for an promise-based async validator to fail:
    // 1) If the promise rejects, Mongoose assumes the validator failed with the given error.
    // 2) If the promise resolves to `false`, Mongoose assumes the validator failed and creates an error with the given `message`.
    validate: {
      validator: () => Promise.resolve(false),
      message: 'Email validation failed'
    }
  }
});

const Stu = db.model('Stu', stuSchema);
const stu = new Stu();

stu.email = 'test@test.co';
stu.name = 'test';
stu.validate().catch(error => {
  assert.ok(error);
  assert.equal(error.errors['name'].message, 'Oops!');
  assert.equal(error.errors['email'].message, 'Email validation failed');
});


var toySchema = new Schema({
  color: String,
  name: String
});

var validator = function(value) {
  return /red|white|gold/i.test(value);
};
toySchema.path('color').validate(validator,
  'Color `{VALUE}` not valid', 'Invalid color');

toySchema.path('name').validate(function(v) {
  if (v !== 'Turbo Man') {
    throw new Error('Need to get a Turbo Man for Christmas');
  }
  return true;
}, 'Name `{VALUE}` is not valid');

var Toy = db.model('Toy', toySchema,'toyness');

var toy = new Toy({ color: 'Green', name: 'Power Ranger' });

toy.save(function (err) {
  // `err` is a ValidationError object
  // `err.errors.color` is a ValidatorError object
  assert.equal(err.errors.color.message, 'Color `Green` not valid');
  assert.equal(err.errors.color.kind, 'Invalid color');
  assert.equal(err.errors.color.path, 'color');
  assert.equal(err.errors.color.value, 'Green');

  // This is new in mongoose 5. If your validator throws an exception,
  // mongoose will use that message. If your validator returns `false`,
  // mongoose will use the 'Name `Power Ranger` is not valid' message.
  assert.equal(err.errors.name.message,
    'Need to get a Turbo Man for Christmas');
  assert.equal(err.errors.name.value, 'Power Ranger');
  // If your validator threw an error, the `reason` property will contain
  // the original error thrown, including the original stack trace.
  assert.equal(err.errors.name.reason.message,
    'Need to get a Turbo Man for Christmas');

  assert.equal(err.name, 'ValidationError');
});

//CastError
const vehicleSchema = new Schema({
  numWheels: { type: Number, max: 18 }
});
const Vehicle = db.model('Vehicle', vehicleSchema);

const doc = new Vehicle({ numWheels: 'not a number' });
const err = doc.validateSync();

//console.log(err.errors);

err.errors['numWheels'].name; // 'CastError'
// 'Cast to Number failed for value "not a number" at path "numWheels"'
err.errors['numWheels'].message;

//Required Validators
//On Nested Objects
var nameSchema = new Schema({
  name: {
    first: String,
    last: String
  }
});

assert.throws(function() {
  // This throws an error, because 'name' isn't a full fledged path
  nameSchema.path('name').required(true);
}, /Cannot.*'required'/);

var personSchema = new Schema({
  name: {
    type: nameSchema,
    required: true
  }
});

var OnePerson = db.model('OnePerson', personSchema);

var person = new OnePerson();
var error = person.validateSync();

assert.ok(error.errors['name']);

//Update Validators
/*
In the above examples, you learned about document validation.
Mongoose also supports validation for update(), updateOne(), updateMany(), and findOneAndUpdate() operations.
Update validators are off by default - you need to specify the runValidators option.
*/

var updateSchema = new Schema({
  color: String,
  name: String
});

var Updatetoyone = db.model('Updatetoyone', updateSchema);

Updatetoyone.schema.path('color').validate(function (value) {
  return /red|green|blue/i.test(value);
}, 'Invalid color');

var opts1 = { runValidators: true };
Updatetoyone.updateOne({}, { color: 'not a color' }, opts1, function (err) {
  assert.equal(err.errors.color.message,
    'Invalid color');
});

//Update Validators and this
var updatetwoSchema = new Schema({
  color: String,
  name: String
});

updatetwoSchema.path('color').validate(function(value) {
  // When running in `validate()` or `validateSync()`, the
  // validator can access the document using `this`.
  // Does **not** work with update validators.
//  console.log(value)
  if (this.name.toLowerCase().indexOf('red') !== -1) {
    return value !== 'red';
  }
  return true;
});

var Updatetoytwo = db.model('Updatetoytwo', updatetwoSchema);

var toytwo = new Updatetoytwo({ color: 'red', name: 'Red Power Ranger' });
var error = toytwo.validateSync();

assert.ok(error.errors['color']);

var update = { color: 'red', name: 'Red Power Ranger' };
var opts2 = { runValidators: true };

Updatetoytwo.updateOne({}, update, opts2, function(error) {
  // The update validator throws an error:
  // "TypeError: Cannot read property 'toLowerCase' of undefined",
  // because `this` is **not** the document being updated when using
  // update validators
  //console.log(error.errors['color'])
  assert.ok(error);
});
