const express = require('express');
const bodyParser = require("body-parser");
var upload = require('express-fileupload');

var path = require('path');
var fs = require('fs');
var CSVToJSON = require("csvtojson");
const FileSystem = require("fs");


const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

extend_csv=".csv";
extend_json=".json";
app.use(express.json());
app.use(express.static("public"));
app.use(upload());
// set the view engine to ejs

app.get("/",function(req,res){
    res.sendFile(__dirname+ "/index.html");
   
  });
  var down_name;


  app.post("/upload",function(req,res){


  console.log("hello");
    console.log(req.files);
    if(req.files.upfile){
 
      var file = req.files.upfile,
        name = file.name,
        type = file.mimetype;

      //File where .csv will be downloaded  
       uploadpath = __dirname + '/uploads/' + name;

      //Name of the file --ex test,example
      const First_name = name.split('.')[0];

      //Name to download the file
      down_name = First_name;
      file.mv(uploadpath,function(err){
        if(err){
          res.sendFile(__dirname+ "/public/404.html");
        }
        else
        {
          //Path of the downloaded or uploaded file
          var initialPath = path.join(__dirname, `./uploads/${First_name}${extend_csv}`);
          //Path where the converted json will be placed/uploaded
          var upload_path = path.join(__dirname, `./uploads/${First_name}${extend_json}`);
   



        CSVToJSON().fromFile(initialPath).then(source => {
            console.log(source);
            FileSystem.writeFile(upload_path, JSON.stringify(source, null, 4), (err) => {
                if (err) {
                  res.sendFile(__dirname+ "/public/404.html");
                }
                console.log("Downloaded");
                res.download(__dirname +`/uploads/${down_name}${extend_json}`,`${down_name}${extend_json}`,(err) =>{
                 if(err){
                  res.sendFile(__dirname+ "/public/404.html");
                 }else{
                   //Delete the files from directory after the use
                   console.log('Files deleted');
                   const delete_path_csv = process.cwd() + `/uploads/${down_name}${extend_csv}`;
                   const delete_path_json = process.cwd() + `/uploads/${down_name}${extend_json}`;
                   try {
                     fs.unlinkSync(delete_path_csv)
                     fs.unlinkSync(delete_path_json)
                     //file removed
                   } catch(err) {
                    res.sendFile(__dirname+ "/public/404.html");
                   }
                  }
            });
           
            });
        })
     
       
      
      }});
    }
    else{
      res.sendFile(__dirname+ "/public/404.html");

    }
  });
 
  


  app.listen(3000,() => {
    console.log("Server Started at port 3000...");
});