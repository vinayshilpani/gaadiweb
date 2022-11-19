// npm modules

const express = require("express");
const route = express.Router();
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const cookieParser = require("cookie-parser");
route.use(cookieParser());
const session = require("express-session");
const nodemailer = require('nodemailer');
const validator = require('email-validator');

const oneDay = 1000 * 60 * 60 * 24;

route.use(
  session({
    secret: process.env.SECRET_KEY,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

let transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  secure: true,
  port: 465,
  auth: {
    user: "it.support@gaadiweb.com",
    pass: "k8hHs64X0Sb1",
  },
});

// custom modules

const partForm = require("../models/partsFormData");
const purWithUs = require("../models/purWithUs");
const sellWithUs = require("../models/sellWithUs");
const adminDetail = require("../models/adminDetail");
const carDataList = require('../models/carDataList');
const isLogin = require("../middleware/isLogin");
const isLogout = require("../middleware/isLogout");
const { check } = require("express-validator");




route.get("/", async (req, res) => {
  try {
    let carData = await carDataList.distinct("make");
    res.render("home", { carData: carData });
  } catch (err) {
    console.log(err);
  }
});

route.get("/purchaseWithUs", (req, res) => {
  try {
    res.render("purchaseWithUs");
  } catch (err) {
    res.status(500).send(err);
  }
});

route.post("/purchaseWithUs", async (req, res) => {
  try {
    let name = req.body.name;
    let phone = req.body.phone;
    let email = req.body.email;
    let desc = req.body.desc;
    await purWithUs.insertMany({ name, phone, email, desc });

    let userdesc = `Hi ${name} submitted a form. <br> Basic Details are : <br> Mobile -> ${phone} <br> Email -> ${email} <br> Description -> ${desc}`;

    const mailOptions = {
      from: "it.support@gaadiweb.com",
      to: "support@gaadiweb.com",
      subject: "Regarding Purchase From Us Form Submittion on Gaadiweb",
      html: userdesc
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
      }
      console.log("Mail Send To User")
    })

    res.redirect("/purchaseWithUs");
  } catch (err) {
    res.status(500).send(err);
  }
});

route.get("/sellWithUs", (req, res) => {
  try {
    res.render("sellWithUs");
  } catch (err) {
    res.status(500).send(err);
  }
});

route.post("/sellWithUs", async (req, res) => {
  try {
    let { name, phone, email, pincode, formtype } = req.body;
    await sellWithUs.insertMany({ name, phone, email, pincode, formtype, });

    let userdesc = `Hi ${name} submitted a form. <br> Basic Details are : <br> Mobile -> ${phone} <br> Email -> ${email} <br> Pincode -> ${pincode} <br> Form Type -> ${formtype}`;

    const mailOptions = {
      from: "it.support@gaadiweb.com",
      to: "support@gaadiweb.com",
      subject: "Regarding Sell with Us Form Submittion on Gaadiweb",
      html: userdesc
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
      }
      console.log("Mail Send To User")
    })

    res.send('submit');
  } catch (err) {
    res.status(500).send(err);
  }
});

route.post("/getCarModel", async (req, res) => {
  let brand = req.body.carBrand;
  try {
    let modelData = await carDataList.find({ make: brand }).distinct('model');
    res.json({
      modelData: modelData,
    });
  } catch (err) {
    res.status(501).send(err);
  }
});

route.post('/getCarEngine', async (req, res) => {
  try {
    let model = req.body.model
    let engine = await carDataList.find({ model: model }).distinct('fuel_engine')
    res.json({ engine: engine })
  }
  catch (err) {
    console.log(err);
  }
})

route.post("/getCarYear", async (req, res) => {
  let model = req.body.carModel;
  let engineType = req.body.engineType;
  let date = new Date();
  try {
    let YearData = await carDataList.find({ model: model, fuel_engine: engineType }).distinct('year_range');
    console.log(YearData);
    let yearString = YearData.toString();
    let startYear = yearString.slice(0, 4);
    let endYear = yearString.slice(-4);

    if (endYear == '-Now') {
      endYear = date.getFullYear()
    }
    res.json({
      startYear: startYear,
      endYear: endYear
    });
  } catch (err) {
    res.status(502).send(err);
  }
});


route.post('/getParts', async (req, res) => {
  try {
    let model = req.body.model;
    let fuel_engine = req.body.engineType;
    let partsData = await carDataList.find({ model: model, fuel_engine: fuel_engine }).distinct('sku_category');
    res.json({ partsData: partsData })
  }
  catch (err) {
    console.log(err);
  }
})

route.post("/getPartsFrom", async (req, res) => {
  let carBrand = req.body.carBrand;
  let carModel = req.body.carModel;
  let carYear = req.body.carYear;
  let carParts = req.body.getparts;
  let name = req.body.name;
  let mobile = req.body.mobile;
  let email = req.body.email;
  let description = req.body.description;
  try {
    await partForm.insertMany({
      name: name, mobile: mobile, email: email, desc: description, carBrand: carBrand, carModel: carModel, carYear: carYear, carParts: carParts,
    });

    let userdesc = `Hi ${name} submitted a form for part enquiry. <br><br> 
    Car Details are : <br><br>
    Make -> ${carBrand} <br>
    Model -> ${carModel} <br>
    Year -> ${carYear} <br><br>
    Basic Details are : <br><br> 
    Mobile -> ${mobile} <br>
    Email -> ${email} <br>
    Discription -> ${description} <br>
    Car Parts = ${carParts}
    `;

    const mailOptions = {
      from: "it.support@gaadiweb.com",
      to: "support@gaadiweb.com",
      subject: "Regarding Parts Enquiry on Gaadiweb",
      html: userdesc
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
      }
      console.log("Mail Send To User")
    })



    res.send('ok')
  } catch (err) {
    console.log(err);
  }
});


route.get("/adminHome", isLogin, async (req, res) => {
  try {
    let partFormData = await partForm.find().sort({ _id: -1 });
    let totalPartsformData = await partForm.countDocuments();
    let totalpurchaseUsData = await purWithUs.countDocuments();
    let totalsellData = await sellWithUs.countDocuments();
    let totalcarData = await carDataList.find().distinct('model');

    res.render("admin", {
      partFormData: partFormData,
      totalPartsformData: totalPartsformData,
      totalpurchaseUsData: totalpurchaseUsData,
      totalsellData: totalsellData,
      totalcarData: totalcarData.length,
    });
  } catch (err) {
    console.log(err);
  }
});

route.get("/admin", isLogout, (req, res) => {
  try {
    res.render("login", { c: 'valid' });
  } catch (err) {
    console.log(err);
  }
});


route.get("/viewCarData", isLogin, async (req, res) => {
  try {
    let carsData = await carDetail.find();
    let totalCarsData = await carDataList.find().distinct('model');
    let getBrand = await carDetail.distinct("carBrand");
    res.render("viewCarData", { carsData: carsData, totalCarsData: totalCarsData.length, getBrand: getBrand });
  } catch (err) {
    console.log(err);
  }
});


route.get("/purchview", isLogin, async (req, res) => {
  try {
    let purWithUsData = await purWithUs.find();
    res.render("purchview", { purWithUsData: purWithUsData });
  } catch (err) {
    console.log(err);
  }
});


route.get("/ven_sellview", isLogin, async (req, res) => {
  try {
    let sellwVendorData = await sellWithUs.find({ formtype: "Vendor" });
    res.render("sellWithVendor", { sellwVendorData: sellwVendorData });
  } catch (err) {
    console.log(err);
  }
});


route.get("/cus_sellview", isLogin, async (req, res) => {
  try {
    let sellwCustomerData = await sellWithUs.find({ formtype: "Customer" });
    res.render("sellWithCustomer", { sellwCustomerData: sellwCustomerData });
  } catch (err) {
    console.log(err);
  }
});


route.post("/admin", async (req, res) => {
  try {
    let username = req.body.username;
    let password = req.body.password;

    const userData = await adminDetail.findOne({ username });

    if (!userData) {
      res.render("login", { c: 'invalid' });
      return;
    }
    const isMatch = await bcrypt.compare(password, userData.password);

    if (isMatch) {
      req.session.user_id = userData._id;
      console.log(req.session);
      res.redirect("/adminHome");
    } else {
      res.render("login", { c: 'incorrect' });
    }
  } catch (err) {
    console.log(err);
  }
});

route.get("/logout", isLogin, (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/admin");
  } catch (err) {
    console.log(err);
  }
});


route.get('/manageParts', isLogin, async (req, res) => {
  try {
    let makes = await carDataList.find().distinct('make');
    let model = await carDataList.find().distinct('model');
    // let sku_category = await carDataList.find();
    let part_type = await carDataList.find().distinct("sku_category");

    var perPage = 10;
    var total = await carDataList.count();
    var pages = Math.ceil(total / perPage);
    var pageNumber = (req.query.page == null) ? 1 : req.query.page;
    var startFrom = (pageNumber - 1) * perPage;
    let carData = await carDataList.find().sort({ '_id': -1 }).skip(startFrom).limit(perPage)



    res.render('manageParts', { make: makes, totalmakes: makes.length, model: model.length, part_type: part_type.length, carData: carData, pages: pages });
  } catch (err) {
    console.log(err);
  }
});


route.post('/findModel', async (req, res) => {
  let make = req.body.make
  let data = await carDataList.find({ make: make }).distinct('model');
  res.json({
    data: data
  })
})

route.post('/findEngine', async (req, res) => {
  let model = req.body.model
  let data = await carDataList.find({ model: model }).distinct('fuel_engine');
  res.json({
    data: data
  })
})


route.post('/addCarPart', async (req, res) => {

  let make = req.body.make
  let model = req.body.model
  let fuel_engine = req.body.variant
  let year_range = req.body.year
  let sku_category = req.body.part

  let addData = await carDataList.insertMany({ fuel_engine, year_range, make, model, sku_category })

  console.log(addData);

  res.send('ok')
})


route.get('/forgetpassword', async (req, res) => {
  res.render('forgot')
})

route.get('/reset', async (req, res) => {
  res.render('reset')
})

route.post('/resetpass', async (req, res) => {

  let usermail = req.body.email;
  let token = req.body.token;
  let password = req.body.password

  var salt = bcrypt.genSaltSync(10);

  let checkUser = await adminDetail.findOne({ usermail });
  if (checkUser) {
    if (token == checkUser.token) {


      bcrypt.hash(password, salt, async (err, data) => {
        let updatepassword = await adminDetail.updateOne({usermail:checkUser.usermail}, { $set: {password: data,token:"Empty" }})
        res.send("changed")
      });

    }
    else {
      res.send('invalidToken');
    }
  }
  else {
    res.send('invalidMail');
  }
});


route.get('/changepass', isLogin, async (req, res) => {
  res.render('changepass')
})

route.post('/changepass', async (req, res) => {

  let oldPass = req.body.cpass;
  let newPass = req.body.newpass;

  var salt = bcrypt.genSaltSync(10);
  let _id = req.session.user_id
  let user = await adminDetail.findOne({ _id: _id })
  const passwordMatch = await bcrypt.compare(oldPass, user.password);

  if (passwordMatch === true) {

    bcrypt.hash(newPass, salt, async (err, data) => {
      let ceck = await adminDetail.updateOne({ _id: _id }, { $set: { 'password': data } })
      res.send("changed")
    });

  } else if (passwordMatch === false) {
    res.send("incorrect")
  }

})


route.post('/deleteParts', async (req, res) => {
  let { model, fuel_engine, sku_category } = req.body;
  await carDataList.deleteOne({ model, fuel_engine, sku_category })
  res.send('Part Delete')
})



route.post('/sendresetlink', async (req, res) => {
  let usermail = req.body.mail;
  let checkUser = await adminDetail.findOne({ usermail: usermail })

  if (!checkUser) {
    res.send('incorrect');
  } else {

    // let hash = checkUser._id;
    // console.log(hash,'hash');

    var salt = bcrypt.genSaltSync(10);
    bcrypt.hash(usermail, salt, async (err, data) => {

      await adminDetail.updateOne({usermail}, { $set: { token: data } })

      link = `http://newgaadiweb.herokuapp.com/reset`;
      let token = data;
      console.log(token,'token');

      let userdesc = `Hi ${checkUser.name} <br><br>  
      Copy Toekn and click on the below button for reset your password <br><br>
      Token - ${token} <br><br>
      Link - <a href="${link}"> Click for reset your password </a> <br><br>
      Thanks and Regards Gaadiweb.com
      `;

      const mailOptions = {
        from: "it.support@gaadiweb.com",
        to: "support@gaadiweb.com",
        subject: "Regarding Reset Your Password",
        html: userdesc
      };

      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err);
        }
        console.log("Mail Send To User")
        res.send('send')
      })




    });



  }
})




route.get("*", async (req, res) => {
  try {
    res.render("page404");
  } catch (err) {
    console.log(err);
  }
});


// mail through gmail

// let transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'gaadiweb2016@gmail.com',
//     pass: 'ilquznaplcyjquww'
//   },
//   secure: false,
//   requireTLS: false,
//   tls: { rejectUnauthorized: false },
//   debug: true
// })


// route.get('/send', async (req, res) => {

//   let mailOptions = {
//     from: 'gaadiweb2016@gmail.com',
//     to: 'gaadiwebsales1@gmail.com',
//     subject: 'Testing of nodemailer',
//     text: `Hi this is a test mail for testing purpose`
//   }

//   transporter.sendMail(mailOptions, (err, data) => {
//     if (err) {
//       console.log(err);
//       res.send('err')
//     }
//     else {
//       console.log('Email Send ' + data.response)
//       res.send('send')
//     }
//   })
// })


module.exports = route;
