import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { SengrsService } from '../../../services/sengrs.service';
import { DropdownService } from '../../../services/dropdown.service';
import { SEngrs } from '../../../models/sengrs.model';
import Swal from 'sweetalert2';

export interface Castes {
  id: number;
  caste_name: string;
  caste_alias: string;
  remarks: any;
}
export interface Designations {
  id: number;
  designation_name: string;
  designation_alias: string;
  remarks: any;
}

@Component({
  selector: 'app-senior-engrs',
  templateUrl: './senior-engrs.component.html',
  styleUrls: ['./senior-engrs.component.scss']
})
export class SeniorEngrsComponent implements OnInit {

  seUpdateForm: FormGroup; 
  showBoundaryLinks = true;
  page: number = 1;
  currentPage: number;
  maxSize: number = 4;      //Limit the maximum visible page numbers
  pageSize: number = 10;     //default items per page
  pageSizes = [10, 20, 50, 100, 200];  //option for items per page
  totalPages: number;
  totalRecords: number;
  
  sEngrs: SEngrs[];
  castes: Castes[] = [];
  designations: Designations[] = [];
  SeGradationDateLists: any = [];
  SelectedSeGradationWef: any = '';
  gradation_list_wef: any = '';
  loading = false; 

  minDate: Date;
  maxDate: Date;
  seDob: string = null;
  AeDoj: string = null;
  EeDoj: string = null;
  SeDoj: string = null;
  CeDoj: string = null;
  seDor: string = null;
  gwef: string = null;
  
  constructor(private fb: FormBuilder, private dropdownService : DropdownService, private sengrsService: SengrsService) 
  { 
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate() - 29200); //maximum age 80yrs
    this.maxDate.setDate(this.maxDate.getDate() - 6570);  //minimum age 18yrs
  }

  ngOnInit(): void {
    this.loading = true;
    this.seLatestGradations();
  
    this.dropdownService.getCastes().subscribe((response: { castes: Castes[]; }) => {      
      this.castes = response.castes;     
    });

    this.dropdownService.getSeDesignations().subscribe((response: { designationData: Designations[]; }) => {      
      this.designations = response.designationData;     
    });

    this.sengrsService.getSeUpdateListener().subscribe( res => {
      this.loading = false;
      this.sEngrs = res;
    });

    this.seUpdateForm = this.fb.group({
      id: [null, Validators.required],
      gradation_sl_no: [null, Validators.required],
      engineer_name: [null, Validators.required],
      employee_caste_id: [null, Validators.required],
      engineer_dob: [null, Validators.required],
      engineer_dor: [null, Validators.required],
      ae_doj: [null, Validators.required],
      ee_doj: null,
      se_doj: null,
      ce_doj: null,
      promo_designation_id: null,
      service_status: null,
      notes: null,
      gradation_list_wef: null,
      display: [null, Validators.required],
      inforce: [null, Validators.required],
    });

  }

  getEngrsDetailsById(event) {
    this.loading = true;
    this.sengrsService.getSeDetailsById(event).pipe(first()).subscribe((x: any) => {
      this.loading = false;
      this.seUpdateForm.patchValue(x.se);
    }); 
  }

  changeDob(value: Date): void {
    if(value != null){
      this.seDob = formatDate(value, 'yyyy-MM-dd', 'en');
    }else{
      this.seDob = null;
    }
  }
  changeAeDoj(value: Date): void {
    if(value != null){
      this.AeDoj = formatDate(value, 'yyyy-MM-dd', 'en');
    }else{
      this.AeDoj = null;
    } 
  }
  changeEeDoj(value: Date): void {
    if(value != null){
      this.EeDoj = formatDate(value, 'yyyy-MM-dd', 'en');
    }else{
      this.EeDoj = null;
    } 
  }
  changeSeDoj(value: Date): void {
    if(value != null){
      this.SeDoj = formatDate(value, 'yyyy-MM-dd', 'en');
    }else{
      this.SeDoj = null;
    } 
  }
  changeCeDoj(value: Date): void {
    if(value != null){
      this.CeDoj = formatDate(value, 'yyyy-MM-dd', 'en');
    }else{
      this.CeDoj = null;
    } 
  }
  changeDor(value: Date): void {
    if(value != null){
      this.seDor = formatDate(value, 'yyyy-MM-dd', 'en');
    }else{
      this.seDor = null;
    }    
  }
  
  updateSeData(){
    this.loading = true;
    const formData = this.seUpdateForm.getRawValue();    
    const updateSeData = {
      id: formData.id,
      grdnSl: formData.gradation_sl_no,
      engrName: formData.engineer_name,
      caste: formData.employee_caste_id, 
      promoDsgn: formData.promo_designation_id, 
      serviceStatus: formData.service_status, 
      display: formData.display,
      inforce: formData.inforce, 
      notes: formData.notes,
      birthDate: this.seDob,
      dor: this.seDor,
      aeDoj: this.AeDoj, 
      eeDoj: this.EeDoj,
      seDoj: this.SeDoj,
      ceDoj: this.CeDoj,
      wef: this.gradation_list_wef,
    }

    console.log(updateSeData);
    this.sengrsService.seUpdateDataById(updateSeData).subscribe(() => {
      this.loading = false;
      Swal.fire({ position: 'top-end', icon: 'success', title: 'SE Data Updated successfully', showConfirmButton: false, timer: 2000 }); 

    }, err => {
      this.loading = false;
      Swal.fire({ position: 'top-end', icon: 'error', title: err, showConfirmButton: false, timer: 4000 }); 
    }); 
  }

  seLatestGradations(){
    this.loading = true;
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      wef: this.gradation_list_wef,
    }    
    this.sengrsService.getSeLatestGradations(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.SelectedSeGradationWef = res.seLatestTotal[0];
      this.SeGradationDateLists = res.seGradationDate;
      this.sEngrs = res.seniorEngineer.data;

      this.totalRecords = res.seLatestTotal[0].total;
      this.totalPages = res.seniorEngineer.total_pages;
      this.currentPage = res.seniorEngineer.current_page;
    });

  }

  onTableSizeChange(event): void {
    this.pageSize = event.target.value;
    this.currentPage = this.page;
    this.seLatestGradations();
  }
  
  pageChanged(event: any): void {
    this.page = event.page;
    this.pageSize = event.itemsPerPage; 
    this.seLatestGradations(); 
  }

  seGradationListByWef(value: Date): void {
    this.gradation_list_wef = formatDate(value, 'yyyy-MM-dd', 'en');
    this.loading = true;
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      wef: this.gradation_list_wef,
    }
    
    this.sengrsService.getSeGradationListByWef(requestObj).pipe(first()).subscribe((res: any) => {
      this.loading = false;
      this.SelectedSeGradationWef = res.seLatestTotal[0];
      this.sEngrs = res.seniorEngineer.data;
      this.SeGradationDateLists = res.seGradationDate;
      
      this.totalRecords = res.seniorEngineer.total;
      this.totalPages = res.seniorEngineer.total_pages;
      this.currentPage = res.seniorEngineer.current_page;   
      
      // this.seUpdateForm.patchValue({
      //   gradation_list_wef: this.SelectedSeGradationWef.gradation_list_wef,      
      // });

    });

  }

  getSearchTableData(event: any){
    if(event.length > 0){
      this.loading = true;
      this.sengrsService.getSearchData(event).pipe(first()).subscribe((res: any) => {
        this.loading = false;
        this.sEngrs = res.seniorEngineer.data;

        this.totalRecords = res.seniorEngineer.total;
        this.totalPages = res.seniorEngineer.total_pages;
        this.currentPage = res.seniorEngineer.current_page;
      });
    }    
    if(event.length <= 0){
      this.seLatestGradations();
    }
  }

  formReset(){
    this.seUpdateForm.reset();
  }

}


