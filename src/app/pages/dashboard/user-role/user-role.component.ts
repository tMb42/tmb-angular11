import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faTrashAlt, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { first } from 'rxjs/operators';
import { DropdownService } from '../../../services/dropdown.service';
import { UserService } from '../../../services/user.service';
import { Users } from '../../../models/user.model';
import Swal from 'sweetalert2';


export interface Roles {
  id: number;
  label: string;
  name: string;
}

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss']
})
export class UserRoleComponent implements OnInit {
  userRoleForm: FormGroup;

  faTrashAlt = faTrashAlt;
  faUserEdit = faUserEdit;
  
  users: Users[] = null; 
  roles: Roles[] = null;
  success: number = 0;
  message: any;

  submitted = false;
  loading = false;  
  showBoundaryLinks = true;
  page: number = 1;
  currentPage: number;
  maxSize: number = 4;      //Limit the maximum visible page numbers
  pageSizes = [10, 15, 20, 50];  //option for items per page
  pageSize: number = 10;     //default items per page
  totalPages: number;
  totalRecords: Number;
  skip: number; 
  
  selectedItems = [];
  dropdownSettings: any = {};  

  constructor(private fb: FormBuilder, private userService: UserService, private dropdownService: DropdownService,) 
  { 
    this.getAllUserList();
  }

  ngOnInit(): void {
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

    this.getAllUserList();

    this.userService.getUserUpdateListener().subscribe( (res:any) => {
      console.log('dsgsg', res)
      this.users = res.users.data;
    });
    

    this.dropdownService.getNonAdminRole().subscribe((response: { nonAdminRoles: Roles[]; }) => {      
      this.roles = response.nonAdminRoles;     
    });
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  getAllUserList() {
    const requestObj = {
      page: this.page,
      per_page: this.pageSize,
      skip: this.skip
    }

    this.userService.getAll(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.users = res.users.data;
      this.totalRecords = res.users.total;
      console.log(this.users);
    });  

    this.userRoleForm = this.fb.group({
      id: [null, Validators.required],
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      roles: [null, Validators.required],
    });
    
  }

  getUserDetailsById(event: string) {
    this.loading = true;
    this.userService.getById(event).pipe(first()).subscribe((x: any) => {
      this.loading = false;
      this.userRoleForm.patchValue(x.users);
    }); 
  }

  formReset(){
    this.userRoleForm.reset();
    this.loading = false;
  }

  onSubmit() {
   this.submitted = true;
    this.loading = true;
    this.userService.updateUserRoles(this.userRoleForm.value).pipe(first()).subscribe((res: any) => {
      this.loading = false;
      this.users = res.users.data;
      if(this.success == 1){
        Swal.fire({ position: 'top-end', icon: 'success', title: 'Role updated successfully', showConfirmButton: false, timer: 2000 }); 
      }else{
        Swal.fire({ position: 'top-end', icon: 'error', title: res.message, showConfirmButton: false, timer: 4000 }); 
      }    
    }, err => {
      this.loading = false;
      Swal.fire({ position: 'top-end', icon: 'error', title: err, showConfirmButton: false, timer: 2000 }); 
    }); 
  }

  onTableSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.currentPage = this.page;
    this.getAllUserList();    
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.pageSize = event.itemsPerPage;
  }

  addUserRole(id: string) {
    const user = this.users.find(x => x.id === id);
    if (!user) return;
    user.isDeleting = true;
    this.userService.delete(id).pipe(first()).subscribe(() => 
    this.users = this.users.filter(x => x.id !== id));
  }
}
