import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthUser } from '../../../models/auth-user.model';
import { Circle } from '../../../models/circle.model';
import { Department } from '../../../models/department.model';
import { District } from '../../../models/district.model';
import { Division } from '../../../models/division.model';
import { RailwayYard } from '../../../models/railwayYard.model';
import { Section } from '../../../models/section.model';
import { StackYard } from '../../../models/stackYards.model';
import { SubDivision } from '../../../models/subDivision.model';
import { AuthService } from '../../../services/auth.service';
import { DropdownService } from '../../../services/dropdown.service';
import { faPlus, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pwd-working-profile',
  templateUrl: './pwd-working-profile.component.html',
  styleUrls: ['./pwd-working-profile.component.scss']
})
export class PwdWorkingProfileComponent implements OnInit {
  authUser: AuthUser = null;

  faPlus = faPlus;
  faEdit = faUserEdit;
  isLoading = false;
  isCircleFormShow: boolean = false;
  isDivisionFormShow: boolean = false;
  isSubdivisionFormShow: boolean = false;
  isSectionFormShow: boolean = false;

  pwdWorkingProfileForm: FormGroup;
  circleForm: FormGroup;
  divisionForm: FormGroup;
  subDivisionForm: FormGroup;
  sectionForm: FormGroup;

  depts: Department[] = [];
  districts: District[] = [];
  circles: Circle[] = [];
  divns: Division[] = [];
  subDivns: SubDivision[] = [];
  sections: Section[] = [];
  rlys: RailwayYard[] = [];
  stackYards: StackYard[] = [];

  newCirId: number = null;
  newDivId: number = null;
  newSubDivId: number = null;
  newSecId: number = null;
  postingOfficeId: number = null;
  officeId: number = null;


  constructor(
    private fb: FormBuilder,
    private dropdownService : DropdownService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {

      this.authService.getAuthUser().pipe(first()).subscribe((response: any) => {
        this.isLoading = false;
        this.authUser = response.data;
        this.pwdWorkingProfileForm.patchValue({
          department: this.authUser.department_id,
          circle_id: this.authUser.circleId,
          division_id: this.authUser.divisionId,
          sub_division_id: this.authUser.subDivisionId,
          section_id: this.authUser.sectionId,
          stackyard_id: this.authUser.stackId,
          railway_id: this.authUser.rlyId,
          district_id: this.authUser.distId,
          remarks: this.authUser.pwdProRemarks,
        });

      //get circle list by default selection of department
      this.dropdownService.getAllCirclesByDeprtId(this.authUser.department_id).subscribe((response: { circleData: Circle[]; }) => {
        this.circles = response.circleData;
      });

      //get division by auto selection of circle
      this.dropdownService.getAllDivisionsByCircleId(this.authUser.circleId).subscribe((response: { divnData: Division[]; }) => {
        this.divns = response.divnData;
      });

      //get sub-division by auto selection of division
      this.dropdownService.getAllSubDivisionsByDivisionId(this.authUser.divisionId).subscribe((response: { subDivnData: SubDivision[]; }) => {
        this.subDivns = response.subDivnData;
      });

      //get section by auto selection of sub-division
      this.dropdownService.getAllSectionsBySubDivisionId(this.authUser.subDivisionId).subscribe((response: { SecData: Section[]; }) => {
        this.sections = response.SecData;
      });

      //get Stackyard list by default selection of division
      this.dropdownService.getAllDepartmentalStackyardByDivnId(this.authUser.divisionId).subscribe((response: { stackYardData: StackYard[]; }) => {
        this.stackYards = response.stackYardData;
      });


      });
    }

  ngOnInit(): void {
    this.isLoading = true;

    this.authService.getAuthUserUpdateListener().subscribe( (res: any) => {
      this.authUser = res.user;
      this.isLoading = false;
    });

    this.pwdWorkingProfileForm = this.fb.group({
      department: new FormControl({ value: null, disabled: true}, [Validators.required]),
      circle_id: new FormControl(null, [Validators.required]),
      division_id: new FormControl(null, [Validators.required]),
      sub_division_id: new FormControl(null, [Validators.required]),
      section_id: new FormControl(null, [Validators.required]),
      district_id: new FormControl(null, [Validators.required]),
      stackyard_id: new FormControl(null, [Validators.required]),
      railway_id: new FormControl(null, [Validators.required]),
      remarks: new FormControl(null),
    });

    this.circleForm = this.fb.group({
      newCirId: new FormControl(null, [Validators.required]),
      circle_name: new FormControl(null, [Validators.required]),
      remarks: new FormControl(null),
    });

    this.divisionForm = this.fb.group({
      newDivId: new FormControl(null, [Validators.required]),
      divn_name: new FormControl(null, [Validators.required]),
      remarks: new FormControl(null),
    });

    this.subDivisionForm = this.fb.group({
      newSubDivId: new FormControl(null, [Validators.required]),
      subDivn_name: new FormControl(null, [Validators.required]),
      remarks: new FormControl(null),
    });

    this.sectionForm = this.fb.group({
      newSecId: new FormControl(null, [Validators.required]),
      section_name: new FormControl(null, [Validators.required]),
      remarks: new FormControl(null),
    });

    this.dropdownService.getDepartments().subscribe((response: { departmentData: Department[]; }) => {
      this.depts = response.departmentData;
    });

    this.dropdownService.getDistricts().subscribe((response: { districtData: District[]; }) => {
      this.districts = response.districtData;
    });

    this.dropdownService.getRailwayYards().subscribe((response: { rlyData: RailwayYard[]; }) => {
      this.rlys = response.rlyData;
    });

  }

  getCirclesByDepartmentId(departId: number){
    if(!departId){
      this.isCircleFormShow = false;
    }else{
      this.dropdownService.getAllCirclesByDeprtId(departId).subscribe((response: { circleData: Circle[]; }) => {
        this.circles = response.circleData;
     });
    }
  }

  getDivisionsByCircleId(circleId: number){
    if(!circleId){
      this.isDivisionFormShow = false;
    }else{
      this.dropdownService.getAllDivisionsByCircleId(circleId).subscribe((response: { divnData: Division[]; }) => {
        this.divns = response.divnData;
      });
    }
  }

  getSubDivisionsByDivisionId(divnId: number){
    if(!divnId){
      this.isSubdivisionFormShow = false;
    }else{
      this.dropdownService.getAllSubDivisionsByDivisionId(divnId).subscribe((response: { subDivnData: SubDivision[]; }) => {
        this.subDivns = response.subDivnData;
      });
    }
  }

  getSectionsBySubDivisionId(subDivnId: number){
    if(!subDivnId){
      this.isSectionFormShow = false;
    }else{
      this.dropdownService.getAllSectionsBySubDivisionId(subDivnId).subscribe((response: { SecData: Section[]; }) => {
        this.sections = response.SecData;
      });
    }
  }

  getDepartmentalStackyardByDivnId(divnId: number){
    this.dropdownService.getAllDepartmentalStackyardByDivnId(divnId).subscribe((response: { stackYardData: StackYard[]; }) => {
      this.stackYards = response.stackYardData;
    });
  }

  getAllDepartmentalStackyard(){
    this.dropdownService.getAllDepartmentalStackyard().subscribe((response: { stackYardAllData: StackYard[]; }) => {
      this.stackYards = response.stackYardAllData;
    });
  }

  //--------------------------------------------------------------------------------------------

  cancelCircle () {
    this.isCircleFormShow = false;
  }
  showCircleInsertFormIf() {
    this.isDivisionFormShow = false;
    this.isSubdivisionFormShow = false;
    this.isSectionFormShow = false;

    const formData = this.pwdWorkingProfileForm.getRawValue();
    if(formData.department != 'null'){
      this.isCircleFormShow = true;
      this.dropdownService.getLastCircleID().subscribe((res: any) =>{
        this.newCirId = res.nextCirId[0].newId;
        this.circleForm.patchValue({
          newCirId: this.newCirId
        });
      });

    }else{
      this.isCircleFormShow = false;
    }
  }

  cancelDivision() {
    this.isDivisionFormShow = false;
  }
  showDivisionInsertFormIf() {
    this.isCircleFormShow = false;
    this.isSubdivisionFormShow = false;
    this.isSectionFormShow = false;
    const formData = this.pwdWorkingProfileForm.getRawValue();
    if(formData.circle_id != 'null'){
      this.isDivisionFormShow = true;
      this.dropdownService.getLastDivisionID().subscribe((res: any) =>{
        this.newDivId = res.nextDivId[0].newId;
        this.divisionForm.patchValue({
          newDivId: this.newDivId
        });
      });
    }else{
      this.isDivisionFormShow = false;
    }
  }

  cancelSubDivision() {
    this.isSubdivisionFormShow = false;
  }
  showSubDivisionInsertFormIf() {
    this.isCircleFormShow = false;
    this.isDivisionFormShow = false;
    this.isSectionFormShow = false;
    const formData = this.pwdWorkingProfileForm.getRawValue();
    if(formData.division_id != 'null'){
      this.isSubdivisionFormShow = true;
      this.dropdownService.getLastSubDivisionID().subscribe((res: any) =>{
        this.newSubDivId = res.nextSubDivId[0].newId;
        this.subDivisionForm.patchValue({
          newSubDivId: this.newSubDivId
        });
      });
    }else{
      this.isSubdivisionFormShow = false;
    }
  }

  cancelSection() {
    this.isSectionFormShow = false;
  }
  showSectionInsertFormIf() {
    this.isCircleFormShow = false;
    this.isDivisionFormShow = false;
    this.isSubdivisionFormShow = false;

    const formData = this.pwdWorkingProfileForm.getRawValue();
    if(formData.sub_division_id != 'null'){
      this.isSectionFormShow = true;
      this.dropdownService.getLastSectionID().subscribe((res: any) =>{
        this.newSecId = res.nextSecId[0].newId;
        this.sectionForm.patchValue({
          newSecId: this.newSecId
        });
      });
    }else{
      this.isSectionFormShow = false;
    }
  }

  //-------------------------------------------------------------------------------------------------------------
  addNewCircle(){
    this.isLoading = true;
    const mainFormData = this.pwdWorkingProfileForm.getRawValue();
    const formData = this.circleForm.getRawValue();
    const addedData = {
      circle_id: formData.newCirId,
      circleName: formData.circle_name,
      oldCircleName: formData.old_circle_name,
      remarks: formData.remarks,
      deprt_id: mainFormData.department
    }

    this.dropdownService.getNewCircleUnderDeprt(addedData).pipe(first()).subscribe(response => {
      this.isLoading = false;
      if (response.success === 1){
        this.circles.unshift({id: response.circle.id, circle_name: response.circle.circle_name, department_id: response.circle.department_id});
        this.pwdWorkingProfileForm.patchValue({ circle_id: this.circles[0].id });

        this.isCircleFormShow = false;

        Swal.fire({ position: 'top-end', icon: 'success', showConfirmButton: false, timer: 3000, title: response.message });
      }else if(response.success === 0){
        Swal.fire({ position: 'top-end', icon: 'warning', showConfirmButton: false, timer: 3000, title: response.message });
      }else{

      }
    },
    (err: any) => {
      this.isLoading = false;
      Swal.fire({ position: 'top-end', icon: 'error',  title: err, showConfirmButton: false, timer: 4000
      })

    });
  }

  //-------------------------------------------------------------------------------------------------------------
  addNewDivision(){
    this.isLoading = true;
    const mainFormData = this.pwdWorkingProfileForm.getRawValue();
    const formData = this.divisionForm.getRawValue();
    const addedData = {
      divisionName: formData.divn_name,
      oldDivisionName: formData.old_divn_name,
      remarks: formData.remarks,
      cirId: mainFormData.circle_id
    }

    this.dropdownService.getNewDivisionUnderCircle(addedData).pipe(first()).subscribe(response => {
      this.isLoading = false;
      if (response.success === 1){
        this.divns.unshift({id: response.division.id, division_name: response.division.division_name, circle_id: response.division.circle_id});
        this.pwdWorkingProfileForm.patchValue({ division_id: this.divns[0].id });

        this.isDivisionFormShow = false;

        Swal.fire({ position: 'top-end', icon: 'success', showConfirmButton: false, timer: 3000, title: response.message });

      }else if(response.success === 0){
        Swal.fire({ position: 'top-end', icon: 'warning', showConfirmButton: false, timer: 3000, title: response.message });
      }else{
        //
      }
    },
    (err: any) => {
      this.isLoading = false;
      Swal.fire({ position: 'top-end', icon: 'error',  title: err, showConfirmButton: false, timer: 4000
      })

    });
  }

  //-------------------------------------------------------------------------------------------------------------
  addNewSubDivision(){
    this.isLoading = true;
    const mainFormData = this.pwdWorkingProfileForm.getRawValue();
    const formData = this.subDivisionForm.getRawValue();
    const addedData = {
      subDivName: formData.subDivn_name,
      oldSubDivName: formData.old_subDivn_name,
      remarks: formData.remarks,
      divnId: mainFormData.division_id
    }

    this.dropdownService.getNewSubDivisionUnderDivision(addedData).pipe(first()).subscribe(response => {
      this.isLoading = false;
      if (response.success === 1){
        this.subDivns.unshift({id: response.subDivision.id, sub_division_name: response.subDivision.sub_division_name, division_id: response.subDivision.division_id});
        this.pwdWorkingProfileForm.patchValue({ sub_division_id: this.subDivns[0].id });

        this.isSubdivisionFormShow = false;

        Swal.fire({ position: 'top-end', icon: 'success', showConfirmButton: false, timer: 3000, title: response.message });
      }else if(response.success === 0){
        Swal.fire({ position: 'top-end', icon: 'warning', showConfirmButton: false, timer: 3000, title: response.message });
      }else{
        //
      }
    },
    (err: any) => {
      this.isLoading = false;
      Swal.fire({ position: 'top-end', icon: 'error',  title: err, showConfirmButton: false, timer: 4000
      })

    });
  }

  //-------------------------------------------------------------------------------------------------------------
  addNewSection(){
    this.isLoading = true;
    const mainFormData = this.pwdWorkingProfileForm.getRawValue();
    const formData = this.sectionForm.getRawValue();
    const addedData = {
      sectionName: formData.section_name,
      remarks: formData.remarks,
      mobileCUG: formData.mobile,
      subDivId: mainFormData.sub_division_id
    }

    this.dropdownService.getNewSectionUnderSubDivision(addedData).pipe(first()).subscribe(response => {
      this.isLoading = false;
      if (response.success === 1){
        this.sections.unshift({id: response.section.id, section_name: response.section.section_name, sub_division_id: response.section.sub_division_id});
        this.pwdWorkingProfileForm.patchValue({ section_id: this.sections[0].id });

        this.isSectionFormShow = false;

        Swal.fire({ position: 'top-end', icon: 'success', showConfirmButton: false, timer: 3000, title: response.message });

        }else if(response.success === 0){
        Swal.fire({ position: 'top-end', icon: 'warning', showConfirmButton: false, timer: 3000, title: response.message });
      }else{
        //
      }
    },
    (err: any) => {
      this.isLoading = false;
      Swal.fire({ position: 'top-end', icon: 'error',  title: err, showConfirmButton: false, timer: 4000
      })

    });
  }
  //-------------------------------------------------------------------------------------------------------------


  //--------------------------------------------------------------------------------

  updatePwdWorkingProfile(){
    this.isLoading = true;
    const formData = this.pwdWorkingProfileForm.getRawValue();

    if(this.authUser.designation_id == 2){
      this.officeId = 5;
      this.postingOfficeId = formData.section_id;
    }else if(this.authUser.designation_id == 3){
      this.officeId = 4;
      this.postingOfficeId = formData.sub_division_id;
    }else if(this.authUser.designation_id == 4){
      this.officeId = 3;
      this.postingOfficeId = formData.division_id;
    }else if(this.authUser.designation_id == 5){
      this.officeId = 2;
      this.postingOfficeId = formData.circle_id;

    }else if(this.authUser.designation_id == 6){
      this.officeId = 1;
      this.postingOfficeId = formData.department;
    }else{

    }

    const pwdWorkingProfileData = {
      officeId: this.officeId,
      postingOfficeId: this.postingOfficeId,
      stackYardId: formData.stackyard_id,
      districtId: formData.district_id,
      rlyId: formData.railway_id,
      remarks: formData.remarks,
    }

    this.authService.getPwdWorkingUserProfile(pwdWorkingProfileData).pipe(first()).subscribe((res: any) => {
      this.isLoading = false;
      if (res.success === 1){
        this.router.navigate(['/pwd-works'], { relativeTo: this.route });
        Swal.fire({ position: 'center', icon: 'success', showConfirmButton: false, timer: 3000, title: res.message });
      }else if(res.success === 0){
        Swal.fire({ position: 'top-end', icon: 'warning', showConfirmButton: false, timer: 4000, title: "Validation Error" });
      }else{
        this.router.navigate(['/pwd-works/pwd-working-profile']);
        Swal.fire({ position: 'top-end', icon: 'warning', showConfirmButton: true,
        title: 'Sorry! '+ res.authUser.name +'. ' + res.duplicateUser[0].name +', '+ res.duplicateUser[0].designation_name + ' already hold this place of posting. Please request to ' + res.duplicateUser[0].name + ' to his registered mobile no.'+ res.duplicateUser[0].mobile_no + ' for update his current place of posting because only one user hold one place of posting at a time.'});
      }

    }, err => {
      this.isLoading = false;
      Swal.fire({ position: 'top-end', icon: 'error',  title: err.error.message, showConfirmButton: false, timer: 3000 });
    });

  }

  resetPwdWorkingProfile(){
    this.pwdWorkingProfileForm.reset();
    this.isLoading = false;
  }

}
