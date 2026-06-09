const { ee } =
require("./earthEngineService");

async function getAnalytics(
  geoJsonPolygon
){

  return new Promise(
    (resolve,reject)=>{

      try{

        const geometry =
          ee.Geometry.Polygon(
            geoJsonPolygon.coordinates
          );

        const image =
          ee.ImageCollection(
            "COPERNICUS/S2_SR_HARMONIZED"
          )
          .filterBounds(
            geometry
          )
          .filterDate(
            "2025-01-01",
            "2030-01-01"
          )
          .sort(
            "system:time_start",
            false
          )
          .first();


        const ndvi =
            image.normalizedDifference(
            ["B8","B4"]
            ).rename("ndvi");

        const ndre =
            image.normalizedDifference(
            ["B8","B5"]
            ).rename("ndre");

        const ndwi =
            image.normalizedDifference(
            ["B8","B11"]
            ).rename("ndwi");

        const ndmi =
            image.normalizedDifference(
            ["B8","B11"]
            ).rename("ndmi");

        const msi =
            image.select("B11")
            .divide(
            image.select("B8")
            )
            .rename("msi");

        const savi =
            image.expression(

            '((NIR-RED)/(NIR+RED+0.5))*1.5',

            {

            NIR:image.select("B8"),

            RED:image.select("B4")

            }

            ).rename("savi");

        const gci =
            image.expression(

            '(NIR/GREEN)-1',

            {

            NIR:image.select("B8"),

            GREEN:image.select("B3")

            }

            ).rename("gci");

        const evi =
            image.expression(

            '2.5*((NIR-RED)/(NIR+6*RED-7.5*BLUE+1))',

            {

            NIR:image.select("B8"),

            RED:image.select("B4"),

            BLUE:image.select("B2")

            }

            ).rename("evi");

        

        const stack =
            ee.Image.cat([

            ndvi,
            ndre,
            ndwi,
            ndmi,
            msi,
            savi,
            gci,
            evi

            ]);

        const stats =
            stack.reduceRegion({

            reducer:
                ee.Reducer.mean(),

            geometry,

            scale:10,

            maxPixels:1e9

            });

        stats.getInfo(
            result => {

            resolve(result);

            }
            );



      }
      catch(err){

        reject(err);

      }

    });

}

module.exports = {
 getAnalytics
};