import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { DropdownService } from '../../../services/dropdown.service';
import { TenderDetails } from '../../../models/tenderDetails.model';
import { TendersService } from '../../../services/tenders.service';
import Swal from 'sweetalert2';
import { AuthUser } from '../../../models/auth-user.model';
import { Department } from '../../..//models/department.model';
import { Designation } from '../../../models/designation.model';
import { AuthService } from '../../../services/auth.service';
import { Section } from '../../../models/section.model';
import { Circle } from 'src/app/models/circle.model';
import { Division } from 'src/app/models/division.model';
import { SubDivision } from 'src/app/models/subDivision.model';
import { ThisReceiver } from '@angular/compiler';



@Component({
  selector: 'app-tender-details',
  templateUrl: './tender-details.component.html',
  styleUrls: ['./tender-details.component.scss']
})

export class TenderDetailsComponent implements OnInit {
  authUser: AuthUser = null;
  tenderDetails: TenderDetails[] = null;

  pwdTenderDetailsForm : FormGroup;
  circleForm: FormGroup;
  divisionForm: FormGroup;
  subDivisionForm: FormGroup;
  sectionForm: FormGroup;

  depts: Department[] = [];
  designs: Designation[] = [];
  circles: Circle[] = [];
  divns: Division[] = [];
  subDivns: SubDivision[] = [];
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
  designationId: number = null;

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
          this.designationId = response.data.designation_id;
          this.workingOfficeId = response.data.officeId;
          this.sectionId = response.data.sectionId;
          this.subDivisionId = response.data.subDivisionId;
          this.divnId = response.data.divisionId;
          this.cirId = response.data.circleId;
          this.loading = false;

          if(this.designationId == 5){
            //get circle when auth designation is SE
            this.pwdTenderDetailsForm.patchValue({
              circle_id: this.authUser.circleId,
            });
            this.dropdownService.getAllDivisionsByCircleId(this.authUser.circleId).subscribe((response: { divnData: Division[]; }) => {
              this.divns = response.divnData;
            });

          }else if(this.designationId === 4){
            //get Division when auth designation is EE
            this.pwdTenderDetailsForm.patchValue({
              division_id: this.authUser.divisionId
            });

            this.dropdownService.getAllSubDivisionsByDivisionId(this.authUser.divisionId).subscribe((response: { subDivnData: SubDivision[]; }) => {
              this.subDivns = response.subDivnData;
            });

          }else if(this.designationId == 3){
            //get Sub-Division when auth designation is AE
            this.pwdTenderDetailsForm.patchValue({
              sub_division_id: this.authUser.subDivisionId,
            });
            this.dropdownService.getAllSectionsBySubDivisionId(this.authUser.subDivisionId).subscribe((response: { SecData: Section[]; }) => {
              this.sections = response.SecData;
            });

          }else if(this.designationId == 2){
            //get Section when auth designation is JE
            this.pwdTenderDetailsForm.patchValue({
              section_id: this.authUser.sectionId
            });

          }else{
            //
          }

        })

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

    this.dropdownService.getDepartments().subscribe((response: { departmentData: Department[]; }) => {
      this.depts = response.departmentData;
    });

    this.dropdownService.getTenderAuthority().subscribe((response: { designationData: Designation[]; }) => {
      this.designs = response.designationData;
    });

    this.pwdTenderDetailsForm = this.fb.group({
      department_id: new FormControl(null),
      circle_id: new FormControl(null),
      division_id: new FormControl(null),
      sub_division_id: new FormControl(null),
      section_id: new FormControl(null),
    });

  }

  getDivisionsByCircle(circleId: number){
    this.dropdownService.getAllDivisionsByCircleId(circleId).subscribe((response: { divnData: Division[]; }) => {
      this.divns = response.divnData;
    });
  }

  getSubDivisionsByDivision(divnId: number){
    this.dropdownService.getAllSubDivisionsByDivisionId(divnId).subscribe((response: { subDivnData: SubDivision[]; }) => {
      this.subDivns = response.subDivnData;
    });
  }

  getSectionsBySubDivision(subDivnId: number){
    this.dropdownService.getAllSectionsBySubDivisionId(subDivnId).subscribe((response: { SecData: Section[]; }) => {
      this.sections = response.SecData;
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


  // getTenderAuthorityOffice(designationId: number){
  //   if(designationId == 5){
  //     this.tenderAuthority = this.designs[0].designation_alias,
  //     this.officeName = this.authUser.circleName
  //     console.log(this.tenderAuthority, this.officeName);
  //   }else if(designationId == 4){
  //     this.tenderAuthority = this.designs[1].designation_alias,
  //     this.officeName = this.authUser.divnName
  //     console.log(this.tenderAuthority, this.officeName);
  //   }else if(designationId == 3){
  //     this.tenderAuthority = this.designs[2].designation_alias,
  //     this.officeName = this.authUser.subDivnName
  //     console.log(this.tenderAuthority, this.officeName);
  //   }else{

  //   }

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


}
