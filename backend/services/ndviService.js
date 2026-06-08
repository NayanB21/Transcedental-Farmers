const { ee } =
require("./earthEngineService");

async function getNDVI(
  geoJsonPolygon
){

  return new Promise(
    (resolve,reject)=>{

      try{

        const geometry =
          ee.Geometry.Polygon(
            geoJsonPolygon.coordinates
          ); //server side gee geometry object

        const image =
          ee.ImageCollection(
            "COPERNICUS/S2_SR_HARMONIZED"
          )  // References the Sentinel-2 Surface Reflectance harmonized dataset collection on Google's servers.
          .filterBounds(
            geometry
          )  //Filters the collection to keep only satellite images that overlap with your polygon.
          .filterDate(
            "2025-01-01",
            "2030-01-01"
          )  //Restricts the imagery to a specific timeframe.
          .sort(
            "system:time_start",
            false
          )  // Sorts the filtered images by their capture timestamp (system:time_start)..fasle->in descending order
          .first();  //get the most recent one image

        const ndvi =
          image.normalizedDifference(
            ["B8","B4"]
          );   //standard formula

        const meanNDVI =   //take mean of all ndvis over polygon
          ndvi.reduceRegion({

            reducer:
              ee.Reducer.mean(),

            geometry,

            scale:10,  //res=10=s2 b4 and b8 native res

            maxPixels:
              1e9

          });

        meanNDVI
          .get("nd")
          .getInfo(value=>{

            resolve(value);

          });

      }
      catch(err){

        reject(err);

      }

    });

}

module.exports = {
  getNDVI
};