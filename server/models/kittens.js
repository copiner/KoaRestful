import mongoose from 'mongoose';

const { Schema } = mongoose;// schema

const kittySchema = new Schema({
  name: {
    type: String,
    required: true
  }
});

//methods
// NOTE: methods must be added to the schema before compiling it with mongoose.model()
kittySchema.methods.speak = function () {
  var greeting = this.name
    ? "Meow name is " + this.name
    : "I don't have a name";
  console.log(greeting);
}//Now all of our Kitten instances have a speak method available to them.

kittySchema.methods.findSimilarTypes = function(cb) {
  return this.model('Kitten').find({ type: this.type }, cb);
};

//statics
kittySchema.statics.findByName = function(name) {
  return this.find({ name: new RegExp(name, 'i') });
};

//query
kittySchema.query.byName = function(name) {
  return this.where({ name: new RegExp(name, 'i') });
};

const Kitten = mongoose.model('Kitten', kittySchema,'somekittens');

var silence = new Kitten({ name: 'silence' });
//console.log(silence.name); // 'Silence'
//silence.speak();

var fluffy = new Kitten({ name: 'fluffy' });
//fluffy.speak(); // "Meow name is fluffy"

// fluffy.save(function (err, fluffy) {
//   if (err) return console.error(err);
//   fluffy.speak();
// });

Kitten.find(function (err, kittens) {
  if (err) return console.error(err);
  //console.log(kittens);
})

Kitten.find({ name: /^sile/ }, function(err, kittens){
  if (err) return console.error(err);
  //console.log(kittens);
});


/*------------methods-------------------*/

fluffy.findSimilarTypes(function(err, kit) {
  //console.log(kit); // woof
});


/*------------statics-------------------*/
let animal = async () => {
  return await Kitten.findByName('fluffy');
}

animal().then((v)=>{
  console.log(v)
}).catch((e)=>{
  console.log(e)
})
/*------------query-------------------*/
Kitten.find().byName('fido').exec(function(err, animals) {
  console.log(animals);
});

Kitten.findOne().byName('fido').exec(function(err, animal) {
  console.log(animal);
});
