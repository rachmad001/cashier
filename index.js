var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();

//parsing application/json
app.use(bodyParser.json())

//parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))

//parsing multipart/form-data
app.use(upload.array());

app.use('/office', require('./Controller/OfficeController.js'));

app.listen(8000)