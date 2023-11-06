const distance = require("google-distance-matrix");
const dotenv = require("dotenv");
dotenv.config();

const calculateDistance = async (origins, destinations, mode) => {
  // origins would be an array of one or more addresses or latitude/longitude values from
  // which to calculate distance
  // pass latitude and longitude with space no in between while address can be sent with space
  // eg: ['40.7421,-73.9914'] or ['San Francisco CA']

  // destinations would also be an array of one or more addresses or latitude/longitude values to
  // which to calculate distance
  // pass latitude and longitude with space no in between while address can be sent with space
  // eg: ['40.7421,-73.9914'] or ['San Francisco CA']

  // mode is travel type used, driving | walking | bicycling | transit, (default - driving)

  //   more info on - https://github.com/ecteodoro/google-distance-matrix

  try {
    distance.key(process.env.GOOGLE_MAP_API_KEY);

    distance.units("imperial"); // for units in miles

    distance.matrix(origins, destinations, mode, function (err, distances) {
      if (!err) {
        // return distances;
        return distances.rows;
      } else {
        return err;
      }
    });
  } catch (err) {
    console.log("distance matrix ", err);
  }
};

module.exports = calculateDistance;
