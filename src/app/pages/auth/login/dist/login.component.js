"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LoginComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var operators_1 = require("rxjs/operators");
var sweetalert2_1 = require("sweetalert2");
var LoginComponent = /** @class */ (function () {
    function LoginComponent(fb, route, router, authService, deviceService) {
        this.fb = fb;
        this.route = route;
        this.router = router;
        this.authService = authService;
        this.deviceService = deviceService;
        this.deviceInfo = null;
        this.hide = true;
        this.rememberMe = false;
        this.isLoading = false;
        this.submitted = false;
        this.error = '';
        this.isLoginMode = true;
        this.socials = [
            {
                provider: 'google',
                icon: 'mdi-google',
                iconColor: '#e91e63'
            },
            // {
            //   provider: 'facebook',
            //   icon: 'mdi-facebook',
            //   iconColor: '#007bff'
            // },
            {
                provider: 'github',
                icon: 'mdi-github',
                iconColor: 'black'
            },
        ];
        this.epicFunction();
        // redirect to home if already logged in
        if (this.authService.userValue) {
            this.router.navigate(['/dashboard']);
        }
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.loginForm = this.fb.group({
            email: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.email]),
            password: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.minLength(8)]),
            rememberMe: new forms_1.FormControl(false)
        });
    };
    LoginComponent.prototype.epicFunction = function () {
        this.deviceInfo = this.deviceService.getDeviceInfo();
        var isMobile = this.deviceService.isMobile();
        var isTablet = this.deviceService.isTablet();
        var isDesktopDevice = this.deviceService.isDesktop();
        // console.log(this.deviceInfo);
        // console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
        // console.log(isTablet);  // returns if the device us a tablet (iPad etc)
        // console.log(isDesktopDevice); // returns if the app is running on a Desktop browser.
    };
    LoginComponent.prototype.onSubmit = function () {
        var _this = this;
        var formData = this.loginForm.getRawValue();
        // converting password to MD5
        // const md5 = new Md5();
        // const passwordMd5 = md5.appendStr(formData.password).end();
        var loginData = {
            email: formData.email,
            password: formData.password,
            remember: formData.rememberMe,
            device_name: this.deviceInfo.deviceType + ' - ' + this.deviceInfo.os_version + ' - ' + this.deviceInfo.browser
        };
        this.authService.login(loginData).pipe(operators_1.first()).subscribe(function () {
            _this.isLoading = false;
            // get return url from query parameters or default to home page
            var returnUrl = _this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
            _this.router.navigateByUrl(returnUrl);
            sweetalert2_1["default"].fire({ position: 'top-end', icon: 'success', title: "Thank you for signing in", showConfirmButton: false, timer: 2000 });
        }, function (err) {
            _this.isLoading = false;
            sweetalert2_1["default"].fire({ position: 'top-end', icon: 'error', title: err.error.message, showConfirmButton: false, timer: 4000 });
        });
    };
    LoginComponent.prototype.socialiteLogin = function (data) {
        var _this = this;
        this.isLoading = true;
        var loginData = {
            provider: data,
            device_name: this.deviceInfo.deviceType + ' - ' + this.deviceInfo.os_version + ' - ' + this.deviceInfo.browser
        };
        this.authService.loginWithSocialite(loginData).pipe(operators_1.first()).subscribe(function (response) {
            _this.isLoading = false;
        });
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'app-login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.scss']
        })
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
