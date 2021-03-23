"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var app_routing_module_1 = require("./app-routing.module");
var app_component_1 = require("./app.component");
var auth_layout_component_1 = require("./layouts/auth-layout/auth-layout.component");
var admin_layout_component_1 = require("./layouts/admin-layout/admin-layout.component");
var pwd_engrs_layout_component_1 = require("./layouts/pwd-engrs-layout/pwd-engrs-layout.component");
var pwd_works_layout_component_1 = require("./layouts/pwd-works-layout/pwd-works-layout.component");
var animations_1 = require("@angular/platform-browser/animations");
var common_1 = require("@angular/common");
var http_1 = require("@angular/common/http");
var forms_1 = require("@angular/forms");
var core_2 = require("@angular/material/core");
var http_interceptors_1 = require("./http-interceptors");
var auth_navbar_module_1 = require("./components/auth-navbar/auth-navbar.module");
var pwd_engrs_navbar_module_1 = require("./components/pwd-engrs-navbar/pwd-engrs-navbar.module");
var navbar_module_1 = require("./components/navbar/navbar.module");
var pwd_works_navbar_module_1 = require("./components/pwd-works-navbar/pwd-works-navbar.module");
var sidebar_module_1 = require("./components/sidebar/sidebar.module");
var fixedplugin_module_1 = require("./components/fixedplugin/fixedplugin.module");
var footer_module_1 = require("./components/footer/footer.module");
var alert_component_1 = require("./components/alert/alert.component");
var progress_bar_module_1 = require("./components/progress-bar/progress-bar.module");
var dateFormat_1 = require("./dateFormat");
var AppModule = /** @class */ (function () {
    function AppModule(dateAdapter) {
        this.dateAdapter = dateAdapter;
        this.dateAdapter.setLocale('en-in'); // DD/MM/YYYY
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                auth_layout_component_1.AuthLayoutComponent,
                admin_layout_component_1.AdminLayoutComponent,
                pwd_engrs_layout_component_1.PwdEngrsLayoutComponent,
                pwd_works_layout_component_1.PwdWorksLayoutComponent,
                alert_component_1.AlertComponent,
            ],
            imports: [
                platform_browser_1.BrowserModule,
                app_routing_module_1.AppRoutingModule,
                animations_1.BrowserAnimationsModule,
                common_1.CommonModule,
                forms_1.FormsModule,
                http_1.HttpClientModule,
                fixedplugin_module_1.FixedpluginModule,
                sidebar_module_1.SidebarModule,
                footer_module_1.FooterModule,
                auth_navbar_module_1.AuthNavbarModule,
                progress_bar_module_1.ProgressBarModule,
                navbar_module_1.NavbarModule,
                pwd_engrs_navbar_module_1.PwdEngrsNavbarModule,
                pwd_works_navbar_module_1.PwdWorksNavbarModule,
            ],
            providers: [http_interceptors_1.httpInterceptorProviders, { provide: core_2.DateAdapter, useClass: dateFormat_1.DateFormat }],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
