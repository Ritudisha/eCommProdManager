const {MongoClient,ObjectId} = require('mongodb');
let mongoUrl = 'mongodb://127.0.0.1:27017/';
let getRootCategories = ()=>{
    return new Promise((resolve,reject)=>{
        MongoClient.connect(mongoUrl,{useNewUrlParser:true},(err,client)=>{
            if(err){
                reject('Error');
            }
            let db = client.db('MY_DB');
            let stack = [];
            db.collection('category').find().toArray().then((result)=>{
            
            resolve(result);
            
            });
        });
    }); 
}

let getChild = ()=>{
    let children = result.childCategories;
        let childrenName = [];
        //children.forEach((doc)=>{
          console.log('result',result);
          db.collection('category').find({_id:{$in:result.childCategories}}).toArray().then((res2) => {
            //childrenName.push(res2.name);
                console.log(res2);
                result.childCategories = res2;
                stack.push(result.childCategories);

                while(stack.length > 0){
                    let node = stack.pop();
                    if(node.childCategories.length>0){
                        db.collection('category').find({_id:{$in:result.childCategories}}).toArray().then((res3) => {
                            node.childCategories = res3;
                        });
                    }
                }
            });
            //resolve(result);

          //});
}

let getChildren = (parent, res)=>{
    //console.log('parent', parent);
    let promises = [];
    return new Promise((resolve,reject)=>{
        MongoClient.connect(mongoUrl,{useNewUrlParser:true},(err,client)=>{
            let db = client.db('MY_DB');
            
            parent.map((mainDoc)=>{                    
                promises.push(new Promise((resolve,reject)=>{
                    
                    mainDoc.children = [];
                    if(mainDoc.childCategories!=undefined){
                        db.collection('category').find({_id:{$in:mainDoc.childCategories}}).toArray().then((result)=>{
                            //console.log('result', result);
                            if(result.length>0){
                                //console.log(mainDoc.name);
                                result.forEach(function(resObj){
                                    //console.log('resObj', resObj);
                                        
                                    
                                    // if(resObj.childCategories.length>0){
                                    //     resObj.children = [];
                                        
                                    //     resObj.children.push(getChildren([resObj], res));//parent.childrenName = result;
                                    // }

                                    mainDoc.children.push(resObj);
                                    //console.log('docChildren',doc);
                                });
                                    
                            }
                            console.log('mainDoc', mainDoc);
                            resolve(mainDoc);
                            
                            //res.send(finalResult);
                        });  
                    }
                }));
                //console.log('finalResult', finalResult);
            });
            return Promise.all(promises).then((result)=>{       
                
                resolve(result);
            });
        
                
        });
        
    });
}

module.exports = {
    getRootCategories,
    getChildren
}