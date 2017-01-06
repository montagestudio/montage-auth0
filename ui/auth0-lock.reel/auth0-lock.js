var AuthorizationPanel = require("montage-data/ui/authorization-panel.reel").AuthorizationPanel;

/**
 * @class Login
 * @extends AuthorizationPanel
 */
exports.Auth0Lock = AuthorizationPanel.specialize({
    constructor: {
        value: function Auth0Lock() {
            this.super();
        }
    },

    enterDocument: {
        value: function () {
            var self = this,
                connectionDescriptor = this.dataService.connectionDescriptor,
                auth0Lock;
            auth0Lock = this._auth0Lock = new Auth0Lock(
                connectionDescriptor.clientId,
                connectionDescriptor.domain,
                connectionDescriptor.options
            );


            // Listening for the authenticated event
            auth0Lock.on("authenticated", function(authResult) {
                // Use the token in authResult to getProfile() and save it to localStorage
                auth0Lock.getProfile(authResult.idToken, function(error, profile) {
                    if (error) {
                        // Handle error
                        throw error;
                        return;
                    }

                    self.authorizationManagerPanel.approveAuthorization(profile);

                    localStorage.setItem('auth0IdToken', authResult.idToken);
                    localStorage.setItem('auth0Profile', JSON.stringify(profile));

                    self.isAuthenticated = true;
                    self.needsDraw = true;

                });


            });
            this.needsDraw = true;
        }
    },

    draw: {
        value: function() {
          this.isAuthenticated
          ? this._auth0Lock.hide()
          : this._auth0Lock.show();
        }
    },

    isAuthenticated: {
        value: false
    },

    handleSignInAction: {
        value: function () {
            var self = this;

            this.isErrorVisible = false;
            this.isLoading = true;
            if (!this.username.value) {
                this.showError("Please enter username");
                return;
            }
            if (!this.password.value) {
                this.showError("Please enter password");
                return;
            }
            this.username.value = this.username.value.trim();
            this.dataService.loginWithCredentials(this.username.value, this.password.value).then(function (authorization) {
                self.authorizationManagerPanel.approveAuthorization(authorization);
                // self.application.sessionService.sessionDidOpen(self.userName);

                // Don't keep any track of the password in memory.
                self.username.value = self.password.value = null;

                self.application.session = {
                    isAuthenticated: true,
                    organizationId: authorization.organizationId,
                    bounds: authorization.data.attributes.latLngBounds,
                    timezone: authorization.data.attributes.timezone
                };


            }, function (error) {
                self.showError(error);
            }).finally(function () {
                self.isAuthenticating = false;
            });
        }
    },

    logout: {
        value: function() {
            this._auth0Lock.logout();
        }
    }

    // showError: {
    //     value: function (message) {
    //         this.errorMessage.value = message;
    //         this.isErrorVisible = true;
    //         this.isLoading = false;
    //     }
    // },

    // handleCloseErrorAction: {
    //     value: function () {
    //         this.isErrorVisible = false;
    //     }
    // }

});
