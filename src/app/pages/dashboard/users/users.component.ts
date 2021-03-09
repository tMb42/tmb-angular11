import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { UserService } from '../../../services/user.service';
import { Users } from '../../../models/user.model';
import { ProgressBarService } from '../../../services/progress-bar.service';
import { faTrashAlt, faUserEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  faTrashAlt = faTrashAlt;
  faUserEdit = faUserEdit;
  
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
  

  constructor(private userService: UserService, progressBarService: ProgressBarService,) {
    this.getAllUserList();
  }

  ngOnInit(): void {
    this.getAllUserList();
   
  }

  getAllUserList(){
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
    // console.log(requestObj);
     
    this.userService.getAll(requestObj).pipe(first()).subscribe((res:any) => {
      this.loading = false;
      this.users = res.users.data;
      this.totalRecords = res.users.total;
      console.log(this.users);
      
    });
  }
  
  onTableSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.currentPage = this.page;
    this.getAllUserList();

    console.log('Current page: ' + this.currentPage, 'Items per page: ' + this.pageSize);
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.pageSize = event.itemsPerPage;
    const startItem = (event.page - 1) * event.itemsPerPage + 1;
    const endItem = event.page * event.itemsPerPage;
    this.getAllUserList();
    
    console.log('Current page: ' + event.page, 'Items per page: ' + event.itemsPerPage, 'Start item :' + startItem, 'End item :' + endItem);
  }

  addUserRole(id: string) {
    const user = this.users.find(x => x.id === id);
    if (!user) return;
    user.isDeleting = true;
    this.userService.delete(id).pipe(first()).subscribe(() => 
    this.users = this.users.filter(x => x.id !== id));
  }


}