import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Title } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';


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
      console.log(data);
    });
    Swal.fire({icon: 'success', title: 'You Are Logout Successfully', showConfirmButton: false, timer: 2000 });
  }

}
