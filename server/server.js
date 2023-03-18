const express = require('express')
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const nodemailer = require('nodemailer');
const port = 5000;
const BASEURL = "http://blossom.saloon.com"
const con = mysql.createConnection({
  host: "localhost",
  user: "awais",
  database: 'blossom',
  password: 'Wk8wEycvp5ndYxV4'
});


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'blossombirdsaloon@gmail.com',
    pass: 'Sf7Y>6"LZB^\p%W8',
  },
});

const USER_TABLE_NAME = "users";
const SERVICE_TABLE_NAME = "services";
const APPOINTMENT_TABLE_NAME = "appointments";
const PRODUCT_TABLE_NAME = "products";
app.options('*', cors()) // include before other routes


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Content-Type", "application/json; charset=UTF-8");
    next();
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})
con.connect(function(err) {
  if (err) throw err;
  console.log("MySQL Connected!");
});

app.post('/signup', (req, res) => {
  console.log(req.body)
  let userName = req.body.username;
  let selectQuery = "SELECT COUNT(id) as userCount FROM "+USER_TABLE_NAME+" WHERE username='"+userName+"' LIMIT 1";
  con.query(selectQuery,function(selectErr,selectResult) {
    // console.log(selectResult[0].userCount);
    if(selectErr) {
      console.log('MYSQL SELECT ERROR SIGNUP',selectErr);
    }
    else {
      if(selectResult && selectResult.length>0 && selectResult[0].userCount==0) {
        // console.log(req.body);
        let hashPassword = req.body.password;
        let phoneNumber = req.body.phonenumber
        let email = req.body.email;
        let address = req.body.address;
        let insertQuery = " INSERT INTO "+USER_TABLE_NAME+" (username,email,password,phone_number,address,accessToken) VALUES ('"+userName+"', '"+email+"','"+hashPassword+"','"+phoneNumber+"','"+address+"',NULL)";

        con.query(insertQuery, function (err, result) {
          if (err){
            // throw err;
            console.log('Signup MYSQL ERROR',err)
            res.send({success:"no",message:"Signup Failed"});
            res.end();
          } 
          else {
            console.log('success');
            res.send({success:"yes",message:"User Signup Successfull"});
            res.end();
          }
        });
      }
      else {
        // console.log(req.body);
        res.send({success:"no",message:"User Already Exists"});
        res.end();
      }
    }
  });
})


app.post('/createService',upload.fields([
    {
      name: 'img1', maxCount: 1
    }, {
      name: 'img2', maxCount: 1
    }, {
      name: 'img3', maxCount: 1
    }, {
      name: 'img4', maxCount: 1
    }
  ]) , (req, res) => {
  console.log("req.files",req.files);
  console.log(req.body);
  let name = req.body.name;
  let price = req.body.price;
  let description = req.body.description;
  if(!req.files || !req.files.img1) {
    res.send({success:"no",message:"Service Images are missing"});
    res.end();
    return;
  }
  let img1 = req.files.img1;
  let img2 = req.files.img2;
  let img3 = req.files.img3;
  let img4 = req.files.img4;

  let selectQuery = "SELECT COUNT(id) as serviceCount FROM "+SERVICE_TABLE_NAME+" WHERE name='"+name+"' LIMIT 1";
  con.query(selectQuery,function(selectErr,selectResult) {
    // console.log(selectResult[0].shopCount);
    if(selectErr) {
      console.log('MYSQL SELECT ERROR SIGNUP',selectErr);
    }
    else {
      if(selectResult && selectResult.length>0 && selectResult[0].serviceCount==0) {
        // console.log(req.body);
        try{
          img1 = JSON.stringify(req.files.img1[0]);
        }catch(e) {
          img1 = "";
        }

        try{
          img2 = JSON.stringify(req.files.img2[0]);
        }catch(e) {
          img2 = "";
        }

        try{
          img3 = JSON.stringify(req.files.img3[0]);
        }catch(e) {
          img3 = "";
        }

        try{
          img4 = JSON.stringify(req.files.img4[0]);
        }catch(e) {
          img4 = "";
        }

        var insertQuery = " INSERT INTO "+SERVICE_TABLE_NAME;
        insertQuery+= " (name,price,description,img1,img2,img3,img4) ";
        insertQuery+= " VALUES ('"+name+"',"+price+",'"+description+"','"+img1+"','"+img2+"','"+img3+"','"+img4+"')";
        con.query(insertQuery, function (err, result) {
          if (err){
            // throw err;
            console.log('Signup MYSQL ERROR',err)
            res.send({success:"no",message:"Signup Failed"});
            res.end();
          } 
          else {
            res.send({success:"yes",message:"Service added Successfully",id:result.insertId});
            res.end();
          }
        });
      }
      else {
        // console.log(req.body);
        res.send({success:"no",message:"Service Already Exists with name "+name});
        res.end();
      }
    }
  });

})

app.get('/getServices', function(req, res) {

  let selectQuery = "SELECT * FROM "+SERVICE_TABLE_NAME;
  console.log(selectQuery);
  con.query(selectQuery, function(error, results) {
    let services = [];

    if (results && results.length > 0) {
      services = results;
    }
    res.send({success:"yes",message:'Successful',data:services});
    res.end();
    
  });
  
});
app.get('/cancelAppointment', function(req, res) {
  let appointmentId = parseInt(req.query.id);

  let deleteQuery = `DELETE FROM ${APPOINTMENT_TABLE_NAME} WHERE id=${appointmentId}`;
  console.log(deleteQuery);
  con.query(deleteQuery, function(error, results) {
    console.log(results);
    res.send({success:"yes",message:'Successful',data:results});
    res.end();
    
  });
  
});

app.get('/getService', function(req, res) {
  let serviceId = parseInt(req.query.id);
  console.log(serviceId);
  console.log(req.params);
  if(serviceId) {
    let selectQuery = "SELECT * FROM "+SERVICE_TABLE_NAME+" WHERE id="+serviceId;
    console.log(selectQuery);
    con.query(selectQuery, function(error, results) {
      if (results && results.length > 0) {
        res.send({success:"yes",message:'Successful',service:results[0]});
        res.end();
      }
      else {
        res.send({success:"no",message:'No Data found'});
        res.end(); 
      }
      
    });
  }
  else {
    res.send({success:"no",message:'Invalid Id'});
    res.end();
  }
  
});


app.post('/updateService',upload.fields([
    {
      name: 'img1', maxCount: 1
    }, {
      name: 'img2', maxCount: 1
    }, {
      name: 'img3', maxCount: 1
    }, {
      name: 'img4', maxCount: 1
    }
  ]), function(req, res) {
  let id = parseInt(req.body.id);
  let name = req.body.name;
  let description = req.body.description;
  let price = req.body.price;

  let img1 = req.files.img1;
  let img2 = req.files.img2;
  let img3 = req.files.img3;
  let img4 = req.files.img4;

  let selectQuery = "SELECT * FROM "+SERVICE_TABLE_NAME+" WHERE id = '"+id+"' LIMIT 1";
  console.log(selectQuery);
  if (id) {
    con.query(selectQuery, function(error, results) {
      if (results && results.length > 0) {

        try{
          img1 = JSON.stringify(req.files.img1[0]);
        }catch(e) {
          img1 = "";
        }

        try{
          img2 = JSON.stringify(req.files.img2[0]);
        }catch(e) {
          img2 = "";
        }

        try{
          img3 = JSON.stringify(req.files.img3[0]);
        }catch(e) {
          img3 = "";
        }

        try{
          img4 = JSON.stringify(req.files.img4[0]);
        }catch(e) {
          img4 = "";
        }

        let user = results[0]; 
        let updateQuery = `UPDATE ${SERVICE_TABLE_NAME} SET name='${name}'`;
        updateQuery+=`,description='${description}',price='${price}'`;

        if(img1 && img1!="")
          updateQuery+=`,img1='${img1}'`;
        
        if(img2 && img2!="")
          updateQuery+=`,img2='${img2}'`;

        if(img3 && img3!="")
          updateQuery+=`,img3='${img3}'`;

        if(img4 && img4!="")
          updateQuery+=`,img4='${img4}'`;
            
        console.log(updateQuery);
        
        con.query(updateQuery, function(error, results) {
          if(!error) {
            res.send({success:"yes",message:'Profile updated Successfully',data:user});
            res.end();
          }
          else {
            console.log(error);
            res.send({success:"no",message:'MYSQL DATABASE ERROR'});
            res.end();
          }
        });
      } else {
        res.send({success:"no",message:'No Result Found!'});
        res.end();
      }     
    });
  } else {
    res.send({success:"no",message:'Invalid ID'});
    res.end();
  }
});

app.get('/getProducts', function(req, res) {

  let selectQuery = "SELECT * FROM "+PRODUCT_TABLE_NAME;
  console.log(selectQuery);
  con.query(selectQuery, function(error, results) {
    let products = [];

    if (results && results.length > 0) {
      products = results;
    }
    res.send({success:"yes",message:'Successful',products:products});
    res.end();
    
  });
  
});

app.get('/getProduct', function(req, res) {
  let productId = parseInt(req.query.id);
  console.log(productId);
  if(productId) {
    let selectQuery = "SELECT * FROM "+PRODUCT_TABLE_NAME+" WHERE id="+productId;
    console.log(selectQuery);
    con.query(selectQuery, function(error, results) {
      if (results && results.length > 0) {
        res.send({success:"yes",message:'Successful',product:results[0]});
        res.end();
      }
      else {
        res.send({success:"no",message:'No Data found'});
        res.end(); 
      }
      
    });
  }
  else {
    res.send({success:"no",message:'Invalid Id'});
    res.end();
  }
  
});

app.post('/createProduct',upload.fields([
    {
      name: 'img1', maxCount: 1
    }, {
      name: 'img2', maxCount: 1
    }, {
      name: 'img3', maxCount: 1
    }, {
      name: 'img4', maxCount: 1
    }
  ]) , (req, res) => {
  console.log(req.files);
  console.log(req.body);
  let name = req.body.name;
  let price = req.body.price;
  let description = req.body.description;
  let img1 = req.files.img1;
  let img2 = req.files.img2;
  let img3 = req.files.img3;
  let img4 = req.files.img4;

  let selectQuery = "SELECT COUNT(id) as productCount FROM "+PRODUCT_TABLE_NAME+" WHERE name='"+name+"' LIMIT 1";
  con.query(selectQuery,function(selectErr,selectResult) {
    // console.log(selectResult[0].shopCount);
    if(selectErr) {
      console.log('MYSQL SELECT ERROR SIGNUP',selectErr);
    }
    else {
      if(selectResult && selectResult.length>0 && selectResult[0].productCount==0) {
        // console.log(req.body);
        try{
          img1 = JSON.stringify(req.files.img1[0]);
        }catch(e) {
          img1 = "";
        }

        try{
          img2 = JSON.stringify(req.files.img2[0]);
        }catch(e) {
          img2 = "";
        }

        try{
          img3 = JSON.stringify(req.files.img3[0]);
        }catch(e) {
          img3 = "";
        }

        try{
          img4 = JSON.stringify(req.files.img4[0]);
        }catch(e) {
          img4 = "";
        }

        var insertQuery = " INSERT INTO "+PRODUCT_TABLE_NAME;
        insertQuery+= " (name,price,description,img1,img2,img3,img4) ";
        insertQuery+= " VALUES ('"+name+"',"+price+",'"+description+"','"+img1+"','"+img2+"','"+img3+"','"+img4+"')";
        con.query(insertQuery, function (err, result) {
          if (err){
            // throw err;
            console.log('Signup MYSQL ERROR',err)
            res.send({success:"no",message:"Signup Failed"});
            res.end();
          } 
          else {
            res.send({success:"yes",message:"Product added Successfully",id:result.insertId});
            res.end();
          }
        });
      }
      else {
        // console.log(req.body);
        res.send({success:"no",message:"Product Already Exists with name "+name});
        res.end();
      }
    }
  });

})

app.post('/updateProduct',upload.fields([
    {
      name: 'img1', maxCount: 1
    }, {
      name: 'img2', maxCount: 1
    }, {
      name: 'img3', maxCount: 1
    }, {
      name: 'img4', maxCount: 1
    }
  ]), function(req, res) {
  let id = parseInt(req.body.id);
  let name = req.body.name;
  let description = req.body.description;
  let price = req.body.price;

  let img1 = req.files.img1;
  let img2 = req.files.img2;
  let img3 = req.files.img3;
  let img4 = req.files.img4;

  let file = JSON.stringify(req.file);

  let selectQuery = "SELECT * FROM "+PRODUCT_TABLE_NAME+" WHERE id = '"+id+"' LIMIT 1";
  console.log(selectQuery);
  if (id) {
    con.query(selectQuery, function(error, results) {
      if (results && results.length > 0) {

        try{
          img1 = JSON.stringify(req.files.img1[0]);
        }catch(e) {
          img1 = "";
        }

        try{
          img2 = JSON.stringify(req.files.img2[0]);
        }catch(e) {
          img2 = "";
        }

        try{
          img3 = JSON.stringify(req.files.img3[0]);
        }catch(e) {
          img3 = "";
        }

        try{
          img4 = JSON.stringify(req.files.img4[0]);
        }catch(e) {
          img4 = "";
        }

        let user = results[0]; 
        let updateQuery = `UPDATE ${PRODUCT_TABLE_NAME} SET name='${name}'`;
        updateQuery+=`,description='${description}',price='${price}'`;


        if(img1 && img1!="")
          updateQuery+=`,img1='${img1}'`;
        
        if(img2 && img2!="")
          updateQuery+=`,img2='${img2}'`;

        if(img3 && img3!="")
          updateQuery+=`,img3='${img3}'`;

        if(img4 && img4!="")
          updateQuery+=`,img4='${img4}'`;
        
        console.log(updateQuery);
        
        con.query(updateQuery, function(error, results) {
          if(!error) {
            res.send({success:"yes",message:'Profile updated Successfully',data:user});
            res.end();
          }
          else {
            console.log(error);
            res.send({success:"no",message:'MYSQL DATABASE ERROR'});
            res.end();
          }
        });
      } else {
        res.send({success:"no",message:'No Result Found!'});
        res.end();
      }     
    });
  } else {
    res.send({success:"no",message:'Invalid ID'});
    res.end();
  }
});

app.post('/createAppointment', function(req, res) {
  let userId = req.body.userId;
  let serviceId = req.body.serviceId;
  let type = req.body.type;
  let selectQuery = `SELECT * FROM ${APPOINTMENT_TABLE_NAME} WHERE userId = '${userId}' AND serviceId = '${serviceId}' LIMIT 1`;
  console.log(selectQuery);
  if (userId && serviceId) {
    con.query(selectQuery, function(error, results) {
      if (results && results.length == 0) {
        var insertQuery = ` INSERT INTO ${APPOINTMENT_TABLE_NAME} (userId,serviceId,type) `;
        insertQuery+= ` VALUES ('${userId}', '${serviceId}','${type}')`;
        con.query(insertQuery, function(error, results) {
          if(!error) {
            res.send({success:"yes",message:'Appointment Created Successfully'});
            res.end();
          }
          else {
            console.log(error);
            res.send({success:"no",message:'MYSQL DATABASE ERROR'});
            res.end();
          }
        });
      } else {
        res.send({success:"no",message:'Appointment Already Exists!'});
        res.end();
      }     
    });
  } else {
    res.send({success:"no",message:'Invalid ID!'});
    res.end();
  }
});


app.get('/home', function(req, res) {

  let selectQuery = "SELECT * FROM "+SERVICE_TABLE_NAME+" limit 9";
  console.log(selectQuery);
  con.query(selectQuery, function(error, results) {
    let data = {services:[],products:[]};

    if (results && results.length > 0) {
      data.services = results;
    }

    let selectProductQuery = "SELECT * FROM "+PRODUCT_TABLE_NAME+" limit 9";
    console.log(selectProductQuery);
    con.query(selectProductQuery, function(error, products) {
      if (products && products.length > 0) {
        data.products = products;
      }     
      res.send({success:"yes",message:'Successful',data:data});
      res.end();
    });    
  });
  
});

app.post('/updateProfilePictureUser',upload.single('file'), function(req, res) {

  let id = parseInt(req.body.id);
  let selectQuery = "SELECT * FROM "+USER_TABLE_NAME+" WHERE id = '"+id+"' LIMIT 1";
  console.log(selectQuery);
  if (id) {
    con.query(selectQuery, function(error, results) {
      if (results && results.length > 0) {
        let file = JSON.stringify(req.file);
        console.log(file) 
        let updateQuery = " UPDATE "+USER_TABLE_NAME+" SET image='"+file+"' WHERE id='"+id+"'";
        con.query(updateQuery, function(error, results) {
          if(!error) {
            res.send({success:"yes",message:'Picture update Successfully'});
            res.end();
          }
          else {
            console.log(error);
            res.send({success:"no",message:'MYSQL DATABASE ERROR'});
            res.end();
          }
        });
      } else {
        res.send({success:"no",message:'Invalid ID!'});
        res.end();
      }     
    });
  } else {
    res.send({success:"no",message:'Invalid ID!'});
    res.end();
  }
});

app.post('/updateUserProfile', function(req, res) {
  let id = parseInt(req.body.id);
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let phone_number = req.body.phone_number;
  let password = req.body.password;
  let email = req.body.email;
  let address = req.body.address;
  let selectQuery = "SELECT * FROM "+USER_TABLE_NAME+" WHERE id = '"+id+"' LIMIT 1";
  console.log(selectQuery);
  if (id) {
    con.query(selectQuery, function(error, results) {
      if (results && results.length > 0) {
        let user = results[0]; 
        let updateQuery = " UPDATE "+USER_TABLE_NAME+" SET first_name='"+first_name+"',last_name='"+last_name+"',phone_number='"+phone_number+"',password='"+password+"',email='"+email+"',address='"+address+"' WHERE id='"+id+"'";
        console.log(updateQuery);
        
        con.query(updateQuery, function(error, results) {
          if(!error) {
            res.send({success:"yes",message:'Profile updated Successfully',data:user});
            res.end();
          }
          else {
            console.log(error);
            res.send({success:"no",message:'MYSQL DATABASE ERROR'});
            res.end();
          }
        });
      } else {
        res.send({success:"no",message:'No Result Found!'});
        res.end();
      }     
    });
  } else {
    res.send({success:"no",message:'Invalid ID'});
    res.end();
  }
});

app.get('/userProfile', function(req, res) {
  let id = req.query.id;
  let selectQuery = `SELECT * FROM ${USER_TABLE_NAME} WHERE id = '${id}' LIMIT 1`;
  console.log(selectQuery);
  if (id) {
    con.query(selectQuery, function(error, results) {
      if (results && results.length > 0) {
        let user = results[0]; 
        let selectQueryAppointments = `SELECT *,a.id as appointmentId FROM ${APPOINTMENT_TABLE_NAME} as a 
          INNER JOIN ${SERVICE_TABLE_NAME} as s ON a.serviceId=s.id WHERE a.userId = '${id}' `;
        con.query(selectQueryAppointments, function(error, appointments) {
          user.appointments = appointments;

          res.send({success:"yes",message:'Profile get Successfully',data:user});
          res.end();
        });
      } else {
        res.send({success:"no",message:'No Result Found!'});
        res.end();
      }     
      
    });
  } else {
    res.send({success:"no",message:'Invalid ID'});
    res.end();
  }
});


app.post('/login', function(req, res) {
  let username = req.body.username;
  let password = req.body.password;
  let selectQuery = "SELECT * FROM "+USER_TABLE_NAME+" WHERE username = '"+username+"' AND password = '"+password+"' LIMIT 1";
  console.log(selectQuery);
  if (username && password) {
    con.query(selectQuery, function(error, results) {
      console.log(results);
      if (results && results.length > 0) {
        let user = results[0]; 
        res.send({success:"yes",message:'loggedin Successfully',user:user});
        res.end();

      } else {
        res.send({success:"no",message:'Incorrect Username and/or Password!'});
        res.end();
      }     
    });
  } else {
    res.send({success:"no",message:'Please enter Username and Password!'});
    res.end();
  }
});


app.post('/contactUs', function(req, res) {
  let email = req.body.email;
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let mobile = req.body.mobile;
  let message = req.body.message;
  if (email) {
    let emailText = `Name: ${first_name} ${last_name} \n Mobile: ${mobile} \n\n\n Message: ${message}`;
    transporter.sendMail({
      from: '"Blossom Bird Saloon Support" <blossombirdsaloon@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "User Query Contact Us", // Subject line
      // text: emailText, // plain text body
      html: emailText, // html body
    }).then((info)=>{
      console.log(info);
      res.send({success:"yes",message:'Email sent Successfully'});
      res.end();

    }).catch((e)=>{
      res.send({success:"no",message:'Email Failed'});
      res.end();
    });
  } else {
    res.send({success:"no",message:'Please enter Email!'});
    res.end();
  }
});

app.post('/subscriptions', function(req, res) {
  let email = req.body.email;
  if (email) {
    let emailText = `Thank you for the subscriptions we will keep you updated on our new products and services`;
    transporter.sendMail({
      from: '"Blossom Bird Saloon Support" <blossombirdsaloon@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Thanks for subscriptions", // Subject line
      // text: emailText, // plain text body
      html: emailText, // html body
    }).then((info)=>{
      console.log(info);
      res.send({success:"yes",message:'Email sent Successfully'});
      res.end();

    }).catch((e)=>{
      res.send({success:"no",message:'Email Failed'});
      res.end();
    });
  } else {
    res.send({success:"no",message:'Please enter Email!'});
    res.end();
  }
});


app.listen(port,'blossom.saloon.com', () => {
  console.log(`Application listening at http://blossom.saloon.com:${port}`)
})
