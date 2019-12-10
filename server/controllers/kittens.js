import Middle from '../models/middle';

class MiddleControllers {
  /**
   * Get all kittens
   * @param {ctx} Koa Context
   */
  async find(ctx) {
    ctx.body = await Middle.find();
  }

}

export default new MiddleControllers();//export instance
