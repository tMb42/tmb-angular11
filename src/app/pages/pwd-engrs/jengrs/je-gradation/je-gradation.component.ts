import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { first } from 'rxjs/operators';

import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { JengrsService } from '../../../../services/jengrs.service';
import { JEngrs } from 'src/app/models/jengrs.model';


@Component({
  selector: 'app-je-gradation',
  templateUrl: './je-gradation.component.html',
  styleUrls: ['./je-gradation.component.scss']
})
export class JeGradationComponent implements OnInit {
  showBoundaryLinks = true;
  page: number = 1;
  currentPage: number;
  maxSize: number = 4;      //Limit the maximum visible page numbers
  pageSize: number = 10;     //default items per page
  pageSizes = [10, 20, 50, 100, 200];  //option for items per page
  totalPages: number;
  totalRecords: number;
  
  juniorEngineers: JEngrs[] = [];
  JeGradationDateLists: any = [];
  SelectedJeGradationWef: any = [];
  gradationDate: string = null;
  loading = false; 

  constructor( private jengrsService: JengrsService) {
  
  }

  ngOnInit(): void {
    this.jeLatestGradations();
  }

  jeLatestGradations(){
    this.loading = true;
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
    }

    this.jengrsService.getJeLatestGradations(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.SelectedJeGradationWef = res.jeLatestTotal[0];
      this.JeGradationDateLists = res.jeGradationDate;
      this.juniorEngineers = res.juniorEngineer.data;

      this.totalRecords = res.jeLatestTotal[0].total;
      this.totalPages = res.juniorEngineer.total_pages;
      this.currentPage = res.juniorEngineer.current_page;
    });

  }

  onTableSizeChange(event): void {
    this.pageSize = event.target.value;
    this.currentPage = this.page;
    this.jeLatestGradations();

    console.log('Current page: ' + this.currentPage, 'Items per page: ' + this.pageSize);
  }
  
  pageChanged(event: PageChangedEvent): void {
    this.page = event.page;
    this.pageSize = event.itemsPerPage;
    
    const startItem = (event.page - 1) * event.itemsPerPage + 1;
    const endItem = event.page * event.itemsPerPage;
    this.jeLatestGradations();
    
    console.log('Current page: ' + event.page, 'Items per page: ' + event.itemsPerPage, 'Start item :' + startItem, 'End item :' + endItem);
  }

jeGradationListByWef(value : Date): void{
    console.log(value);
    this.gradationDate = formatDate(value, 'yyyy-MM-dd', 'en');
    this.loading = true;

    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      wef: this.gradationDate,
    }

    console.log(requestObj);
    this.jengrsService.getJeGradationListByWef(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.SelectedJeGradationWef = res.jeLatestTotal[0];
      this.juniorEngineers = res.juniorEngineer.data;
      this.JeGradationDateLists = res.jeGradationDate;
      
      this.totalRecords = res.seLatestTotal[0].total;
      this.totalPages = res.juniorEngineer.total_pages;
      this.currentPage = res.juniorEngineer.current_page;
      
    });
  }

  getSearchTableData(event: any){
    if(event.length > 0){
      this.loading = true;
      this.jengrsService.getSearchData(event).pipe(first()).subscribe((res:any) => {
        this.loading = false;
        this.juniorEngineers = res.juniorEngineer.data;
      });
    }
    if(event.length <= 0){
      this.jeLatestGradations();
    }

  }

}
