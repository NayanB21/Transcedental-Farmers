const express = require("express");

const {
  ee
} = require(
  "../services/earthEngineService"
);

const router =
  express.Router();

router.get(
  "/sentinel",
  async (req, res) => {

    console.log("Route Hit");

    try {

      const num =
        ee.Number(5);

      num.getInfo(
        value => {

          console.log(
            "Value:",
            value
          );

          res.json({

            success: true,

            value

          });

        }
      );

    }
    catch (err) {

      console.error(err);

      res.status(500).json({
        message: err.message
      });

    }

  }
);

module.exports =
  router;