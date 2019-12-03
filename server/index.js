/*
Compile the entire src directory and output it to the lib directory by using either --out-dir or -d. This doesn't overwrite any other files or directories in lib.

"build": "babel server -d dist",
*/
import bodyParser from 'koa-bodyparser';
import Koa from 'koa';
import logger from 'koa-logger';
import mongoose from 'mongoose';
import helmet from 'koa-helmet';
import routing from './routes/';
import { port, monAddr } from './config';

mongoose.connect(monAddr, {
  useNewUrlParser: true,
  autoIndex: false ,
  useCreateIndex :true,
  useUnifiedTopology: true
}).catch((e) => console.error(e));

mongoose.connection.on('error', e => console.error(e));

// mongoose.connection.on('open', ()=>{
// // console.log('wds');
// });

// Create Koa Application
const app = new Koa();

app.use(logger())
   .use(bodyParser())
   .use(helmet());

routing(app);

// Start the application
app.listen(port, () =>
  console.log(`✅  The server is running at http://localhost:${port}/`)
);

export default app;
