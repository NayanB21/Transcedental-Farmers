const {
  ee
} = require(
  "./earthEngineService"
);

async function getNdviTimeline(
  geoJson
){

  const geometry =
    ee.Geometry(
      geoJson
    );

  const collection =
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
      true
    )

    .limit(12);

  return new Promise(

    (resolve,reject)=>{

      collection
      .getInfo(

        async(result)=>{

          try{

            const timeline =
              [];

            for(
              const feature
              of result.features
            ){

              const image =
                ee.Image(
                  feature.id
                );

              const ndvi =
                image
                .normalizedDifference(
                  ["B8","B4"]
                )
                .rename(
                  "NDVI"
                );

              const value =
              await new Promise(

                (res)=>{

                  ndvi
                  .reduceRegion({

                    reducer:
                    ee.Reducer.mean(),

                    geometry,

                    scale:10,

                    maxPixels:
                    1e9

                  })

                  .getInfo(
                    data =>
                    res(
                      data.NDVI
                    )
                  );

                }

              );

              timeline.push({

                date:
                new Date(
                  feature.properties[
                  "system:time_start"
                  ]
                )
                .toLocaleDateString(),

                ndvi:
                Number(
                  value
                ) || 0

              });

            }

            resolve(
              timeline
            );

          }
          catch(err){

            reject(err);

          }

        }

      );

    }

  );

}

module.exports = {
  getNdviTimeline
};