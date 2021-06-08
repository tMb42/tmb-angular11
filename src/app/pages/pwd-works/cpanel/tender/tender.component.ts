import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { DropdownService } from '../../../../services/dropdown.service';
import { TenderDetails } from '../../../../models/tenderDetails.model';
import { TendersService } from '../../../../services/tenders.service';
import Swal from 'sweetalert2';
import { AuthUser } from '../../../../models/auth-user.model';
import { Department } from '../../../../models/department.model';
import { Designation } from '../../../../models/designation.model';
import { AuthService } from '../../../../services/auth.service';
import { Section } from '../../../../models/section.model';

@Component({
  selector: 'app-tender',
  templateUrl: './tender.component.html',
  styleUrls: ['./tender.component.scss']
})
export class TenderComponent implements OnInit {
 authUser: AuthUser = null;
  tenderDetails: TenderDetails[] = null;

  tenderDetailsForm : FormGroup;
  depts: Department[] = [];
  designs: Designation[] = [];
  sections: Section[] = [];

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

  minDate: Date;
  maxDate: Date;

  woDate: any = null;
  doc: any = null;

  tenderAuthority: string = null;
  officeName: string = null;
  deptShortName: string = null;
  workingOfficeId: number = null;
  sectionId: number = null;
  subDivisionId: number = null;
  divnId: number = null;
  cirId: number = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tendersService: TendersService,
    private dropdownService : DropdownService,
    ) {
        this.minDate = new Date();
        this.maxDate = new Date();
        this.minDate.setDate(this.minDate.getDate() - 29200); //maximum age 80yrs
        this.maxDate.setDate(this.maxDate.getDate() - 6570);  //minimum age 18yrs

        this.authService.getAuthUser().pipe(first()).subscribe((response: any) => {
          this.authUser = response.data;
          this.workingOfficeId = response.data.officeId;
          this.sectionId = response.data.sectionId;
          this.subDivisionId = response.data.subDivisionId;
          this.divnId = response.data.divisionId;
          this.cirId = response.data.circleId;
          this.loading = false;
          this.tenderDetailsForm.patchValue({
            department_id: this.authUser.department_id,

          });
        })

        // this.getAllTenderDetails();

      }

  ngOnInit(): void {
    this.getAllTenderDetails();

    this.authService.getAuthUserUpdateListener().subscribe( (res: any) => {
      this.authUser = res.user;
      this.loading = false;
    });

    this.tendersService.getTenderDetailsUpdateListener().subscribe( res => {
      this.tenderDetails = res;
      this.loading = false;
    });

    this.tendersService.getAllSectionAsPerAuthUserForTenderDetails().subscribe((response: { sections: Section[]; }) => {
      this.sections = response.sections;
    });

    this.dropdownService.getDepartments().subscribe((response: { departmentData: Department[]; }) => {
      this.depts = response.departmentData;
    });

    this.dropdownService.getTenderAuthority().subscribe((response: { designationData: Designation[]; }) => {
      this.designs = response.designationData;
    });


    this.tenderDetailsForm = this.fb.group({
      id: new FormControl({value:null}),
      department_id: new FormControl(null, [Validators.required]),
      work_name: new FormControl(null, [Validators.required]),
      agency: new FormControl(null, [Validators.required]),
      amount_put_tender: new FormControl(null, [Validators.required]),
      authority_designation_id: new FormControl(null, [Validators.required]),
      section_id: new FormControl(null, [Validators.required]),
      tdNO: new FormControl(null, [Validators.required]),
      woNO: new FormControl(null, [Validators.required]),
      work_order_date: new FormControl(null, [Validators.required]),
      contactual: new FormControl('', [Validators.required]),
      tendered_amount: new FormControl(null, [Validators.required]),
      commencement_date: new FormControl(null, [Validators.required]),
      dlpNum: new FormControl(null, [Validators.required]),
      financial_year: new FormControl(null, [Validators.required]),
      complitionTime: new FormControl(null, [Validators.required]),
      comTimeUnit: new FormControl(null, [Validators.required]),
      display: new FormControl(null, [Validators.required]),
      inforce: new FormControl(null, [Validators.required]),
      remarks: new FormControl(null),
      actualComplitionDate: new FormControl(null),
    });
  }

  getAllTenderDetails(){
    this.loading = true;
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      skip: (this.page-1) * this.pageSize,
    }

    this.tendersService.getAllTenderDetails(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.tenderDetails = res.authTenderDetails.data;
      this.totalRecords = res.authTenderDetails.total;
      this.currentPage = res.authTenderDetails.current_page;
      this.totalPages = res.authTenderDetails.total_pages;
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

  tenderDetailsById(tenderId: number) {
    this.loading = true;
    this.tendersService.getTenderDetailsById(tenderId).pipe(first()).subscribe((x: any) => {
      this.loading = false;
      this.tenderDetailsForm.patchValue(x.td);
      this.deptShortName = x.td.deptName;
    });

  }

  getTenderAuthorityOffice(designationId: number){
    if(designationId == 5){
      this.tenderAuthority = this.designs[0].designation_alias,
      this.officeName = this.authUser.circleName
      console.log(this.tenderAuthority, this.officeName);
    }else if(designationId == 4){
      this.tenderAuthority = this.designs[1].designation_alias,
      this.officeName = this.authUser.divnName
      console.log(this.tenderAuthority, this.officeName);
    }else if(designationId == 3){
      this.tenderAuthority = this.designs[2].designation_alias,
      this.officeName = this.authUser.subDivnName
      console.log(this.tenderAuthority, this.officeName);
    }else{

    }

  }

  getUpdateTenderDetails(){
    this.loading = true;

    const formData = this.tenderDetailsForm.getRawValue();
    const updateTenderDetailseData = {
      id: formData.id,
      workName: formData.work_name,
      agency: formData.agency,
      tenderNo: formData.tdNO + ' of ' + formData.financial_year + ' accepted by ' + this.tenderAuthority + '/' + this.officeName + '/' + this.deptShortName,
      designation_id: formData.authority_designation_id,
      authorityOffice: this.officeName,
      amountPutTender: formData.amount_put_tender,
      contactual: formData.contactual,
      tenderedAmount: formData.tendered_amount,
      workOrderNo: formData.woNO + ' dated ' + this.woDate + ' of ' + this.tenderAuthority + '/' + this.officeName + '/' + this.deptShortName,
      workOrderDate: this.woDate,
      commencementDate: this.doc,
      sectionId: formData.section_id,
      ComplitionTime: formData.complitionTime + ' ' + formData.comTimeUnit,
      dlp: formData.dlpNum + ' months',
      fy: formData.financial_year,
      actualComplitionDate: formData.actualComplitionDate,
      display: formData.display,
      inforce: formData.inforce,
      remarks: formData.remarks,
    }

    this.tendersService.updateTenderDetails(updateTenderDetailseData).subscribe(() => {
      this.loading = false;
      Swal.fire({ position: 'top-end', icon: 'success', showConfirmButton: false, timer: 3000, title: "Tender details Updated" });

    }, err => {
      console.log('ghfhf', err);
      this.loading = false;
      Swal.fire({ position: 'top-end', icon: 'error',  title: err.error, showConfirmButton: false, timer: 3000 });
    });

  }

  // getCurrentFinancialYear() {
  //   var financial_year = "";
  //   console.log('ff', financial_year);
  //   const today = new Date();
  //   if ((today.getMonth() + 1) <= 3) {
  //       financial_year = (today.getFullYear() - 1) + "-" + today.getFullYear()
  //   } else {
  //       financial_year = today.getFullYear() + "-" + (today.getFullYear() + 1)
  //   }
  //   return financial_year;
  // }


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
