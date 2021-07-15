"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SidebarComponent = exports.ROUTES = void 0;
var core_1 = require("@angular/core");
var perfect_scrollbar_1 = require("perfect-scrollbar");
var operators_1 = require("rxjs/operators");
//Menu Items
exports.ROUTES = [
    {
        path: '/dashboard',
        title: 'Dashboard',
        inforce: 1,
        type: 'link',
        icontype: 'dashboard'
    },
    {
        path: '/dashboard',
        title: 'User Management',
        role: 'super_admin',
        type: 'sub',
        icontype: 'widgets',
        collapse: 'superadmin',
        children: [
            { path: 'user-role', title: 'User - Role', ab: 'UR' },
            { path: 'user-permission', title: 'User - Permission', ab: 'UP' },
            { path: 'users', title: 'Users', ab: 'U' },
            { path: 'roles', title: 'Roles', ab: 'R' },
            { path: 'active-users', title: 'Active User', ab: 'AU' },
            { path: 'block-users', title: 'Blocked User', ab: 'BU' },
        ]
    },
    {
        path: '/engrsCpanel',
        title: 'Cpanel - PWD Engineers',
        role: 'super_admin',
        type: 'sub',
        icontype: 'school',
        collapse: 'pwdEngrs',
        children: [
            { path: 'update-je', title: 'Junior Engineer', ab: 'UJE' },
            { path: 'update-ae', title: 'Assistant Engineer', ab: 'UAE' },
            { path: 'update-se', title: 'Senior Engineer', ab: 'USE' },
        ]
    },
    {
        path: '/engrs',
        title: 'WB PWD Engineers',
        ablity: 1,
        type: 'link',
        icontype: 'architecture'
    },
    {
        path: '/pwd-works',
        title: 'PWD-Works',
        ablity: 1,
        // is_departmental: 1,
        type: 'link',
        icontype: 'work'
    },
    {
        path: 'dashboard/tweety',
        title: 'Discussion Room',
        ablity: 1,
        type: 'link',
        icontype: 'mail'
        // collapse: 'chat',
        // children: [
        //   {path: 'chat', title: 'Chat', ab:'C'},
        //   {path: 'inbox', title: 'Inbox', ab:'IB'},
        // ]
    },
    {
        path: '/developers',
        title: 'Web Development',
        role: 'programmer',
        type: 'sub',
        icontype: 'widgets',
        collapse: 'developers',
        children: [
            { path: 'laravel', title: 'Laravel', ab: 'LAR' },
            { path: 'angular', title: 'Angular', ab: 'ANG' },
            { path: 'vue', title: 'Vue', ab: 'VUE' },
        ]
    },
    {
        path: '/tutorials',
        title: 'Video Tutorial',
        role: 'academy',
        type: 'sub',
        icontype: 'image',
        collapse: 'tutorials',
        children: [
            { path: 'software', title: 'Software', ab: 'S' },
            { path: 'dev', title: 'Coding', ab: 'C' },
        ]
    },
];
var SidebarComponent = /** @class */ (function () {
    function SidebarComponent(authService) {
        var _this = this;
        this.authService = authService;
        this.authUser = null;
        this.authService.getAuthUser().pipe(operators_1.first()).subscribe(function (response) {
            _this.authUser = response.data;
        });
    }
    SidebarComponent.prototype.isMobileMenu = function () {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };
    ;
    SidebarComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.authService.getAuthUserUpdateListener().subscribe(function (res) {
            _this.authUser = res.user;
        });
        this.menuItems = exports.ROUTES.filter(function (menuItem) { return menuItem; });
        if (window.matchMedia("(min-width: 960px)").matches && !this.isMac()) {
            var elemSidebar = document.querySelector('.sidebar .sidebar-wrapper');
            this.ps = new perfect_scrollbar_1["default"](elemSidebar);
        }
    };
    SidebarComponent.prototype.updatePS = function () {
        if (window.matchMedia("(min-width: 960px)").matches && !this.isMac()) {
            this.ps.update();
        }
    };
    SidebarComponent.prototype.isMac = function () {
        var bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    };
    //  for a single link menu
    SidebarComponent.prototype.isPwdEngineer = function (menuitem) {
        if (this.authUser.is_departmental == 1) {
            if (menuitem.is_departmental === this.authUser.is_departmental ||
                menuitem.ablity === this.authUser.is_pwd_engineer ||
                (menuitem.type === 'link' && this.authUser.roles.includes(menuitem.role)) ||
                menuitem.inforce === this.authUser.inforce) {
                return true;
            }
            if (this.authUser.is_pwd_engineer == 1) {
                if ((menuitem.ablity === this.authUser.is_pwd_engineer) ||
                    (menuitem.type === 'link' && this.authUser.roles.includes(menuitem.role))) {
                    return true;
                }
                return false;
            }
            else {
                if (menuitem.type === 'link' && this.authUser.roles.includes(menuitem.role)) {
                    return true;
                }
                return false;
            }
        }
        else {
            if (menuitem.inforce === this.authUser.inforce || menuitem.type === 'link' && this.authUser.roles.includes(menuitem.role)) {
                return true;
            }
            return false;
        }
    };
    //  for a sub menu link
    SidebarComponent.prototype.activeSubMenu = function (menuitem) {
        if (menuitem.display === this.authUser.display || (menuitem.type === 'link' && this.authUser.roles.includes(menuitem.role))) {
            return true;
        }
        return false;
    };
    SidebarComponent = __decorate([
        core_1.Component({
            selector: 'app-sidebar',
            templateUrl: './sidebar.component.html',
            styleUrls: ['./sidebar.component.scss']
        })
    ], SidebarComponent);
    return SidebarComponent;
}());
exports.SidebarComponent = SidebarComponent;
