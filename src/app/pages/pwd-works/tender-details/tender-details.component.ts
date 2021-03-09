import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Tenders } from '../../../models/tenders';
import { TendersService } from '../../../services/tenders.service';

@Component({
  selector: 'app-tender-details',
  templateUrl: './tender-details.component.html',
  styleUrls: ['./tender-details.component.scss']
})
export class TenderDetailsComponent implements OnInit {
  tenderDetails: Tenders[];
  loading = false;  
  showBoundaryLinks = true;
  page: number = 1;
  currentPage: number;
  maxSize: number = 4;      //Limit the maximum visible page numbers
  pageSizes = [10, 15, 20, 50];  //option for items per page
  pageSize: number = 10;     //default items per page
  totalPages: number;
  totalRecords: Number;
  skip: number; 
 
  tendersYear: any = [];
  tenderMonths: string = null;
 

  constructor(private tendersService: TendersService)
    {  
      this.getAllTenderDetails(); 
    }

  ngOnInit(): void {
    this.getAllTenderDetails();
  }

  getAllTenderDetails(){
    this.loading = true;
    // const wef = this.gradationDate
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
    }

    this.tendersService.getAllTenderDetails(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.tenderDetails = res.seniorEngineer.data;
      this.tendersYear = res.seLatestTotal;
      this.tenderMonths = res.seLatestTotal;

      this.totalRecords = res.seLatestTotal[0].total;
      this.totalPages = res.seniorEngineer.total_pages;
      this.currentPage = res.seniorEngineer.current_page;      
    });

  }

  getSearchTableTenderDetails(event: any){
    if(event.length > 0){
      this.loading = true;
      this.tendersService.getSearchTenderDetailsData(event).pipe(first()).subscribe((res:any) => {
        this.loading = false;

        this.tenderDetails = res.seniorEngineer.data;
        // this.totalRecords = res.seLatestTotal[0].total;
        // this.totalPages = res.seniorEngineer.total_pages;
        // this.currentPage = res.seniorEngineer.current_page;
        // this.SeGradationDateLists = res.seGradationDate;
        // this.SelectedSeGradationWef = res.seLatestTotal[0];
      });
    }
    if(event.length <= 0){
      this.getAllTenderDetails();
    }

  }

  onTableSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.currentPage = this.page;
    this.getAllTenderDetails();

    console.log('Current page: ' + this.currentPage, 'Items per page: ' + this.pageSize);
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.pageSize = event.itemsPerPage;
    const startItem = (event.page - 1) * event.itemsPerPage + 1;
    const endItem = event.page * event.itemsPerPage;
    this.getAllTenderDetails();
    
    console.log('Current page: ' + event.page, 'Items per page: ' + event.itemsPerPage, 'Start item :' + startItem, 'End item :' + endItem);
  }



}
