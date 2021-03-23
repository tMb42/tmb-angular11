import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AEngrs } from 'src/app/models/aengrs.model';
import { AengrsService } from 'src/app/services/aengrs.service';

@Component({
  selector: 'app-ae-promotion',
  templateUrl: './ae-promotion.component.html',
  styleUrls: ['./ae-promotion.component.scss']
})
export class AePromotionComponent implements OnInit {
  AePassedForm: FormGroup;

  showBoundaryLinks = true;
  page: number = 1;
  currentPage: number;
  maxSize: number = 4;      //Limit the maximum visible page numbers
  pageSize: number = 10;     //default items per page
  pageSizes = [10, 20, 50, 100, 200];  //option for items per page
  totalPages: number;
  totalRecords: number;
  skip: number;
  
  AePromotionalList: AEngrs[] = [];
  AeCalculatedData: any = [];
  Ae50PointRosterPromo: any = [];
  AePromotionalTotal: number = 0;
  AeConfirmYear: string = '';
  
  loading = false;
  expanded = false;
  panelOpenState = true;

  constructor(private fb: FormBuilder, private aengrsService: AengrsService) { }

  ngOnInit(): void {
    this.getAePromotionalList();

    this.AePassedForm = this.fb.group({
      aeConfirmYear: new FormControl(null),
    });

  }

  getAePromotionalList(){
    this.loading = true;
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      skip: (this.page-1) * this.pageSize
    }
   
    this.aengrsService.getAePromotionalDetails(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.AePromotionalTotal = res.aePromotionalTotal[0].total;
      this.AePromotionalList = res.aePromoList;
      this.totalRecords = res.aePromotionalTotal[0].total;
    });

  }

  getAePromoScopeByPostNo(scopeNo: number){
    if(scopeNo>0){
      this.loading = true;    
      this.aengrsService.getCurrentAePromotionalList(scopeNo).pipe(first()).subscribe((res:any) => {
        this.expanded = true;
        this.loading = false;
        this.AePromotionalList = res.aeFinalPromoList;
        this.AeCalculatedData = res.aePromoData;
        this.Ae50PointRosterPromo = res.ae50PointRosterPromoList;
      });
    }else{
      this.expanded = false;
      this.getAePromotionalList();
    }

  }
     
  onTableSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.currentPage = this.page;
    this.getAePromotionalList();
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.pageSize = event.itemsPerPage;
    const startItem = (event.page - 1) * event.itemsPerPage + 1;
    const endItem = event.page * event.itemsPerPage;
    this.getAePromotionalList();
    
    console.log('Current page: ' + event.page, 'Items per page: ' + event.itemsPerPage, 'Start item :' + startItem, 'End item :' + endItem);
  }

  getSearchTableData(event: any){
    if(event.length > 0){
      this.loading = true;
      this.aengrsService.getAeSearchablePromoTableData(event).pipe(first()).subscribe((res:any) => {
        this.loading = false;
        this.AePromotionalList = res.aePromoSearch;
      });
    }
    if(event.length <= 0){
      this.getAePromotionalList();
    }

  }

}

