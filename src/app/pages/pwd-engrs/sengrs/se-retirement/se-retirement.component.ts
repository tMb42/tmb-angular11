import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { SEngrs } from 'src/app/models/sengrs.model';
import { SengrsService } from 'src/app/services/sengrs.service';

@Component({
  selector: 'app-se-retirement',
  templateUrl: './se-retirement.component.html',
  styleUrls: ['./se-retirement.component.scss']
})
export class SeRetirementComponent implements OnInit {
  seRetirementForm: FormGroup;

  showBoundaryLinks = true;
  page: number = 1;
  currentPage: number;
  maxSize: number = 4;      //Limit the maximum visible page numbers
  pageSize: number = 10;     //default items per page
  pageSizes = [10, 20, 50, 100, 200];  //option for items per page
  totalPages: number;
  totalRecords: number;
  
  seRetirementList: SEngrs[] = [];  
  RetirementYearStatistic: any = [];
  RetirementMonthStatistic: any = [];
  Designations: any = [];
  seRetireYearList: any = [];
  seRetireMonthList: any = [];
  totalInYear: any = null;
  totalInMonth: any = null;
  SelectedDesignation: string = null;
  
  designation: any ='';
  retireYear: any = '';
  retireMonth: any = '';
  SeInServiceTotal: any = 0;
  
  
  loading = false;
  expanded = false;
  panelOpenState = true;

  constructor(private sengrsService: SengrsService, private fb: FormBuilder) { }

  ngOnInit(): void {    
    this.getSeRetirementlList();

    this.seRetirementForm = this.fb.group({
      designation: new FormControl(null),
      retireYear: new FormControl(null),
      retireMonth: new FormControl(null)
    });
  }

  getSeRetirementlList (){
    this.loading = true;
    
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      designationId: this.designation,
      retireYear: this.retireYear,
      retireMonth: this.retireMonth,
    }
    
    this.sengrsService.getSeRetirementDetailslList(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.SeInServiceTotal =  res.seInServiceTotal[0];
      this.seRetirementList = res.seRetirement.data;
      this.RetirementYearStatistic = res.seRetireYearStatistic; 
      this.Designations = res.designations; 
          
      this.totalRecords = res.seRetirement.total;
      this.totalPages = res.seRetirement.total_pages;
      this.currentPage = res.seRetirement.current_page;
    });

  }

  getRetirementDetailsByDesignation (event: any){    
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      designationId: event,
    }

    this.sengrsService.retirementListByDesignation(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.SeInServiceTotal = res.seInServiceTotal[0];     
      this.seRetirementList = res.seDesignationRetirement.data;
      this.RetirementYearStatistic = res.seRetireYearStatistic;
      this.seRetireYearList = res.seRetireYear;
      this.SelectedDesignation = res.selectedDesignation[0].designation_name;

      this.totalRecords = res.seDesignationRetirement.total;
      this.totalPages = res.seDesignationRetirement.total_pages;
      this.currentPage = res.seDesignationRetirement.current_page;
    });

  }

  getSeRetirementYearList (event: any){    
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      designationId: this.designation,
      retireYear: event,
    }

    this.sengrsService.getSeRetirementByYear(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.seRetirementList = res.seRetirementYear.data;
      this.seRetireMonthList = res.months;
      this.RetirementMonthStatistic = res.seRetireMonthCount;
      this.totalInYear = res.seRetireCountYear[0].total;
     
      this.totalRecords = res.seRetirementYear.total;
      this.totalPages = res.seRetirementYear.total_pages;
      this.currentPage = res.seRetirementYear.current_page;
    });

  }

  getSeRetirementByMonth (event: any){
    this.loading = true;
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      designationId: this.designation,
      retireYear: this.retireYear,
      retireMonth: event,
    } 

    this.sengrsService.getSeRetirementListByMonth(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.seRetirementList = res.seRetirementMonth.data;
      this.totalInMonth = res.seRetireMonthCount[0].total; 

      this.totalRecords = res.seRetirementMonth.total;
      this.totalPages = res.seRetirementMonth.total_pages;
      this.currentPage = res.seRetirementMonth.current_page;
    });

  }  

  onTableSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.currentPage = this.page;
    this.getSeRetirementlList();
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.pageSize = event.itemsPerPage;
    this.getSeRetirementlList();
  }

  getSearchTableData(searchValue: any){
    if(searchValue.length > 0){
      this.loading = true;
      this.sengrsService.getSearchSeRetireData(searchValue).pipe(first()).subscribe((res:any) => {
        this.loading = false;
        this.seRetirementList = res.seRetireSearch.data;
        this.totalRecords = res.seRetireSearch.total;
      });
    }
    if(searchValue.length <= 0){
      this.loading = false;
      this.getSeRetirementlList();
    }

  }

}
