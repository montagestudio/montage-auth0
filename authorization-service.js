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
        value: "ui/auth0-lock.reel"
    },
    _auth0Lock: {
        value: null
    },
    _connectionDescriptor: {
        value: null
    },
    
    /**
     * Passes information necessary to Auth0 authorization API/libraries
     *      name: standard ConnectionDescriptor property ("production", "development", etc...)
     *      clientId:,{String} Required parameter. Your application's clientId in Auth0.
     *      domain:  {String}: Required parameter. Your Auth0 domain. Usually your-account.auth0.com.
     *      options:  {Object}: Optional parameter. Allows for the configuration of Lock's appearance and behavior. 
     *                  See https://auth0.com/docs/libraries/lock/v10/customization for details.
     * 
     * enforces that.
     *
     * @class
     * @extends external:Montage
     */
    connectionDescriptor: {
        get: function() {
            return this._connectionDescriptor;
        },
        set: function(value) {
            this._connectionDescriptor = value;
            if(this._connectionDescriptor.clientId && this._connectionDescriptor.auth0Domain) {
                this._auth0Lock = new Auth0Lock(
                    this._connectionDescriptor.clientId,
                    this._connectionDescriptor.auth0Domain
                    );
            }
        }
    },

    //TODO, finish implementation with AuthO UI less library
    loginWithCredentials: {
        value: function(username, password) {
            var self = this;
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

                //Web Lock from CDN
                //<script src="http://cdn.auth0.com/js/lock/10.7.3/lock.min.js"></script>

            });
        }
    }
});
