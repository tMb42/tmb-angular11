"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthService = void 0;
var core_1 = require("@angular/core");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var environment_1 = require("../../environments/environment");
var AuthService = /** @class */ (function () {
    function AuthService(http, router) {
        this.http = http;
        this.router = router;
        this.serverUrl = environment_1.environment.baseURL;
        this.authUser = null;
        this.authUserSubject = new rxjs_1.Subject();
        this.userSubject = new rxjs_1.BehaviorSubject(JSON.parse(localStorage.getItem('authToken')));
        this.user = this.userSubject.asObservable();
    }
    Object.defineProperty(AuthService.prototype, "userValue", {
        get: function () {
            return this.userSubject.value;
        },
        enumerable: false,
        configurable: true
    });
    AuthService.prototype.isAuthenticated = function () {
        if (this.user) {
            return true;
        }
        else {
            return false;
        }
    };
    AuthService.prototype.getAuthUserUpdateListener = function () {
        return this.authUserSubject.asObservable();
    };
    AuthService.prototype.login = function (loginData) {
        var _this = this;
        return this.http.post(this.serverUrl + "/login", loginData)
            .pipe(operators_1.map(function (resData) {
            // store user details and token in local storage to keep user logged in between page refreshes
            localStorage.setItem('authToken', JSON.stringify(resData));
            _this.userSubject.next(__assign({}, resData));
        }), operators_1.catchError(this.handleError));
    };
    AuthService.prototype.isLoggedIn = function () {
        if (localStorage.getItem('authToken')) {
            return true;
        }
        return false;
    };
    AuthService.prototype.getAuthorizationToken = function () {
        var token_key = JSON.parse(localStorage.getItem('authToken'));
        return token_key.token;
    };
    AuthService.prototype.logout = function () {
        var _this = this;
        return this.http.post(this.serverUrl + "/logout", {})
            .pipe(operators_1.catchError(this.handleError), operators_1.tap(function () {
            _this.userSubject.next(null);
            // remove authToken from local storage and set current user to null
            localStorage.removeItem('authToken');
            _this.router.navigate(['/auth']);
        }));
    };
    AuthService.prototype.register = function (registerData) {
        return this.http.post(this.serverUrl + "/register", registerData);
    };
    AuthService.prototype.getAuthUser = function () {
        var _this = this;
        return this.http.get(this.serverUrl + "/userDetails")
            .pipe(operators_1.catchError(this.handleError), operators_1.tap(function (res) {
            _this.authUser = res.data;
        }));
    };
    AuthService.prototype.getEmailVarification = function (model) {
        return this.http.get(this.serverUrl + "/email/verify/" + model.userId + "/" + model.token, { params: { id: model.userId, hash: model.token } });
    };
    AuthService.prototype.checkRegisteredMobile = function (mobile) {
        return this.http.get(this.serverUrl + "/checkMobile/" + mobile);
    };
    AuthService.prototype.getCompaireGradationListBirthDate = function (model) {
        return this.http.get(this.serverUrl + "/checkBithday/" + model.designation + "/" + model.birthDate + "/" + model.lastname).pipe(operators_1.catchError(this.handleError));
    };
    AuthService.prototype.sendPasswordResetLinkToEmail = function (payload) {
        return this.http.post(this.serverUrl + "/password/email", payload).pipe(operators_1.catchError(this.handleError));
    };
    AuthService.prototype.resetPassword = function (resetData) {
        return this.http.post(this.serverUrl + "/password/reset", resetData);
    };
    AuthService.prototype.changeLoginPassword = function (data) {
        return this.http.post(this.serverUrl + "/change-password", data).pipe(operators_1.catchError(this.handleError));
    };
    AuthService.prototype.getUpdateUserProfile = function (profileData) {
        var _this = this;
        return this.http.post(this.serverUrl + "/user/profile", profileData).pipe(operators_1.catchError(this.handleError), operators_1.tap(function (res) {
            _this.authUser = res;
            _this.authUserSubject.next(__assign({}, _this.authUser));
        }));
    };
    AuthService.prototype.getPwdWorkingUserProfile = function (pwdWorkingPro) {
        var _this = this;
        return this.http.post(this.serverUrl + "/pwd/working-profile", pwdWorkingPro).pipe(operators_1.catchError(this.handleError), operators_1.tap(function (res) {
            _this.authUser = res;
            _this.authUserSubject.next(__assign({}, _this.authUser));
        }));
    };
    AuthService.prototype.uploadUserProfileImage = function (uploadImageData) {
        var _this = this;
        return this.http.post(this.serverUrl + "/user/photo", uploadImageData).pipe(operators_1.tap(function (res) {
            _this.authUser = res;
            _this.authUserSubject.next(__assign({}, _this.authUser));
        }));
    };
    AuthService.prototype.loginWithSocialite = function (data) {
        return this.http.get(this.serverUrl + "/auth/" + data.provider, data).pipe(operators_1.map(function (response) {
            if (response.url) {
                window.location.href = response.url;
            }
        }), operators_1.catchError(this.handleError));
    };
    AuthService.prototype.loginFacebookCallback = function (data) {
        var _this = this;
        console.log('data', data);
        return this.http.get(this.serverUrl + "/auth/facebook/callback", { params: data })
            .pipe(operators_1.map(function (res) {
            console.log(res);
            if (res.token) {
                localStorage.setItem('authToken', JSON.stringify(res));
                _this.userSubject.next(__assign({}, res));
            }
        }), operators_1.catchError(this.handleError));
    };
    AuthService.prototype.loginGoogleCallback = function (data) {
        var _this = this;
        return this.http.get(this.serverUrl + "/auth/google/callback", { params: data })
            .pipe(operators_1.map(function (res) {
            if (res.token) {
                localStorage.setItem('authToken', JSON.stringify(res));
                _this.userSubject.next(__assign({}, res));
            }
        }), operators_1.catchError(this.handleError));
    };
    AuthService.prototype.loginGitHubCallback = function (data) {
        var _this = this;
        return this.http.get(this.serverUrl + "/auth/github/callback", { params: data })
            .pipe(operators_1.map(function (res) {
            if (res.token) {
                localStorage.setItem('authToken', JSON.stringify(res));
                _this.userSubject.next(__assign({}, res));
            }
        }), operators_1.catchError(this.handleError));
    };
    AuthService.prototype.deleteAccount = function (params) {
        var _this = this;
        return this.http["delete"](this.serverUrl + "/users/" + params.id)
            .pipe(operators_1.catchError(this.handleError), operators_1.tap(function () {
            _this.userSubject.next(null);
            localStorage.removeItem('authToken');
            _this.router.navigate(['/auth']);
        }));
    };
    AuthService.prototype.lockMyAccount = function (data) {
        var _this = this;
        return this.http.put(environment_1.environment.baseURL + "/suspendUser", data).pipe(operators_1.catchError(this.handleError), operators_1.tap(function () {
            _this.userSubject.next(null);
            localStorage.removeItem('authToken');
            _this.router.navigate(['/auth']);
        }));
    };
    AuthService.prototype.handleError = function (error) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        }
        else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            console.error("Backend returned code " + error.status + ", " + ("body was: " + error.error));
        }
        // Return an observable with a user-facing error message.
        return rxjs_1.throwError(error);
    };
    AuthService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
