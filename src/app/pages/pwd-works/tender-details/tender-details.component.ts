import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { DropdownService } from '../../../services/dropdown.service';
import { TenderDetails } from '../../../models/tenderDetails.model';
import { TendersService } from '../../../services/tenders.service';
import { AuthUser } from '../../../models/auth-user.model';
import { Department } from '../../..//models/department.model';
import { Designation } from '../../../models/designation.model';
import { AuthService } from '../../../services/auth.service';
import { Section } from '../../../models/section.model';
import { Circle } from 'src/app/models/circle.model';
import { Division } from 'src/app/models/division.model';
import { SubDivision } from 'src/app/models/subDivision.model';

import Swal from 'sweetalert2';



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
  tenderAmountStatistic: any = [];

  expanded = false;
  loading = false;
  showBoundaryLinks = true;
  page: number = 1;
  currentPage: number;
  maxSize: number = 4;      //Limit the maximum visible page numbers
  pageSizes = [10, 20, 50, 100];  //option for items per page
  pageSize: number = 10;     //default items per page
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
  deptId: number = null;

  authDesignId:  number = null;
  officeId:  number = null;
  designId:  number = null;
  tenderAmountDetails: any = null;

  constructor( private fb: FormBuilder, private authService: AuthService, private tendersService: TendersService, private router: Router, private   dropdownService : DropdownService) {

    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate() - 29200); //maximum age 80yrs
    this.maxDate.setDate(this.maxDate.getDate() - 6570);  //minimum age 18yrs

    this.authService.getAuthUser().pipe(first()).subscribe((response: any) => {
      this.authUser = response.data;
      this.authDesignId = response.data.designation_id;
      this.workingOfficeId = response.data.officeId;
      this.sectionId = response.data.sectionId;
      this.subDivisionId = response.data.subDivisionId;
      this.divnId = response.data.divisionId;
      this.cirId = response.data.circleId;
      this.deptId = this.authUser.department_id;
      this.loading = false;

      if(this.authDesignId == 6){
        //get Division when auth designation is SE
        this.tendersService.getValidCirclesByDeprtId(this.authUser.department_id).subscribe((response: { circleData: Circle[]; }) => {
          this.circles = response.circleData;
        });

      }else if(this.authDesignId == 5){
        //get Division when auth designation is SE
        this.tendersService.getValidDivisionsByCircleId(this.authUser.circleId).subscribe((response: { divnData: Division[]; }) => {
          this.divns = response.divnData;
        });

      }else if(this.authDesignId === 4){
        // get Sub-Division when auth designation is EE
        this.tendersService.getValidSubDivisionsByDivisionId(this.authUser.divisionId).subscribe((response: { subDivnData: SubDivision[]; }) => {
          this.subDivns = response.subDivnData;
        });

      }else if(this.authDesignId == 3){
        //get Section when auth designation is AE
        this.tendersService.getValidSectionsBySubDivisionId(this.authUser.subDivisionId).subscribe((response: { SecData: Section[]; }) => {
          this.sections = response.SecData;
        });

      }else if(this.authDesignId == 2){
        //get Section when auth designation is JE

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


    this.pwdTenderDetailsForm = this.fb.group({
      department_id: new FormControl(null),
      circle_id: new FormControl(null),
      division_id: new FormControl(null),
      sub_division_id: new FormControl(null),
      section_id: new FormControl(null),
    });

  }

  getCirclesByDeprtment(dptId: number, design_Id: number){
    this.officeId = dptId;
    this.designId = design_Id;
    this.tendersService.getValidCirclesByDeprtId(dptId).subscribe((response: { circleData: Circle[]; }) => {
      this.circles = response.circleData;
    });
  }

  getDivisionsByCircle(circleId: number, design_Id: number){
    this.officeId = circleId;
    this.designId = design_Id;
    this.tendersService.getValidDivisionsByCircleId(circleId).subscribe((response: { divnData: Division[]; }) => {
      this.divns = response.divnData;
    });
  }

  getSubDivisionsByDivision(divnId: number, design_Id: number){
    this.officeId = divnId;
    this.designId = design_Id;
    this.tendersService.getValidSubDivisionsByDivisionId(divnId).subscribe((response: { subDivnData: SubDivision[]; }) => {
      this.subDivns = response.subDivnData;
    });
  }

  getSectionsBySubDivision(subDivnId: number, design_Id: number){
    this.officeId = subDivnId;
    this.designId = design_Id;
    this.tendersService.getValidSectionsBySubDivisionId(subDivnId).subscribe((response: { SecData: Section[]; }) => {
      this.sections = response.SecData;
    });
  }

  getOfficeAndDesignationBySection(sectionId: number, design_Id: number){
    this.officeId = sectionId;
    this.designId = design_Id;
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
      this.tenderAmountStatistic = res.fyTotalTenderAmount;
      this.tenderAmountDetails = res.tenderAmountDetails[0];
    });
  }


  getTenderDetailsByOffice(office_Id: number, design_Id: number){
    if(design_Id == 5){
      const requestObj = {
        page: this.page,
        itemsPerPage: this.pageSize,
        selectedOffice: office_Id,
        designationId: design_Id,
      }

      this.tendersService.getTenderDetailsByOfficeId(requestObj).pipe(first()).subscribe((res:any) => {
        this.loading = false;
        this.tenderDetails = res.selectedTenderDetails.data;
        this.totalRecords = res.selectedTenderDetails.total;
        this.currentPage = res.selectedTenderDetails.current_page;
        this.totalPages = res.selectedTenderDetails.total_pages;
        this.tenderAmountStatistic = res.fyTotalTenderAmount;
        this.tenderAmountDetails = res.tenderAmountDetails[0];
      });

    }else if(design_Id == 4){
       const requestObj = {
        page: this.page,
        itemsPerPage: this.pageSize,
        selectedOffice: office_Id,
        designationId: design_Id,
      }
      this.tendersService.getTenderDetailsByOfficeId(requestObj).pipe(first()).subscribe((res:any) => {
        this.loading = false;
        this.tenderDetails = res.selectedTenderDetails.data;
        this.totalRecords = res.selectedTenderDetails.total;
        this.currentPage = res.selectedTenderDetails.current_page;
        this.totalPages = res.selectedTenderDetails.total_pages;
        this.tenderAmountStatistic = res.fyTotalTenderAmount;
        this.tenderAmountDetails = res.tenderAmountDetails[0];
      });

    }else if(design_Id == 3){
      const requestObj = {
        page: this.page,
        itemsPerPage: this.pageSize,
        selectedOffice: office_Id,
        designationId: design_Id,
      }
      this.tendersService.getTenderDetailsByOfficeId(requestObj).pipe(first()).subscribe((res:any) => {
        this.loading = false;
        this.tenderDetails = res.selectedTenderDetails.data;
        this.totalRecords = res.selectedTenderDetails.total;
        this.currentPage = res.selectedTenderDetails.current_page;
        this.totalPages = res.selectedTenderDetails.total_pages;
        this.tenderAmountStatistic = res.fyTotalTenderAmount;
        this.tenderAmountDetails = res.tenderAmountDetails[0];
      });

    }else if(design_Id == 2){
      const requestObj = {
        page: this.page,
        itemsPerPage: this.pageSize,
        selectedOffice: office_Id,
        designationId: design_Id,
      }
      this.tendersService.getTenderDetailsByOfficeId(requestObj).pipe(first()).subscribe((res:any) => {
        this.loading = false;
        this.tenderDetails = res.selectedTenderDetails.data;
        this.totalRecords = res.selectedTenderDetails.total;
        this.currentPage = res.selectedTenderDetails.current_page;
        this.totalPages = res.selectedTenderDetails.total_pages;
        this.tenderAmountStatistic = res.fyTotalTenderAmount;
        this.tenderAmountDetails = res.tenderAmountDetails[0];
      });

    }else{

    }

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


}
