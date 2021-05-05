import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthUser } from '../../../models/auth-user.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss']
})
export class DeleteAccountComponent implements OnInit {
  authUser: AuthUser = null;
  loading = false;

  constructor( private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getAuthUser().pipe(first()).subscribe( (response: any) => {
      this.authUser = response.data;
    });
  }

  deleteMyAccount(event: any){
    this.loading = true;
    Swal.fire({
      title: 'Are you sure?',
      text: this.authUser.name + ", you are further informed that your account would never be retrived again",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete my account permanently'
    }).then((result) => {
      if (result.isConfirmed) {
        const userId = {id : event};
        this.authService.deleteAccount(userId).pipe(first()).subscribe((res: any) => {
          this.loading = false;
          Swal.fire({position: 'top-end', icon: 'success', title: res.message, showConfirmButton: false, timer: 4000 });
        },
        err => {
          this.loading = false;
          Swal.fire({ position: 'top-end', icon: 'error', title: err, showConfirmButton: false, timer: 5000 });
        });

      }

    });
  }
  suspendMyAccount(event: any){
    this.loading = true;
    Swal.fire({
      title: 'Are you sure?',
      text: this.authUser.name + "won't be able to login from now! ",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, suspend my account temporarily!'
    }).then((result) => {
      if (result.isConfirmed) {
        const userId = {id : event};
        this.authService.lockMyAccount(userId).pipe(first()).subscribe((res: any) => {
          this.loading = false;
          Swal.fire({position: 'top-end', icon: 'success', title: res.message, showConfirmButton: false, timer: 4000 });
        },
        err => {
          this.loading = false;
          Swal.fire({ position: 'top-end', icon: 'error', title: err, showConfirmButton: false, timer: 5000 });
        });

      }

    });
  }

  cancleMyDecesion(){
    this.router.navigate(['/dashboard']);
  }

}
