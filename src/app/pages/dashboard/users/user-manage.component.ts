import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { DropdownService } from '../../../services/dropdown.service';
import { AlertService } from '../../../services/alert.service';
import { UserService } from '../../../services/user.service';
import { MustMatch } from '../../../validation/must-match.validator';
import { IDropdownSettings } from 'ng-multiselect-dropdown';


export interface Role {
  id: number;
  label: string;
  name: string;
}

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./users.component.scss']
})
export class UserManageComponent implements OnInit {
  form!: FormGroup;
  id!: string;
  isAddMode!: boolean;
  loading = false;  
  submitted = false;
    
  selectedItems = [];
  dropdownSettings: any = {};
  roles: Role[] = [];
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private dropdownService: DropdownService,
    private alertService: AlertService
  ) {}

  ngOnInit() {

    this.dropdownSettings = {
      idField: 'id',
      textField: 'label',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 'All',
      allowSearchFilter: true,
      searchPlaceholderText: 'search Roles',
      clearSearchFilter: true,
      singleSelection: false,
      // closeDropDownOnSelection:true
    };

    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;
    
    this.dropdownService.getNonAdminRole().subscribe((response: { nonAdminRoles: Role[]; }) => {      
      this.roles = response.nonAdminRoles;     
    });
  
    // password not required in edit mode
    const passwordValidators = [Validators.minLength(8)];
    if (this.isAddMode) {
      passwordValidators.push(Validators.required);
    }

    const formOptions: AbstractControlOptions = { validators: MustMatch('password', 'confirmPassword') };    
    this.form = this.fb.group({
      first_name: ['', Validators.required],
      middle_name: [''],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      password: ['', [Validators.minLength(8), this.isAddMode ? Validators.required : Validators.nullValidator]],
      confirmPassword: ['', this.isAddMode ? Validators.required : Validators.nullValidator]
    }, formOptions);

    if (!this.isAddMode) {
      this.userService.getById(this.id).pipe(first()).subscribe((x: any) => {
        this.form.patchValue(x.users)
      });        
    }

    
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    if (this.isAddMode) {
      this.createUser();
    } else {
      this.updateUser();
    }
  }

  private createUser() {
    this.userService.create(this.id, this.form.value).pipe(first()).subscribe(() => {
      this.alertService.success('User New Role added', { keepAfterRouteChange: true });
      this.router.navigate(['../'], { relativeTo: this.route });
    }).add(() => this.loading = false);
  }

  private updateUser() {
    this.userService.update(this.id, this.form.value).pipe(first()).subscribe(() => {
      this.alertService.success('User updated', { keepAfterRouteChange: true });
      this.router.navigate(['../../'], { relativeTo: this.route });
    }).add(() => this.loading = false);

  }


}