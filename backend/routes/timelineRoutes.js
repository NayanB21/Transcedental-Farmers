const express =
require("express");

const {
  getNdviTimeline
}
=
require(
 "../services/timelineService"
);

const FarmAnalytics =
require(
 "../models/FarmAnalytics"
);

const router =
express.Router();
router.post(
 "/ndvi",
 async(req,res)=>{
  try{
   const analytics =
   await FarmAnalytics.findOne({
    farmId:
    req.body.farmId
   });
   if(
    analytics?.timeline?.length
   ){
    console.log(
    "Returning Cached Timeline"
    );
    return res.json(
    analytics.timeline
    );
   }
   const data =
   await getNdviTimeline(
    req.body.geoJson
   );


   await FarmAnalytics.findOneAndUpdate(
    {
      farmId:
      req.body.farmId
    },
    {
      $set:{
        timeline:data
      }
    },
    {
      upsert:true
    }
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
 }
);

module.exports =
router;