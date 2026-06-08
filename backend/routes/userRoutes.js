const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

router.post("/signup", async(req,res)=>{

  try{

    const {
      name,
      phone,
      password
    } = req.body;

    const existing =
    await User.findOne({phone});

    if(existing){

      return res.status(400)
      .json({
        message:
        "User already exists"
      });

    }

    const hashed =
    await bcrypt.hash(
      password,
      10
    );

    const user =
    await User.create({

      name,
      phone,
      password:hashed

    });

    res.status(201)
    .json(user);

  }
  catch(err){

    res.status(500)
    .json({
      message:err.message
    });

  }

});


router.post("/login", async (req, res) => {

  try {

    const { phone, password } = req.body;

    const user =
      await User.findOne({ phone });

    if (!user) {

      return res.status(400).json({
        message: "User not found"
      });

    }

    const match =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!match) {

      return res.status(400).json({
        message: "Wrong Password"
      });

    }

    res.json({
      _id: user._id,
      name: user.name,
      phone: user.phone
    });

  }
  catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

});

module.exports = router;