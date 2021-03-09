import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { JengrsService } from 'src/app/services/jengrs.service';

@Component({
  selector: 'app-je-promotion',
  templateUrl: './je-promotion.component.html',
  styleUrls: ['./je-promotion.component.scss']
})
export class JePromotionComponent implements OnInit {  
  
  showBoundaryLinks = true;
  page: number = 1;
  currentPage: number;
  maxSize: number = 4;      //Limit the maximum visible page numbers
  pageSize: number = 10;     //default items per page
  pageSizes = [10, 20, 50, 100, 200];  //option for items per page
  totalPages: number;
  totalRecords: number;
  skip: number;
  
  JePromotionalList: any = [];
  JeCalculatedData: any = [];
  Je50PointRosterPromo: any = [];
  JePromotionalTotal: any = 0;
  loading = false;
  expanded = false;
  panelOpenState = true;

  constructor(private jengrsService: JengrsService) { 
    this.getJePromotionalList();
  }

  ngOnInit(): void {
    this.getJePromotionalList();
  }

  getJePromotionalList(){
    this.loading = true;
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      skip: (this.page-1) * this.pageSize
    }
    console.log(requestObj);

    this.jengrsService.getJePromotionalDetails(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.JePromotionalTotal = res.jePromotionalTotal[0];
      this.JePromotionalList = res.jePromoList;
      this.totalRecords = res.jePromotionalTotal[0].total;
    });

  }

  getJePromoScopeByPostNo(scopeNo: number){
    if(scopeNo>0){
      this.loading = true;    
      this.jengrsService.getCurrentJePromotionalList(scopeNo).pipe(first()).subscribe((res:any) => {
        this.expanded = true;
        this.loading = false;
        this.JePromotionalList = res.jeFinalPromoList;
        this.JeCalculatedData = res.jePromoData;
        this.Je50PointRosterPromo = res.je50PointRosterPromoList;
      });
    }else{
      this.expanded = false;
      this.getJePromotionalList();
    }

  }

  onTableSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.currentPage = this.page;
    this.getJePromotionalList();

    console.log('Current page: ' + this.currentPage, 'Items per page: ' + this.pageSize);
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.pageSize = event.itemsPerPage;
    const startItem = (event.page - 1) * event.itemsPerPage + 1;
    const endItem = event.page * event.itemsPerPage;
    this.getJePromotionalList();
    
    console.log('Current page: ' + event.page, 'Items per page: ' + event.itemsPerPage, 'Start item :' + startItem, 'End item :' + endItem);
  }

  

  getSearchTableData(event: any){
    if(event.length > 0){
      this.loading = true;
      this.jengrsService.getJeSearchablePromoTableData(event).pipe(first()).subscribe((res:any) => {
        this.loading = false;
        this.JePromotionalList = res.jePromoSearch;
      });
    }
    if(event.length <= 0){
      this.getJePromotionalList();
    }

  }

}
