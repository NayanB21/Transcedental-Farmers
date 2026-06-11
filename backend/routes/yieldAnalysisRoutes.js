const express =
require("express");

const {
 askAgronomist
}
=
require(
 "../services/geminiService"
);

const router =
express.Router();

router.post(
 "/",

 async(req,res)=>{

  try{

   const prompt = {

    question:
`
Crop: ${req.body.crop}

Health Score:
${req.body.healthScore}/100

Expected Yield:
${req.body.predictedYield}
Quintal/Acre

Explain:

1. Current crop condition
2. Yield outlook
3. Main concerns
4. Recommended actions

Return plain text.

Do NOT use:

emojis,
markdown,
special symbols,
bullet icons.

Use only normal English text.

Keep answer simple.

Use farmer-friendly language.



`
   };

   const answer =
   await askAgronomist(
    prompt
   );

   res.json({
    answer
   });

  }
    catch(err){

    console.log(
        "YIELD ANALYSIS ERROR:",
        err
    );

    res.status(500)
    .json({
        message:
        err.message
    });

    }

 });

module.exports =
router;