Subschema Image
===
Allows for uploading of an image with a preview.

##Demo
See it in action [here](http://subschema.github.io/subschema-image)

Or run it 

```sh
  git clone https://github.com/subschema/subschema-image.git
  cd subschema-image
  npm install
  npm run hot &
  open http://localhost:8082
```

##Installation
```sh
 $ npm install subschema-image
``

##Usage
```jsx

 import React, {Component} from 'react';
 import Subschema, {loader, Form} from 'Subschema';
 import imageloader from 'subschema-image';
 
 loader.addLoader(imageloader);
 
 //A simple Schema for this demo.
 var schema = {
     schema: {
         image: {
             "type": "Image",
             "help": "Single Image"
         },
         images: {
             "type": "ImageList",
             "help": "Multiple Images"
         }
     }
 }
 
 export default class App extends Component {
 
     render() {
         return <div>
             <h3>Subschema Image Type</h3>
             <Form schema={schema}/>
         </div>
     }
 }


  
```