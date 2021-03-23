"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UpdateProfileComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var operators_1 = require("rxjs/operators");
var sweetalert2_1 = require("sweetalert2");
var UpdateProfileComponent = /** @class */ (function () {
    function UpdateProfileComponent(fb, dropdownService, router, route, authService) {
        this.fb = fb;
        this.dropdownService = dropdownService;
        this.router = router;
        this.route = route;
        this.authService = authService;
        this.depts = [];
        this.designs = [];
        this.roles = [];
        this.isDepartment = null;
        this.submitted = false;
        this.authUser = null;
        // authUsers: AuthUser[];
        this.isLoading = false;
        this.searchMobile = false;
        this.events = [];
        var currentYear = new Date().getFullYear();
        this.minDate = new Date(currentYear - 20, 0, 1);
        this.maxDate = new Date(currentYear + 1, 11, 31);
        this.minDate = new Date();
        this.maxDate = new Date();
        this.minDate.setDate(this.minDate.getDate() - 29200); //maximum age 80yrs
        this.maxDate.setDate(this.maxDate.getDate() - 6570); //minimum age 18yrs
    }
    UpdateProfileComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isLoading = true;
        this.authService.getAuthUser().pipe(operators_1.first()).subscribe(function (response) {
            _this.isLoading = false;
            _this.authUser = response.data;
            _this.profileUpdateForm.patchValue({
                email: _this.authUser.email,
                firstname: _this.authUser.first_name,
                middlename: _this.authUser.middle_name,
                lastname: _this.authUser.last_name,
                department_id: _this.authUser.designation_name,
                designation: _this.authUser.email,
                mobileNo: _this.authUser.mobile,
                isDepartment: _this.authUser.is_departmental,
                // role: this.authUser.role[0],
                gender: _this.authUser.gender,
                birthDate: _this.authUser.dob,
                aboutMe: _this.authUser.remarks
            });
        });
        // this.authService.getAuthUserUpdateListener().subscribe( (res: any) => {
        //   this.authUser = res.user;
        //   console.log('Updateprofile', this.authUser)
        // });
        this.dropdownService.getDepartments().subscribe(function (response) {
            _this.depts = response.departmentData;
        });
        this.dropdownService.getDesignations().subscribe(function (response) {
            _this.designs = response.designationData;
        });
        this.dropdownService.getProfessions().subscribe(function (response) {
            _this.roles = response.profession;
        });
        this.profileUpdateForm = this.fb.group({
            email: new forms_1.FormControl({ value: null, disabled: true }),
            firstname: new forms_1.FormControl(null, [forms_1.Validators.required, forms_1.Validators.minLength(2)]),
            middlename: new forms_1.FormControl(null),
            lastname: new forms_1.FormControl(null, [forms_1.Validators.required, forms_1.Validators.minLength(2)]),
            department: new forms_1.FormControl(null),
            designation: new forms_1.FormControl(null),
            role: new forms_1.FormControl(null),
            isDepartment: new forms_1.FormControl(null),
            gender: new forms_1.FormControl(null),
            mobileNo: new forms_1.FormControl(null, [forms_1.Validators.required, forms_1.Validators.minLength(10)]),
            birthDate: new forms_1.FormControl(null, [forms_1.Validators.required]),
            aboutMe: new forms_1.FormControl(null)
        });
    };
    UpdateProfileComponent.prototype.onDepartmentChange = function (e) {
        if (e == 0) {
            this.profileUpdateForm.patchValue({
                department: null,
                designation: null
            });
        }
        else {
            this.profileUpdateForm.patchValue({
                department: this.authUser.department_id,
                designation: this.authUser.designation_id
            });
        }
    };
    UpdateProfileComponent.prototype.isMobileRegistered = function (mobileNo) {
        var _this = this;
        this.searchMobile = true;
        this.authService.checkRegisteredMobile(mobileNo).subscribe(function (response) {
            _this.message = response;
            _this.searchMobile = false;
        });
    };
    UpdateProfileComponent.prototype.compaireGradationListDOB = function (type, event) {
        var _this = this;
        this.events.push(type + ": " + event.value);
        var dobCheckData = {
            designation: this.profileUpdateForm.value.designation,
            birthDate: this.birthDate,
            lastname: this.profileUpdateForm.value.lastname
        };
        this.authService.getCompaireGradationListBirthDate(dobCheckData).pipe(operators_1.first()).subscribe(function (res) {
            _this.isPwdEngr = res.isPwdEngineer;
            _this.dobMessage = res.dobMessage;
            console.log(res);
        }, function (err) {
            _this.isLoading = false;
            sweetalert2_1["default"].fire({ position: 'top-end', icon: 'error', title: err.dobMessage, showConfirmButton: false, timer: 2000 });
        });
    };
    // compaireGradationListDOBlllll(value: Date): void {
    //   this.birthDate = formatDate(value, 'yyyy-MM-dd', 'en');
    //   const dobCheckData = {
    //     designation: this.profileUpdateForm.value.designation,
    //     birthDate: this.birthDate,
    //     lastname: this.profileUpdateForm.value.lastname,
    //   }
    //   this.authService.getCompaireGradationListBirthDate(dobCheckData).pipe(first()).subscribe((res: any) => {      
    //     this.isPwdEngr = res.isPwdEngineer;
    //     this.dobMessage = res.dobMessage;
    //     console.log(res);
    //     // if(res.isPwdEngineer == 1){
    //     //   Swal.fire({ position: 'top-end', icon: 'success',  title: "Welcome, Your Bithdate matched", showConfirmButton: false, timer: 6000 });
    //     // }else{
    //     //   Swal.fire({ position: 'top-end', icon: 'error',  title: res.message, showConfirmButton: false, timer: 6000 });
    //     // } 
    //   },
    //   err => {
    //     this.isLoading = false;
    //     // this.alertService.error(err);
    //     Swal.fire({ position: 'top-end', icon: 'error',  title: err.dobMessage, showConfirmButton: false, timer: 2000 }); 
    //   }); 
    // }
    UpdateProfileComponent.prototype.updateUserProfile = function () {
        var _this = this;
        this.submitted = true;
        this.isLoading = true;
        var formData = this.profileUpdateForm.getRawValue();
        console.log(formData);
        var updateUserProfileData = {
            firstname: formData.firstname,
            middlename: formData.middlename,
            lastname: formData.lastname,
            name: formData.firstname + ' ' + formData.middlename + ' ' + formData.lastname,
            email: formData.email,
            dob: formData.birthDate,
            gender: formData.gender,
            mobile: formData.mobileNo,
            is_departmental: formData.isDepartment,
            is_pwd_engineer: this.isPwdEngr,
            department_id: formData.department,
            designation_id: formData.designation,
            role_id: formData.role,
            remarks: formData.aboutMe
        };
        this.authService.updateUserProfile(updateUserProfileData).pipe(operators_1.first()).subscribe(function (response) {
            _this.router.navigate(['/dashboard'], { relativeTo: _this.route });
            // this.alertService.success('Registration successful', { keepAfterRouteChange: true });
            sweetalert2_1["default"].fire({ position: 'top-end', icon: 'success', showConfirmButton: false, timer: 3000, title: "Your are successfully update your Profile" });
        }, function (err) {
            _this.isLoading = false;
            // this.alertService.error(err);
            // Swal.fire({ position: 'top-end', icon: 'success',  title: err.error, showConfirmButton: false, timer: 2000 }); 
        });
    };
    UpdateProfileComponent = __decorate([
        core_1.Component({
            selector: 'app-profile',
            templateUrl: './update-profile.component.html',
            styleUrls: ['./update-profile.component.scss']
        })
    ], UpdateProfileComponent);
    return UpdateProfileComponent;
}());
exports.UpdateProfileComponent = UpdateProfileComponent;
