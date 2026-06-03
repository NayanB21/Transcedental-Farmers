const express = require("express");
const Farm = require("../models/Farm");

const router = express.Router();

router.post("/", async (req,res)=>{

  try{

    const farm =
      await Farm.create(req.body);

    res.status(201).json(farm);

  }catch(err){

    res.status(500).json({
      message: err.message
    });

  }

});

module.exports = router;