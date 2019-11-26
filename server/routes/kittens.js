// import 'babel-polyfill';
import Router from 'koa-router';
import { baseApi } from '../config';
import jwt from '../middlewares/jwt';
import KittensControllers from '../controllers/kittens';

const api = 'kittens';

const router = new Router();

router.prefix(`/${baseApi}/${api}`); //  /api/kittens

// GET /api/kittens
router.get('/', KittensControllers.find);


export default router;
