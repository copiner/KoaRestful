import Validates from '../models/validates';

class ValidatesControllers {
  /**
   * Get all kittens
   * @param {ctx} Koa Context
   */
  async find(ctx) {
    ctx.body = await Validates.find();
  }

}

export default new ValidatesControllers();//export instance
