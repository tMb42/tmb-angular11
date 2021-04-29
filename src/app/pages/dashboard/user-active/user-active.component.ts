import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Users } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-active',
  templateUrl: './user-active.component.html',
  styleUrls: ['./user-active.component.scss']
})
export class UserActiveComponent implements OnInit {
  userActiveForm: FormGroup;
  users: Users[];
  
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
  

  constructor(private fb: FormBuilder, private userService: UserService) { 
    this.getAllActiveUserList(); 
  }

  ngOnInit(): void {
    this.getAllActiveUserList();
  }

  getAllActiveUserList(){
    this.loading = true; 

    const requestObj = {
      page: this.page,
      per_page: this.pageSize,
      skip: (this.page-1) * this.pageSize
    }
    
    this.userService.getAllActiveUserList(requestObj).pipe(first()).subscribe((res: any) => {
      this.loading = false;
      this.users = res.users;
      this.totalRecords = res.activeUserTotal[0].total;
    });

  }

  suspendUserAc(event: any){
    this.loading = true;
    Swal.fire({
      title: 'Are you sure?',
      text: event.name + " won't be able to login from now!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, suspend this user!'
    }).then((result) => {
      if (result.isConfirmed) {
        const userId = {id : event.id}; 
        this.userService.blockedUserAc(userId).pipe(first()).subscribe((res: any) => {
          this.loading = false;
          this.totalRecords = res.activeUserTotal[0].total;
          this.users = this.users.filter(x => x.id != res.user.id);
          Swal.fire({position: 'top-end', icon: 'success', title: res.message, showConfirmButton: false, timer: 4000 });
        },
        err => {
          this.loading = false;
          Swal.fire({ position: 'top-end', icon: 'error', title: err, showConfirmButton: false, timer: 5000 }); 
        });
        
      }

    });

  }

  onTableSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.currentPage = this.page;
    this.getAllActiveUserList();

    console.log('Current page: ' + this.currentPage, 'Items per page: ' + this.pageSize);
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.pageSize = event.itemsPerPage;
    const startItem = (event.page - 1) * event.itemsPerPage + 1;
    const endItem = event.page * event.itemsPerPage;
    this.getAllActiveUserList();
    
    console.log('Current page: ' + event.page, 'Items per page: ' + event.itemsPerPage, 'Start item :' + startItem, 'End item :' + endItem);
  }


  searchActiveUser(event: any){ 
    if(event.length > 0){
      this.loading = true;
      this.userService.getSearchActiveUser(event).pipe(first()).subscribe((res:any) => {
        this.loading = false;
        this.users = res.users;
      });
    }
    if(event.length <= 0){
      this.getAllActiveUserList();
    }

  }
  
  


}
