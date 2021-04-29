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
exports.UserService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var operators_2 = require("rxjs/operators");
var environment_1 = require("../../environments/environment");
var serverUrl = environment_1.environment.baseURL + "/users";
var UserService = /** @class */ (function () {
    function UserService(http) {
        this.http = http;
        this.users = null;
        this.userSubject = new rxjs_1.Subject();
    }
    UserService.prototype.getUserUpdateListener = function () {
        return this.userSubject.asObservable();
    };
    UserService.prototype.getAll = function (data) {
        return this.http.get(serverUrl + "?page=" + data.page + "&per_page=" + data.per_page);
    };
    UserService.prototype.getById = function (id) {
        return this.http.get(serverUrl + "/" + id);
    };
    UserService.prototype.create = function (id, params) {
        return this.http.post(serverUrl + "/" + id, params);
    };
    UserService.prototype.update = function (id, params) {
        return this.http.put(serverUrl + "/" + id, params);
    };
    UserService.prototype["delete"] = function (id) {
        return this.http["delete"](serverUrl + "/" + id);
    };
    UserService.prototype.addUserRoles = function (params) {
        return this.http.put(serverUrl + "/addRoles/" + params.id, params).pipe(operators_2.catchError(this.handleError));
    };
    UserService.prototype.deleteUserRoles = function (params) {
        return this.http.put(serverUrl + "/deleteRoles/" + params.id, params).pipe(operators_2.catchError(this.handleError));
    };
    UserService.prototype.addUserPermissions = function (data) {
        return this.http.put(serverUrl + "/addAbility/" + data.id, data).pipe(operators_2.catchError(this.handleError));
    };
    UserService.prototype.deleteUserPermissions = function (data) {
        return this.http["delete"](serverUrl + "/deleteAbility/" + data.id, data).pipe(operators_2.catchError(this.handleError));
    };
    UserService.prototype.blockedUserAc = function (data) {
        var _this = this;
        return this.http.put(environment_1.environment.baseURL + "/suspendUser", data).pipe(operators_2.catchError(this.handleError), operators_1.tap(function (resData) {
            _this.userSubject.next(__assign({}, resData));
        }));
    };
    UserService.prototype.getAllActiveUserList = function (data) {
        return this.http.get(environment_1.environment.baseURL + "/activeUsers?page=" + data.page + "&per_page=" + data.per_page);
    };
    UserService.prototype.getAllBlockedUserList = function (data) {
        return this.http.get(environment_1.environment.baseURL + "/blockedUsers?page=" + data.page + "&per_page=" + data.per_page);
    };
    UserService.prototype.activeUserAc = function (data) {
        var _this = this;
        return this.http.put(environment_1.environment.baseURL + "/unlockUser", data).pipe(operators_2.catchError(this.handleError), operators_1.tap(function (resData) {
            _this.userSubject.next(__assign({}, resData));
        }));
    };
    UserService.prototype.getSearchActiveUser = function (event) {
        return this.http.get(environment_1.environment.baseURL + "/serchActiveUser/" + event);
    };
    UserService.prototype.getSearchBlockedUser = function (event) {
        return this.http.get(environment_1.environment.baseURL + "/serchBlockedUser/" + event);
    };
    // private handleError(error: HttpErrorResponse) {
    //   if (error.error instanceof ErrorEvent) {
    //     // A client-side or network error occurred. Handle it accordingly.
    //     console.error('An error occurred:', error.error.message);
    //   } else {
    //     // The backend returned an unsuccessful response code.
    //     // The response body may contain clues as to what went wrong.
    //     console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    //   }
    //   // Return an observable with a user-facing error message.
    //   return throwError('Something bad happened; please try again later.');
    // }
    UserService.prototype.serverError = function (err) {
        // console.log('sever error:', err);  // debug
        if (err instanceof Response) {
            return rxjs_1.throwError('backend server error');
            // if you're using lite-server, use the following line
            // instead of the line above:
            // return Observable.throw(err.text() || 'backend server error');
        }
        if (err.status === 0) {
            return rxjs_1.throwError({ status: err.status, message: 'Backend Server is not Working', statusText: err.statusText });
        }
        if (err.status === 401) {
            return rxjs_1.throwError({ status: err.status, message: 'Your are not authorised', statusText: err.statusText });
        }
        return rxjs_1.throwError(err);
    };
    UserService.prototype.handleError = function (errorResponse) {
        console.log('test', errorResponse);
        if (errorResponse.error.message.includes('1062')) {
            return rxjs_1.throwError('Record already exists');
        }
        else {
            return rxjs_1.throwError(errorResponse.error.message);
        }
    };
    UserService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
