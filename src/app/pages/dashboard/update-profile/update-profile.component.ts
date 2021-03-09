import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { DropdownService } from '../../../services/dropdown.service';
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';
import { AuthUser } from '../../../models/auth-user.model';


export interface Department {
  id: number;
  department_name: string;
  alias_name: string;
  department_short_name: string;
}
export interface Designation {
  id: number;
  designation_name: string;
  designation_alias: string;
}
export interface Role {
  id: number;
  label: string;
  name: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})

export class UpdateProfileComponent implements OnInit {
  profileUpdateForm: FormGroup; 
  checkDOB: FormGroup;

  depts: Department[] = [];
  designs: Designation[] = [];
  roles: Role[] = [];
  isDepartment: number = null;
  isPwdEngr: number;
    
  submitted = false;
  authUser: AuthUser = null;
  // authUsers: AuthUser[];
  isLoading = false; 
  searchMobile = false;  
  error: {};
  message: {};
  dobMessage: {};

  minDate: Date;
  maxDate: Date;
  birthDate: string;
  
  constructor( 
    private fb: FormBuilder, 
    private dropdownService : DropdownService, 
    private router: Router, 
    private route: ActivatedRoute, 
    private authService: AuthService
  ) { 
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate() - 29200); //maximum age 80yrs
    this.maxDate.setDate(this.maxDate.getDate() - 6570);  //minimum age 18yrs
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.authService.getAuthUser().pipe(first()).subscribe((response) => {  
      this.isLoading = false;
      this.authUser = response;
    });

    // this.authService.getAuthUserUpdateListener().subscribe( (res: any) => {
    //   this.authUser = res.user;
    //   console.log('Updateprofile', this.authUser)
    // });

  
    this.dropdownService.getDepartments().subscribe((response: { departmentData: Department[]; }) => {      
      this.depts = response.departmentData;     
    });

    this.dropdownService.getDesignations().subscribe((response: { designationData: Designation[]; }) => {      
      this.designs = response.designationData;     
    });

    this.dropdownService.getProfessions().subscribe((response: { profession: Role[]; }) => {      
      this.roles = response.profession;     
    });
    
    this.profileUpdateForm = this.fb.group({
      email: new FormControl({value:null, disabled: true}),      
      firstname: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      middlename: new FormControl(null),
      lastname: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      department: new FormControl(null),
      designation: new FormControl(null),     
      role: new FormControl(null),     
      isDepartment: new FormControl(null),     
      gender: new FormControl(null),
      mobileNo: new FormControl(null, [Validators.required, Validators.minLength(10)]),
      birthDate: new FormControl(null, [Validators.required]),   
      aboutMe: new FormControl(null),
    });

  }

  isMobileRegistered(mobileNo){
    this.searchMobile = true;
    this.authService.checkRegisteredMobile(mobileNo).subscribe(response => {
      this.message = response;
      this.searchMobile = false;
    });
  }
    
  compaireGradationListDOB(value: Date): void {
    this.birthDate = formatDate(value, 'yyyy-MM-dd', 'en');
    const dobCheckData = {
      designation: this.profileUpdateForm.value.designation,
      birthDate: this.birthDate,
      lastname: this.profileUpdateForm.value.lastname,
    }
    
    this.authService.getCompaireGradationListBirthDate(dobCheckData).pipe(first()).subscribe((res: any) => {      
      this.isPwdEngr = res.isPwdEngineer;
      this.dobMessage = res.dobMessage;
      console.log(res);
      if(res.isPwdEngineer == 1){
        Swal.fire({ position: 'top-end', icon: 'success',  title: "Welcome, Your Bithdate matched", showConfirmButton: false, timer: 6000 });
      }else{
        Swal.fire({ position: 'top-end', icon: 'error',  title: res.message, showConfirmButton: false, timer: 6000 });
      } 
    },
    err => {
      this.isLoading = false;
      
      // this.alertService.error(err);
      Swal.fire({ position: 'top-end', icon: 'error',  title: err.dobMessage, showConfirmButton: false, timer: 2000 }); 
    }); 
   
  }

  updateUserProfile(){
    this.submitted = true;
    this.isLoading = true;

    const formData = this.profileUpdateForm.getRawValue();    
    const updateUserProfileData = {
      firstname: formData.firstname,
      middlename: formData.middlename,
      lastname: formData.lastname,
      name: formData.firstname + ' ' + formData.middlename + ' ' + formData.lastname,
      email: formData.email,
      dob: formData.birthDate,
      gender: formData.gender,
      mobile: formData.mobileNo,   
      is_departmental: formData.isDepartment,
      is_pwd_engineer: this.isPwdEngr,
      department_id: formData.department,
      designation_id: formData.designation,      
      role_id: formData.role,
      remarks: formData.aboutMe,      
    }

    this.authService.updateUserProfile(updateUserProfileData).pipe(first()).subscribe(response => {
      this.router.navigate(['/dashboard'], { relativeTo: this.route });
      // this.alertService.success('Registration successful', { keepAfterRouteChange: true });
      Swal.fire({ position: 'top-end', icon: 'success', showConfirmButton: false, timer: 3000, title: "Your are successfully update your Profile" });       
    },
    err => {
      this.isLoading = false;
      // this.alertService.error(err);
      // Swal.fire({ position: 'top-end', icon: 'success',  title: err.error, showConfirmButton: false, timer: 2000 }); 
    });      

  }
  
}
