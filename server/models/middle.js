import mongoose from 'mongoose';

const Schema  = mongoose.Schema;// schema

const handleError = (err) => {
  return err;
}
//Pre middleware functions are executed one after another, when each middleware calls next
/*
schema.pre('save', function(next) {
  // do stuff
  next();
});

schema.pre('save', function() {
  return doStuff().
    then(() => doMoreStuff());
});

// Or, in Node.js >= 7.6.0:
schema.pre('save', async function() {
  await doStuff();
  await doMoreStuff();
});
*/

//post middleware are executed after the hooked method and all of its pre middleware have completed.
/*
schema.post('init', function(doc) {
  console.log('%s has been initialized from the db', doc._id);
});
schema.post('validate', function(doc) {
  console.log('%s has been validated (but not saved yet)', doc._id);
});
schema.post('save', function(doc) {
  console.log('%s has been saved', doc._id);
});
schema.post('remove', function(doc) {
  console.log('%s has been removed', doc._id);
});
*/
//Define Middleware Before Compiling Models
const middleSchema = new Schema({ name: String, updatedAt:Date });

middleSchema.pre('save', () => console.log('Hello from pre save'));

//only init hooks are synchronous
middleSchema.pre('init', doc => {
  console.log('%s pre init', doc._id);
});


middleSchema.post('init', function(doc) {
  console.log('%s has been initialized from the db', doc._id);
});
middleSchema.post('validate', function(doc) {
  console.log('%s has been validated (but not saved yet)', doc._id);
});
middleSchema.post('save', function(doc) {
  console.log('%s has been saved', doc._id);
});
middleSchema.post('remove', function(doc) {
  console.log('%s has been removed', doc._id);
});

middleSchema.pre('find', function() {
  console.log(this instanceof mongoose.Query); // true
  this.start = Date.now();
});

middleSchema.post('find', function(result) {
  console.log(this instanceof mongoose.Query); // true
  // prints returned documents
  console.log('find() returned ' + JSON.stringify(result));
  // prints number of milliseconds the query took
  console.log('find() took ' + (Date.now() - this.start) + ' millis');
});

middleSchema.pre('updateOne', function() {
  console.log('updateOne')
  this.set({ updatedAt: new Date() });
});

middleSchema.pre('aggregate', function() {
  // Add a $match state to the beginning of each pipeline.
  console.log('pre aggregate')
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
});

const Middle = mongoose.model('Middle', middleSchema);
//middleSchema.pre('save', () => console.log('Hello from pre save'));




// new Middle({ name: 'wqs' }).save();
// Middle.find().then(function(data){
//   console.log(data);
// });
//
// Middle.updateOne({name:'css'},{name:'cyy'}).then(function(date){
//
// })


/*
schema.pre('validate', function() {
  console.log('this gets printed first');
});
schema.post('validate', function() {
  console.log('this gets printed second');
});
schema.pre('save', function() {
  console.log('this gets printed third');
});
schema.post('save', function() {
  console.log('this gets printed fourth');
});
*/

//Error Handling Middleware

var erSchema = new Schema({
  name: {
    type: String,
    // Will trigger a MongoError with code 11000 when
    // you save a duplicate
    unique: true
  }
});

// Handler **must** take 3 parameters: the error that occurred, the document
// in question, and the `next()` function
erSchema.post('save', function(error, doc, next) {

  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next();
  }
});
const ErSchema = mongoose.model('ErSchema', erSchema);
//----- Will trigger the `post('save')` error handler

//ErSchema.create([{ name: 'Axl Rose' }, { name: 'Axl Rose' }]);
// ErSchema.updateMany({ name: 'Axl Rose' }, { $set: { name: 'hhi' } }, function(error) {
//   // `error.message` will be "There was a duplicate key error"
// });


/*    populate    */

const authorSchema = Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  age: Number,
  stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
});

const fansSchema = Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  age: Number,
  stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
});

const storySchema = Schema({
  author: { type: Schema.Types.ObjectId, ref: 'Author' },
  title: String,
  fans: [{ type: Schema.Types.ObjectId, ref: 'Fans' }]
});

const Story = mongoose.model('Story', storySchema);
const Fans = mongoose.model('Fans', fansSchema);
const Author = mongoose.model('Author', authorSchema);

const author = new Author({
  _id: new mongoose.Types.ObjectId(),
  name: 'Ian Fleming',
  age: 50
});

/*
author.save(function (err) {
  if (err) return handleError(err);

  const story1 = new Story({
    title: 'Casino Royale',
    author: author._id    // assign the _id from the person
  });

  story1.save(function (err) {
    if (err) return handleError(err);
    // thats it!
    const fans1 = new Fans({
      _id: story1._id,
      name: 'Rose',
      age: 16
    });

    fans1.save(function (err) {
      if (err) return handleError(err);

    })

  });
});
*/
Story.findOne({ title: 'Casino Royale' }).
      populate('author').
      exec(function (err, story) {
        if (err) console.error(err);
        // console.log(story)
        // console.log(author)
        //console.log('The author is %s', story.author.name);
        // prints "The author is Ian Fleming"
      });

Story.findOne({ title: /casino royale/i }).
      populate('author', 'name'). // only return the Persons name
      exec(function (err, story) {
        if (err) return handleError(err);

        //console.log('The author is %s', story.author.name);
        // prints "The author is Ian Fleming"

        //console.log('The authors age is %s', story.author.age);
        // prints "The authors age is null'
      });

Story.find().
      populate('fans').
      populate('author').
      exec(function (err, story) {
        if (err) return handleError(err);

        //console.log(story)
      });

Story.find().
      populate({
        path: 'author',
        match: { age: { $gte: 16 }},
        select: 'name -_id',
        options: { limit: 5 }
      }).
      exec(function (err, story) {
        if (err) return handleError(err);

        //console.log(story)
      });

Story.findOne({ title: 'Casino Royale' }, function(error, story) {
  if (error) console.error(error);

  story.author = author;
  //console.log(story.author.name); // prints "Ian Fleming"
});

Author.findOne({ name: 'Antoine' }).
      populate('stories'). // only works if we pushed refs to children
      exec(function (err, author) {
        if (err) return handleError(err);
        //console.log(author);
        Story.
          find({ author: author._id }).
          exec(function (err, stories) {
            if (err) return handleError(err);
            //console.log('The stories are an array: ', stories);
          });
      });

Story.
  find({ author: author._id }).
  exec(function (err, stories) {
    if (err) return handleError(err);
    //console.log('The stories are an array: ', stories);
  });


//Populating across Databases
/*
var eventSchema = new Schema({
  name: String,
  // The id of the corresponding conversation
  // Notice there's no ref here!
  conversation: ObjectId
});
var conversationSchema = new Schema({
  numMessages: Number
});

var db1 = mongoose.createConnection('localhost:27000/db1');
var db2 = mongoose.createConnection('localhost:27001/db2');

var Event = db1.model('Event', eventSchema);
var Conversation = db2.model('Conversation', conversationSchema);

Event.
  find().
  populate({ path: 'conversation', model: Conversation }).
  exec(function(error, docs) {});

*/


//loadedAtPlugin
import loadedAtPlugin from '../middlewares/loadedAt';
const gameSchema = new Schema({
  name: String,
  type: String
});

const playerSchema = new Schema({
  name: String,
  age: Number
});

gameSchema.plugin(loadedAtPlugin);

playerSchema.plugin(loadedAtPlugin);


//Global Plugins
/*

mongoose.plugin(loadedAtPlugin);

const gameSchema = new Schema({ ... });
const playerSchema = new Schema({ ... });
// `loadedAtPlugin` gets attached to both schemas
const Game = mongoose.model('Game', gameSchema);
const Player = mongoose.model('Player', playerSchema);
*/

const Game = mongoose.model('Game', gameSchema);
const Player = mongoose.model('Player', playerSchema);


const game = new Game({
  name: 'Track',
  type: 'superse'
});

const player = new Player({
  name: 'ch',
  age: 7
});

// game.save(function (err) {
//   if (err) return handleError(err);
//   // thats it!
//
// });
//
// player.save(function (err) {
//   if (err) return handleError(err);
//
// })
//console.log(player)
Player.find().then(function(palyer){
  console.log(palyer)
})
