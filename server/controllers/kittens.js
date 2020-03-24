import Kittens from '../models/kittens';

class KittensControllers {
  /**
   * Get all kittens
   * @param {ctx} Koa Context
   */
  async find(ctx) {
    ctx.body = await Kittens.find();
  }

}

export default new KittensControllers();//export instance
