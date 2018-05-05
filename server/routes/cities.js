import 'babel-polyfill';
import Router from 'koa-router';
import { baseApi } from '../config';
import jwt from '../middlewares/jwt';
import CitiesControllers from '../controllers/cities';

const api = 'cities';

const router = new Router();
//console.log(jwt)
router.prefix(`/${baseApi}/${api}`);

// GET /api/cities
router.get('/', jwt, CitiesControllers.find);

// POST /api/cities
// This route is protected, call POST /api/authenticate to get the token
router.post('/', jwt, CitiesControllers.add);

// GET /api/cities/id    5a90f1e1b07de402d8f0811b
// This route is protected, call POST /api/authenticate to get the token
router.get('/:id', jwt, CitiesControllers.findById);

// PUT /api/cities/id
// This route is protected, call POST /api/authenticate to get the token
router.put('/:id', jwt, CitiesControllers.update);

// DELETE /api/cities/id
// This route is protected, call POST /api/authenticate to get the token
router.delete('/:id', jwt, CitiesControllers.delete);

export default router;
