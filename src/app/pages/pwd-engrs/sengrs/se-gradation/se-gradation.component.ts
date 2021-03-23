import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { first } from 'rxjs/operators';
import { SengrsService } from '../../../../services/sengrs.service';
import { SEngrs } from '../../../../models/sengrs.model';
import { faEnvelope, faMobile, faMobileAlt, faTrashAlt, faUserAlt, faUserCircle, faUserEdit } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-se-gradation',
  templateUrl: './se-gradation.component.html',
  styleUrls: ['./se-gradation.component.scss']
})
export class SeGradationComponent implements OnInit {
  SeForm: FormGroup;

  showBoundaryLinks = true;
  page: number = 1;
  currentPage: number;
  maxSize: number = 4;      //Limit the maximum visible page numbers
  pageSize: number = 10;     //default items per page
  pageSizes = [10, 20, 50, 100, 200];  //option for items per page
  totalPages: number;
  totalRecords: number;
  
  seniorEngineers: SEngrs[] = [];
  SeGradationDateLists: any = [];
  SelectedSeGradationWef: any = '';
  gradationDate: any = '';
  loading = false;
  
  
  

  constructor( private sengrsService: SengrsService, private fb: FormBuilder) { }


  ngOnInit(): void {
    this.seLatestGradations();

    this.SeForm = this.fb.group({
      gradationDate: new FormControl(null)
    });
  }

  seLatestGradations(){
    this.loading = true;
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      wef: this.gradationDate,
    }

    this.sengrsService.getSeLatestGradations(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.SelectedSeGradationWef = res.seLatestTotal[0];
      this.SeGradationDateLists = res.seGradationDate;
      this.seniorEngineers = res.seniorEngineer.data;
      console.log(this.SelectedSeGradationWef);
      console.log(this.SeGradationDateLists);

      this.totalRecords = res.seLatestTotal[0].total;
      this.totalPages = res.seniorEngineer.total_pages;
      this.currentPage = res.seniorEngineer.current_page;
    });

  }

  onTableSizeChange(event): void {
    this.pageSize = event.target.value;
    this.currentPage = this.page;
    this.seLatestGradations();
    console.log('Current page: ' + this.currentPage, 'Items per page: ' + this.pageSize);
  }
  
  pageChanged(event: PageChangedEvent): void {
    this.page = event.page;
    this.pageSize = event.itemsPerPage;    
    const startItem = (event.page - 1) * event.itemsPerPage + 1;
    const endItem = event.page * event.itemsPerPage;
    this.seLatestGradations();    
    console.log('Current page: ' + event.page, 'Items per page: ' + event.itemsPerPage, 'Start item :' + startItem, 'End item :' + endItem);
  }

  
  seGradationListByWef(value : Date): void{
    console.log(value);
    this.gradationDate = formatDate(value, 'yyyy-MM-dd', 'en');
    this.loading = true;

    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      wef: this.gradationDate,
    }

    console.log(requestObj);
    this.sengrsService.getSeGradationListByWef(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.SelectedSeGradationWef = res.seLatestTotal[0];
      this.seniorEngineers = res.seniorEngineer.data;
      this.SeGradationDateLists = res.seGradationDate;
      
      this.totalRecords = res.seLatestTotal[0].total;
      this.totalPages = res.seniorEngineer.total_pages;
      this.currentPage = res.seniorEngineer.current_page;
      
    });
  }

  getSearchTableData(event: any){
    if(event.length > 0){
      this.loading = true;
      this.sengrsService.getSearchData(event).pipe(first()).subscribe((res:any) => {
        this.loading = false;

        this.seniorEngineers = res.seniorEngineer.data;
        // this.totalRecords = res.seLatestTotal[0].total;
        // this.totalPages = res.seniorEngineer.total_pages;
        // this.currentPage = res.seniorEngineer.current_page;
        // this.SeGradationDateLists = res.seGradationDate;
        // this.SelectedSeGradationWef = res.seLatestTotal[0];
      });
    }
    if(event.length <= 0){
      this.seLatestGradations();
    }

  }

}
