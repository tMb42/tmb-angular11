"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TenderDetailsComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var operators_1 = require("rxjs/operators");
var TenderDetailsComponent = /** @class */ (function () {
    function TenderDetailsComponent(fb, authService, tendersService, dropdownService) {
        var _this = this;
        this.fb = fb;
        this.authService = authService;
        this.tendersService = tendersService;
        this.dropdownService = dropdownService;
        this.authUser = null;
        this.tenderDetails = null;
        this.depts = [];
        this.designs = [];
        this.circles = [];
        this.divns = [];
        this.subDivns = [];
        this.sections = [];
        this.loading = false;
        this.showBoundaryLinks = true;
        this.page = 1;
        this.maxSize = 4; //Limit the maximum visible page numbers
        this.pageSizes = [5, 10, 20, 50]; //option for items per page
        this.pageSize = 5; //default items per page
        this.woDate = null;
        this.doc = null;
        this.tenderAuthority = null;
        this.officeName = null;
        this.deptShortName = null;
        this.workingOfficeId = null;
        this.sectionId = null;
        this.subDivisionId = null;
        this.divnId = null;
        this.cirId = null;
        this.designationId = null;
        this.minDate = new Date();
        this.maxDate = new Date();
        this.minDate.setDate(this.minDate.getDate() - 29200); //maximum age 80yrs
        this.maxDate.setDate(this.maxDate.getDate() - 6570); //minimum age 18yrs
        this.authService.getAuthUser().pipe(operators_1.first()).subscribe(function (response) {
            _this.authUser = response.data;
            _this.designationId = response.data.designation_id;
            _this.workingOfficeId = response.data.officeId;
            _this.sectionId = response.data.sectionId;
            _this.subDivisionId = response.data.subDivisionId;
            _this.divnId = response.data.divisionId;
            _this.cirId = response.data.circleId;
            _this.loading = false;
            if (_this.designationId == 5) {
                //get circle when auth designation is SE
                _this.pwdTenderDetailsForm.patchValue({
                    circle_id: _this.authUser.circleId
                });
                _this.dropdownService.getAllDivisionsByCircleId(_this.authUser.circleId).subscribe(function (response) {
                    _this.divns = response.divnData;
                });
            }
            else if (_this.designationId === 4) {
                //get Division when auth designation is EE
                _this.pwdTenderDetailsForm.patchValue({
                    division_id: _this.authUser.divisionId
                });
                _this.dropdownService.getAllSubDivisionsByDivisionId(_this.authUser.divisionId).subscribe(function (response) {
                    _this.subDivns = response.subDivnData;
                });
            }
            else if (_this.designationId == 3) {
                //get Sub-Division when auth designation is AE
                _this.pwdTenderDetailsForm.patchValue({
                    sub_division_id: _this.authUser.subDivisionId
                });
                _this.dropdownService.getAllSectionsBySubDivisionId(_this.authUser.subDivisionId).subscribe(function (response) {
                    _this.sections = response.SecData;
                });
            }
            else if (_this.designationId == 2) {
                //get Section when auth designation is JE
                _this.pwdTenderDetailsForm.patchValue({
                    section_id: _this.authUser.sectionId
                });
            }
            else {
                //
            }
        });
    }
    TenderDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getAllTenderDetails();
        this.authService.getAuthUserUpdateListener().subscribe(function (res) {
            _this.authUser = res.user;
            _this.loading = false;
        });
        this.tendersService.getTenderDetailsUpdateListener().subscribe(function (res) {
            _this.tenderDetails = res;
            _this.loading = false;
        });
        this.dropdownService.getDepartments().subscribe(function (response) {
            _this.depts = response.departmentData;
        });
        this.dropdownService.getTenderAuthority().subscribe(function (response) {
            _this.designs = response.designationData;
        });
        this.pwdTenderDetailsForm = this.fb.group({
            department_id: new forms_1.FormControl(null),
            circle_id: new forms_1.FormControl(null),
            division_id: new forms_1.FormControl(null),
            sub_division_id: new forms_1.FormControl(null),
            section_id: new forms_1.FormControl(null)
        });
    };
    TenderDetailsComponent.prototype.getDivisionsByCircle = function (circleId) {
        var _this = this;
        this.dropdownService.getAllDivisionsByCircleId(circleId).subscribe(function (response) {
            _this.divns = response.divnData;
        });
    };
    TenderDetailsComponent.prototype.getSubDivisionsByDivision = function (divnId) {
        var _this = this;
        this.dropdownService.getAllSubDivisionsByDivisionId(divnId).subscribe(function (response) {
            _this.subDivns = response.subDivnData;
        });
    };
    TenderDetailsComponent.prototype.getSectionsBySubDivision = function (subDivnId) {
        var _this = this;
        this.dropdownService.getAllSectionsBySubDivisionId(subDivnId).subscribe(function (response) {
            _this.sections = response.SecData;
        });
    };
    TenderDetailsComponent.prototype.getAllTenderDetails = function () {
        var _this = this;
        this.loading = true;
        var requestObj = {
            page: this.page,
            itemsPerPage: this.pageSize,
            skip: (this.page - 1) * this.pageSize
        };
        this.tendersService.getAllTenderDetails(requestObj).pipe(operators_1.first()).subscribe(function (res) {
            _this.loading = false;
            _this.tenderDetails = res.authTenderDetails.data;
            _this.totalRecords = res.authTenderDetails.total;
            _this.currentPage = res.authTenderDetails.current_page;
            _this.totalPages = res.authTenderDetails.total_pages;
        });
    };
    // getTenderAuthorityOffice(designationId: number){
    //   if(designationId == 5){
    //     this.tenderAuthority = this.designs[0].designation_alias,
    //     this.officeName = this.authUser.circleName
    //     console.log(this.tenderAuthority, this.officeName);
    //   }else if(designationId == 4){
    //     this.tenderAuthority = this.designs[1].designation_alias,
    //     this.officeName = this.authUser.divnName
    //     console.log(this.tenderAuthority, this.officeName);
    //   }else if(designationId == 3){
    //     this.tenderAuthority = this.designs[2].designation_alias,
    //     this.officeName = this.authUser.subDivnName
    //     console.log(this.tenderAuthority, this.officeName);
    //   }else{
    //   }
    // }
    TenderDetailsComponent.prototype.getSearchTableTenderDetails = function (event) {
        var _this = this;
        if (event.length > 0) {
            this.loading = true;
            this.tendersService.getSearchTenderDetailsData(event).pipe(operators_1.first()).subscribe(function (res) {
                _this.loading = false;
                _this.tenderDetails = res.tdSearch.data;
                _this.totalRecords = res.tdSearch.total;
                _this.currentPage = res.tdSearch.current_page;
                _this.totalPages = res.tdSearch.total_pages;
            });
        }
        if (event.length <= 0) {
            this.getAllTenderDetails();
        }
    };
    TenderDetailsComponent.prototype.onTableSizeChange = function (event) {
        this.pageSize = event.target.value;
        this.currentPage = this.page;
        this.getAllTenderDetails();
        console.log('Current page: ' + this.currentPage, 'Items per page: ' + this.pageSize);
    };
    TenderDetailsComponent.prototype.pageChanged = function (event) {
        this.page = event.page;
        this.pageSize = event.itemsPerPage;
        var startItem = (event.page - 1) * event.itemsPerPage + 1;
        var endItem = event.page * event.itemsPerPage;
        this.getAllTenderDetails();
        console.log('Current page: ' + event.page, 'Items per page: ' + event.itemsPerPage, 'Start item :' + startItem, 'End item :' + endItem);
    };
    TenderDetailsComponent = __decorate([
        core_1.Component({
            selector: 'app-tender-details',
            templateUrl: './tender-details.component.html',
            styleUrls: ['./tender-details.component.scss']
        })
    ], TenderDetailsComponent);
    return TenderDetailsComponent;
}());
exports.TenderDetailsComponent = TenderDetailsComponent;
