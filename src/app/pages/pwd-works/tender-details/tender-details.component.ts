import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { DropdownService } from '../../../services/dropdown.service';
import { TenderDetails } from '../../../models/tenderDetails.model';
import { TendersService } from '../../../services/tenders.service';
import Swal from 'sweetalert2';


export interface Department {
  id: number;
  department_name: string;
  alias_name: string;
  department_short_name: string;
}
export interface Designation {
  id: number;
  designation_name: string;
  designation_alias: any;
}

@Component({
  selector: 'app-tender-details',
  templateUrl: './tender-details.component.html',
  styleUrls: ['./tender-details.component.scss']
})

export class TenderDetailsComponent implements OnInit {
  tenderDetailsForm : FormGroup;
  tenderDetails: TenderDetails[];
  loading = false;
  showBoundaryLinks = true;
  page: number = 1;
  currentPage: number;
  maxSize: number = 4;      //Limit the maximum visible page numbers
  pageSizes = [5, 10, 20, 50];  //option for items per page
  pageSize: number = 5;     //default items per page
  totalPages: number;
  totalRecords: Number;
  skip: number;

  depts: Department[] = [];
  designs: Designation[] = [];

  minDate: Date;
  maxDate: Date;
  woDate: string = null;
  doc: string = null;
  // tendersYear: any = [];
  // tenderMonths: string = null;


  constructor(private fb: FormBuilder, private tendersService: TendersService, private dropdownService : DropdownService,)
    {
      this.getAllTenderDetails();
      this.minDate = new Date();
      this.maxDate = new Date();
      this.minDate.setDate(this.minDate.getDate() - 29200); //maximum age 80yrs
      this.maxDate.setDate(this.maxDate.getDate() - 6570);  //minimum age 18yrs
    }

  ngOnInit(): void {
    this.getAllTenderDetails();

    this.dropdownService.getDepartments().subscribe((response: { departmentData: Department[]; }) => {
      this.depts = response.departmentData;
    });

    this.dropdownService.getTenderAuthority().subscribe((response: { designationData: Designation[]; }) => {
      this.designs = response.designationData;
      console.log(response.designationData);
      // this.designs = response.designationData;
    });


    this.tenderDetailsForm = this.fb.group({
      id: new FormControl({value:null, disabled: true}),
      work_name: new FormControl(null, [Validators.required]),
      agency: new FormControl(null, [Validators.required]),
      amount_put_tender: new FormControl(null, [Validators.required]),
      department_id: new FormControl(null, [Validators.required]),
      authority_designation_id: new FormControl(null, [Validators.required]),
      tenderNo: new FormControl(null, [Validators.required]),
      workOrderNo: new FormControl(null, [Validators.required]),
      work_order_date: new FormControl(null, [Validators.required]),
      contactual: new FormControl('', [Validators.required]),
      tendered_amount: new FormControl(null, [Validators.required]),
      commencement_date: new FormControl(null, [Validators.required]),
      dlp: new FormControl(null, [Validators.required]),
      financial_year: new FormControl(null, [Validators.required]),
      complition_time: new FormControl(null, [Validators.required]),
      display: new FormControl(1, [Validators.required]),
      inforce: new FormControl(1, [Validators.required]),
      remarks: new FormControl(null),
    });

  }

  getAllTenderDetails(){
    this.loading = true;
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      skip: (this.page-1) * this.pageSize
    }

    this.tendersService.getAllTenderDetails(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.tenderDetails = res.tenderDetails.data;
      this.totalRecords = res.tenderDetails.total;
      this.currentPage = res.tenderDetails.current_page;
      this.totalPages = res.tenderDetails.total_pages;
    });

  }

  changeDoc(value: Date): void {
    if(value != null){
      this.doc = formatDate(value, 'yyyy-MM-dd', 'en');
    }else{
      this.doc = null;
    }
  }

  changeWod(value: Date): void {
    if(value != null){
      this.woDate = formatDate(value, 'yyyy-MM-dd', 'en');
    }else{
      this.woDate = null;
    }
  }

  tenderDetailsById(event) {
    this.loading = true;
    this.tendersService.getTenderDetailsById(event).pipe(first()).subscribe((x: any) => {
      this.loading = false;
      this.tenderDetailsForm.patchValue(x.td);
    });
  }

  getUpdateTenderDetails(){
    this.loading = true;

    const formData = this.tenderDetailsForm.getRawValue();
    const updateTenderDetailseData = {
      workName: formData.work_name,
      agency: formData.agency,
      tenderNo: formData.tenderNo + ' of ' + formData.financial_year + ' accepted by ' + formData.tenderAuthorityAlias + '/' + formData.authority_office + '/' + formData.deptName,
      designation_id: formData.authority_designation_id,
      authorityOffice: formData.authority_office,
      amountPutTender: formData.amount_put_tender,
      contactual: formData.contactual,
      tenderedAmount: formData.tendered_amount,
      workOrderNo: formData.workOrderNo + ' dated ' + this.woDate + ' of ' + formData.designation_alias,
      workOrderDate: this.woDate,
      commencementDate: this.doc,
      sectionId: formData.section_id,
      ComplitionTime: formData.complition_time,
      dlp: formData.dlp,
      fy: formData.financial_year,
      actualComplitionDate: formData.department,
      display: formData.display,
      inforce: formData.inforce,
      remarks: formData.remarks,
    }

    console.log('updateTenderDetailseData', updateTenderDetailseData);

    this.tendersService.updateTenderDetails(updateTenderDetailseData).pipe(first()).subscribe(() => {

      Swal.fire({ position: 'top-end', icon: 'success', showConfirmButton: false, timer: 3000, title: "Tender details Updated" });
    }, err => {
      console.log('ghfhf', err);
      this.loading = false;
      Swal.fire({ position: 'top-end', icon: 'error',  title: err.error.message, showConfirmButton: false, timer: 2000 });
    });

  }

  getTenderAuthorityOffice(event: any){
    console.log(event);

  }

  getSearchTableTenderDetails(event: any){
    if(event.length > 0){
      this.loading = true;
      this.tendersService.getSearchTenderDetailsData(event).pipe(first()).subscribe((res:any) => {
        this.loading = false;
        this.tenderDetails = res.tdSearch.data;
        this.totalRecords = res.tdSearch.total;
        this.currentPage = res.tdSearch.current_page;
        this.totalPages = res.tdSearch.total_pages;
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

  formReset(){
    this.tenderDetailsForm.reset();
  }


}
