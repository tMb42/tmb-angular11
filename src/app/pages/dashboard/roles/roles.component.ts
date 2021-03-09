import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AlertService } from '../../../services/alert.service';
import { RoleService } from '../../../services/role.service';
import { DropdownService } from '../../../services/dropdown.service';

import { faTrashAlt, faUserEdit } from '@fortawesome/free-solid-svg-icons';


export interface Role {
  id: number;
  label: string;
  name: string;
}

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  faTrashAlt = faTrashAlt;
  faUserEdit = faUserEdit;

  loading = false;  
  showBoundaryLinks = true;
  page: number = 1;
  currentPage: number;
  maxSize: number = 4;      //Limit the maximum visible page numbers
  pageSize: number = 5;     //default items per page
  pageSizes = [5, 10, 15, 25];  //option for items per page
  totalPages: number;
  totalRecords: Number;
  skip: number;

  // roles: Role[] = [];
  roles!: Role[];

  form!: FormGroup;
  id!: string;
  isAddMode!: boolean;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private roleService: RoleService,
    private dropdownService: DropdownService,
    private alertService: AlertService
  ) {
    this.getAllRoleList();
  }
 
  ngOnInit(): void {
    this.getAllRoleList();

    this.dropdownService.getNonAdminRole().subscribe((response: { nonAdminRoles: Role[]; }) => {      
      this.roles = response.nonAdminRoles;     
    });
  
    this.form = this.formBuilder.group({
      id: ['', Validators.required],
      role: ['', Validators.required],
      // roleName: ['', Validators.required]
    });

    if (!this.isAddMode) {
      this.roleService.getById(this.id).pipe(first()).subscribe(x => this.form.patchValue(x));
    }
    
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
      this.createRole();
    } else {
      this.updateRole();
    }
  }

  private createRole() {
    this.roleService.create(this.form.value).pipe(first()).subscribe(() => {
      this.alertService.success('Role added', { keepAfterRouteChange: true });
      this.router.navigate(['../'], { relativeTo: this.route });
    }).add(() => this.loading = false);
  }

  private updateRole() {
    this.roleService.update(this.id, this.form.value).pipe(first()).subscribe(() => {
      this.alertService.success('Role updated', { keepAfterRouteChange: true });
      this.router.navigate(['../../'], { relativeTo: this.route });
    }).add(() => this.loading = false);
  }


  getAllRoleList(){
    this.loading = true; 

    const requestObj = {
      page: this.page,
      itemsPerPage: this.pageSize,
      skip: (this.page-1) * this.pageSize
    }
    console.log(requestObj);

    this.roleService.getAllRole(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.roles = res.roles;
      this.totalRecords = res.totalRoles;
    });
  }

  onTableSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.currentPage = this.page;
    this.getAllRoleList();

    console.log('Current page: ' + this.currentPage, 'Items per page: ' + this.pageSize);
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.pageSize = event.itemsPerPage;
    const startItem = (event.page - 1) * event.itemsPerPage + 1;
    const endItem = event.page * event.itemsPerPage;
    this.getAllRoleList();
    
    console.log('Current page: ' + event.page, 'Items per page: ' + event.itemsPerPage, 'Start item :' + startItem, 'End item :' + endItem);
  }

  getSearchTableData(event: any){
    if(event.length > 0){
      this.loading = true;
      this.roleService.getSearchData(event).pipe(first()).subscribe((res:any) => {
        this.loading = false;
        this.roles = res.roles;
      });
    }
    if(event.length <= 0){
      this.getAllRoleList();
    }

  }

}
