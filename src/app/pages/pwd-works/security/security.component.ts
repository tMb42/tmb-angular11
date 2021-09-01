import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthUser } from 'src/app/models/auth-user.model';
import { Designation } from 'src/app/models/designation.model';
import { Division } from 'src/app/models/division.model';
import { Section } from 'src/app/models/section.model';
import { SubDivision } from 'src/app/models/subDivision.model';
import { DueSecurityPercent, SecurityRules, TenderedSecurity } from 'src/app/models/tenderDetails.model';
import { AuthService } from 'src/app/services/auth.service';
import { DropdownService } from 'src/app/services/dropdown.service';
import { TendersService } from 'src/app/services/tenders.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})

export class SecurityComponent implements OnInit {
  newSecurityReleaseForm: FormGroup;
  loading = false;
  expanded = false;
  authUser: AuthUser = null;
  tabIndex: number = 1;

  securityReleaseAction: TenderedSecurity[] = null;
  fullSecurityDue: TenderedSecurity[] = null;
  partSecurityReleased: TenderedSecurity[] = null;
  finalSecurityReleased: TenderedSecurity[] = null;
  tenderedSecurity: TenderedSecurity[] = null;
  editDetails: TenderedSecurity[] = null;
  dueSecurityPercent: DueSecurityPercent[] = null;
  designs: Designation[] = [];
  divns: Division[] = [];
  subDivns: SubDivision[] = [];
  sections: Section[] = [];
  securityRules: SecurityRules[] = [];

  showBoundaryLinks = true;
  page: number = 1;
  currentPage: number;
  maxSize: number = 4;      //Limit the maximum visible page numbers
  pageSizes = [10, 20, 50, 100];  //option for items per page
  pageSize: number = 10;     //default items per page
  totalPages: number;
  totalRecords: Number;
  skip: number;
  fullSecurityTotal: Number;
  securityRulesOrder: any = null;
  authDesignId:  number = null;
  officeId:  number = null;
  designId:  number = null;
  tenderId: number = null;
  dor: any = null;
  securityDueDate: Date = null;
  diffDlp: number = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private tendersService: TendersService, private router: Router, private   dropdownService : DropdownService) { }


  ngOnInit(): void {
    this.authService.getAuthUser().pipe(first()).subscribe((response: any) => {
      if(response.data.designation_id == 2){
        this.tabIndex = 1;
      }
      this.tabIndex = 0;

      this.authUser = response.data;
      this.newSecurityReleaseForm.patchValue({
        authDesignId: response.data.designation_id,
        section_id: this.authUser.sectionId,
        office_id: this.authUser.officeId,
      });
      this.loading = false;

    });

    this.getAllAuthenticatedTenderDetailsForSecurityRelease()

    this.authService.getAuthUserUpdateListener().subscribe( (res: any) => {
      this.authUser = res.user;
      this.loading = false;
    });

    this.dropdownService.getSecurityReleasedByDesignations().subscribe((response: { designationData: Designation[]; }) => {
      this.designs = response.designationData;
    });

    this.tendersService.getTenderSecurityDetailsListener().subscribe( response => {
      this.tenderedSecurity = response;
      this.loading = false;
    });

    this.newSecurityReleaseForm = this.fb.group({
      authDesignId: new FormControl({ value: null, disabled: true}, [Validators.required]),
      dlp_security_releases_id: new FormControl(null, [Validators.required]),
      security_release_date: new FormControl(new Date(), [Validators.required]),
      abstract_mb: new FormControl(null, [Validators.required]),
      remarks: new FormControl(null),
    });
  }

  changeDor(value: Date): void {
    this.dor = formatDate(value, 'yyyy-MM-dd', 'en');
  }

  getAllAuthenticatedTenderDetailsForSecurityRelease(){
    this.loading = true;
    const requestObj = {
      selectedOffice: this.officeId,
      designationId: this.designId,
      page: this.page,
      itemsPerPage: this.pageSize,
      skip: (this.page-1) * this.pageSize
    }

    this.tendersService.getAllTenderDetailsAsPerAuthUserForSecurityRelease(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      if (res.success == 1){
        this.fullSecurityDue = res.fullSecurityDue.data;
        this.securityReleaseAction = res.securityReleaseAction.data;
        this.partSecurityReleased = res.partSecurityReleased.data;
        this.finalSecurityReleased = res.finalSecurityReleased.data;
        this.tenderedSecurity = res.tenderedSecurity.data;

        this.totalRecords = res.fullSecurityDue.total;
        this.currentPage = res.fullSecurityDue.current_page;
        this.totalPages = res.fullSecurityDue.total_pages;

      }else if(res.success == 0){
        this.loading = false;
        Swal.fire({ position: 'top-end', icon: 'warning', title: res.message, showConfirmButton: false, timer: 4000 });
      }else{
        //
      }

    });
  }

  onTableSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.currentPage = this.page;
    this.getAllAuthenticatedTenderDetailsForSecurityRelease();
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.pageSize = event.itemsPerPage;
    this.getAllAuthenticatedTenderDetailsForSecurityRelease();
  }

  getSearchTableTenderDetails(event: any){
    if(event.length > 0){
      this.loading = true;
      this.expanded = false;
      this.tendersService.getSearchTenderSecurityDetailsData(event).pipe(first()).subscribe((res:any) => {
        this.loading = false;
        this.tenderedSecurity = res.tdSearch.data;
        this.fullSecurityDue = res.tdSearch.data;
        this.totalRecords = res.tdSearch.total;
        this.currentPage = res.tdSearch.current_page;
        this.totalPages = res.tdSearch.total_pages;
      });
    }

    if(event.length <= 0){
      this.expanded = false;
      this.getAllAuthenticatedTenderDetailsForSecurityRelease();
    }
  }

  formResetwithclose(){
    this.expanded = false;
  }

  getTenderDetailsById(tenderId: number) {
    this.loading = true;
    this.expanded = true;
    const requestObj = {
      tender_id: tenderId,
    }
    this.tendersService.getSecurityReleasedDetailsByTenderId(requestObj).subscribe((x: any) => {
      this.loading = false;
      this.dueSecurityPercent = x.securityDue;
      this.securityRules = x.securityRules;
      this.securityDueDate = x.securityDueDate;
      this.diffDlp = x.diffDlp;
      this.securityRulesOrder = x.securityRules[0].remarks;
      this.tenderId = x.tenderDetails[0].id;
      this.newSecurityReleaseForm.patchValue(x.tenderDetails);
       this.editDetails = x.tenderDetails[0];
      this.newSecurityReleaseForm.patchValue({
        abstract_mb : x.securityDue[0].abstract_mb
      });

      if (x.success === 0){
        Swal.fire({ position: 'top-end', icon: 'warning', showConfirmButton: false, timer: 4000, title: x.message });
      }
    });
  }

  getSecuirityReleasedDetails(tenderId: number, tenderSecurityId: number) {
    this.loading = true;
    this.expanded = true;
    const requestObj = {
      tender_id: tenderId,
      tendered_secutity_id: tenderSecurityId,
    }
    console.log(requestObj);
    this.tendersService.getSecurityReleasedActionDetailsByTenderId(requestObj).subscribe((x: any) => {
      this.loading = false;
      this.dueSecurityPercent = x.releasePercent;
      this.securityRules = x.securityRules;
      this.securityDueDate = x.securityDueDate;
      this.diffDlp = x.diffDlp;
      this.securityRulesOrder = x.securityRules[0].remarks;
      this.editDetails = x.securityReleaseAction[0];
      this.tenderId = x.securityReleaseAction[0].tender_details_id;
      this.newSecurityReleaseForm.patchValue({
        abstract_mb : x.securityReleaseAction[0].abstract_mb,
        dlp_security_releases_id : x.securityReleaseAction[0].dlp_security_releases_id,
      });


      if (x.success === 0){
        Swal.fire({ position: 'top-end', icon: 'warning', showConfirmButton: false, timer: 4000, title: x.message });
      }
    });
  }

  saveSecurityReleaseDetails(){
    this.loading = true;
    const formData = this.newSecurityReleaseForm.getRawValue();
    const detailsData = {
      tender_id: this.tenderId,
      designationId: formData.authDesignId,
      dlpSRId: formData.dlp_security_releases_id,
      securityReleaseDate: this.dor,
      abstMb: formData.abstract_mb,
      remarks: formData.remarks,
    }

    this.tendersService.saveNewSecurityReleaseDetails(detailsData).subscribe((res: any) => {
      this.loading = false;
      if (res.success === 1){
        this.tabIndex = 1;
        this.expanded = false;
        Swal.fire({ position: 'top-end', icon: 'success', showConfirmButton: false, timer: 3000, title: 'Security Released successfully from this end.' });
      }else if(res.success === 0){
        this.expanded = true;
        Swal.fire({ position: 'top-end', icon: 'warning', showConfirmButton: false, timer: 4000, title: "Validation Error" });
      }else{
        Swal.fire({ position: 'top-end', icon: 'error', title: res.error, showConfirmButton: false,
          timer: 3000
        });
      }

    }, err => {
      this.loading = false;
      Swal.fire({ position: 'top-end', icon: 'error',  title: err.error, showConfirmButton: false, timer: 3000 });
    });

  }


}
