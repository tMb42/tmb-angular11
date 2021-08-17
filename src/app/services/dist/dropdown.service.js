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
exports.DropdownService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var rxjs_2 = require("rxjs");
var operators_1 = require("rxjs/operators");
var operators_2 = require("rxjs/operators");
var environment_1 = require("src/environments/environment");
var DropdownService = /** @class */ (function () {
    function DropdownService(http) {
        this.http = http;
        this.serverUrl = environment_1.environment.baseURL;
        this.circles = null;
        this.circleSubject = new rxjs_1.Subject();
        this.divns = null;
        this.divnSubject = new rxjs_1.Subject();
        this.subDivns = null;
        this.subDivnSubject = new rxjs_1.Subject();
        this.sections = null;
        this.sectionSubject = new rxjs_1.Subject();
    }
    DropdownService.prototype.getCastes = function () {
        return this.http.get(this.serverUrl + "/castes").pipe(operators_2.catchError(this.handleError));
    };
    DropdownService.prototype.getDepartments = function () {
        return this.http.get(this.serverUrl + "/departments").pipe(operators_2.catchError(this.handleError));
    };
    DropdownService.prototype.getDesignations = function () {
        return this.http.get(this.serverUrl + "/designations").pipe(operators_2.catchError(this.handleError));
    };
    DropdownService.prototype.getSecurityReleasedByDesignations = function () {
        return this.http.get(this.serverUrl + "/srDesigns").pipe(operators_2.catchError(this.handleError));
    };
    DropdownService.prototype.getSecurityReleasedPercent = function () {
        return this.http.get(this.serverUrl + "/securityRelease").pipe(operators_2.catchError(this.handleError));
    };
    DropdownService.prototype.getAeDesignations = function () {
        return this.http.get(this.serverUrl + "/aePost").pipe(operators_2.catchError(this.handleError));
    };
    DropdownService.prototype.getTenderAuthority = function () {
        return this.http.get(this.serverUrl + "/tenderAuthority").pipe(operators_2.catchError(this.handleError));
    };
    DropdownService.prototype.getDlp = function () {
        return this.http.get(this.serverUrl + "/tenderDlp").pipe(operators_2.catchError(this.handleError));
    };
    DropdownService.prototype.getEeDesignations = function () {
        return this.http.get(this.serverUrl + "/eePost").pipe(operators_2.catchError(this.handleError));
    };
    DropdownService.prototype.getSeDesignations = function () {
        return this.http.get(this.serverUrl + "/sePost").pipe(operators_2.catchError(this.handleError));
    };
    DropdownService.prototype.getProfessions = function () {
        return this.http.get(this.serverUrl + "/nonEngineerRoles").pipe(operators_2.catchError(this.handleError));
    };
    DropdownService.prototype.getNonAdminRole = function () {
        return this.http.get(this.serverUrl + "/rolesExceptAdmin").pipe(operators_2.catchError(this.handleError));
    };
    DropdownService.prototype.getAllUserPermission = function () {
        return this.http.get(this.serverUrl + "/permissions").pipe(operators_2.catchError(this.handleError));
    };
    DropdownService.prototype.getDistricts = function () {
        return this.http.get(this.serverUrl + "/districts").pipe(operators_2.catchError(this.handleError));
    };
    DropdownService.prototype.getRailwayYards = function () {
        return this.http.get(this.serverUrl + "/rlys").pipe(operators_2.catchError(this.handleError));
    };
    DropdownService.prototype.getAllCirclesByDeprtId = function (deprtId) {
        return this.http.get(this.serverUrl + "/circles/" + deprtId).pipe(operators_2.catchError(this.handleError));
    };
    DropdownService.prototype.getAllDivisionsByCircleId = function (circleId) {
        return this.http.get(this.serverUrl + "/divn/" + circleId).pipe(operators_2.catchError(this.handleError));
    };
    DropdownService.prototype.getAllSubDivisionsByDivisionId = function (DivnId) {
        return this.http.get(this.serverUrl + "/subDivn/" + DivnId).pipe(operators_2.catchError(this.handleError));
    };
    DropdownService.prototype.getAllSectionsBySubDivisionId = function (SubDivnId) {
        return this.http.get(this.serverUrl + "/section/" + SubDivnId).pipe(operators_2.catchError(this.handleError));
    };
    DropdownService.prototype.getAllDepartmentalStackyardByDivnId = function (DivnId) {
        return this.http.get(this.serverUrl + "/stackyard/" + DivnId).pipe(operators_2.catchError(this.handleError));
    };
    DropdownService.prototype.getAllDepartmentalStackyard = function () {
        return this.http.get(this.serverUrl + "/allStackyard").pipe(operators_2.catchError(this.handleError));
    };
    //------------------------------------------------------------------------------------------------------
    DropdownService.prototype.getSectionUnderWorkExecuted = function () {
        return this.http.get(this.serverUrl + "/workingSection").pipe(operators_2.catchError(this.handleError));
    };
    //---------------------------------------------------------------------------------------------------
    // getCircleUpdateListener() {
    //   return this.circleSubject.asObservable();
    // }
    // getDivisionUpdateListener() {
    //   return this.divnSubject.asObservable();
    // }
    DropdownService.prototype.getLastCircleID = function () {
        var _this = this;
        return this.http.get(this.serverUrl + "/lastCircleID").pipe(operators_2.catchError(this.handleError), operators_1.tap(function (res) {
            _this.circles = res;
            _this.circleSubject.next(__assign({}, _this.circles));
        }));
    };
    DropdownService.prototype.getNewCircleUnderDeprt = function (newData) {
        var _this = this;
        return this.http.post(this.serverUrl + "/addCircle", newData).pipe(operators_2.catchError(this.handleError), operators_1.tap(function (res) {
            _this.circles = res;
            _this.circleSubject.next(__assign({}, _this.circles));
        }));
    };
    //----------------------------------------------------------------------------------------------------------
    DropdownService.prototype.getLastDivisionID = function () {
        var _this = this;
        return this.http.get(this.serverUrl + "/lastDivID").pipe(operators_2.catchError(this.handleError), operators_1.tap(function (res) {
            _this.divns = res;
            _this.divnSubject.next(__assign({}, _this.divns));
        }));
    };
    DropdownService.prototype.getNewDivisionUnderCircle = function (newData) {
        var _this = this;
        return this.http.post(this.serverUrl + "/addDivision", newData).pipe(operators_2.catchError(this.handleError), operators_1.tap(function (res) {
            _this.divns = res;
            _this.divnSubject.next(__assign({}, _this.divns));
        }));
    };
    //----------------------------------------------------------------------------------------------------------
    DropdownService.prototype.getLastSubDivisionID = function () {
        var _this = this;
        return this.http.get(this.serverUrl + "/lastSubDivID").pipe(operators_2.catchError(this.handleError), operators_1.tap(function (res) {
            _this.subDivns = res;
            _this.subDivnSubject.next(__assign({}, _this.subDivns));
        }));
    };
    DropdownService.prototype.getNewSubDivisionUnderDivision = function (newData) {
        var _this = this;
        return this.http.post(this.serverUrl + "/addSubDivision", newData).pipe(operators_2.catchError(this.handleError), operators_1.tap(function (res) {
            _this.subDivns = res;
            _this.subDivnSubject.next(__assign({}, _this.subDivns));
        }));
    };
    //----------------------------------------------------------------------------------------------------------
    DropdownService.prototype.getLastSectionID = function () {
        var _this = this;
        return this.http.get(this.serverUrl + "/lastSecID").pipe(operators_2.catchError(this.handleError), operators_1.tap(function (res) {
            _this.sections = res;
            _this.sectionSubject.next(__assign({}, _this.sections));
        }));
    };
    DropdownService.prototype.getNewSectionUnderSubDivision = function (newData) {
        var _this = this;
        return this.http.post(this.serverUrl + "/addSection", newData).pipe(operators_2.catchError(this.handleError), operators_1.tap(function (res) {
            _this.sections = res;
            _this.sectionSubject.next(__assign({}, _this.sections));
        }));
    };
    DropdownService.prototype.handleError = function (error) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        }
        else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error("Backend returned code " + error.status + ", " + ("body was: " + error.error));
        }
        // return an observable with a user-facing error message
        return rxjs_2.throwError('Something bad happened. Please try again later.');
    };
    DropdownService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], DropdownService);
    return DropdownService;
}());
exports.DropdownService = DropdownService;
