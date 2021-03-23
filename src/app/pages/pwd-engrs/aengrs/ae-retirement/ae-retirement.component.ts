import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AEngrs } from '../../../../models/aengrs.model';
import { AengrsService } from '../../../../services/aengrs.service';


@Component({
  selector: 'app-ae-retirement',
  templateUrl: './ae-retirement.component.html',
  styleUrls: ['./ae-retirement.component.scss']
})
export class AeRetirementComponent implements OnInit {
  aeRetirementForm: FormGroup;  
  showBoundaryLinks = true;
  page: number = 1;
  currentPage: number;
  maxSize: number = 4;      //Limit the maximum visible page numbers
  pageSize: number = 10;     //default items per page
  pageSizes = [10, 20, 50, 100, 200];  //option for items per page
  totalPages: number;
  totalRecords: number = 0;
  
  aeRetirementList: AEngrs[] = [];  
  RetirementYearStatistic: any = [];
  RetirementMonthStatistic: any = [];
  aeRetireMonthList: any = [];
  totalInYear: any = null;
  totalInMonth: any = null;
  
  retireYear: any = '';
  retireMonth: any = '';
  AeInServiceTotal: any = 0;
  AeSelectedRetireNo: number = 0;
  

  loading = false;
  expanded = false;
  panelOpenState = true;


  constructor(private aengrsService: AengrsService, private fb: FormBuilder,) { }

  ngOnInit(): void {    
    this.getAeRetirementlList();

    this.aeRetirementForm = this.fb.group({
      retireYear: new FormControl(null),
      retireMonth: new FormControl(null),
    });
  }

  getAeRetirementlList (){
    this.loading = true;
    
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      retireYear: this.retireYear,
      retireMonth: this.retireMonth,
    }
    
    this.aengrsService.getAeRetirementDetailslList(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.AeInServiceTotal =  res.aeInServiceTotal[0];
      this.aeRetirementList = res.aeRetirement.data;
      this.RetirementYearStatistic = res.aeRetireYearCount; 
          
      this.totalRecords = res.aeRetirement.total;
      this.totalPages = res.aeRetirement.total_pages;
      this.currentPage = res.aeRetirement.current_page;
    });

  }

  getAeRetirementYearList (event: any){    
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      retireYear: event,
    }    
    this.aengrsService.getAeRetirementByYear(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.aeRetirementList = res.aeRetirementYear.data;
      this.aeRetireMonthList = res.months;
      this.RetirementMonthStatistic = res.aeRetireMonthCount;
      this.totalInYear = res.aeRetireCountYear[0].total;
     
      this.totalRecords = res.aeRetirementYear.total;
      this.totalPages = res.aeRetirementYear.total_pages;
      this.currentPage = res.aeRetirementYear.current_page;
    });

  }

  getAeRetirementByMonth (event: any){
    this.loading = true;
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      retireYear: this.retireYear,
      retireMonth: event,
    }    
    this.aengrsService.getAeRetirementListByMonth(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.aeRetirementList = res.aeRetirementMonth.data;
      this.totalInMonth = res.aeRetireCountMonth[0].total; 

      this.totalRecords = res.aeRetirementMonth.total;
      this.totalPages = res.aeRetirementMonth.total_pages;
      this.currentPage = res.aeRetirementMonth.current_page;
    });

  }  

  onTableSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.currentPage = this.page;
    this.getAeRetirementlList();

    console.log('Current page: ' + this.currentPage, 'Items per page: ' + this.pageSize);
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.pageSize = event.itemsPerPage;
    const startItem = (event.page - 1) * event.itemsPerPage + 1;
    const endItem = event.page * event.itemsPerPage;
    this.getAeRetirementlList();
    
    console.log('Current page: ' + event.page, 'Items per page: ' + event.itemsPerPage, 'Start item :' + startItem, 'End item :' + endItem);
  }

  getSearchTableData(searchValue: any){
    if(searchValue.length > 0){
      this.loading = true;
      this.aengrsService.getSearchAeRetireData(searchValue).pipe(first()).subscribe((res:any) => {
        this.loading = false;
        this.aeRetirementList = res.aeRetireSearch.data;
        this.totalRecords = res.aeRetireSearch.total;
      });
    }
    if(searchValue.length <= 0){
      this.loading = false;
      this.getAeRetirementlList();
    }

  }

}
