"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DashboardRoutingModule = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var auth_guard_1 = require("../../services/auth.guard");
var profile_component_1 = require("./profile/profile.component");
var roles_component_1 = require("./roles/roles.component");
var update_profile_component_1 = require("./update-profile/update-profile.component");
var user_layout_component_1 = require("./users/user-layout.component");
var password_change_component_1 = require("../auth/password/password-change/password-change.component");
var user_manage_component_1 = require("./users/user-manage.component");
var users_component_1 = require("./users/users.component");
var user_active_component_1 = require("./user-active/user-active.component");
var user_black_list_component_1 = require("./user-black-list/user-black-list.component");
var user_role_component_1 = require("./user-role/user-role.component");
var user_permission_component_1 = require("./user-permission/user-permission.component");
var DashboardRoutes = [
    { path: '', redirectTo: '/auth', pathMatch: 'full' },
    {
        path: '',
        children: [
            {
                path: 'profile',
                component: profile_component_1.ProfileComponent,
                canActivate: [auth_guard_1.AuthGuard]
            },
            {
                path: 'update-profile',
                component: update_profile_component_1.UpdateProfileComponent,
                canActivate: [auth_guard_1.AuthGuard]
            },
            {
                path: 'change-password',
                component: password_change_component_1.PasswordChangeComponent,
                canActivate: [auth_guard_1.AuthGuard]
            },
            {
                path: 'user-role',
                component: user_role_component_1.UserRoleComponent,
                canActivate: [auth_guard_1.AuthGuard],
                data: {
                    roles: ["super_admin"]
                }
            },
            {
                path: 'user-permission',
                component: user_permission_component_1.UserPermissionComponent,
                canActivate: [auth_guard_1.AuthGuard],
                data: {
                    roles: ["super_admin"]
                }
            },
            {
                path: 'users',
                component: user_layout_component_1.UserLayoutComponent,
                canActivate: [auth_guard_1.AuthGuard],
                data: {
                    roles: ["super_admin"]
                },
                children: [
                    { path: '', component: users_component_1.UsersComponent },
                    { path: 'add/:id', component: user_manage_component_1.UserManageComponent },
                    { path: 'edit/:id', component: user_manage_component_1.UserManageComponent }
                ]
            },
            {
                path: 'active-users',
                component: user_active_component_1.UserActiveComponent,
                canActivate: [auth_guard_1.AuthGuard],
                data: {
                    roles: ["super_admin"]
                }
            },
            {
                path: 'block-users',
                component: user_black_list_component_1.UserBlackListComponent,
                canActivate: [auth_guard_1.AuthGuard],
                data: {
                    roles: ["super_admin"]
                }
            },
            {
                path: 'roles',
                component: roles_component_1.RolesComponent,
                canActivate: [auth_guard_1.AuthGuard],
                data: {
                    roles: ["super_admin"]
                }
            }
        ]
    }
];
var DashboardRoutingModule = /** @class */ (function () {
    function DashboardRoutingModule() {
    }
    DashboardRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forChild(DashboardRoutes)],
            exports: [router_1.RouterModule]
        })
    ], DashboardRoutingModule);
    return DashboardRoutingModule;
}());
exports.DashboardRoutingModule = DashboardRoutingModule;
