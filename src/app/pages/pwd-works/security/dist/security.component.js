"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SecurityComponent = void 0;
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var operators_1 = require("rxjs/operators");
var sweetalert2_1 = require("sweetalert2");
var SecurityComponent = /** @class */ (function () {
    function SecurityComponent(fb, authService, tendersService, router, dropdownService) {
        this.fb = fb;
        this.authService = authService;
        this.tendersService = tendersService;
        this.router = router;
        this.dropdownService = dropdownService;
        this.loading = false;
        this.expanded = false;
        this.authUser = null;
        this.tabIndex = 0;
        this.securityReleaseAction = null;
        this.fullSecurityDue = null;
        this.partSecurityReleased = null;
        this.finalSecurityReleased = null;
        this.tenderedSecurity = null;
        this.editDetails = null;
        this.dueSecurity = null;
        this.designs = [];
        this.divns = [];
        this.subDivns = [];
        this.sections = [];
        this.securityRules = [];
        this.showBoundaryLinks = true;
        this.page = 1;
        this.maxSize = 4; //Limit the maximum visible page numbers
        this.pageSizes = [10, 20, 50, 100]; //option for items per page
        this.pageSize = 10; //default items per page
        this.securityRulesOrder = null;
        this.authDesignId = null;
        this.officeId = null;
        this.designId = null;
        this.tenderId = null;
        this.dor = null;
        this.securityDueDate = null;
        this.diffDlp = null;
    }
    SecurityComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.authService.getAuthUser().pipe(operators_1.first()).subscribe(function (response) {
            _this.authUser = response.data;
            _this.newSecurityReleaseForm.patchValue({
                // division_id: this.authUser.divisionId,
                // sub_division_id: this.authUser.subDivisionId,
                authDesignId: response.data.designation_id,
                section_id: _this.authUser.sectionId,
                office_id: _this.authUser.officeId
            });
            _this.loading = false;
        });
        this.getAllAuthenticatedTenderDetailsForSecurityRelease();
        this.authService.getAuthUserUpdateListener().subscribe(function (res) {
            _this.authUser = res.user;
            _this.loading = false;
        });
        this.dropdownService.getSecurityReleasedByDesignations().subscribe(function (response) {
            _this.designs = response.designationData;
        });
        this.tendersService.getTenderSecurityDetailsListener().subscribe(function (response) {
            _this.tenderedSecurity = response;
            console.log('tenderedSecurity', _this.tenderedSecurity);
            _this.loading = false;
        });
        this.newSecurityReleaseForm = this.fb.group({
            authDesignId: new forms_1.FormControl({ value: null, disabled: true }, [forms_1.Validators.required]),
            dlp_security_releases_id: new forms_1.FormControl(null, [forms_1.Validators.required]),
            security_release_date: new forms_1.FormControl(new Date(), [forms_1.Validators.required]),
            abstract_mb: new forms_1.FormControl(null, [forms_1.Validators.required]),
            remarks: new forms_1.FormControl(null)
        });
    };
    SecurityComponent.prototype.changeDor = function (value) {
        this.dor = common_1.formatDate(value, 'yyyy-MM-dd', 'en');
    };
    SecurityComponent.prototype.getAllAuthenticatedTenderDetailsForSecurityRelease = function () {
        var _this = this;
        this.loading = true;
        var requestObj = {
            selectedOffice: this.officeId,
            designationId: this.designId,
            page: this.page,
            itemsPerPage: this.pageSize,
            skip: (this.page - 1) * this.pageSize
        };
        this.tendersService.getAllTenderDetailsAsPerAuthUserForSecurityRelease(requestObj).pipe(operators_1.first()).subscribe(function (res) {
            _this.loading = false;
            if (res.success == 1) {
                _this.fullSecurityDue = res.fullSecurityDue.data;
                _this.securityReleaseAction = res.securityReleaseAction.data;
                _this.partSecurityReleased = res.partSecurityReleased.data;
                _this.finalSecurityReleased = res.finalSecurityReleased.data;
                _this.tenderedSecurity = res.tenderedSecurity.data;
                _this.totalRecords = res.fullSecurityDue.total;
                _this.currentPage = res.fullSecurityDue.current_page;
                _this.totalPages = res.fullSecurityDue.total_pages;
            }
            else if (res.success == 0) {
                _this.loading = false;
                sweetalert2_1["default"].fire({ position: 'top-end', icon: 'warning', title: res.message, showConfirmButton: false, timer: 4000 });
            }
            else {
                //
            }
        });
    };
    SecurityComponent.prototype.onTableSizeChange = function (event) {
        this.pageSize = event.target.value;
        this.currentPage = this.page;
        this.getAllAuthenticatedTenderDetailsForSecurityRelease();
    };
    SecurityComponent.prototype.pageChanged = function (event) {
        this.page = event.page;
        this.pageSize = event.itemsPerPage;
        this.getAllAuthenticatedTenderDetailsForSecurityRelease();
    };
    SecurityComponent.prototype.getSearchTableTenderDetails = function (event) {
        var _this = this;
        if (event.length > 0) {
            this.loading = true;
            this.expanded = false;
            this.tendersService.getSearchTenderSecurityDetailsData(event).pipe(operators_1.first()).subscribe(function (res) {
                _this.loading = false;
                _this.tenderedSecurity = res.tdSearch.data;
                _this.fullSecurityDue = res.tdSearch.data;
                _this.totalRecords = res.tdSearch.total;
                _this.currentPage = res.tdSearch.current_page;
                _this.totalPages = res.tdSearch.total_pages;
            });
        }
        if (event.length <= 0) {
            this.expanded = false;
            this.getAllAuthenticatedTenderDetailsForSecurityRelease();
        }
    };
    SecurityComponent.prototype.formResetwithclose = function () {
        this.expanded = false;
    };
    SecurityComponent.prototype.getTenderDetailsById = function (tenderId) {
        var _this = this;
        this.loading = true;
        this.expanded = true;
        var requestObj = {
            tender_id: tenderId
        };
        this.tendersService.getSecurityReleasedDetailsByTenderId(requestObj).subscribe(function (x) {
            _this.loading = false;
            _this.dueSecurity = x.securityDue;
            _this.securityRules = x.securityRules;
            _this.securityDueDate = x.securityDueDate;
            _this.diffDlp = x.diffDlp;
            _this.securityRulesOrder = x.securityRules[0].remarks;
            _this.tenderId = x.tenderDetails[0].id;
            _this.newSecurityReleaseForm.patchValue(x.tenderDetails);
            _this.editDetails = x.tenderDetails[0];
            if (x.success === 0) {
                sweetalert2_1["default"].fire({ position: 'top-end', icon: 'warning', showConfirmButton: false, timer: 4000, title: x.message });
            }
        });
    };
    SecurityComponent.prototype.saveSecurityReleaseDetails = function () {
        var _this = this;
        this.loading = true;
        var formData = this.newSecurityReleaseForm.getRawValue();
        var detailsData = {
            tender_id: this.tenderId,
            designationId: formData.authDesignId,
            dlpSRId: formData.dlp_security_releases_id,
            securityReleaseDate: this.dor,
            abstMb: formData.abstract_mb,
            remarks: formData.remarks
        };
        this.tendersService.saveNewSecurityReleaseDetails(detailsData).subscribe(function (res) {
            _this.loading = false;
            // this.formReset();
            if (res.success === 1) {
                _this.tabIndex = 4;
                _this.expanded = false;
                sweetalert2_1["default"].fire({ position: 'top-end', icon: 'success', showConfirmButton: false, timer: 3000, title: 'Security Released successfully from this end.' });
            }
            else if (res.success === 0) {
                _this.expanded = true;
                sweetalert2_1["default"].fire({ position: 'top-end', icon: 'warning', showConfirmButton: false, timer: 4000, title: "Validation Error" });
            }
            else {
                sweetalert2_1["default"].fire({ position: 'top-end', icon: 'error', title: res.error, showConfirmButton: false,
                    timer: 3000
                });
            }
        }, function (err) {
            console.log('ghfhf', err);
            _this.loading = false;
            sweetalert2_1["default"].fire({ position: 'top-end', icon: 'error', title: err.error, showConfirmButton: false, timer: 3000 });
        });
    };
    SecurityComponent = __decorate([
        core_1.Component({
            selector: 'app-security',
            templateUrl: './security.component.html',
            styleUrls: ['./security.component.scss']
        })
    ], SecurityComponent);
    return SecurityComponent;
}());
exports.SecurityComponent = SecurityComponent;
