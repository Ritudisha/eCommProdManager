# eCommProdManager

The files present in this repository are: 

  - Products.json
  - category.json
  - getCategoryModel.js
  - myApp.js
  - package-lock.json
  - package.json
  
Products.json and category.json are the data files which can be imported in to mongo DB server using following commands
   - Ubuntu: sudo mongoimport --db <dbName> --collection Products --file Products.json
   (dbName: MY_DB)
   
After importing the files, The code can be executed by the command: node myApp.js.

myApp.js contains all the required  GET or POST APIs:
  - **addCategory**: Post API, used to insert a category along with the child categories. 
          INPUT: Inputs to this API are: {name: <name of the category>, categories: [<List of names of the child categories>]}
          USE: The API is called when a new category is to be added along with its children categories to the "category" collection. The name field of "category" collection is unique. 
  - **getCategory**: GET API. No INPUTs
          USE: This API is called to list all the categories along with all it's children.
  - **addOrUpdateProduct**: POST API.
          INPUT: 
          
          {
                    "productName": <name of the product>, 
                    "categories": [<List of the Ids of the categories>], 
                    "prodPrice": [
                        {
                          "price": <price value>, 
                          "currency": <corresponding currency>

                        }
                      ], 
                    "stockQuantity": [
                        {
                          "size": <size of the products>, 
                          "quantity": <Quantity available in stock for that product and size>

                        },
                        {
                          "size": <size of the products>, 
                          "quantity": <Quantity available in stock for that product and size>
                        }
                      ], 
                    "brand": <brand name>,
                    "images": [<List of image files corresponding to the products>] //the image file storage is not handled in this code
           }
            
          
          USE: This API is called to add or update an existing or add a new product in "Products" collection. The combination of brand, product name and status is makes a document unique in "Products" collection.
          ASSUMPTION: While updating the details of a product it is assumed that any list present in each product document is updated totally. Hence, front end displays the existing elements in the respective list and allows user to append new or edit the existing ones.
  - **getCategoryWiseProduct**: POST API
          INPUT: [<List of categorie Ids]
          USE: This API is used to list the products mapped to the list of category Ids.
          ASSUMPTION: The user selects category from the list of available categories, displayed by the System.
