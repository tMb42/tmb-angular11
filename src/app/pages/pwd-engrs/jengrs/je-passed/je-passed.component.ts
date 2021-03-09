import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { JEngrs } from '../../../../models/jengrs.model';
import { JengrsService } from '../../../../services/jengrs.service';

@Component({
  selector: 'app-je-passed',
  templateUrl: './je-passed.component.html',
  styleUrls: ['./je-passed.component.scss']
})
export class JePassedComponent implements OnInit {
  JeDeprtPassedForm: FormGroup;

  showBoundaryLinks = true;
  page: number = 1;
  currentPage: number;
  maxSize: number = 4;      //Limit the maximum visible page numbers
  pageSize: number = 10;     //default items per page
  pageSizes = [10, 20, 50, 100, 200];  //option for items per page
  totalPages: number;
  totalRecords: number;
  skip: number;
  
  JeDepartPassList: JEngrs[] = [];
  JePassedSessionList: any = [];
  JePscAllotYearList: any = [];

  TotalPassedJe: number = 0;
  pscBatch: any = '';
  pscPassingBatch: any = '';

  loading = false;
  expanded = false;
  panelOpenState = true;

  constructor(private jengrsService: JengrsService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.jeDepartPassedList();

    this.JeDeprtPassedForm = this.fb.group({
      pscBatch: new FormControl(null),
      pscPassingBatch: new FormControl(null),
    });

  }

  jeDepartPassedList(){
    this.loading = true;
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      pscBatch: this.pscBatch,
      pscPassedBatch: this.pscPassingBatch,
    }
   
    this.jengrsService.getJePassedList(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.TotalPassedJe = res.jePassedTotal[0].total;
      this.JeDepartPassList = res.jeDepartPassed.data;
      this.JePassedSessionList = res.jePassedSession;
      this.JePscAllotYearList = res.jePscAllotYear;
      this.totalRecords = res.jeDepartPassed.total;
    });

  }

  getJePscBatchListByYear(event: any){
    this.loading = true;
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      pscBatch: event,
    }    
    this.jengrsService.getJePscBatchByYear(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.JeDepartPassList = res.jeDepartPassedPscAllot.data;
      this.TotalPassedJe = res.jePscAllotTotal[0].total;
      this.totalRecords = res.jeDepartPassedPscAllot.total;
      this.currentPage = res.jeDepartPassedPscAllot.current_page;
      this.totalPages = res.jeDepartPassedPscAllot.total_pages;
    });
    
  }

  getJePscPassingBatchListBySession(event: any){
    this.loading = true;
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      pscPassedBatch: this.pscPassingBatch,
    }    
    this.jengrsService.getJePscPassingBatchBySession(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.JeDepartPassList = res.jeDepartPassedYear.data;
      this.totalRecords = res.jeDepartPassedYear.total;
      this.currentPage = res.jeDepartPassedYear.current_page;
      this.totalPages = res.jeDepartPassedYear.total_pages;
    });
    
  }

  onTableSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.currentPage = this.page;
    this.jeDepartPassedList();
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.pageSize = event.itemsPerPage;
    const startItem = (event.page - 1) * event.itemsPerPage + 1;
    const endItem = event.page * event.itemsPerPage;
    this.jeDepartPassedList();
    
    console.log('Current page: ' + event.page, 'Items per page: ' + event.itemsPerPage, 'Start item :' + startItem, 'End item :' + endItem);
  }

  getSearchTableData(event: any){
    if(event.length > 0){
      this.loading = true;
      this.jengrsService.getJeSearchData(event).pipe(first()).subscribe((res:any) => {
        this.loading = false;
        this.JeDepartPassList = res.juniorEngineer.data;
      });
    }
    if(event.length <= 0){
      this.jeDepartPassedList();
    }

  }

}

