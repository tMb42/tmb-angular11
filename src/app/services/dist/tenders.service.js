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
exports.TendersService = void 0;
var core_1 = require("@angular/core");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var environment_1 = require("src/environments/environment");
var serverUrl = environment_1.environment.baseURL + "/recordSection";
var TendersService = /** @class */ (function () {
    function TendersService(http) {
        //  this.http.get(`${serverUrl}/tendDetails`).subscribe((response: any) => {
        //     this.tenderDetails = response.authTenderDetails.data;
        //     this.tenderDetailsSubject.next([...this.tenderDetails]);
        //   });
        this.http = http;
        this.tenderDetails = [];
        this.tenderDetailsSubject = new rxjs_1.Subject();
    }
    TendersService.prototype.getTenderDetailsUpdateListener = function () {
        return this.tenderDetailsSubject.asObservable();
    };
    TendersService.prototype.getAllTenderDetailsAsPerAuthUser = function (data) {
        return this.http.get(serverUrl + "/tendDetails?page=" + data.page, { params: { per_page: data.itemsPerPage, designation_id: data.designationId, posting_office_id: data.selectedOffice } });
    };
    TendersService.prototype.getValidCirclesByDeprtId = function (deprtId) {
        return this.http.get(serverUrl + "/circles/" + deprtId).pipe(operators_1.catchError(this.handleError));
    };
    TendersService.prototype.getValidDivisionsByCircleId = function (circleId) {
        return this.http.get(serverUrl + "/divn/" + circleId).pipe(operators_1.catchError(this.handleError));
    };
    TendersService.prototype.getValidSubDivisionsByDivisionId = function (DivnId) {
        return this.http.get(serverUrl + "/subDivn/" + DivnId).pipe(operators_1.catchError(this.handleError));
    };
    TendersService.prototype.getValidSectionsBySubDivisionId = function (SubDivnId) {
        return this.http.get(serverUrl + "/section/" + SubDivnId).pipe(operators_1.catchError(this.handleError));
    };
    TendersService.prototype.getTenderDetailsByOfficeId = function (data) {
        console.log('data', data);
        return this.http.get(serverUrl + "/officeTender?page=" + data.page, { params: { per_page: data.itemsPerPage, designation_id: data.designationId, posting_office_id: data.selectedOffice } });
    };
    TendersService.prototype.getTenderDetailsById = function (id) {
        return this.http.get(serverUrl + "/tendDetails/" + id);
    };
    TendersService.prototype.updateTenderDetails = function (tenderData) {
        var _this = this;
        return this.http.put(serverUrl + "/tendDetails/" + tenderData.id, tenderData)
            .pipe(operators_1.catchError(this.handleError), operators_1.tap(function (res) {
            var index = _this.tenderDetails.findIndex(function (x) { return x.id === tenderData.id; });
            _this.tenderDetails[index] = res.td;
            _this.tenderDetailsSubject.next(__assign({}, _this.tenderDetails));
            console.log(index);
        }));
    };
    TendersService.prototype.getSearchTenderDetailsData = function (event) {
        return this.http.get(serverUrl + "/search/" + event);
    };
    TendersService.prototype.getAllSectionAsPerAuthUserForTenderDetails = function () {
        return this.http.get(serverUrl + "/workingSections").pipe(operators_1.catchError(this.handleError));
    };
    TendersService.prototype.handleError = function (error) {
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
    TendersService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], TendersService);
    return TendersService;
}());
exports.TendersService = TendersService;
