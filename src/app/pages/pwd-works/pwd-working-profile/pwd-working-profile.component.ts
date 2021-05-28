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
import { faTrashAlt, faPlus, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pwd-working-profile',
  templateUrl: './pwd-working-profile.component.html',
  styleUrls: ['./pwd-working-profile.component.scss']
})
export class PwdWorkingProfileComponent implements OnInit {
  authUser: AuthUser = null;

  faPlus = faPlus;
  faUserEdit = faUserEdit;
  // faUserEdit = faUserEdit;
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
  Rlys: RailwayYard[] = [];
  stackYards: StackYard[] = [];

  newCirId: number = null;
  newDivId: number = null;
  newSubDivId: number = null;
  newSecId: number = null;
  officeId: string = null;

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
          remarks: this.authUser.pwdProRemarks,
          railway_id: this.authUser.RlyId,
          district_id: this.authUser.distId,
          stackyard_id: this.authUser.StackId,
        });

      });
    }

  ngOnInit(): void {
    this.isLoading = true;

    this.authService.getAuthUserUpdateListener().subscribe( (res: any) => {
      this.authUser = res.user;
      this.isLoading = false;
    });


    // this.dropdownService.getCircleUpdateListener().subscribe( (res: any) => {
    //   this.circles = res.circleData;
    // });

    this.pwdWorkingProfileForm = this.fb.group({
      department: new FormControl(null, [Validators.required]),
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
      this.Rlys = response.rlyData;
    });

  }

  getCirclesByDepartmentId(event: any){
    if(event === 'null'){
      this.isCircleFormShow = false;
    }else{
      this.dropdownService.getAllCirclesByDeprtId(event).subscribe((response: { circleData: Circle[]; }) => {
        this.circles = response.circleData;
      });
    }
  }

  getDivisionsByCircleId(event: any){
    if(event === 'null'){
      this.isDivisionFormShow = false;
    }else{
      this.dropdownService.getAllDivisionsByCircleId(event).subscribe((response: { DivnData: Division[]; }) => {
        this.divns = response.DivnData;
      });
    }
  }

  getSubDivisionsByDivisionId(event: any){
    if(event === 'null'){
      this.isSubdivisionFormShow = false;
    }else{
      this.dropdownService.getAllSubDivisionsByDivisionId(event).subscribe((response: { subDivnData: SubDivision[]; }) => {
        this.subDivns = response.subDivnData;
      });
    }
  }

  getSectionsBySubDivisionId(event: any){
    if(event === 'null'){
      this.isSectionFormShow = false;
    }else{
      this.dropdownService.getAllSectionsBySubDivisionId(event).subscribe((response: { SecData: Section[]; }) => {
        this.sections = response.SecData;
      });
    }
  }

  getDepartmentalStackyardByDivnId(event: number){
    this.dropdownService.getAllDepartmentalStackyardByDivnId(event).subscribe((response: { stackYardData: StackYard[]; }) => {
      this.stackYards = response.stackYardData;
    });
  }

  //--------------------------------------------------------------------------------------------

  cancelCircle () {
    this.isCircleFormShow = false;
  }
  showCircleInsertFormIf() {
    const formData = this.pwdWorkingProfileForm.getRawValue();
    if(formData.department != 'null'){
      this.isCircleFormShow = true;
      // this.isCircleFormShow = !this.isCircleFormShow;
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
    const formData = this.pwdWorkingProfileForm.getRawValue();
    if(formData.division_id != 'null'){
      this.isSubdivisionFormShow = !this.isSubdivisionFormShow;
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
      remarks: formData.remarks,
      deprt_id: mainFormData.department
    }

    this.dropdownService.getNewCircleUnderDeprt(addedData).pipe(first()).subscribe(response => {
      Swal.fire({ position: 'top-end', icon: 'success', showConfirmButton: false, timer: 3000, title: response.message });
    },
    (err: any) => {
      this.isLoading = false;
      Swal.fire({ position: 'top-end', icon: 'error',  title: err.error.errors, showConfirmButton: false, timer: 4000
      })

    });
  }

  //-------------------------------------------------------------------------------------------------------------
  addNewDivision(){
    this.isLoading = true;
    const mainFormData = this.pwdWorkingProfileForm.getRawValue();
    const formData = this.divisionForm.getRawValue();
    const addedData = {
      division_id: formData.newDivId,
      divisionName: formData.divn_name,
      remarks: formData.remarks,
      cirId: mainFormData.circle_id
    }

    this.dropdownService.getNewDivisionUnderCircle(addedData).pipe(first()).subscribe(response => {
      Swal.fire({ position: 'top-end', icon: 'success', showConfirmButton: false, timer: 3000, title: response.message });
    },
    (err: any) => {
      this.isLoading = false;
      Swal.fire({ position: 'top-end', icon: 'error',  title: err.error.errors, showConfirmButton: false, timer: 4000
      })

    });
  }

  //-------------------------------------------------------------------------------------------------------------
  addNewSubDivision(){
    this.isLoading = true;
    const mainFormData = this.pwdWorkingProfileForm.getRawValue();
    const formData = this.subDivisionForm.getRawValue();
    const addedData = {
      sub_division_id: formData.newSubDivId,
      subDivName: formData.subDivn_name,
      remarks: formData.remarks,
      division_id: mainFormData.division_id
    }

    this.dropdownService.getNewSubDivisionUnderDivision(addedData).pipe(first()).subscribe(response => {
      Swal.fire({ position: 'top-end', icon: 'success', showConfirmButton: false, timer: 3000, title: response.message });
    },
    (err: any) => {
      this.isLoading = false;
      Swal.fire({ position: 'top-end', icon: 'error',  title: err.error.errors, showConfirmButton: false, timer: 4000
      })

    });
  }

  //-------------------------------------------------------------------------------------------------------------
  addNewSection(){
    this.isLoading = true;
    const mainFormData = this.pwdWorkingProfileForm.getRawValue();
    const formData = this.sectionForm.getRawValue();
    const addedData = {
      sectionId: formData.newSecId,
      sectionName: formData.section_name,
      remarks: formData.remarks,
      mobileCUG: formData.mobile,
      subDivId: mainFormData.sub_division_id
    }

    this.dropdownService.getNewSectionUnderSubDivision(addedData).pipe(first()).subscribe(response => {
      if(response.success == 0){
        Swal.fire({ position: 'top-end', icon: 'error', showConfirmButton: false, timer: 3000, title: response });
      }
      Swal.fire({ position: 'top-end', icon: 'success', showConfirmButton: false, timer: 3000, title: response.message });
    },
    (err: any) => {
      console.log(err);
      this.isLoading = false;
      Swal.fire({ position: 'top-end', icon: 'error',  title: err.error, showConfirmButton: false, timer: 4000
      })

    });
  }

  //--------------------------------------------------------------------------------

  updatePwdWorkingProfile(){
    this.isLoading = true;
    const formData = this.pwdWorkingProfileForm.getRawValue();

    if(formData.section_id != 'null'){
      this.officeId = formData.section_id;
    }else if(formData.sub_division_id != 'null'){
      this.officeId = formData.sub_division_id;
    }else if(formData.division_id != 'null'){
      this.officeId = formData.division_id;
    }else{

    }

    const pwdWorkingProfileData = {
      officeId: this.officeId,
      stackYardId: formData.stackyard_id,
      districtId: formData.district_id,
      rlyId: formData.railway_id,
      remarks: formData.remarks,
    }

    console.log(pwdWorkingProfileData);

    this.authService.getPwdWorkingUserProfile(pwdWorkingProfileData).pipe(first()).subscribe((res: any) => {
      // this.router.navigate(['/dashboard'], { relativeTo: this.route });
      Swal.fire({ position: 'top-end', icon: 'success', showConfirmButton: false, timer: 3000, title: res.message  });
    }, err => {
      this.isLoading = false;
      Swal.fire({ position: 'top-end', icon: 'error',  title: err.error.message, showConfirmButton: false, timer: 2000 });
    });

  }

}
