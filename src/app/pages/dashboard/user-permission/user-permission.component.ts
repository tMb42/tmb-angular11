import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { faTrashAlt, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { first } from 'rxjs/operators';
import { Abilities } from '../../../models/permission.model';
import { Users } from '../../../models/user.model';
import { DropdownService } from '../../../services/dropdown.service';
import { UserService } from '../../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-permission',
  templateUrl: './user-permission.component.html',
  styleUrls: ['./user-permission.component.scss']
})
export class UserPermissionComponent implements OnInit {
  userAbilityForm: FormGroup;

  faTrashAlt = faTrashAlt;
  faUserEdit = faUserEdit;
  
  users: Users[] = null; 
  permissions: Abilities[] = null;
  success: number = 0;
  message: any = '';
  status: any = '';
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
  disabled = false;
  selectedItems: any = [];
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
      limitSelection: 3,
      allowSearchFilter: true,
      searchPlaceholderText: 'search Permission',
      clearSearchFilter: true,
      singleSelection: false,
      closeDropDownOnSelection: true
    };

    this.getAllUserList();

    this.userService.getUserUpdateListener().subscribe( (res:any) => {
      this.users = res.users.data;
    });
    
    this.dropdownService.getAllUserPermission().subscribe((response: { abilities: Abilities[]; }) => {      
      this.permissions = response.abilities;     
    });

    this.userAbilityForm = this.fb.group({
      id: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      permissions: new FormControl(null, [Validators.required]),
    });
    
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
    });     
  }

  getUserDetailsById(event: string) {
    this.loading = true;
    this.userService.getById(event).pipe(first()).subscribe((x: any) => {
      this.loading = false;
      this.userAbilityForm.patchValue(x.users);
    }); 
  }

  formReset(){
    this.userAbilityForm.reset();
  }

 onItemSelect(item: any) {
    console.log('onItemSelect', item);
  }
  onSelectAll(items: any) {
    console.log('onSelectAll', items);
  }
  
  addAbility() {
    this.submitted = true;
    this.loading = true;
    this.userService.addUserPermissions(this.userAbilityForm.value).pipe(first()).subscribe((res: any) => {
      this.loading = false;
      this.users = res.users.data;
      if(res.success == 1){
        Swal.fire({ position: 'top-end', icon: 'success', title: 'Permission added successfully', showConfirmButton: false, timer: 2000 }); 
      }else if(res.success == 0){
        console.log(res);
        this.message = res.message;
        Swal.fire({ position: 'top-end', icon: 'error', title: res.message, showConfirmButton: false, timer: 4000 }); 
      }else{

      }    
    }, err => {
      this.loading = false;
      Swal.fire({ position: 'top-end', icon: 'error', title: err, showConfirmButton: false, timer: 2000 }); 
    }); 
  }

  deleteAbility() {
   this.submitted = true;
    this.loading = true;
    this.userService.deleteUserPermissions(this.userAbilityForm.value).pipe(first()).subscribe((res: any) => {
      this.loading = false;
      this.users = res.users.data;
      if(res.success == 1){
        Swal.fire({ position: 'top-end', icon: 'success', title: 'Permission deleted successfully', showConfirmButton: false, timer: 2000 }); 
      }else if(res.success == 0){
        console.log(res);
        this.message = res.message;
        Swal.fire({ position: 'top-end', icon: 'error', title: res.message, showConfirmButton: false, timer: 4000 }); 
      }else{

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

  


}
