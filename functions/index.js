const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();

exports.makeRouteFromLocation = functions.database
    .ref('/locations/{location_id}')
    .onCreate((snapshot, context) => {

        // Grab the current value of what was written to the Realtime Database.
        const data = snapshot.val();

        if (data !== null) {
            let location_id = context.params.location_id;
            var directionsUrl = 'https://maps.googleapis.com/maps/api/directions/json?origin=' + data.request[0].lat + ',' + data.request[0].lng + '&destination=' + data.request[1].lat + ',' + data.request[1].lng + '&key=AIzaSyBBzs_6TkKeDNeWxFVBjLcdC4H3egqwG1c';

            return axios.get(directionsUrl)
                .then(function (response) {
                    console.log(response.data);
                    // handle success
                    return admin.database().ref('locations/' + location_id).update({
                        'response': response.data,
                    }, function (error) {
                        if (error) {
                            return console.error(error);
                        }
                    });
                })
                .catch(function (error) {
                    return console.log(error);
                });
        }

    });
