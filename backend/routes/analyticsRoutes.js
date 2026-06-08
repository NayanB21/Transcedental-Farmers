const express =
require("express");

const {
  getNDVI
} = require(
  "../services/ndviService"
);

const router =
  express.Router();

router.post(
  "/ndvi",
  async(req,res)=>{

    try{

      const ndvi =
        await getNDVI(
          req.body.geoJson
        );

      res.json({

        success:true,

        ndvi

      });

    }
    catch(err){

      res.status(500).json({

        message:
          err.message

      });

    }

  }
);

module.exports =
router;