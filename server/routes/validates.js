// import 'babel-polyfill';
import Router from 'koa-router';
import { baseApi } from '../config';
import jwt from '../middlewares/jwt';

import ValidatesControllers from '../controllers/validates';

const api = 'validates';
const router = new Router();

router.prefix(`/${baseApi}/${api}`); //  /api/kittens

// GET /api/kittens
router.get('/', ValidatesControllers.find);


export default router;
