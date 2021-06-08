import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthUser } from '../../models/auth-user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-pwd-works-navbar',
  templateUrl: './pwd-works-navbar.component.html',
  styleUrls: ['./pwd-works-navbar.component.scss']
})
export class PwdWorksNavbarComponent implements OnInit {
  authUser: AuthUser = null;
  workingOfficeId: number = null;
  loading = false;

  constructor(private authService: AuthService) {
    this.authService.getAuthUser().pipe(first()).subscribe( (response: any) => {
      this.authUser = response.data;
      this.workingOfficeId = response.data.officeId;
    });
  }

  ngOnInit(): void {
    this.authService.getAuthUserUpdateListener().subscribe( (res: any) => {
      this.authUser = res.user;
    });
  }

  get isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  logoutCurrentUser(): void {
    this.loading = true;
    this.authService.logout().subscribe(data=>{
     Swal.fire({icon: 'success', title: data.message, showConfirmButton: false, timer: 2000 });
    });

  }

}
