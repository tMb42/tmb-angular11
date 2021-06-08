"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthGuard = void 0;
var core_1 = require("@angular/core");
var sweetalert2_1 = require("sweetalert2");
var AuthGuard = /** @class */ (function () {
    function AuthGuard(authService, router, alertService) {
        this.authService = authService;
        this.router = router;
        this.alertService = alertService;
    }
    AuthGuard.prototype.canActivate = function (route, state) {
        var currentUser = this.authService.userValue;
        if (currentUser) {
            var Roles = currentUser.userData.roles;
            var permissibleRoles = route.data.roles;
            // console.log("User's Roles =>", Roles);
            // console.log("permissibleRoles =>", permissibleRoles);
            if (permissibleRoles) {
                for (var i = 0; i < Roles.length; i++) {
                    // const matchedRole = permissibleRoles.indexOf(Roles[i])
                    // console.log('role =>', Roles[i]);
                    // console.log('matchedRole =>', matchedRole);
                    if (permissibleRoles.indexOf(Roles[i]) > -1) {
                        return true;
                    }
                }
                // role not authorised so redirect to home page
                this.router.navigate(['/auth']);
                sweetalert2_1["default"].fire({ position: 'center', icon: 'warning', title: 'Sorry! ' + currentUser.userData.first_name + ' you are not authorised for this page', showConfirmButton: false, timer: 7000 });
                return false;
            }
            return true;
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
        sweetalert2_1["default"].fire({ position: 'center', icon: 'error', title: 'Please login first', showConfirmButton: false, timer: 4000 });
        return false;
    };
    AuthGuard = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], AuthGuard);
    return AuthGuard;
}());
exports.AuthGuard = AuthGuard;
