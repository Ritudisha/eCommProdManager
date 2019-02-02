const express = require('express')
const app = express()
const port = 3000
const {MongoClient,ObjectId} = require("mongodb");
const bodyParser = require('body-parser');

const getCategoryModel = require('./getCategoryModel.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/addCategory', (req, res) => {//Input: category Id, child category list.
  console.log(req.body);
  MongoClient.connect('mongodb://127.0.0.1:27017/',(err,client)=>{
    if(err){

    }
    let db = client.db('MY_DB');
    if(req.body.childCategories != undefined){
    req.body.childCategories.forEach((child) => {
      console.log(child);
      let childId; 
      db.collection('category').findOne({name: child}).then((result) => {
          
          if(result == null){
            db.collection('category').insertOne({name: child, childCategories: []}).then((result)=>{
              childId = result.ops[0]._id.toString();
              //console.log("InsertedCat", childId);
              db.collection('category').updateOne({name: req.body.name}, { $addToSet: {childCategories: ObjectId(childId)}}, {upsert: true}).then((result)=>{
                res.status(200).send(result);
              }).catch(err=>{
    
              });
            });
            
          }
          else{
            childId = result._id;
            //console.log("else", childId)
            db.collection('category').updateOne({name: req.body.name}, { $addToSet: {childCategories: ObjectId(childId)}}, {upsert: true}).then((result)=>{
              res.status(200).send(result);
            }).catch(err=>{
  
            });
          }
          
          
      });
    });
  }
  });
});
app.get('/getCategory', (req, res) => {
  
  getCategoryModel.getRootCategories().then((result)=>{
        
    return getCategoryModel.getChildren(result, res);
      
      
    }).then((result)=>{
      //console.log('res1',result);
        res.send(result);
        res.end();
    })
    
});


app.post('/addOrUpdateProduct', (req, res) => {
  // Input: {"productName": Value, "categories": [values], "prodPrice": [{"price": Value, "currency": Value}],"stockQuantity": ["size": Value, "quantity": Value},{	"size": Value,"quantity": Value}],"brand":Value,"images": [file1, File2, ...]}
  console.log(req.body);
    MongoClient.connect('mongodb://127.0.0.1:27017/', (error, client) => {
      if(error){

      }
      let db = client.db('MY_DB');

      let catArray = [];
      req.body.categories.forEach((cat) => {
        catArray.push(ObjectId(cat))
      })
      let prodId = null;
      let myDateString = Date();
      
      db.collection('Products').findOne({name: req.body.productName, brand: req.body.brand, status: 1}).then((result) => {
        if(result != null){
          prodId = result._id;
        }

        if(prodId == null){
          console.log('If', prodId)
          db.collection('Products').insertOne({name: req.body.productName, categories: catArray, productPrice: req.body.prodPrice, stockQuantity: req.body.stockQuantity, brand: req.body.brand, status: 1, addedDateTime: myDateString, lastUpdate: myDateString, images: req.body.images}).then((result) => {
            res.status(200).send(result);
  
          });
        }
  
        else{
          //Assumption: all the lists present in each product document is updated totally. Hence, front end displays the existing elements in the respective list and allows user to append new or edit the existing ones.
          db.collection('Products').updateOne({name: req.body.productName, brand: req.body.brand, status: 1}, {$set: {name: req.body.productName, brand: req.body.brand, status: 1, lastUpdate: myDateString, categories: catArray, productPrice: req.body.prodCategory, stockQuantity: req.body.stockQuantity, images: req.body.images}}, {upsert: true}).then((result) => {
              console.log('Id',result._id);
              
              res.status(200).send(result);
          });
        }
        
      });
      //console.log(result)
      
    });
});


app.post('/getCategoryWiseProduct', (req, res) => { //Assumption: The user selects category from the list of available categories, displayed by the System.
  //Input: [categories]
  console.log(req.body.categories);
  MongoClient.connect('mongodb://127.0.0.1:27017/', (error, client) => {
    if(error){

    }
    let db = client.db('MY_DB');
    let catArray = [];
    req.body.categories.forEach((cat) => {
      catArray.push(ObjectId(cat))
    })
    console.log(catArray)
    db.collection('Products').find({Categories: {$in:catArray}}).toArray().then((result) => {
      res.status(200).send(result);
    })
  });
});





app.listen(port, () => console.log(`Server listening on port ${port}!`));
