import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-auth-navbar',
  templateUrl: './auth-navbar.component.html',
  styleUrls: ['./auth-navbar.component.scss']
})
export class AuthNavbarComponent implements OnInit {
  loading = false;
  returnUrl: string;

  sidebarClose() {
    throw new Error('Method not implemented.');
  }

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) { }


  ngOnInit(): void {
  }

  get isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  logoutCurrentUser(): void {
    this.loading = true;
    this.authService.logout().subscribe(data=>{
      this.loading = false;
      Swal.fire({icon: 'success', title: data.message, showConfirmButton: false, timer: 2000 });
    });
  }

}
