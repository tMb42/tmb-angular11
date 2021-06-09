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
        this.expanded = false;
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
        this.deptId = null;
        this.authDesignId = null;
        this.officeId = null;
        this.designId = null;
        this.tenderOfficeDetails = null;
        this.minDate = new Date();
        this.maxDate = new Date();
        this.minDate.setDate(this.minDate.getDate() - 29200); //maximum age 80yrs
        this.maxDate.setDate(this.maxDate.getDate() - 6570); //minimum age 18yrs
        this.authService.getAuthUser().pipe(operators_1.first()).subscribe(function (response) {
            _this.authUser = response.data;
            _this.authDesignId = response.data.designation_id;
            _this.workingOfficeId = response.data.officeId;
            _this.sectionId = response.data.sectionId;
            _this.subDivisionId = response.data.subDivisionId;
            _this.divnId = response.data.divisionId;
            _this.cirId = response.data.circleId;
            _this.deptId = _this.authUser.department_id;
            _this.loading = false;
            if (_this.authDesignId == 6) {
                //get Division when auth designation is SE
                _this.tendersService.getValidCirclesByDeprtId(_this.authUser.department_id).subscribe(function (response) {
                    _this.circles = response.circleData;
                });
            }
            else if (_this.authDesignId == 5) {
                //get Division when auth designation is SE
                _this.tendersService.getValidDivisionsByCircleId(_this.authUser.circleId).subscribe(function (response) {
                    _this.divns = response.divnData;
                });
            }
            else if (_this.authDesignId === 4) {
                // get Sub-Division when auth designation is EE
                _this.tendersService.getValidSubDivisionsByDivisionId(_this.authUser.divisionId).subscribe(function (response) {
                    _this.subDivns = response.subDivnData;
                });
            }
            else if (_this.authDesignId == 3) {
                //get Section when auth designation is AE
                _this.tendersService.getValidSectionsBySubDivisionId(_this.authUser.subDivisionId).subscribe(function (response) {
                    _this.sections = response.SecData;
                });
            }
            else if (_this.authDesignId == 2) {
                //get Section when auth designation is JE
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
        // this.dropdownService.getDepartments().subscribe((response: { departmentData: Department[]; }) => {
        //   this.depts = response.departmentData;
        // });
        // this.dropdownService.getTenderAuthority().subscribe((response: { designationData: Designation[]; }) => {
        //   this.designs = response.designationData;
        // });
        this.pwdTenderDetailsForm = this.fb.group({
            department_id: new forms_1.FormControl(null),
            circle_id: new forms_1.FormControl(null),
            division_id: new forms_1.FormControl(null),
            sub_division_id: new forms_1.FormControl(null),
            section_id: new forms_1.FormControl(null)
        });
    };
    TenderDetailsComponent.prototype.getCirclesByDeprtment = function (dptId, design_Id) {
        var _this = this;
        this.officeId = dptId;
        this.designId = design_Id;
        this.tendersService.getValidCirclesByDeprtId(dptId).subscribe(function (response) {
            _this.circles = response.circleData;
        });
    };
    TenderDetailsComponent.prototype.getDivisionsByCircle = function (circleId, design_Id) {
        var _this = this;
        this.officeId = circleId;
        this.designId = design_Id;
        this.tendersService.getValidDivisionsByCircleId(circleId).subscribe(function (response) {
            _this.divns = response.divnData;
        });
    };
    TenderDetailsComponent.prototype.getSubDivisionsByDivision = function (divnId, design_Id) {
        var _this = this;
        this.officeId = divnId;
        this.designId = design_Id;
        this.tendersService.getValidSubDivisionsByDivisionId(divnId).subscribe(function (response) {
            _this.subDivns = response.subDivnData;
        });
    };
    TenderDetailsComponent.prototype.getSectionsBySubDivision = function (subDivnId, design_Id) {
        var _this = this;
        this.officeId = subDivnId;
        this.designId = design_Id;
        this.tendersService.getValidSectionsBySubDivisionId(subDivnId).subscribe(function (response) {
            _this.sections = response.SecData;
        });
    };
    TenderDetailsComponent.prototype.getOfficeAndDesignationBySection = function (sectionId, design_Id) {
        this.officeId = sectionId;
        this.designId = design_Id;
    };
    TenderDetailsComponent.prototype.getAllTenderDetails = function () {
        var _this = this;
        this.loading = true;
        var requestObj = {
            page: this.page,
            itemsPerPage: this.pageSize,
            selectedOffice: this.officeId,
            designationId: this.designId
        };
        this.tendersService.getAllTenderDetailsAsPerAuthUser(requestObj).pipe(operators_1.first()).subscribe(function (res) {
            _this.loading = false;
            _this.tenderDetails = res.authTenderDetails.data;
            _this.tenderOfficeDetails = res.tenderTotal[0];
            _this.totalRecords = res.authTenderDetails.total;
            _this.currentPage = res.authTenderDetails.current_page;
            _this.totalPages = res.authTenderDetails.total_pages;
        });
    };
    TenderDetailsComponent.prototype.getTenderDetailsByOffice = function (office_Id, design_Id) {
        var _this = this;
        if (design_Id == 5) {
            var requestObj = {
                page: this.page,
                itemsPerPage: this.pageSize,
                selectedOffice: office_Id,
                designationId: design_Id
            };
            this.tendersService.getTenderDetailsByOfficeId(requestObj).pipe(operators_1.first()).subscribe(function (res) {
                _this.loading = false;
                _this.tenderDetails = res.selectedTenderDetails.data;
                _this.tenderOfficeDetails = res.tenderTotal[0];
                _this.totalRecords = res.selectedTenderDetails.total;
                _this.currentPage = res.selectedTenderDetails.current_page;
                _this.totalPages = res.selectedTenderDetails.total_pages;
            });
        }
        else if (design_Id == 4) {
            var requestObj = {
                page: this.page,
                itemsPerPage: this.pageSize,
                selectedOffice: office_Id,
                designationId: design_Id
            };
            this.tendersService.getTenderDetailsByOfficeId(requestObj).pipe(operators_1.first()).subscribe(function (res) {
                _this.loading = false;
                _this.tenderDetails = res.selectedTenderDetails.data;
                _this.tenderOfficeDetails = res.tenderTotal[0];
                _this.totalRecords = res.selectedTenderDetails.total;
                _this.currentPage = res.selectedTenderDetails.current_page;
                _this.totalPages = res.selectedTenderDetails.total_pages;
            });
        }
        else if (design_Id == 3) {
            var requestObj = {
                page: this.page,
                itemsPerPage: this.pageSize,
                selectedOffice: office_Id,
                designationId: design_Id
            };
            this.tendersService.getTenderDetailsByOfficeId(requestObj).pipe(operators_1.first()).subscribe(function (res) {
                _this.loading = false;
                _this.tenderDetails = res.selectedTenderDetails.data;
                _this.tenderOfficeDetails = res.tenderTotal[0];
                _this.totalRecords = res.selectedTenderDetails.total;
                _this.currentPage = res.selectedTenderDetails.current_page;
                _this.totalPages = res.selectedTenderDetails.total_pages;
            });
        }
        else if (design_Id == 2) {
            var requestObj = {
                page: this.page,
                itemsPerPage: this.pageSize,
                selectedOffice: office_Id,
                designationId: design_Id
            };
            this.tendersService.getTenderDetailsByOfficeId(requestObj).pipe(operators_1.first()).subscribe(function (res) {
                _this.loading = false;
                _this.tenderDetails = res.selectedTenderDetails.data;
                _this.tenderOfficeDetails = res.tenderTotal[0];
                _this.totalRecords = res.selectedTenderDetails.total;
                _this.currentPage = res.selectedTenderDetails.current_page;
                _this.totalPages = res.selectedTenderDetails.total_pages;
            });
        }
        else {
        }
    };
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
    };
    TenderDetailsComponent.prototype.pageChanged = function (event) {
        this.page = event.page;
        this.pageSize = event.itemsPerPage;
        this.getAllTenderDetails();
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
