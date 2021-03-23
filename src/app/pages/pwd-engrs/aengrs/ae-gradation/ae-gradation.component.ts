import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { first } from 'rxjs/operators';
import { AEngrs } from '../../../../models/aengrs.model';
import { AengrsService } from '../../../../services/aengrs.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';


@Component({
  selector: 'app-ae-gradation',
  templateUrl: './ae-gradation.component.html',
  styleUrls: ['./ae-gradation.component.scss']
})

export class AeGradationComponent implements OnInit {
  showBoundaryLinks = true;
  page: number = 1;
  currentPage: number;
  maxSize: number = 4;      //Limit the maximum visible page numbers
  pageSize: number = 10;     //default items per page
  pageSizes = [10, 20, 50, 100, 200];  //option for items per page
  totalPages: number;
  totalRecords: number;
  
  assistantEngineers: AEngrs[] = [];
  AeGradationDateLists: any = [];
  SelectedAeGradationWef: any = '';
  gradationDate: any = '';
  loading = false; 

  constructor(private fb: FormBuilder, private aengrsService: AengrsService) { }

  ngOnInit(): void {
    this.aeLatestGradations();
  }

  aeLatestGradations(){
    this.loading = true;
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      wef: this.gradationDate,
    }
    console.log(requestObj);

    this.aengrsService.getAeLatestGradations(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.SelectedAeGradationWef = res.aeLatestTotal[0];
      this.AeGradationDateLists = res.aeGradationDate;
      this.assistantEngineers = res.assistantEngineers.data;

      this.totalRecords = res.aeLatestTotal[0].total;
      this.totalPages = res.assistantEngineers.total_pages;
      this.currentPage = res.assistantEngineers.current_page;

    });

  }

  onTableSizeChange(event): void {
    this.pageSize = event.target.value;
    this.currentPage = this.page;
    this.aeLatestGradations();
    console.log('Current page: ' + this.currentPage, 'Items per page: ' + this.pageSize);
  }
  
  pageChanged(event: PageChangedEvent): void {
    this.page = event.page;
    this.pageSize = event.itemsPerPage;    
    const startItem = (event.page - 1) * event.itemsPerPage + 1;
    const endItem = event.page * event.itemsPerPage;
    this.aeLatestGradations();    
    console.log('Current page: ' + event.page, 'Items per page: ' + event.itemsPerPage, 'Start item :' + startItem, 'End item :' + endItem);
  }

  aeGradationListByWef(event: any): void {
    this.loading = true;
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      wef: event,
    }
    console.log(requestObj);
    this.aengrsService.getAeGradationListByWef(requestObj).pipe(first()).subscribe((res: any) => {
      this.loading = false;
      this.SelectedAeGradationWef = res.aeSelectedTotal[0];
      this.assistantEngineers = res.assistantEngineers.data;
      this.AeGradationDateLists = res.aeGradationDate;
      
      this.totalRecords = res.assistantEngineers.total;
      this.totalPages = res.assistantEngineers.total_pages;
      this.currentPage = res.assistantEngineers.current_page;      
    });
  }

  getSearchTableData(event: any){
    if(event.length > 0){
      this.loading = true;
      this.aengrsService.getSearchData(event).pipe(first()).subscribe((res: any) => {
        this.loading = false;
        this.assistantEngineers = res.assistantEngineers.data;
      });
    }    
    if(event.length <= 0){
      this.aeLatestGradations();
    }

  }

}

