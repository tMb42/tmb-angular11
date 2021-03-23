import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AEngrs } from '../../../../models/aengrs.model';
import { AengrsService } from '../../../../services/aengrs.service';


@Component({
  selector: 'app-ae-caste',
  templateUrl: './ae-caste.component.html',
  styleUrls: ['./ae-caste.component.scss']
})
export class AeCasteComponent implements OnInit {
  showBoundaryLinks = true;
  page: number = 1;
  currentPage: number;
  maxSize: number = 4;      //Limit the maximum visible page numbers
  pageSize: number = 10;     //default items per page
  pageSizes = [10, 20, 50, 100, 200];  //option for items per page
  totalPages: number;
  totalRecords: number;
  skip: number;
  
  AePromoCasteGroup: AEngrs[] = [];
  AePassedCastes: any = [];

  loading = false;
  expanded = false;
  panelOpenState = true;

  constructor(private aengrsService: AengrsService) { }

  ngOnInit(): void {
    this.getAePromoCasteDetails();     
  }
 
  getAePromoCasteDetails(){
    this.loading = true;
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      skip: (this.page-1) * this.pageSize
    }
   
    this.aengrsService.getAePromotionalCasteDetails(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;      
      const casteGroup = res.aePromoCasteGroup;
      this.AePassedCastes = res.aeConfirmedCaste;
      this.totalRecords = res.aePromoTotal[0].total;
      
      this.AePromoCasteGroup = casteGroup.reduce((r, {caste_name})=>{
        if(!r.some(o=>o.caste_name == caste_name)){
          r.push({  caste_name, groupItem: casteGroup.filter(v=>v.caste_name == caste_name)  });
      }   
        return r;    
      },[]);
      
    });

  }

  aeCastePromoScopeByPostNo(scopeNo: number){
    if(scopeNo>0){
      this.loading = true;    
      this.aengrsService.getAeCastePromoScopeByPostNo(scopeNo).pipe(first()).subscribe((res:any) => {
        this.expanded = true;
        this.loading = false;
        const casteGroup = res.aeFinalPromoList;
        this.AePromoCasteGroup = casteGroup.reduce((r, {caste_name})=>{
        if(!r.some(o=>o.caste_name == caste_name)){
          r.push({  caste_name, groupItem: casteGroup.filter(v=>v.caste_name == caste_name)  });
        }   
        return r;    
      },[]);

      });
    }else{
      this.expanded = false;
      this.getAePromoCasteDetails();
    }

  }

  onTableSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.currentPage = this.page;
    this.getAePromoCasteDetails();
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.pageSize = event.itemsPerPage;
    const startItem = (event.page - 1) * event.itemsPerPage + 1;
    const endItem = event.page * event.itemsPerPage;
    this.getAePromoCasteDetails();
    
    console.log('Current page: ' + event.page, 'Items per page: ' + event.itemsPerPage, 'Start item :' + startItem, 'End item :' + endItem);
  }

  getSearchTableData(event: any){
    if(event.length > 0){
      this.loading = true;
      this.aengrsService.getAeSearchablePromoTableData(event).pipe(first()).subscribe((res:any) => {
        this.loading = false;
        const casteGroup = res.aePromoSearch;
        this.AePromoCasteGroup = casteGroup.reduce((r, {caste_name})=>{
          if(!r.some(o=>o.caste_name == caste_name)){
            r.push({  caste_name, groupItem: casteGroup.filter(v=>v.caste_name == caste_name)  });
          }   
          return r;    
        },[]);
      });
    }
    if(event.length <= 0){
      this.getAePromoCasteDetails();
    }

  }

}

