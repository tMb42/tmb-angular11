"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AssistantEngrsComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var operators_1 = require("rxjs/operators");
var sweetalert2_1 = require("sweetalert2");
var common_1 = require("@angular/common");
var AssistantEngrsComponent = /** @class */ (function () {
    function AssistantEngrsComponent(fb, dropdownService, aengrsService) {
        this.fb = fb;
        this.dropdownService = dropdownService;
        this.aengrsService = aengrsService;
        this.showBoundaryLinks = true;
        this.page = 1;
        this.maxSize = 4; //Limit the maximum visible page numbers
        this.pageSize = 10; //default items per page
        this.pageSizes = [10, 20, 50, 100, 200]; //option for items per page
        this.castes = [];
        this.AeGradationDateLists = [];
        this.SelectedAeGradationWef = '';
        this.gradationDate = '';
        this.loading = false;
        this.aeDob = null;
        this.aeDoj = null;
        this.aeDoc = null;
        this.aeDor = null;
        this.eehs = null;
        this.gwef = null;
        this.minDate = new Date();
        this.maxDate = new Date();
        this.minDate.setDate(this.minDate.getDate() - 29200); //maximum age 80yrs
        this.maxDate.setDate(this.maxDate.getDate() - 6570); //minimum age 18yrs
    }
    AssistantEngrsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loading = true;
        this.aeLatestGradations();
        this.dropdownService.getCastes().subscribe(function (response) {
            _this.castes = response.castes;
        });
        this.aengrsService.getAeUpdateListener().subscribe(function (res) {
            _this.loading = false;
            console.log('2', res);
            _this.aEngrs = res;
        });
        this.aeUpdateForm = this.fb.group({
            id: [null, forms_1.Validators.required],
            gradation_sl_no: [null, forms_1.Validators.required],
            engineer_name: [null, forms_1.Validators.required],
            employee_caste_id: [null, forms_1.Validators.required],
            engineer_dob: [null, forms_1.Validators.required],
            assistant_engineers_doj: null,
            assistant_engineers_doc: null,
            engineer_dor: [null, forms_1.Validators.required],
            ee_higher_scale_date: null,
            service_status: null,
            notes: null,
            joining_time: null,
            gradation_list_wef: [null, forms_1.Validators.required],
            display: [null, forms_1.Validators.required],
            inforce: [null, forms_1.Validators.required]
        });
    };
    AssistantEngrsComponent.prototype.getEngrsDetailsById = function (event) {
        var _this = this;
        this.loading = true;
        this.aengrsService.getAeDetailsById(event).pipe(operators_1.first()).subscribe(function (x) {
            _this.loading = false;
            _this.aeUpdateForm.patchValue(x.ae);
        });
    };
    AssistantEngrsComponent.prototype.changeDob = function (value) {
        this.aeDob = common_1.formatDate(value, 'yyyy-MM-dd', 'en');
    };
    AssistantEngrsComponent.prototype.changeDoj = function (value) {
        this.aeDoj = common_1.formatDate(value, 'yyyy-MM-dd', 'en');
    };
    AssistantEngrsComponent.prototype.changeDoc = function (value) {
        this.aeDoc = common_1.formatDate(value, 'yyyy-MM-dd', 'en');
        console.log('2422', this.aeDoc);
    };
    AssistantEngrsComponent.prototype.changeDor = function (value) {
        this.aeDor = common_1.formatDate(value, 'yyyy-MM-dd', 'en');
    };
    AssistantEngrsComponent.prototype.changeEehs = function (value) {
        this.eehs = common_1.formatDate(value, 'yyyy-MM-dd', 'en');
        console.log('222', this.eehs);
    };
    AssistantEngrsComponent.prototype.changeGwef = function (value) {
        this.gwef = common_1.formatDate(value, 'yyyy-MM-dd', 'en');
    };
    AssistantEngrsComponent.prototype.updateAeData = function () {
        var _this = this;
        this.loading = true;
        var formData = this.aeUpdateForm.getRawValue();
        var updateAeData = {
            id: formData.id,
            grdnSl: formData.gradation_sl_no,
            engrName: formData.engineer_name,
            caste: formData.employee_caste_id,
            jnTime: formData.joining_time,
            serviceStatus: formData.service_status,
            display: formData.display,
            inforce: formData.inforce,
            notes: formData.notes,
            birthDate: this.aeDob,
            doj: this.aeDoj,
            doc: this.aeDoc,
            dor: this.aeDor,
            eeHgrScale: this.eehs,
            wef: this.gwef
        };
        console.log('update', updateAeData);
        this.aengrsService.aeUpdateDataById(updateAeData).subscribe(function () {
            _this.loading = false;
            sweetalert2_1["default"].fire({ position: 'top-end', icon: 'success', title: 'AE Data Updated successfully', showConfirmButton: false, timer: 2000 });
        }, function (err) {
            _this.loading = false;
            sweetalert2_1["default"].fire({ position: 'top-end', icon: 'error', title: err, showConfirmButton: false, timer: 4000 });
        });
    };
    AssistantEngrsComponent.prototype.aeLatestGradations = function () {
        var _this = this;
        this.loading = true;
        var requestObj = {
            page: this.page,
            itemsPerPage: this.pageSize,
            wef: this.gradationDate
        };
        console.log(requestObj);
        this.aengrsService.getAeLatestGradations(requestObj).pipe(operators_1.first()).subscribe(function (res) {
            _this.loading = false;
            _this.SelectedAeGradationWef = res.aeLatestTotal[0];
            _this.AeGradationDateLists = res.aeGradationDate;
            _this.aEngrs = res.assistantEngineers.data;
            _this.totalRecords = res.aeLatestTotal[0].total;
            _this.totalPages = res.assistantEngineers.total_pages;
            _this.currentPage = res.assistantEngineers.current_page;
        });
    };
    AssistantEngrsComponent.prototype.onTableSizeChange = function (event) {
        this.pageSize = event.target.value;
        this.currentPage = this.page;
        this.aeLatestGradations();
        console.log('Current page: ' + this.currentPage, 'Items per page: ' + this.pageSize);
    };
    AssistantEngrsComponent.prototype.pageChanged = function (event) {
        this.page = event.page;
        this.pageSize = event.itemsPerPage;
        this.aeLatestGradations();
    };
    AssistantEngrsComponent.prototype.aeGradationListByWef = function (event) {
        var _this = this;
        this.loading = true;
        var requestObj = {
            page: this.page,
            itemsPerPage: this.pageSize,
            wef: event
        };
        this.aengrsService.getAeGradationListByWef(requestObj).pipe(operators_1.first()).subscribe(function (res) {
            _this.loading = false;
            _this.SelectedAeGradationWef = res.aeSelectedTotal[0];
            _this.aEngrs = res.assistantEngineers.data;
            _this.AeGradationDateLists = res.aeGradationDate;
            _this.totalRecords = res.assistantEngineers.total;
            _this.totalPages = res.assistantEngineers.total_pages;
            _this.currentPage = res.assistantEngineers.current_page;
            _this.aeUpdateForm.patchValue({
                gradation_list_wef: _this.SelectedAeGradationWef.gradation_list_wef
            });
        });
    };
    AssistantEngrsComponent.prototype.getSearchTableData = function (event) {
        var _this = this;
        if (event.length > 0) {
            this.loading = true;
            this.aengrsService.getSearchData(event).pipe(operators_1.first()).subscribe(function (res) {
                _this.loading = false;
                _this.aEngrs = res.assistantEngineers.data;
                _this.totalRecords = res.assistantEngineers.total;
                _this.totalPages = res.assistantEngineers.total_pages;
                _this.currentPage = res.assistantEngineers.current_page;
            });
        }
        if (event.length <= 0) {
            this.aeLatestGradations();
        }
    };
    AssistantEngrsComponent.prototype.formReset = function () {
        this.aeUpdateForm.reset();
    };
    AssistantEngrsComponent = __decorate([
        core_1.Component({
            selector: 'app-assistant-engrs',
            templateUrl: './assistant-engrs.component.html',
            styleUrls: ['./assistant-engrs.component.scss']
        })
    ], AssistantEngrsComponent);
    return AssistantEngrsComponent;
}());
exports.AssistantEngrsComponent = AssistantEngrsComponent;
