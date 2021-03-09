import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { JEngrs } from '../../../../models/jengrs.model';
import { JengrsService } from '../../../../services/jengrs.service';

@Component({
  selector: 'app-je-caste',
  templateUrl: './je-caste.component.html',
  styleUrls: ['./je-caste.component.scss']
})
export class JeCasteComponent implements OnInit {

  showBoundaryLinks = true;
  page: number = 1;
  currentPage: number;
  maxSize: number = 4;      //Limit the maximum visible page numbers
  pageSize: number = 10;     //default items per page
  pageSizes = [10, 20, 50, 100, 200];  //option for items per page
  totalPages: number;
  totalRecords: number;
  skip: number;
  
  JePromoCasteGroup: JEngrs[] = [];
  JePassedCastes: any = [];

  loading = false;
  expanded = false;
  panelOpenState = true;

  constructor(private jengrsService: JengrsService) { }

  ngOnInit(): void {
    this.getJePassedCasteList();     
  }
 
  getJePassedCasteList(){
    this.loading = true;
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      skip: (this.page-1) * this.pageSize
    }
   
    this.jengrsService.getJePromotionalCasteDetails(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;      
      const casteGroup = res.jePromoCasteGroup;
      this.JePassedCastes = res.jePassedCasteCount;
      this.totalRecords = res.jePromoTotal[0].total;
      
      this.JePromoCasteGroup = casteGroup.reduce((r, {caste_name})=>{
        if(!r.some(o=>o.caste_name == caste_name)){
          r.push({  caste_name, groupItem: casteGroup.filter(v=>v.caste_name == caste_name)  });
      }   
        return r;    
      },[]);
      
    });

  }

  jeCastePromoScopeByPostNo(scopeNo: number){
    if(scopeNo>0){
      this.loading = true;    
      this.jengrsService.getJeCastePromoScopeByPostNo(scopeNo).pipe(first()).subscribe((res:any) => {
        this.expanded = true;
        this.loading = false;
        const casteGroup = res.jeFinalPromoList;
        this.JePromoCasteGroup = casteGroup.reduce((r, {caste_name})=>{
        if(!r.some(o=>o.caste_name == caste_name)){
          r.push({  caste_name, groupItem: casteGroup.filter(v=>v.caste_name == caste_name)  });
        }   
        return r;    
      },[]);

      });
    }else{
      this.expanded = false;
      this.getJePassedCasteList();
    }

  }

  onTableSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.currentPage = this.page;
    this.getJePassedCasteList();
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.pageSize = event.itemsPerPage;
    const startItem = (event.page - 1) * event.itemsPerPage + 1;
    const endItem = event.page * event.itemsPerPage;
    this.getJePassedCasteList();
    
    console.log('Current page: ' + event.page, 'Items per page: ' + event.itemsPerPage, 'Start item :' + startItem, 'End item :' + endItem);
  }

  getSearchTableData(event: any){
    if(event.length > 0){
      this.loading = true;
      this.jengrsService.getJeSearchablePromoTableData(event).pipe(first()).subscribe((res:any) => {
        this.loading = false;
        const casteGroup = res.jePromoSearch;
        this.JePromoCasteGroup = casteGroup.reduce((r, {caste_name})=>{
          if(!r.some(o=>o.caste_name == caste_name)){
            r.push({  caste_name, groupItem: casteGroup.filter(v=>v.caste_name == caste_name)  });
          }   
          return r;    
        },[]);
      });
    }
    if(event.length <= 0){
      this.getJePassedCasteList();
    }

  }

}

