import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { SEngrs } from '../../../../models/sengrs.model';
import { SengrsService } from '../../../../services/sengrs.service';

@Component({
  selector: 'app-se-caste',
  templateUrl: './se-caste.component.html',
  styleUrls: ['./se-caste.component.scss']
})

export class SeCasteComponent implements OnInit {
  seCastePromoForm: FormGroup;

  showBoundaryLinks = true;
  page: number = 1;
  currentPage: number;
  maxSize: number = 4;      //Limit the maximum visible page numbers
  pageSize: number = 10;     //default items per page
  pageSizes = [10, 20, 50, 100, 200];  //option for items per page
  totalPages: number;
  totalRecords: number;
  skip: number;
  
  SePromoCasteGroup: SEngrs[] = [];
  SePassedCastes: any = [];
  SeProfCasteGroupTotal: any = [];
  Designations: any = [];
  designation: any = null;
  SelectedDesignation: string = null;

  loading = false;
  expanded = false;
  panelOpenState = true;

  constructor(private sengrsService: SengrsService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.seCastePromoForm = this.fb.group({
      designation: new FormControl(null),
    });

    this.getSePromoCasteDetails();     
  }
 
  getSePromoCasteDetails(){
    this.loading = true;
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      skip: (this.page-1) * this.pageSize
    }
   
    this.sengrsService.getSePromotionalCasteDetails(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;      
      const casteGroup = res.sePromoCasteGroup;
      this.SeProfCasteGroupTotal = res.seConfirmedCaste;
      this.Designations = res.designations;
      this.totalRecords = res.seGradationTotal[0].total;
      
      this.SePromoCasteGroup = casteGroup.reduce((r, {caste_name})=>{
        if(!r.some(o=>o.caste_name == caste_name)){
          r.push({  caste_name, groupItem: casteGroup.filter(v=>v.caste_name == caste_name)  });
      }   
        return r;    
      },[]);
      
    });

  }

  seCastePromoListByDesignation(event: any){
    this.loading = true;
    const requestObj = {
      designationId: event,
      page: this.page,
      itemsPerPage: this.pageSize,
      skip: (this.page-1) * this.pageSize
    }   
    this.sengrsService.getSeCastePromotionalDetailsByDesignation(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      const casteGroup = res.sePromoList;
      this.SeProfCasteGroupTotal = res.selectedConfirmedCaste;
      this.Designations = res.designations;
      this.totalRecords = res.sePromoTotal[0].total;
      this.SelectedDesignation = res.selectedDesignation[0].designation_name;
      
      this.SePromoCasteGroup = casteGroup.reduce((r, {caste_name})=>{
        if(!r.some(o=>o.caste_name == caste_name)){
          r.push({  caste_name, groupItem: casteGroup.filter(v=>v.caste_name == caste_name)  });
      }   
        return r;    
      },[]);
      
    });

  }

  seCastePromoScopeByPostNo(event: number){
    if(event>0){
      this.loading = true;
      const requestObj = {
        designationId: this.designation,
        scopeNo: event,
        page: this.page,
        itemsPerPage: this.pageSize,
        skip: (this.page-1) * this.pageSize
      } 

      this.sengrsService.getSeCastePromoScopeByPostNo(requestObj).pipe(first()).subscribe((res:any) => {
        this.expanded = true;
        this.loading = false;
        const casteGroup = res.seFinalPromoList;
        this.SePromoCasteGroup = casteGroup.reduce((r, {caste_name})=>{
        if(!r.some(o=>o.caste_name == caste_name)){
          r.push({  caste_name, groupItem: casteGroup.filter(v=>v.caste_name == caste_name)  });
        }   
        return r;    
      },[]);

      });
    }else{
      this.expanded = false;
      this.getSePromoCasteDetails();
    }

  }

  onTableSizeChange(event: any): void {
    this.loading = true;
    this.pageSize = event.target.value;
    this.currentPage = this.page;    
    const requestObj = {
      designationId: this.designation,
      page: this.page,
      itemsPerPage: this.pageSize,
      skip: (this.page-1) * this.pageSize
    }   
    this.sengrsService.getSeCastePromotionalDetailsByDesignation(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      const casteGroup = res.sePromoList;
      this.SeProfCasteGroupTotal = res.selectedConfirmedCaste;
      this.Designations = res.designations;
      this.totalRecords = res.sePromoTotal[0].total;
      this.SelectedDesignation = res.selectedDesignation[0].designation_name;
      
      this.SePromoCasteGroup = casteGroup.reduce((r, {caste_name})=>{
        if(!r.some(o=>o.caste_name == caste_name)){
          r.push({  caste_name, groupItem: casteGroup.filter(v=>v.caste_name == caste_name)  });
      }   
        return r;    
      },[]);
      
    });
  }

  pageChanged(event: any): void {
    this.loading = true;
    this.page = event.page;
    this.pageSize = event.itemsPerPage;
    const requestObj = {
      designationId: this.designation,
      page: this.page,
      itemsPerPage: this.pageSize,
      skip: (this.page-1) * this.pageSize
    }   
    this.sengrsService.getSeCastePromotionalDetailsByDesignation(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      const casteGroup = res.sePromoList;
      this.SeProfCasteGroupTotal = res.selectedConfirmedCaste;
      this.Designations = res.designations;
      this.totalRecords = res.sePromoTotal[0].total;
      this.SelectedDesignation = res.selectedDesignation[0].designation_name;
      
      this.SePromoCasteGroup = casteGroup.reduce((r, {caste_name})=>{
        if(!r.some(o=>o.caste_name == caste_name)){
          r.push({  caste_name, groupItem: casteGroup.filter(v=>v.caste_name == caste_name)  });
      }   
        return r;    
      },[]);
      
    });
    
  }

  getSearchTableData(event: any){
    if(event.length > 0){
      this.loading = true;
      this.sengrsService.getSeSearchablePromoTableData(event).pipe(first()).subscribe((res:any) => {
        this.loading = false;
        const casteGroup = res.sePromoSearch;
        this.SePromoCasteGroup = casteGroup.reduce((r, {caste_name})=>{
          if(!r.some(o=>o.caste_name == caste_name)){
            r.push({  caste_name, groupItem: casteGroup.filter(v=>v.caste_name == caste_name)  });
          }   
          return r;    
        },[]);
      });
    }
    if(event.length <= 0){
      this.getSePromoCasteDetails();
    }

  }

}

