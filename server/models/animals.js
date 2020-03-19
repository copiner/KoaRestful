import mongoose from 'mongoose';

const assert = require('assert');
const { Schema } = mongoose;// schema

/*-------------------Schemas-------------------------------------------*/
var animalSchema = new Schema({
  name: String,
  type: String
 });


 //methods
 animalSchema.methods.findSimilarTypes = function(cb) {
   return this.model('Animal').find({ type: this.type }, cb);
 };

 //statics
 animalSchema.statics.findByName = function(name) {
   return this.find({ name: new RegExp(name, 'i') });
 };

 //query
 animalSchema.query.byName = function(name) {
   return this.where({ name: new RegExp(name, 'i') });
 };


 const Animal = mongoose.model('Animal', animalSchema,'someanimals');

 /*------------methods-------------------*/
 var dog = new Animal({ type: 'dog' });
 dog.findSimilarTypes(function(err, dogs) {
   //console.log(dogs); // woof
 });


 /*------------statics-------------------*/
 let animal = async () => {
   return await Animal.findByName('fluffy');
 }

 animal().then((v)=>{
   //console.log(v)
 }).catch((e)=>{
   //console.log(e)
 })
 /*------------query-------------------*/
 Animal.find().byName('fido').exec(function(err, animals) {
   //console.log(animals);
 });

 Animal.findOne().byName('fido').exec(function(err, animal) {
   //console.log(animal);
 });

 // define a schema
 var personSchema = new Schema({
   name: {
     first: String,
     last: String
   },
   n:{
     type: String,
     alias: 'petName'
   }
 });

 // personSchema.virtual('fullName').get(function () {
 //   return this.name.first + ' ' + this.name.last;
 // });

 personSchema.virtual('fullName').
  get(function() { return this.name.first + ' ' + this.name.last; }).
  set(function(v) {
    this.name.first = v.substr(0, v.indexOf(' '));
    this.name.last = v.substr(v.indexOf(' ') + 1);
  });

 // compile our model
 var Person = mongoose.model('Person', personSchema,'person');

 // create a document
var axl = new Person({
  name: { first: 'Axl', last: 'Rose' }
});

//console.log(axl.name.first + ' ' + axl.name.last); // Axl Rose
//console.log(axl.fullName); // Axl Rose

axl.fullName = 'William Rose'; // Now `axl.name.first` is "William"

//console.log(axl.fullName); // Axl Rose


var person = new Person({ petName: 'Val' });
//console.log(person); // { n: 'Val' }
//console.log(person.toObject({ virtuals: true })); // { n: 'Val', petName: 'Val' }
//console.log(person.petName); // "Val"

person.petName = 'Not Val';
//console.log(person); // { n: 'Not Val' }

//Aliases
const childSchema = new Schema({
  n: {
    type: String,
    alias: 'last'
  }
}, { _id: false });

const parentSchema = new Schema({
  // If in a child schema, alias doesn't need to include the full nested path
  /*
  c:{
    n: {
      type: String,
      alias: 'last'
    }
  }
  */
  c: childSchema,
  d: {
    f: {
      type: String,
      // Alias needs to include the full nested path if declared inline
      alias: 'd.first'
    }
  }
});

var Parent = mongoose.model('Parent', parentSchema,'parent');

var parent = new Parent({
  c:{ last:'w' },
  d:{ first:'rq'}
});

//console.log(parent);

//options

/*
new Schema({..}, options);

// or

var schema = new Schema({..});
schema.set(option, value);

//or e.g.
mongoose.set('autoIndex', false);
const schema = new Schema({..}, { autoIndex: false });
var schema = new Schema({ name: String }, { id: false });
new Schema({..}, { capped: { size: 1024, max: 1000, autoIndexId: true } });
var childSchema = new Schema({ name: String }, { _id: false });
*/

var cSchema = new Schema({ name: String }, { _id: false });
var pSchema = new Schema({ children: [cSchema] });

var PModel = mongoose.model('PModel', pSchema,"pmodel");
/*
PModel.create({ children: [{ name: 'Luke' }] }, function(error, doc) {
  // doc.children[0]._id will be undefined
  //console.log(doc)
});
*/

/*
//minimize
Mongoose will, by default, "minimize" schemas by removing empty objects
*/

const minSchema = new Schema({ name: String, inventory: {} });
const Character = mongoose.model('Character', minSchema,"character");
/*
// will store `inventory` field if it is not empty
const frodo = new Character({ name: 'Frodo', inventory: { ringOfPower: 1 }});

let nimize = async () =>{
  await frodo.save();
}

let fnimize = async () =>{
  return await Character.findOne({ name: 'Frodo' }).lean();
}

fnimize.then((doc)=>{
  console.log(doc)
})
*/
// will not store `inventory` field if it is empty
const sam = new Character({ name: 'Sam', inventory: {}},/*{ minimize: false }*/);


//console.log(sam.$isEmpty('inventory'));

let samfun = async () =>{
  await sam.save();
}
//samfun();

let sammize = async () =>{
  return await Character.findOne({ name: 'Sam' }).lean();
}

sammize().then((doc)=>{
  //console.log(doc.inventory)
})

var toobjSchema = new Schema({ name: String });
// toobjSchema.path('name').get(function (v) {
//   return v + ' is my name';
// });
toobjSchema.set('toObject', { getters: true });
var ToObj = mongoose.model('ToObj', toobjSchema);
var too = new ToObj({ name: 'Max Headroom' });
//console.log(too);

//console.log(toobjSchema.path('name') instanceof mongoose.Schema.Types.String);
//console.log(toobjSchema.path('name').instance);

//SchemaType Options
var numberSchema = new Schema({
  integerOnly: {
    type: Number,
    get: v => Math.round(v),
    set: v => Math.round(v),
    alias: 'i'
  }
});

var Numbered = mongoose.model('Numbered', numberSchema);

var aNumber = new Numbered();
/*
console.log(aNumber);
aNumber.integerOnly = 2.001;
console.log(aNumber);
console.log(aNumber.integerOnly);
console.log(aNumber.i);

let aNum = async () =>{
  await aNumber.save();
}

//aNum()
*/
// var dateSchema = new Schema({
//   dueDate: {
//     type: Date,
//   }
// });

var Assignment = mongoose.model('Assignment', { dueDate: Date });
let ass = new Assignment({dueDate:new Date});
let aAss = async () =>{
  await ass.save();
}
//aAss()

/*
Assignment.findOne(function (err, doc) {

    doc.dueDate.setMonth(3);
    doc.save(); // THIS DOES NOT SAVE YOUR CHANGE
    doc.markModified('dueDate');
    doc.save(); // works

})

*/

//Buffer
const bufferSchema = new Schema({ binData: Buffer }); // binData will be cast to a Buffer

const Data = mongoose.model('Data', bufferSchema);

const buf = new Data({ binData: 'test'});
//console.log(buf)

var ToySchema = new Schema({ name: String });
// var ToyBoxSchema = new Schema({
//   toys: [ToySchema],
//   buffers: [Buffer],
//   strings: [String],
//   numbers: [Number]
//   // ... etc
// });

var ToyBoxSchema = new Schema({
  toys: {
    type: [ToySchema],
    default: undefined
  }
});

var ToyBox = mongoose.model('ToyBox', ToyBoxSchema);
//console.log((new ToyBox()).toys); // []

async function run() {
  // Create a new mongoose model
  const changedSchema = new mongoose.Schema({
    name: String
  });
  const Changed = mongoose.model('Changed', changedSchema, 'changed');

  // Create a change stream. The 'change' event gets emitted when there's a
  // change in the database
  Changed.watch().on('change', data => console.log(new Date(), data));

  // Insert a doc, will trigger the change stream handler above
  console.log(new Date(), 'Inserting doc');
  await Changed.create({ name: 'W Rose' });
}

//run()

//model
/*
Mongoose models provide several static helper functions for CRUD operations.
Each of these functions returns a mongoose Query object.

A mongoose query can be executed in one of two ways.
First, if you pass in a callback function, Mongoose will execute the query asynchronously and pass the results to the callback.

A query also has a .then() function, and thus can be used as a promise.

Mongoose queries are not promises. They have a .then() function for co and async/await as a convenience.
*/
