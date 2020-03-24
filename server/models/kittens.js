import mongoose from 'mongoose';

const { Schema } = mongoose;// schema

const kittySchema = new Schema({
  name: {
    type: String,
    required: true
  }
});


// NOTE: methods must be added to the schema before compiling it with mongoose.model()
kittySchema.methods.speak = function () {
  var greeting = this.name
    ? "Meow name is " + this.name
    : "I don't have a name";
//  console.log(greeting);
}//Now all of our Kitten instances have a speak method available to them.


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
