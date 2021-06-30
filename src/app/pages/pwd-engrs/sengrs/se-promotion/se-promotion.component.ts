import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { SEngrs } from '../../../../models/sengrs.model';
import { SengrsService } from '../../../../services/sengrs.service';

@Component({
  selector: 'app-se-promotion',
  templateUrl: './se-promotion.component.html',
  styleUrls: ['./se-promotion.component.scss']
})
export class SePromotionComponent implements OnInit {
  sePromoForm: FormGroup;

  showBoundaryLinks = true;
  page: number = 1;
  currentPage: number;
  maxSize: number = 4;      //Limit the maximum visible page numbers
  pageSize: number = 10;     //default items per page
  pageSizes = [10, 20, 50, 100, 200];  //option for items per page
  totalPages: number;
  totalRecords: number;

  SePromotionalList: SEngrs[] = [];
  Designations: any = [];
  SeCalculatedData: any = [];
  Se50PointRosterPromo: any = [];
  SePromotionalTotal: number = null;
  SelectedDesignation: string = null;

  designation: any = null;
  SeInServiceTotal: any = 0;

  loading = false;
  expanded = false;
  panelOpenState = true;

  constructor(private sengrsService: SengrsService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getSeDesignationList();

    this.sePromoForm = this.fb.group({
      designation: new FormControl(null),
    });

  }

  getSeDesignationList(){
    this.loading = true;
    this.sengrsService.getDesignations().pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.Designations = res.designations;
    });

  }

  sePromoListByDesignation(event: any){
    this.loading = true;
    const requestObj = {
      designationId: event,
      page: this.page,
      itemsPerPage: this.pageSize,
      skip: (this.page-1) * this.pageSize
    }

    this.sengrsService.getSePromotionalDetails(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.SePromotionalTotal = res.sePromoTotal[0].total;
      this.SelectedDesignation = res.selectedDesignation[0].designation_name;
      this.SePromotionalList = res.sePromoList;
      this.totalRecords = res.sePromoTotal[0].total;
    });

  }

  getSePromoScopeByPostNo(event: number){
    if(event>0){
      this.loading = true;
      const requestObj = {
        designationId: this.designation,
        scopeNo: event,
        page: this.page,
        itemsPerPage: this.pageSize,
        skip: (this.page-1) * this.pageSize
      }

      this.sengrsService.getCurrentSePromotionalList(requestObj).pipe(first()).subscribe((res:any) => {
        this.expanded = true;
        this.loading = false;
        this.SePromotionalList = res.seFinalPromoList;
        this.SeCalculatedData = res.sePromoData;
        this.Se50PointRosterPromo = res.se50PointRosterPromoList;
        this.totalRecords = event;
      });
    }else{
      this.expanded = false;
    }

  }

  onTableSizeChange(event: any): void {
    this.loading = true;

    this.pageSize = event.target.value;
    this.currentPage = this.page;

    const requestObj = {
      designationId: this.designation,
      page: this.page,
      itemsPerPage: this.pageSize,
      skip: (this.page-1) * this.pageSize
    }
    this.sengrsService.getSePromotionalDetails(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.SePromotionalTotal = res.sePromoTotal[0].total;
      this.SePromotionalList = res.sePromoList;
      this.totalRecords = res.sePromoTotal[0].total;
    });


  }

  pageChanged(event: any): void {
    this.loading = true;
    this.page = event.page;
    this.pageSize = event.itemsPerPage;
    const requestObj = {
      designationId: this.designation,
      page: this.page,
      itemsPerPage: this.pageSize,
      skip: (this.page-1) * this.pageSize
    }

    this.sengrsService.getSePromotionalDetails(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.SePromotionalTotal = res.sePromoTotal[0].total;
      this.SePromotionalList = res.sePromoList;
      this.totalRecords = res.sePromoTotal[0].total;
    });
  }

  getSearchTableData(event: any){
    if(event.length > 0){
      this.loading = true;
      this.sengrsService.getSeSearchablePromoTableData(event).pipe(first()).subscribe((res:any) => {
        this.loading = false;
        this.SePromotionalList = res.sePromoSearch;
      });
    }
    if(event.length <= 0){
      this.loading = false;

    }

  }

}
