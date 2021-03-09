import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Users } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-active',
  templateUrl: './user-active.component.html',
  styleUrls: ['./user-active.component.scss']
})
export class UserActiveComponent implements OnInit {

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
  
  constructor(private userService: UserService) {  this.getAllUserList(); }

  ngOnInit(): void {
    this.getAllUserList()
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


}
