const express =
require("express");

const {
  getNdviTimeline
}
=
require(
 "../services/timelineService"
);

const router =
express.Router();

router.post(
 "/ndvi",

 async(req,res)=>{

  try{

   const data =
   await getNdviTimeline(
     req.body.geoJson
   );

   res.json(data);

  }
  catch(err){

   res.status(500)
   .json({
     message:
     err.message
   });

  }

 });

module.exports =
router;