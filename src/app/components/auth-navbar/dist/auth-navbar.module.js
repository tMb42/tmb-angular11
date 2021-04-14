"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthNavbarModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var http_1 = require("@angular/common/http");
var platform_browser_1 = require("@angular/platform-browser");
var animations_1 = require("@angular/platform-browser/animations");
var router_1 = require("@angular/router");
var auth_navbar_component_1 = require("./auth-navbar.component");
var toolbar_1 = require("@angular/material/toolbar");
var icon_1 = require("@angular/material/icon");
var button_1 = require("@angular/material/button");
var menu_1 = require("@angular/material/menu");
var list_1 = require("@angular/material/list");
var AuthNavbarModule = /** @class */ (function () {
    function AuthNavbarModule() {
    }
    AuthNavbarModule = __decorate([
        core_1.NgModule({
            declarations: [auth_navbar_component_1.AuthNavbarComponent],
            imports: [
                common_1.CommonModule,
                router_1.RouterModule,
                http_1.HttpClientModule,
                platform_browser_1.BrowserModule,
                animations_1.BrowserAnimationsModule,
                button_1.MatButtonModule,
                icon_1.MatIconModule,
                toolbar_1.MatToolbarModule,
                menu_1.MatMenuModule,
                list_1.MatListModule
            ],
            exports: [
                auth_navbar_component_1.AuthNavbarComponent,
            ]
        })
    ], AuthNavbarModule);
    return AuthNavbarModule;
}());
exports.AuthNavbarModule = AuthNavbarModule;
