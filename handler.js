'use strict';
const qs = require('querystring')
const mongoose = require('mongoose')
const Product = require('./models/product.model')
const config = require('./credentials/config')

let dev_db_url = config.db.mongo.url.dev;
let mongodburl = process.env.MONGODB_URI || dev_db_url;

const dbExecute = (db, fn) => db.then(fn).finally(() => db.close());

function dbConnectAndExecute(dbUrl, fn) {
  return dbExecute(mongoose.connect(dbUrl, {
    useMongoClient: true
  }), fn);
}

function dbConnect() {

  mongoose.connect(mongodburl, {
    useNewUrlParser: true
  });
  mongoose.Promise = global.Promise;
  let db = mongoose.connection;
  db.once("open", () => console.log("connected to the database"));
  db.on('error', console.error.bind(console, 'MongoDB connectionerror: '));
  return db;

}

module.exports.hello = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.getProducts = async (event, context) => {

  let dbconnection = dbConnect();
  try {
    let productset = await Product.find({});
    return {
      statusCode: 200,
      body: JSON.stringify({
        products: productset
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
    };
  } finally {
    dbconnection.close();
  }

}

module.exports.createProduct = async (event, context) => {
  let dbconnection = dbConnect();
  const eventdata = qs.parse(event.body);
  const product = new Product({
    name: eventdata.name,
    price: eventdata.price
  });

  try {
    let saveres = await product.save();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Product saved successfully"
      }),
    };

  } catch (err) {
    return {
      statusCode: 500,
    };
  } finally {
    dbconnection.close();
  }

}