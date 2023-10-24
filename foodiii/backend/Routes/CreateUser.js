const express = require("express")
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const jwtSecret = "mynameisajayshakyaIamFrommyownw"


router.post("/creatuser", [
  body('email').isEmail(),
  body('name').isLength({ min: 5 }),
  body('password', 'Incorrect passoword').isLength({ min: 5 })] ,

  
  async (req, res) => {
    // console.log({   
    //     name:req.body.name,
    //     email:req.body.email,
    //     location:req.body.location,
    //     password:req.body.password        
    // }) 



    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(10);
    let secPassword = await bcrypt.hash(req.body.password, salt)
    try {
      await User.create({
        name: req.body.name,
        email: req.body.email,
        location: req.body.location,
        password: secPassword

      }).then(res.json({ success: true }))

    }
    catch (error) {
      console.log(error)
      res.json({ success: false })

    }

  })


router.post("/loginuser", [
  body('email').isEmail(),
  body('password', 'Incorrect passoword').isLength({ min: 5 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let email = req.body.email;
    try {
      let userData = await User.findOne({ email });
      if (!userData) {
        return res.status(400).json({
          errors: "try logginng with   fucking wrong creditenls"
        })
      }
      const pwdCompare = await bcrypt.compare(req.body.password, userData.password)
      if (!pwdCompare) {
        return res.status(400).json({
          errors: "try logginng with fucking wrong creditenls"
        })
      }
      const data = {
        user: {
          id: userData.id
        }
      }
      const authToken = jwt.sign(data, jwtSecret)
      return res.json({ success: true, authToken: authToken })
      //  console.log({userData})

    }
    catch (error) {
      console.log(error)
      res.json({ success: false });
    }
  })

module.exports = router;