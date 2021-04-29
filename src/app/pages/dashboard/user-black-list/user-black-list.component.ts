import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Users } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-black-list',
  templateUrl: './user-black-list.component.html',
  styleUrls: ['./user-black-list.component.scss']
})
export class UserBlackListComponent implements OnInit {
  blockedUserForm: FormGroup;
  users!: Users[];  
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
    this.getAllBlockedUser(); 
  }

  ngOnInit(): void {
    this.getAllBlockedUser();
  }

  getAllBlockedUser(){
    this.loading = true; 

    if(this.page ==1){
      this.skip =0;
    }else{
      this.skip = (this.page-1) * this.pageSize;
    }
    
    const requestObj = {
      page: this.page,
      per_page: this.pageSize,
      skip: this.skip
    }
    
    this.userService.getAllBlockedUserList(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.users = res.users.data;
      this.totalRecords = res.blockedUserTotal[0].total;
    });

  }

  activeBlockedUserAc(event: any){
    this.loading = true;
    Swal.fire({
      title: 'Are you sure?',
      text: event.name + " able to login from now!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, unlocked now!'
    }).then((result) => {
      if (result.isConfirmed) {
        const userId = {id : event.id}; 
        this.userService.activeUserAc(userId).pipe(first()).subscribe((res: any) => {
          this.totalRecords = res.blockedUserTotal[0].total;
          this.loading = false;
          this.users = this.users.filter(x => x.id != res.user.id);
          Swal.fire({position: 'bottom-end', icon: 'success', title: res.message, showConfirmButton: false, timer: 2000 });
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
    this.getAllBlockedUser();

    console.log('Current page: ' + this.currentPage, 'Items per page: ' + this.pageSize);
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.pageSize = event.itemsPerPage;
    const startItem = (event.page - 1) * event.itemsPerPage + 1;
    const endItem = event.page * event.itemsPerPage;
    this.getAllBlockedUser();
    
    console.log('Current page: ' + event.page, 'Items per page: ' + event.itemsPerPage, 'Start item :' + startItem, 'End item :' + endItem);
  }

  searchBlockedUser(event: any){ 
    if(event.length > 0){
      this.loading = true;
      this.userService.getSearchBlockedUser(event).pipe(first()).subscribe((res:any) => {
        this.loading = false;
        this.users = res.users;
      });
    }
    if(event.length <= 0){
      this.getAllBlockedUser();
    }

  }


}
