import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AEngrs } from '../../../models/aengrs.model';
import { AengrsService } from '../../../services/aengrs.service';
import { DropdownService } from '../../../services/dropdown.service';
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';


export interface Castes {
  id: number;
  caste_name: string;
  caste_alias: string;
  remarks: any;
}

@Component({
  selector: 'app-assistant-engrs',
  templateUrl: './assistant-engrs.component.html',
  styleUrls: ['./assistant-engrs.component.scss']
})

export class AssistantEngrsComponent implements OnInit {
  aeUpdateForm: FormGroup; 
  showBoundaryLinks = true;
  page: number = 1;
  currentPage: number;
  maxSize: number = 4;      //Limit the maximum visible page numbers
  pageSize: number = 10;     //default items per page
  pageSizes = [10, 20, 50, 100, 200];  //option for items per page
  totalPages: number;
  totalRecords: number;
  
  aEngrs: AEngrs[];
  castes: Castes[] = [];
  AeGradationDateLists: any = [];
  SelectedAeGradationWef: any = '';
  gradationDate: any = '';
  loading = false; 

  minDate: Date;
  maxDate: Date;
  aeDob: string = null;
  aeDoj: string = null;
  aeDoc: string = null;
  aeDor: string = null;
  eehs: string = null;
  gwef: string = null;
  
  constructor(private fb: FormBuilder, private dropdownService : DropdownService, private aengrsService: AengrsService) 
  { 
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate() - 29200); //maximum age 80yrs
    this.maxDate.setDate(this.maxDate.getDate() - 6570);  //minimum age 18yrs
  }

  ngOnInit(): void {
    this.loading = true;
    this.aeLatestGradations();
  
    this.dropdownService.getCastes().subscribe((response: { castes: Castes[]; }) => {      
      this.castes = response.castes;     
    });

    this.aengrsService.getAeUpdateListener().subscribe( res => {
      this.loading = false;
      this.aEngrs = res;
    });
     
    this.aeUpdateForm = this.fb.group({
      id: [null, Validators.required],
      gradation_sl_no: [null, Validators.required],
      engineer_name: [null, Validators.required],
      employee_caste_id: [null, Validators.required],
      engineer_dob: [null, Validators.required],
      assistant_engineers_doj: null,
      assistant_engineers_doc: null,
      engineer_dor: [null, Validators.required],
      ee_higher_scale_date: null,
      service_status: null,
      notes: null,
      joining_time: null,
      gradation_list_wef: [null, Validators.required],
      display: [null, Validators.required],
      inforce: [null, Validators.required],
    });

  }

  getEngrsDetailsById(event) {
    this.loading = true;
    this.aengrsService.getAeDetailsById(event).pipe(first()).subscribe((x: any) => {
      this.loading = false;
      this.aeUpdateForm.patchValue(x.ae);
    }); 
  }

  changeDob(value: Date): void {
    if(value != null){
      this.aeDob = formatDate(value, 'yyyy-MM-dd', 'en');
    }else{
      this.aeDoc = null;
    }
  }
  changeDoj(value: Date): void {
    if(value != null){
      this.aeDoj = formatDate(value, 'yyyy-MM-dd', 'en');
    }else{
      this.aeDoc = null;
    } 
  }
  changeDoc(value: Date): void {
    if(value != null){
      this.aeDoc = formatDate(value, 'yyyy-MM-dd', 'en');
    }else{
      this.aeDoc = null;
    } 
  }
  changeDor(value: Date): void {
    if(value != null){
      this.aeDor = formatDate(value, 'yyyy-MM-dd', 'en');
    }else{
      this.aeDoc = null;
    }    
  }
  changeEehs(value: Date) {
    if(value != null){
      this.eehs = formatDate(value, 'yyyy-MM-dd', 'en');
    }else{
      this.aeDoc = null;
    } 
  }

  updateAeData(){
    this.loading = true;
    const formData = this.aeUpdateForm.getRawValue();
    const updateAeData = {
      id: formData.id,
      grdnSl: formData.gradation_sl_no,
      engrName: formData.engineer_name,
      caste: formData.employee_caste_id, 
      jnTime: formData.joining_time, 
      serviceStatus: formData.service_status, 
      display: formData.display,
      inforce: formData.inforce, 
      notes: formData.notes,
      birthDate: this.aeDob,
      doj: this.aeDoj, 
      doc: this.aeDoc,
      dor: this.aeDor,
      eeHgrScale: this.eehs,
    }

    this.aengrsService.aeUpdateDataById(updateAeData).subscribe(() => {
      this.loading = false;
      this.formReset();
      Swal.fire({ position: 'top-end', icon: 'success', title: 'AE Data Updated successfully', showConfirmButton: false, timer: 2000 }); 

    }, err => {
      this.loading = false;
      Swal.fire({ position: 'top-end', icon: 'error', title: err, showConfirmButton: false, timer: 4000 }); 
    }); 
  }

  aeLatestGradations(){
    this.loading = true;
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      wef: this.gradationDate,
    }
    this.aengrsService.getAeLatestGradations(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.SelectedAeGradationWef = res.aeLatestTotal[0];
      this.AeGradationDateLists = res.aeGradationDate;
      this.aEngrs = res.assistantEngineers.data;

      this.totalRecords = res.aeLatestTotal[0].total;
      this.totalPages = res.assistantEngineers.total_pages;
      this.currentPage = res.assistantEngineers.current_page;
    });

  }

  onTableSizeChange(event): void {
    this.pageSize = event.target.value;
    this.currentPage = this.page;
    this.aeLatestGradations();
  }
  
  pageChanged(event: any): void {
    this.page = event.page;
    this.pageSize = event.itemsPerPage; 
    this.aeLatestGradations(); 
  }

  aeGradationListByWef(event: any): void {
    this.loading = true;
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      wef: event,
    }
    this.aengrsService.getAeGradationListByWef(requestObj).pipe(first()).subscribe((res: any) => {
      this.loading = false;
      this.SelectedAeGradationWef = res.aeSelectedTotal[0];
      this.aEngrs = res.assistantEngineers.data;
      this.AeGradationDateLists = res.aeGradationDate;
      
      this.totalRecords = res.assistantEngineers.total;
      this.totalPages = res.assistantEngineers.total_pages;
      this.currentPage = res.assistantEngineers.current_page;   
      
      this.aeUpdateForm.patchValue({
        gradation_list_wef: this.SelectedAeGradationWef.gradation_list_wef,      
      });

    });

  }

  getSearchTableData(event: any){
    if(event.length > 0){
      this.loading = true;
      this.aengrsService.getSearchData(event).pipe(first()).subscribe((res: any) => {
        this.loading = false;
        this.aEngrs = res.assistantEngineers.data;

        this.totalRecords = res.assistantEngineers.total;
        this.totalPages = res.assistantEngineers.total_pages;
        this.currentPage = res.assistantEngineers.current_page;
      });
    }    
    if(event.length <= 0){
      this.aeLatestGradations();
    }
  }

  formReset(){
    this.aeUpdateForm.reset();
  }

}

