// import 'babel-polyfill';
import Router from 'koa-router';
import { baseApi } from '../config';
import jwt from '../middlewares/jwt';
import MiddleControllers from '../controllers/middle';

const api = 'middle';

const router = new Router();

router.prefix(`/${baseApi}/${api}`); //  /api/kittens

// GET /api/kittens
router.get('/', MiddleControllers.find);


export default router;
