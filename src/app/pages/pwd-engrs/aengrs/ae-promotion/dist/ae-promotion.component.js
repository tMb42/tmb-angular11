"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AePromotionComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var operators_1 = require("rxjs/operators");
var AePromotionComponent = /** @class */ (function () {
    function AePromotionComponent(fb, aengrsService) {
        this.fb = fb;
        this.aengrsService = aengrsService;
        this.showBoundaryLinks = true;
        this.page = 1;
        this.maxSize = 4; //Limit the maximum visible page numbers
        this.pageSize = 10; //default items per page
        this.pageSizes = [10, 20, 50, 100, 200]; //option for items per page
        this.AePromotionalList = [];
        this.AeCalculatedData = [];
        this.Ae50PointRosterPromo = [];
        this.AePromotionalTotal = 0;
        this.AeConfirmYear = '';
        this.loading = false;
        this.expanded = false;
        this.panelOpenState = true;
    }
    AePromotionComponent.prototype.ngOnInit = function () {
        this.getAePromotionalList();
        this.AePassedForm = this.fb.group({
            aeConfirmYear: new forms_1.FormControl(null)
        });
    };
    AePromotionComponent.prototype.getAePromotionalList = function () {
        var _this = this;
        this.loading = true;
        var requestObj = {
            page: this.page,
            itemsPerPage: this.pageSize,
            skip: (this.page - 1) * this.pageSize
        };
        this.aengrsService.getAePromotionalDetails(requestObj).pipe(operators_1.first()).subscribe(function (res) {
            _this.loading = false;
            _this.AePromotionalTotal = res.aePromotionalTotal[0].total;
            _this.AePromotionalList = res.aePromoList;
            _this.totalRecords = res.aePromotionalTotal[0].total;
        });
    };
    AePromotionComponent.prototype.getAePromoScopeByPostNo = function (scopeNo) {
        var _this = this;
        if (scopeNo > 0) {
            this.loading = true;
            this.aengrsService.getCurrentAePromotionalList(scopeNo).pipe(operators_1.first()).subscribe(function (res) {
                _this.expanded = true;
                _this.loading = false;
                _this.AePromotionalList = res.aeFinalPromoList;
                _this.AeCalculatedData = res.aePromoData;
                _this.Ae50PointRosterPromo = res.ae50PointRosterPromoList;
            });
        }
        else {
            this.expanded = false;
            this.getAePromotionalList();
        }
    };
    AePromotionComponent.prototype.onTableSizeChange = function (event) {
        this.pageSize = event.target.value;
        this.currentPage = this.page;
        this.getAePromotionalList();
    };
    AePromotionComponent.prototype.pageChanged = function (event) {
        this.page = event.page;
        this.pageSize = event.itemsPerPage;
        var startItem = (event.page - 1) * event.itemsPerPage + 1;
        var endItem = event.page * event.itemsPerPage;
        this.getAePromotionalList();
        console.log('Current page: ' + event.page, 'Items per page: ' + event.itemsPerPage, 'Start item :' + startItem, 'End item :' + endItem);
    };
    AePromotionComponent.prototype.getSearchTableData = function (event) {
        var _this = this;
        if (event.length > 0) {
            this.loading = true;
            this.aengrsService.getAeSearchablePromoTableData(event).pipe(operators_1.first()).subscribe(function (res) {
                _this.loading = false;
                _this.AePromotionalList = res.aePromoSearch;
            });
        }
        if (event.length <= 0) {
            this.getAePromotionalList();
        }
    };
    AePromotionComponent = __decorate([
        core_1.Component({
            selector: 'app-ae-promotion',
            templateUrl: './ae-promotion.component.html',
            styleUrls: ['./ae-promotion.component.scss']
        })
    ], AePromotionComponent);
    return AePromotionComponent;
}());
exports.AePromotionComponent = AePromotionComponent;
