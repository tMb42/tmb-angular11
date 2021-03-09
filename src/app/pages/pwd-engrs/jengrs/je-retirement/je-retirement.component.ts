import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { JEngrs } from '../../../../models/jengrs.model';
import { JengrsService } from '../../../../services/jengrs.service';

@Component({
  selector: 'app-je-retirement',
  templateUrl: './je-retirement.component.html',
  styleUrls: ['./je-retirement.component.scss']
})
export class JeRetirementComponent implements OnInit {
  jeRetirementForm: FormGroup;
  
  showBoundaryLinks = true;
  page: number = 1;
  currentPage: number;
  maxSize: number = 4;      //Limit the maximum visible page numbers
  pageSize: number = 10;     //default items per page
  pageSizes = [10, 20, 50, 100, 200];  //option for items per page
  totalPages: number;
  totalRecords: number = 0;
  
  jeRetirementList: JEngrs[] = [];  
  jeRetirementYearList: any = [];
  jeRetireMonthList: any = [];
  
  retireYear: any = '';
  retireMonth: any = '';

  RetirementMonthStatistic: any = [];

  JeInServiceTotal: any = 0;
  jeSelectedRetireNo: number = 0;
  

  loading = false;
  expanded = false;
  panelOpenState = true;


  constructor(private jengrsService: JengrsService, private fb: FormBuilder,) { }

  ngOnInit(): void {    
    this.getJeRetirementlList();

    this.jeRetirementForm = this.fb.group({
      retireYear: new FormControl(null),
      retireMonth: new FormControl(null),
    });
  }

  getJeRetirementlList (){
    this.loading = true;
    
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      retireYear: this.retireYear,
      retireMonth: this.retireMonth,
    }
    
    this.jengrsService.getJeRetirementDetailslList(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.JeInServiceTotal =  res.jeInServiceTotal[0];
      this.jeRetirementList = res.jeRetirement.data;
      this.jeRetirementYearList = res.jeRetireYearCount; 
          
      this.totalRecords = res.jeRetirement.total;
      this.totalPages = res.jeRetirement.total_pages;
      this.currentPage = res.jeRetirement.current_page;
    });

  }

  getJeRetirementYearList (event: any){    
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      retireYear: event,
    }    
    this.jengrsService.getJeRetirementByYear(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.jeRetirementList = res.jeRetirementYear.data;
      this.jeRetireMonthList = res.months;
      this.RetirementMonthStatistic = res.jeRetireMonthCount;
     
      this.totalRecords = res.jeRetirementYear.total;
      this.totalPages = res.jeRetirementYear.total_pages;
      this.currentPage = res.jeRetirementYear.current_page;
    });

  }

  getJeRetirementByMonth (event: any){
    this.loading = true;
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      retireYear: this.retireYear,
      retireMonth: event,
    }    
    this.jengrsService.getJeRetirementListByMonth(requestObj).pipe(first()).subscribe((res:any) => {
      // this.expanded = true;
      this.loading = false;
      this.jeRetirementList = res.jeRetirementMonth.data;
           
      this.totalRecords = res.jeRetirementMonth.total;
      this.totalPages = res.jeRetirementMonth.total_pages;
      this.currentPage = res.jeRetirementMonth.current_page;
    });

  }  

  onTableSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.currentPage = this.page;
    this.getJeRetirementlList();

    console.log('Current page: ' + this.currentPage, 'Items per page: ' + this.pageSize);
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.pageSize = event.itemsPerPage;
    const startItem = (event.page - 1) * event.itemsPerPage + 1;
    const endItem = event.page * event.itemsPerPage;
    this.getJeRetirementlList();
    
    console.log('Current page: ' + event.page, 'Items per page: ' + event.itemsPerPage, 'Start item :' + startItem, 'End item :' + endItem);
  }

  getSearchTableData(searchValue: any){
    if(searchValue.length > 0){
      this.loading = true;
      this.jengrsService.getSearchJeRetireData(searchValue).pipe(first()).subscribe((res:any) => {
        this.loading = false;
        this.jeRetirementList = res.jeRetireSearch.data;
        this.totalRecords = res.jeRetireSearch.total;
      });
    }
    if(searchValue.length <= 0){
      this.loading = false;
      this.getJeRetirementlList();
    }

  }

}
