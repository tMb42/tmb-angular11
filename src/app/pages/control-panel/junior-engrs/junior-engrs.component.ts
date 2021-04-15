import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { JengrsService } from '../../../services/jengrs.service';
import { DropdownService } from '../../../services/dropdown.service';
import { JEngrs } from '../../../models/jengrs.model';
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
  selector: 'app-junior-engrs',
  templateUrl: './junior-engrs.component.html',
  styleUrls: ['./junior-engrs.component.scss']
})
export class JuniorEngrsComponent implements OnInit {
  jeUpdateForm: FormGroup; 
  showBoundaryLinks = true;
  page: number = 1;
  currentPage: number;
  maxSize: number = 4;      //Limit the maximum visible page numbers
  pageSize: number = 10;     //default items per page
  pageSizes = [10, 20, 50, 100, 200];  //option for items per page
  totalPages: number;
  totalRecords: number;
  
  jEngrs: JEngrs[];
  castes: Castes[] = [];
  designations: Designations[] = [];
  JeGradationDateLists: any = [];
  SelectedJeGradationWef: any = '';
  gradationDate: any = '';
  loading = false; 

  minDate: Date;
  maxDate: Date;
  jeDob: string = null;
  jeDoj: string = null;
  jeDoc: string = null;
  jeDor: string = null;
  gwef: string = null;
  
  constructor(private fb: FormBuilder, private dropdownService : DropdownService, private jengrsService: JengrsService) 
  { 
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate() - 29200); //maximum age 80yrs
    this.maxDate.setDate(this.maxDate.getDate() - 6570);  //minimum age 18yrs
  }

  ngOnInit(): void {
    this.loading = true;
    this.jeLatestGradations();
  
    this.dropdownService.getCastes().subscribe((response: { castes: Castes[]; }) => {      
      this.castes = response.castes;     
    });

    this.dropdownService.getAeDesignations().subscribe((response: { designationData: Designations[]; }) => {      
      this.designations = response.designationData;     
    });

    this.jengrsService.getJeUpdateListener().subscribe( res => {
      this.loading = false;
      this.jEngrs = res;
    });
     
    this.jeUpdateForm = this.fb.group({
      id: [null, Validators.required],
      gradation_sl_no: [null, Validators.required],
      engineer_name: [null, Validators.required],
      employee_caste_id: [null, Validators.required],
      engineer_dob: [null, Validators.required],
      promo_designation_id: null,
      junior_engineers_doj: null,
      junior_engineers_doc: null,
      engineer_dor: [null, Validators.required],
      year_passing_de: null,
      year_allot_psc: null,
      service_status: null,
      notes: null,
      gradation_list_wef: [null, Validators.required],
      display: [null, Validators.required],
      inforce: [null, Validators.required],
    });

  }

  getEngrsDetailsById(event) {
    this.loading = true;
    this.jengrsService.getJeDetailsById(event).pipe(first()).subscribe((x: any) => {
      this.loading = false;
      this.jeUpdateForm.patchValue(x.je);
    }); 
  }

  changeDob(value: Date): void {
    if(value != null){
      this.jeDob = formatDate(value, 'yyyy-MM-dd', 'en');
    }else{
      this.jeDoc = null;
    }
  }
  changeDoj(value: Date): void {
    if(value != null){
      this.jeDoj = formatDate(value, 'yyyy-MM-dd', 'en');
    }else{
      this.jeDoc = null;
    } 
  }
  changeDoc(value: Date): void {
    if(value != null){
      this.jeDoc = formatDate(value, 'yyyy-MM-dd', 'en');
    }else{
      this.jeDoc = null;
    } 
  }
  changeDor(value: Date): void {
    if(value != null){
      this.jeDor = formatDate(value, 'yyyy-MM-dd', 'en');
    }else{
      this.jeDoc = null;
    }    
  }
  changeWef(value: Date): void {
    if(value != null){
      this.gwef = formatDate(value, 'yyyy-MM-dd', 'en');
    }else{
      this.gwef = null;
    }    
  }
  

  updateJeData(){
    this.loading = true;
    const formData = this.jeUpdateForm.getRawValue();
    const updateJeData = {
      id: formData.id,
      grdnSl: formData.gradation_sl_no,
      engrName: formData.engineer_name,
      caste: formData.employee_caste_id, 
      serviceStatus: formData.service_status, 
      display: formData.display,
      inforce: formData.inforce, 
      notes: formData.notes,
      birthDate: this.jeDob,
      doj: this.jeDoj, 
      doc: this.jeDoc,
      dor: this.jeDor,
      wef: this.gwef,
      pscAlotYr: formData.year_allot_psc,
      passYr: formData.year_passing_de,
      promoDsgn: formData.promo_designation_id,
    }
    console.log(updateJeData);

    this.jengrsService.jeUpdateDataById(updateJeData).subscribe(() => {
      this.loading = false;
      Swal.fire({ position: 'top-end', icon: 'success', title: 'JE Data Updated successfully', showConfirmButton: false, timer: 2000 }); 
    }, err => {
      this.loading = false;
      Swal.fire({ position: 'top-end', icon: 'error', title: err, showConfirmButton: false, timer: 4000 }); 
    }); 
  }

  jeLatestGradations(){
    this.loading = true;
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      wef: this.gradationDate,
    }
    this.jengrsService.getJeLatestGradations(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.SelectedJeGradationWef = res.jeLatestTotal[0];
      this.JeGradationDateLists = res.jeGradationDate;
      this.jEngrs = res.juniorEngineer.data;

      this.totalRecords = res.jeLatestTotal[0].total;
      this.totalPages = res.juniorEngineer.total_pages;
      this.currentPage = res.juniorEngineer.current_page;
    });

  }

  onTableSizeChange(event): void {
    this.pageSize = event.target.value;
    this.currentPage = this.page;
    this.jeLatestGradations();
  }
  
  pageChanged(event: any): void {
    this.page = event.page;
    this.pageSize = event.itemsPerPage; 
    this.jeLatestGradations(); 
  }

  aeGradationListByWef(event: any): void {
    this.loading = true;
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      wef: event,
    }
    this.jengrsService.getJeGradationListByWef(requestObj).pipe(first()).subscribe((res: any) => {
      this.loading = false;
      this.SelectedJeGradationWef = res.jeSelectedTotal[0];
      this.jEngrs = res.juniorEngineer.data;
      this.JeGradationDateLists = res.jeGradationDate;
      
      this.totalRecords = res.juniorEngineer.total;
      this.totalPages = res.juniorEngineer.total_pages;
      this.currentPage = res.juniorEngineer.current_page;   
      
      this.jeUpdateForm.patchValue({
        gradation_list_wef: this.SelectedJeGradationWef.gradation_list_wef,      
      });

    });

  }

  getSearchTableData(event: any){
    if(event.length > 0){
      this.loading = true;
      this.jengrsService.getSearchData(event).pipe(first()).subscribe((res: any) => {
        this.loading = false;
        this.jEngrs = res.juniorEngineer.data;

        this.totalRecords = res.juniorEngineer.total;
        this.totalPages = res.juniorEngineer.total_pages;
        this.currentPage = res.juniorEngineer.current_page;
      });
    }    
    if(event.length <= 0){
      this.jeLatestGradations();
    }
  }

  formReset(){
    this.jeUpdateForm.reset();
  }

}

