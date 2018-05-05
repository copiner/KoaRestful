import City from '../models/cities';

/**
根据模型创建实体(entity)，是指的个体对象
var cityentity = new City({
    name : "Houston",
    totalPopulation  : 518,
    country : "American",
    zipCode : 77001
});
//用save 方法把自己保存到数据库中
cityentity.save(function(error,doc){
    if(error){
        console.log("error :" + error);
    }else{
        console.log(doc);
    }
});
*/

class CitiesControllers {
  /* eslint-disable no-param-reassign */

  /**
   * Get all cities
   * @param {ctx} Koa Context
   */
  async find(ctx) {
    ctx.body = await City.find();
  }

  /**
   * Find a city
   * @param {ctx} Koa Context
   */
  async findById(ctx) {
    //console.log(ctx.state.user);
    try {
      const city = await City.findById(ctx.params.id);
      if (!city) {
        ctx.throw(404);
      }
      ctx.body = city;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        ctx.throw(404);
      }
      ctx.throw(500);
    }
  }

  /**
   * Add a city
   * @param {ctx} Koa Context
   */
  async add(ctx) {
    try {
      console.log(ctx.request.body);
      const city = await new City(ctx.request.body).save();
      ctx.body = city;
    } catch (err) {
      ctx.throw(422);
    }
  }

  /**
   * Update a city
   * @param {ctx} Koa Context
   */
  async update(ctx) {
    try {
      const city = await City.findByIdAndUpdate(
        ctx.params.id,
        ctx.request.body
      );
      if (!city) {
        ctx.throw(404);
      }
      ctx.body = city;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        ctx.throw(404);
      }
      ctx.throw(500);
    }
  }

  /**
   * Delete a city
   * @param {ctx} Koa Context
   */
  async delete(ctx) {
    try {
      const city = await City.findByIdAndRemove(ctx.params.id);
      if (!city) {
        ctx.throw(404);
      }
      ctx.body = city;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        ctx.throw(404);
      }
      ctx.throw(500);
    }
  }

  /* eslint-enable no-param-reassign */
}

export default new CitiesControllers();
