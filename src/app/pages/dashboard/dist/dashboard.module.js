"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DashboardModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var datepicker_1 = require("ngx-bootstrap/datepicker");
var dropdown_1 = require("ngx-bootstrap/dropdown");
var collapse_1 = require("ngx-bootstrap/collapse");
var progressbar_1 = require("ngx-bootstrap/progressbar");
var tooltip_1 = require("ngx-bootstrap/tooltip");
var datepicker_2 = require("@angular/material/datepicker");
var core_2 = require("@angular/material/core");
var ng_multiselect_dropdown_1 = require("ng-multiselect-dropdown");
var pagination_1 = require("ngx-bootstrap/pagination");
var dashboard_routing_module_1 = require("./dashboard-routing.module");
var navbar_module_1 = require("src/app/components/navbar/navbar.module");
var profile_component_1 = require("../dashboard/profile/profile.component");
var update_profile_component_1 = require("./update-profile/update-profile.component");
var users_component_1 = require("./users/users.component");
var user_manage_component_1 = require("./users/user-manage.component");
var user_layout_component_1 = require("./users/user-layout.component");
var roles_component_1 = require("./roles/roles.component");
var angular_fontawesome_1 = require("@fortawesome/angular-fontawesome");
var user_active_component_1 = require("./user-active/user-active.component");
var user_black_list_component_1 = require("./user-black-list/user-black-list.component");
var user_role_component_1 = require("./user-role/user-role.component");
var user_permission_component_1 = require("./user-permission/user-permission.component");
console.log('Test for Dashboard Module. Loaded Ok');
var DashboardModule = /** @class */ (function () {
    function DashboardModule() {
    }
    DashboardModule = __decorate([
        core_1.NgModule({
            declarations: [profile_component_1.ProfileComponent, update_profile_component_1.UpdateProfileComponent, user_layout_component_1.UserLayoutComponent, users_component_1.UsersComponent, user_manage_component_1.UserManageComponent, roles_component_1.RolesComponent, user_active_component_1.UserActiveComponent, user_black_list_component_1.UserBlackListComponent, user_role_component_1.UserRoleComponent, user_permission_component_1.UserPermissionComponent],
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                angular_fontawesome_1.FontAwesomeModule,
                pagination_1.PaginationModule,
                datepicker_2.MatDatepickerModule,
                core_2.MatNativeDateModule,
                // MatButtonModule,
                // MatCardModule,
                // MatCheckboxModule,
                // MatFormFieldModule,
                // MatIconModule,
                dashboard_routing_module_1.DashboardRoutingModule,
                navbar_module_1.NavbarModule,
                ng_multiselect_dropdown_1.NgMultiSelectDropDownModule.forRoot(),
                datepicker_1.BsDatepickerModule.forRoot(),
                dropdown_1.BsDropdownModule.forRoot(),
                progressbar_1.ProgressbarModule.forRoot(),
                tooltip_1.TooltipModule.forRoot(),
                collapse_1.CollapseModule.forRoot()
            ]
        })
    ], DashboardModule);
    return DashboardModule;
}());
exports.DashboardModule = DashboardModule;
