"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PwdWorksNavbarComponent = void 0;
var core_1 = require("@angular/core");
var operators_1 = require("rxjs/operators");
var sweetalert2_1 = require("sweetalert2");
var PwdWorksNavbarComponent = /** @class */ (function () {
    function PwdWorksNavbarComponent(authService) {
        var _this = this;
        this.authService = authService;
        this.authUser = null;
        this.loading = false;
        this.authService.getAuthUser().pipe(operators_1.first()).subscribe(function (response) {
            _this.authUser = response.data;
        });
    }
    PwdWorksNavbarComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.authService.getAuthUserUpdateListener().subscribe(function (res) {
            _this.authUser = res.userData;
        });
    };
    Object.defineProperty(PwdWorksNavbarComponent.prototype, "isLoggedIn", {
        get: function () {
            return this.authService.isLoggedIn();
        },
        enumerable: false,
        configurable: true
    });
    PwdWorksNavbarComponent.prototype.logoutCurrentUser = function () {
        var _this = this;
        this.loading = true;
        this.authService.logout().subscribe(function (data) {
            _this.loading = false;
            sweetalert2_1["default"].fire({ icon: 'success', title: data.message, showConfirmButton: false, timer: 2000 });
        });
    };
    PwdWorksNavbarComponent = __decorate([
        core_1.Component({
            selector: 'app-pwd-works-navbar',
            templateUrl: './pwd-works-navbar.component.html',
            styleUrls: ['./pwd-works-navbar.component.scss']
        })
    ], PwdWorksNavbarComponent);
    return PwdWorksNavbarComponent;
}());
exports.PwdWorksNavbarComponent = PwdWorksNavbarComponent;
