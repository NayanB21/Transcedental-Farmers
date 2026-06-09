const express =
require("express");

const {
 getAnalytics
}
=
require(
 "../services/analyticsService"
);

const {
 detectStress
}
=
require(
 "../services/stressService"
);


const {
 generateRecommendations
}
=
require(
 "../services/recommendationService"
);

const {
 getCropAdvice
}
=
require(
 "../services/cropAdviceService"
);



const router =
express.Router();

router.post(
 "/farm",
 async(req,res)=>{

  try{

    const data =
    await getAnalytics(
      req.body.geoJson
    );

    const recommendations =
      generateRecommendations(
      data
      );
    
    const stresses =
      detectStress(
      data
      );

    const cropAdvice =
      getCropAdvice(
      req.body.crop,
      stresses
      );

  

  

   return res.json({

    analytics:data,

    stresses,

    recommendations,

    cropAdvice

    });


  }
  catch(err){

   res.status(500)
   .json({
     message:err.message
   });

  }

 });

module.exports =
router;