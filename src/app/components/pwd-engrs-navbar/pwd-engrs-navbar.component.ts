import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { AuthUser } from '../../models/auth-user.model';

@Component({
  selector: 'app-pwd-engrs-navbar',
  templateUrl: './pwd-engrs-navbar.component.html',
  styleUrls: ['./pwd-engrs-navbar.component.scss']
})
export class PwdEngrsNavbarComponent implements OnInit {
  authUser: AuthUser = null;
  loading = false;
  returnUrl: string;
  constructor(private authService: AuthService) { }

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

