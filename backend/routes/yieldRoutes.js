const express =
require("express");

const {
 predictYield
}
=
require(
 "../services/yieldPredictionService"
);

const router =
express.Router();

router.post(
 "/predict",

 (req,res)=>{

  const {

   crop,
   healthScore

  }
  =
  req.body;

  const result =
  predictYield(

   crop,

   healthScore

  );

  res.json(
   result
  );

 }

);

module.exports =
router;