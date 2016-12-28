var DataService = require("montage-data/logic/service/data-service").DataService,
    RawDataService = require("montage-data/logic/service/raw-data-service").RawDataService,
    DataSelector = require("montage-data/logic/service/data-selector").DataSelector,
    //Auth0 = qequire("auth0-js/index"),
    //Auth0 = qequire("http://cdn.auth0.com/w2/auth0-7.6.0.min.js"),
    Auth0Service;


//http://jsonapi.org/format/#document-meta
//routes KPI will be there.
// Listen socket on ws:// with x-organazion id and any update available will come trhough regardless of types, we get all off them.
// packages, driver, inventory, truck, all move together. node.js 
// be careful abou
/*
    types: {
        value: [


    const TYPES = [
  'contacts',
  'drivers',
  'fleets',
  'hubs',
  'locations',
  'orders',
  'organizations',
  'packages',
  'products',
  'providers',
  'pulls',
  'routes',
  'services',
  'shipments',
  'stops',
  'tasks',
  'vehicles',
]
*/

AuthorizationService = exports.AuthorizationService = RawDataService.specialize({
    /***************************************************************************
     * Initializing
     */

    constructor: {
        value: function Auth0Service() {
            RawDataService.call(this);
        }
    },
    providesAuthorization: {
        value: true
    },
    authorizationPanel: {
        value: "ui/login.reel"
    },
    loginWithCredentials: {
        value: function(username, password) {


            return new Promise(function(resolve, reject) {

                // //Direct to Auth0
                // var loadAuth0equest = new XMLHttpRequest();
                // loadAuth0equest.addEventListener("load", function () {
                //     eval(this.responseText);
                //     var auth0 = new Auth0({
                //         domain: "milezero.auth0.com",
                //         clientID: "7umULmlCTJr3sOnz5iwpnCXnXc5Le1LC",
                //         callbackOnLocationHash: true,
                //         callbackURL: "http://localhost:6789/",
                //     });

                //     //http://cdn.auth0.com/w2/auth0-7.6.0.min.js
                //     //Using Auth0    
                //     auth0.login({
                //         connection: 'Username-Password-Authentication',
                //         responseType: 'token',
                //         email: username,
                //         password: password,
                //     }, function(err, result) {
                //         if (err) {
                //             console.log("something went wrong: ",err);
                //             reject(err);
                //         } else {
                //             resolve(result);
                //         }
                //     });

                // });
                // loadAuth0equest.open("GET", "http://cdn.auth0.com/w2/auth0-7.6.0.min.js", true);
                // loadAuth0equest.send();
                // return;
                
                //Direct to MileZero
                var request = new XMLHttpRequest();

                request.addEventListener("load", function () {
                    var response;

                    try {
                        response = JSON.parse(this.responseText);
                    } catch (error) {
                        reject("There was a problem connecting to the server. Please try later.");
                        return;
                    }
                    if (response.errors) {
                        if (response.errors[0] && response.errors[0].code === "401") {
                            reject("The username and password you have entered are not valid. Please try again.");
                            return;
                        }
                        // TODO: Are there any other kinds of errors? How to handle them?
                        reject("There was a problem connecting to the server. Please try later.");
                        return;
                    }
                    console.log(response);
                    response.organizationId = username;
                    //resolve({organizationId: username});
                    //TEMP fix until autho is sorted out
                    resolve(response);
                }, false);

                request.open("POST", "http://localhost:6789/api/authenticate?include=organization,hubs.location", true);
                request.setRequestHeader("Accept", "application/vnd.api+json");
                request.send(
                    JSON.stringify({
                        data: {
                            type: "authenticate",
                            attributes: {
                                username: username
                            }
                        }
                    })
                );




            });
        }
    }
});