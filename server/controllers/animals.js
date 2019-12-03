import Animals from '../models/animals';

class AnimalsControllers {
  /**
   * Get all kittens
   * @param {ctx} Koa Context
   */
  async find(ctx) {
    ctx.body = await Animals.find();
  }

}

export default new AnimalsControllers();//export instance
