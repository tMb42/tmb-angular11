import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { first } from 'rxjs/operators';
import { AEngrs } from '../../../../models/aengrs.model';
import { AengrsService } from '../../../../services/aengrs.service';


@Component({
  selector: 'app-ae-confirmation',
  templateUrl: './ae-confirmation.component.html',
  styleUrls: ['./ae-confirmation.component.scss']
})
export class AeConfirmationComponent implements OnInit {
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
  
  AeProfPassedList: AEngrs[] = [];
  aeConfirmationYearList: any = [];
  aeYearTotal: number = 0;
  AeConfirmYear: string = '';
  
  loading = false;
  expanded = false;
  panelOpenState = true;

  constructor(private fb: FormBuilder, private aengrsService: AengrsService) { }

  ngOnInit(): void {
    this.getAeConfirmationDetails();

    this.AePassedForm = this.fb.group({
      aeConfirmYear: new FormControl(null),
    });

  }

  getAeConfirmationDetails(){
    this.loading = true;
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      aeConfirmYear: this.AeConfirmYear,
    }
   
    this.aengrsService.getAeConfirmationDetailsList(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.aeYearTotal = res.aeConfirmedTotal[0].total;
      this.AeProfPassedList = res.aeConfirmPassed.data;
      this.aeConfirmationYearList = res.aeConfirmationYear;
      this.totalRecords = res.aeConfirmPassed.total;
    });

  }

  getAeConfirmationByYear(event: any){
    this.loading = true;
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      aeConfirmYear: event,
    }    
    console.log(requestObj);
    this.aengrsService.getAeConfirmationListByYear(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.aeConfirmationYearList = res.aeConfirmationYear;
      this.AeProfPassedList = res.aeConfirmPassed.data;
      this.aeYearTotal = res.aeConfirmYearTotal[0].total;
      this.totalRecords = res.aeConfirmPassed.total;
      this.currentPage = res.aeConfirmPassed.current_page;
      this.totalPages = res.aeConfirmPassed.total_pages;
    });
    
  }
    
  onTableSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.currentPage = this.page;
    this.getAeConfirmationDetails();
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.pageSize = event.itemsPerPage;
    const startItem = (event.page - 1) * event.itemsPerPage + 1;
    const endItem = event.page * event.itemsPerPage;
    this.getAeConfirmationDetails();
    
    console.log('Current page: ' + event.page, 'Items per page: ' + event.itemsPerPage, 'Start item :' + startItem, 'End item :' + endItem);
  }

  getSearchTableData(event: any){
    if(event.length > 0){
      this.loading = true;
      this.aengrsService.getAeSearchData(event).pipe(first()).subscribe((res:any) => {
        this.loading = false;
        this.AeProfPassedList = res.assistantEngineer.data;
      });
    }
    if(event.length <= 0){
      this.getAeConfirmationDetails();
    }

  }

}

