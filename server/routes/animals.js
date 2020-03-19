// import 'babel-polyfill';
import Router from 'koa-router';
import { baseApi } from '../config';
import jwt from '../middlewares/jwt';

import AnimalsControllers from '../controllers/animals';

const api = 'animals';
const router = new Router();

router.prefix(`/${baseApi}/${api}`); //  /api/kittens

// GET /api/kittens
router.get('/', AnimalsControllers.find);


export default router;
