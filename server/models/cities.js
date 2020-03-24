//note:  mongodb -- The official MongoDB driver for Node.js

import mongoose from 'mongoose';//elegant mongodb object modeling for node.js

//  To fix https://github.com/Automattic/mongoose/issues/4291
//mongoose.Promise = global.Promise;

const { Schema } = mongoose;// schema

//  Defining a Model
//  Models are defined through the `Schema` interface
// 由Schema构造生成的模型，除了Schema定义的数据库骨架以外，还具有数据库操作的行为，类似于管理数据属性、行为的类.
const citySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  totalPopulation: {
    type: Number,
    required: false
  },
  country: String,
  zipCode: Number,
  updated: {
    type: Date,
    default: Date.now
  }
});


export default mongoose.model('City', citySchema,'somecities');

//mongoose.model(name,[schema],[collection],[skipInit]) //model方法参数，如果不加第三个参数，就会取第一个参数+"s"作为数据库中collection的名字
//查看官方文档。了解各个api用法!!!

//mongodb
// {
//   "_id":"5a90f1e1b07de402d8f0811b",
//   "name":"Hangzhou",
//   "totalPopulation":1000,
//   "country":"China",
//   "zipCode":310000,
//   "updated":"2018-02-24T05:02:25.293Z",
//   "__v":0
// }
