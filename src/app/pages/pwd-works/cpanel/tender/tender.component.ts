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

  newTenderForm : FormGroup;
  depts: Department[] = [];
  designs: Designation[] = [];
  sections: Section[] = [];

  checked: boolean = true;
  expanded = true;
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

  workDate: any = null;
  woDate: any = null;
  doc: any = null;
  fiscalYear: any = '';

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
          this.deptShortName = response.data.department_short_name;
          this.loading = false;
          this.newTenderForm.patchValue({
            department_id: this.authUser.department_id,
          });
        })

      }

  ngOnInit(): void {
    this.getAllTenderDetails();
    this.getCurrentFinancialYear();

    this.authService.getAuthUserUpdateListener().subscribe( (res: any) => {
      this.authUser = res.user;
      this.loading = false;
    });

    this.tendersService.getTenderDetailsUpdateListener().subscribe( (res: any) => {
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

    this.newTenderForm = this.fb.group({
      department_id: new FormControl({ value: null, disabled: true}, [Validators.required]),
      work_name: new FormControl(null, [Validators.required]),
      agency: new FormControl(null, [Validators.required]),
      amount_put_tender: new FormControl(null, [Validators.required]),
      authority_designation_id: new FormControl(null, [Validators.required]),
      section_id: new FormControl(null, [Validators.required]),
      tdNo: new FormControl(null, [Validators.required]),
      woNo: new FormControl(null, [Validators.required]),
      work_order_date: new FormControl(null, [Validators.required]),
      contactual: new FormControl('', [Validators.required]),
      tendered_amount: new FormControl({ value: null, disabled: true}, [Validators.required]),
      commencement_date: new FormControl(null, [Validators.required]),
      dlpNum: new FormControl(null, [Validators.required]),
      financial_year: new FormControl(this.fiscalYear, [Validators.required]),
      complitionTime: new FormControl(null, [Validators.required]),
      comTimeUnit: new FormControl(null, [Validators.required]),
      remarks: new FormControl(null),
      actualComplitionDate: new FormControl(null),
    });

  }

  getAllTenderDetails(){
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
      this.woDate = formatDate(value, 'dd-MM-yyyy', 'en');
      this.workDate = formatDate(value, 'yyyy-MM-dd', 'en');
    }else{
      this.woDate = null;
      this.workDate = null;
    }
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

  addNewTenderDetails(){
    this.loading = true;

    const formData = this.newTenderForm.getRawValue();
    const tenderDetailsData = {
      workName: formData.work_name,
      agency: formData.agency,
      tender_No: formData.tdNo,
      work_order_no: formData.tdNo,
      tenderNo: formData.tdNo + ' of ' + formData.financial_year + ' accepted by ' + this.tenderAuthority + '/' + this.officeName + '/' + this.deptShortName,
      designation_id: formData.authority_designation_id,
      authorityOffice: this.officeName,
      amountPutTender: formData.amount_put_tender,
      contactual: formData.contactual,
      tenderedAmt: formData.tendered_amount,
      workOrderNo: formData.woNo + ' dated ' + this.woDate + ' of ' + this.tenderAuthority + '/' + this.officeName + '/' + this.deptShortName,
      workOrderDate: this.workDate,
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

    this.tendersService.saveTenderDetails(tenderDetailsData).subscribe(() => {
      this.loading = false;
      this.formReset();
      Swal.fire({ position: 'top-end', icon: 'success', showConfirmButton: false, timer: 3000, title: "Tender details Updated" });

    }, err => {
      console.log('ghfhf', err);
      this.loading = false;
      Swal.fire({ position: 'top-end', icon: 'error',  title: err.error, showConfirmButton: false, timer: 3000 });
    });

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
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.pageSize = event.itemsPerPage;
    this.getAllTenderDetails();
  }

  formReset(){
    this.newTenderForm.get('authority_designation_id').reset();
    this.newTenderForm.get('work_name').reset();
    this.newTenderForm.get('agency').reset();
    this.newTenderForm.get('tdNo').reset();
    this.newTenderForm.get('authority_designation_id').reset();
    this.newTenderForm.get('amount_put_tender').reset();
    this.newTenderForm.get('contactual').reset();
    this.newTenderForm.get('tendered_amount').reset();
    this.newTenderForm.get('woNo').reset();
    this.newTenderForm.get('work_order_date').reset();
    this.newTenderForm.get('section_id').reset();
    this.newTenderForm.get('commencement_date').reset();
    this.newTenderForm.get('dlpNum').reset();
    this.newTenderForm.get('complitionTime').reset();
    this.newTenderForm.get('comTimeUnit').reset();
    this.newTenderForm.get('remarks').reset();
  }

  //get current financial year
  getCurrentFinancialYear() {
    const today = new Date();
    if ((today.getMonth() + 1) <= 3) {
      this.fiscalYear = (today.getFullYear() - 1) + "-" + today.getFullYear();
    } else {
      this.fiscalYear = today.getFullYear() + "-" + (today.getFullYear() + 1);
    }
  }

  //get tendered amount calculation
  getTenderedAmount(){
    const apt = this.newTenderForm.get('amount_put_tender').value;
    const cPercent = this.newTenderForm.get('contactual').value;
    if(!this.checked){
      console.log(this.checked);
        this.newTenderForm.patchValue({
        tendered_amount: (apt*(1+(cPercent/100))).toFixed(2)
      });
    }else{
      console.log(this.checked);
        this.newTenderForm.patchValue({
        tendered_amount: (apt*(1+(cPercent/100))).toFixed(0)
      });
    }

  }

}
