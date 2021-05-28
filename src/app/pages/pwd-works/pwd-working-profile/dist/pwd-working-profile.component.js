"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PwdWorkingProfileComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var operators_1 = require("rxjs/operators");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var sweetalert2_1 = require("sweetalert2");
var PwdWorkingProfileComponent = /** @class */ (function () {
    function PwdWorkingProfileComponent(fb, dropdownService, router, route, authService) {
        var _this = this;
        this.fb = fb;
        this.dropdownService = dropdownService;
        this.router = router;
        this.route = route;
        this.authService = authService;
        this.authUser = null;
        this.faPlus = free_solid_svg_icons_1.faPlus;
        this.faUserEdit = free_solid_svg_icons_1.faUserEdit;
        // faUserEdit = faUserEdit;
        this.isLoading = false;
        this.isCircleFormShow = false;
        this.isDivisionFormShow = false;
        this.isSubdivisionFormShow = false;
        this.isSectionFormShow = false;
        this.depts = [];
        this.districts = [];
        this.circles = [];
        this.divns = [];
        this.subDivns = [];
        this.sections = [];
        this.Rlys = [];
        this.stackYards = [];
        this.newCirId = null;
        this.newDivId = null;
        this.newSubDivId = null;
        this.newSecId = null;
        this.officeId = null;
        this.authService.getAuthUser().pipe(operators_1.first()).subscribe(function (response) {
            _this.isLoading = false;
            _this.authUser = response.data;
            _this.pwdWorkingProfileForm.patchValue({
                department: _this.authUser.department_id,
                remarks: _this.authUser.pwdProRemarks,
                railway_id: _this.authUser.RlyId,
                district_id: _this.authUser.distId,
                stackyard_id: _this.authUser.StackId
            });
        });
    }
    PwdWorkingProfileComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isLoading = true;
        this.authService.getAuthUserUpdateListener().subscribe(function (res) {
            _this.authUser = res.user;
            _this.isLoading = false;
        });
        // this.dropdownService.getCircleUpdateListener().subscribe( (res: any) => {
        //   this.circles = res.circleData;
        // });
        this.pwdWorkingProfileForm = this.fb.group({
            department: new forms_1.FormControl(null, [forms_1.Validators.required]),
            circle_id: new forms_1.FormControl(null, [forms_1.Validators.required]),
            division_id: new forms_1.FormControl(null, [forms_1.Validators.required]),
            sub_division_id: new forms_1.FormControl(null, [forms_1.Validators.required]),
            section_id: new forms_1.FormControl(null, [forms_1.Validators.required]),
            district_id: new forms_1.FormControl(null, [forms_1.Validators.required]),
            stackyard_id: new forms_1.FormControl(null, [forms_1.Validators.required]),
            railway_id: new forms_1.FormControl(null, [forms_1.Validators.required]),
            remarks: new forms_1.FormControl(null)
        });
        this.circleForm = this.fb.group({
            newCirId: new forms_1.FormControl(null, [forms_1.Validators.required]),
            circle_name: new forms_1.FormControl(null, [forms_1.Validators.required]),
            remarks: new forms_1.FormControl(null)
        });
        this.divisionForm = this.fb.group({
            newDivId: new forms_1.FormControl(null, [forms_1.Validators.required]),
            divn_name: new forms_1.FormControl(null, [forms_1.Validators.required]),
            remarks: new forms_1.FormControl(null)
        });
        this.subDivisionForm = this.fb.group({
            newSubDivId: new forms_1.FormControl(null, [forms_1.Validators.required]),
            subDivn_name: new forms_1.FormControl(null, [forms_1.Validators.required]),
            remarks: new forms_1.FormControl(null)
        });
        this.sectionForm = this.fb.group({
            newSecId: new forms_1.FormControl(null, [forms_1.Validators.required]),
            section_name: new forms_1.FormControl(null, [forms_1.Validators.required]),
            remarks: new forms_1.FormControl(null)
        });
        this.dropdownService.getDepartments().subscribe(function (response) {
            _this.depts = response.departmentData;
        });
        this.dropdownService.getDistricts().subscribe(function (response) {
            _this.districts = response.districtData;
        });
        this.dropdownService.getRailwayYards().subscribe(function (response) {
            _this.Rlys = response.rlyData;
        });
    };
    PwdWorkingProfileComponent.prototype.getCirclesByDepartmentId = function (event) {
        var _this = this;
        if (event === 'null') {
            this.isCircleFormShow = false;
        }
        else {
            this.dropdownService.getAllCirclesByDeprtId(event).subscribe(function (response) {
                _this.circles = response.circleData;
            });
        }
    };
    PwdWorkingProfileComponent.prototype.getDivisionsByCircleId = function (event) {
        var _this = this;
        if (event === 'null') {
            this.isDivisionFormShow = false;
        }
        else {
            this.dropdownService.getAllDivisionsByCircleId(event).subscribe(function (response) {
                _this.divns = response.DivnData;
            });
        }
    };
    PwdWorkingProfileComponent.prototype.getSubDivisionsByDivisionId = function (event) {
        var _this = this;
        if (event === 'null') {
            this.isSubdivisionFormShow = false;
        }
        else {
            this.dropdownService.getAllSubDivisionsByDivisionId(event).subscribe(function (response) {
                _this.subDivns = response.subDivnData;
            });
        }
    };
    PwdWorkingProfileComponent.prototype.getSectionsBySubDivisionId = function (event) {
        var _this = this;
        if (event === 'null') {
            this.isSectionFormShow = false;
        }
        else {
            this.dropdownService.getAllSectionsBySubDivisionId(event).subscribe(function (response) {
                _this.sections = response.SecData;
            });
        }
    };
    PwdWorkingProfileComponent.prototype.getDepartmentalStackyardByDivnId = function (event) {
        var _this = this;
        this.dropdownService.getAllDepartmentalStackyardByDivnId(event).subscribe(function (response) {
            _this.stackYards = response.stackYardData;
        });
    };
    //--------------------------------------------------------------------------------------------
    PwdWorkingProfileComponent.prototype.cancelCircle = function () {
        this.isCircleFormShow = false;
    };
    PwdWorkingProfileComponent.prototype.showCircleInsertFormIf = function () {
        var _this = this;
        var formData = this.pwdWorkingProfileForm.getRawValue();
        if (formData.department != 'null') {
            this.isCircleFormShow = true;
            // this.isCircleFormShow = !this.isCircleFormShow;
            this.dropdownService.getLastCircleID().subscribe(function (res) {
                _this.newCirId = res.nextCirId[0].newId;
                _this.circleForm.patchValue({
                    newCirId: _this.newCirId
                });
            });
        }
        else {
            this.isCircleFormShow = false;
        }
    };
    PwdWorkingProfileComponent.prototype.cancelDivision = function () {
        this.isDivisionFormShow = false;
    };
    PwdWorkingProfileComponent.prototype.showDivisionInsertFormIf = function () {
        var _this = this;
        var formData = this.pwdWorkingProfileForm.getRawValue();
        if (formData.circle_id != 'null') {
            this.isDivisionFormShow = true;
            this.dropdownService.getLastDivisionID().subscribe(function (res) {
                _this.newDivId = res.nextDivId[0].newId;
                _this.divisionForm.patchValue({
                    newDivId: _this.newDivId
                });
            });
        }
        else {
            this.isDivisionFormShow = false;
        }
    };
    PwdWorkingProfileComponent.prototype.cancelSubDivision = function () {
        this.isSubdivisionFormShow = false;
    };
    PwdWorkingProfileComponent.prototype.showSubDivisionInsertFormIf = function () {
        var _this = this;
        var formData = this.pwdWorkingProfileForm.getRawValue();
        if (formData.division_id != 'null') {
            this.isSubdivisionFormShow = !this.isSubdivisionFormShow;
            this.dropdownService.getLastSubDivisionID().subscribe(function (res) {
                _this.newSubDivId = res.nextSubDivId[0].newId;
                _this.subDivisionForm.patchValue({
                    newSubDivId: _this.newSubDivId
                });
            });
        }
        else {
            this.isSubdivisionFormShow = false;
        }
    };
    PwdWorkingProfileComponent.prototype.cancelSection = function () {
        this.isSectionFormShow = false;
    };
    PwdWorkingProfileComponent.prototype.showSectionInsertFormIf = function () {
        var _this = this;
        var formData = this.pwdWorkingProfileForm.getRawValue();
        if (formData.sub_division_id != 'null') {
            this.isSectionFormShow = true;
            this.dropdownService.getLastSectionID().subscribe(function (res) {
                _this.newSecId = res.nextSecId[0].newId;
                _this.sectionForm.patchValue({
                    newSecId: _this.newSecId
                });
            });
        }
        else {
            this.isSectionFormShow = false;
        }
    };
    //-------------------------------------------------------------------------------------------------------------
    PwdWorkingProfileComponent.prototype.addNewCircle = function () {
        var _this = this;
        this.isLoading = true;
        var mainFormData = this.pwdWorkingProfileForm.getRawValue();
        var formData = this.circleForm.getRawValue();
        var addedData = {
            circle_id: formData.newCirId,
            circleName: formData.circle_name,
            remarks: formData.remarks,
            deprt_id: mainFormData.department
        };
        this.dropdownService.getNewCircleUnderDeprt(addedData).pipe(operators_1.first()).subscribe(function (response) {
            sweetalert2_1["default"].fire({ position: 'top-end', icon: 'success', showConfirmButton: false, timer: 3000, title: response.message });
        }, function (err) {
            _this.isLoading = false;
            sweetalert2_1["default"].fire({ position: 'top-end', icon: 'error', title: err.error.errors, showConfirmButton: false, timer: 4000
            });
        });
    };
    //-------------------------------------------------------------------------------------------------------------
    PwdWorkingProfileComponent.prototype.addNewDivision = function () {
        var _this = this;
        this.isLoading = true;
        var mainFormData = this.pwdWorkingProfileForm.getRawValue();
        var formData = this.divisionForm.getRawValue();
        var addedData = {
            division_id: formData.newDivId,
            divisionName: formData.divn_name,
            remarks: formData.remarks,
            cirId: mainFormData.circle_id
        };
        this.dropdownService.getNewDivisionUnderCircle(addedData).pipe(operators_1.first()).subscribe(function (response) {
            sweetalert2_1["default"].fire({ position: 'top-end', icon: 'success', showConfirmButton: false, timer: 3000, title: response.message });
        }, function (err) {
            _this.isLoading = false;
            sweetalert2_1["default"].fire({ position: 'top-end', icon: 'error', title: err.error.errors, showConfirmButton: false, timer: 4000
            });
        });
    };
    //-------------------------------------------------------------------------------------------------------------
    PwdWorkingProfileComponent.prototype.addNewSubDivision = function () {
        var _this = this;
        this.isLoading = true;
        var mainFormData = this.pwdWorkingProfileForm.getRawValue();
        var formData = this.subDivisionForm.getRawValue();
        var addedData = {
            sub_division_id: formData.newSubDivId,
            subDivName: formData.subDivn_name,
            remarks: formData.remarks,
            division_id: mainFormData.division_id
        };
        this.dropdownService.getNewSubDivisionUnderDivision(addedData).pipe(operators_1.first()).subscribe(function (response) {
            sweetalert2_1["default"].fire({ position: 'top-end', icon: 'success', showConfirmButton: false, timer: 3000, title: response.message });
        }, function (err) {
            _this.isLoading = false;
            sweetalert2_1["default"].fire({ position: 'top-end', icon: 'error', title: err.error.errors, showConfirmButton: false, timer: 4000
            });
        });
    };
    //-------------------------------------------------------------------------------------------------------------
    PwdWorkingProfileComponent.prototype.addNewSection = function () {
        var _this = this;
        this.isLoading = true;
        var mainFormData = this.pwdWorkingProfileForm.getRawValue();
        var formData = this.sectionForm.getRawValue();
        var addedData = {
            sectionId: formData.newSecId,
            sectionName: formData.section_name,
            remarks: formData.remarks,
            mobileCUG: formData.mobile,
            subDivId: mainFormData.sub_division_id
        };
        this.dropdownService.getNewSectionUnderSubDivision(addedData).pipe(operators_1.first()).subscribe(function (response) {
            if (response.success == 0) {
                sweetalert2_1["default"].fire({ position: 'top-end', icon: 'error', showConfirmButton: false, timer: 3000, title: response });
            }
            sweetalert2_1["default"].fire({ position: 'top-end', icon: 'success', showConfirmButton: false, timer: 3000, title: response.message });
        }, function (err) {
            console.log(err);
            _this.isLoading = false;
            sweetalert2_1["default"].fire({ position: 'top-end', icon: 'error', title: err.error, showConfirmButton: false, timer: 4000
            });
        });
    };
    //--------------------------------------------------------------------------------
    PwdWorkingProfileComponent.prototype.updatePwdWorkingProfile = function () {
        var _this = this;
        this.isLoading = true;
        var formData = this.pwdWorkingProfileForm.getRawValue();
        if (formData.section_id != 'null') {
            this.officeId = formData.section_id;
        }
        else if (formData.sub_division_id != 'null') {
            this.officeId = formData.sub_division_id;
        }
        else if (formData.division_id != 'null') {
            this.officeId = formData.division_id;
        }
        else {
        }
        var pwdWorkingProfileData = {
            officeId: this.officeId,
            stackYardId: formData.stackyard_id,
            districtId: formData.district_id,
            rlyId: formData.railway_id,
            remarks: formData.remarks
        };
        console.log(pwdWorkingProfileData);
        this.authService.getPwdWorkingUserProfile(pwdWorkingProfileData).pipe(operators_1.first()).subscribe(function (res) {
            // this.router.navigate(['/dashboard'], { relativeTo: this.route });
            sweetalert2_1["default"].fire({ position: 'top-end', icon: 'success', showConfirmButton: false, timer: 3000, title: res.message });
        }, function (err) {
            _this.isLoading = false;
            sweetalert2_1["default"].fire({ position: 'top-end', icon: 'error', title: err.error.message, showConfirmButton: false, timer: 2000 });
        });
    };
    PwdWorkingProfileComponent = __decorate([
        core_1.Component({
            selector: 'app-pwd-working-profile',
            templateUrl: './pwd-working-profile.component.html',
            styleUrls: ['./pwd-working-profile.component.scss']
        })
    ], PwdWorkingProfileComponent);
    return PwdWorkingProfileComponent;
}());
exports.PwdWorkingProfileComponent = PwdWorkingProfileComponent;
