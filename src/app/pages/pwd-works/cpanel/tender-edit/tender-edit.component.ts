import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { TenderDetails } from 'src/app/models/tenderDetails.model';
import { DropdownService } from 'src/app/services/dropdown.service';
import { TendersService } from 'src/app/services/tenders.service';
import { AuthUser } from '../../../../models/auth-user.model';
import { Department } from '../../../../models/department.model';
import { Designation } from '../../../../models/designation.model';
import { AuthService } from '../../../../services/auth.service';
import { Section } from '../../../../models/section.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tender-edit',
  templateUrl: './tender-edit.component.html',
  styleUrls: ['./tender-edit.component.scss']
})
export class TenderEditComponent implements OnInit {
  authUser: AuthUser = null;
  tenderDetails: TenderDetails[];

  tenderEditForm : FormGroup;
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
  officeId:  number = null;
  designId:  number = null;
  tenderOfficeDetails: any = null;

  amount_put_tender: number = 0;
  contactual: number = 0;
  tendered_amount: number = 0;

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
          this.tenderEditForm.patchValue({
            department_id: this.authUser.department_id,
          });
        })

      }

  ngOnInit(): void {
    this.loading = true;
    this.getAllAuthenticatedTenderDetails();

    this.authService.getAuthUserUpdateListener().subscribe( (res: any) => {
      this.authUser = res.user;
      this.loading = false;
    });

    this.tendersService.getTenderDetailsUpdateListener().subscribe( res => {
      this.loading = false;
      this.tenderDetails = res;
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


    this.tenderEditForm = this.fb.group({
      id: new FormControl(null, [Validators.required]),
      department_id: new FormControl(null, [Validators.required]),
      work_name: new FormControl(null, [Validators.required]),
      agency: new FormControl(null, [Validators.required]),
      amount_put_tender: new FormControl(null, [Validators.required]),
      authority_designation_id: new FormControl(null, [Validators.required]),
      // authority_office: new FormControl(null, [Validators.required]),
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

  getAllAuthenticatedTenderDetails(){
    this.loading = true;
    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      selectedOffice: this.officeId,
      designationId: this.designId,
    }
    this.tendersService.getAllTenderDetailsAsPerAuthUser(requestObj).pipe(first()).subscribe((res:any) => {
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


  getTenderedAmount(): void {
    const formData = this.tenderEditForm.getRawValue();
    this.tendered_amount = formData.amountPutTender*formData.contactual
    console.log('dgdg', this.tendered_amount);
  }

  getEditTenderDetailsById(tenderId: number) {
    this.loading = true;
    this.tendersService.getTenderDetailsById(tenderId).subscribe((x: any) => {
      this.loading = false;
      this.tenderEditForm.patchValue(x.td);
      this.deptShortName = x.td.deptName;
      this.officeName = x.td.authority_office;
      this.tenderAuthority = x.td.tenderAuthority;
    });

  }

  getTenderAuthorityOffice(designationId: number){
    if(designationId == 5){
      this.tenderAuthority = this.designs[0].designation_alias,
      this.officeName = this.authUser.circleName
    }else if(designationId == 4){
      this.tenderAuthority = this.designs[1].designation_alias,
      this.officeName = this.authUser.divnName
    }else if(designationId == 3){
      this.tenderAuthority = this.designs[2].designation_alias,
      this.officeName = this.authUser.subDivnName
    }else{

    }

  }


  getUpdateTenderDetails(){
    this.loading = true;

    const formData = this.tenderEditForm.getRawValue();
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

    this.tendersService.updateTenderDetails(updateTenderDetailseData).subscribe( (res: any) => {
      this.loading = false;
      if (res.success === 1){
        Swal.fire({ position: 'top-end', icon: 'success', showConfirmButton: false, timer: 3000, title: res.message });
      }else if(res.success === 0){
        console.log(res);
        Swal.fire({ position: 'top-end', icon: 'warning', showConfirmButton: false, timer: 4000, title: "Validation Error" });
      }else{
        //
      }

    }, err => {
      this.loading = false;
      Swal.fire({ position: 'top-end', icon: 'error',  title: err, showConfirmButton: false, timer: 3000 });
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
      this.getAllAuthenticatedTenderDetails();
    }

  }

  onTableSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.currentPage = this.page;
    this.getAllAuthenticatedTenderDetails();
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.pageSize = event.itemsPerPage;
    this.getAllAuthenticatedTenderDetails();
  }

  formReset(){
    this.tenderEditForm.reset();
  }


}
