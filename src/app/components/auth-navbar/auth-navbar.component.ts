import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Title } from '@angular/platform-browser';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-auth-navbar',
  templateUrl: './auth-navbar.component.html',
  styleUrls: ['./auth-navbar.component.scss']
})
export class AuthNavbarComponent implements OnInit {
  sidebarClose() {
    throw new Error('Method not implemented.');
  }

  constructor(private titleService: Title, private authService: AuthService) { }


  ngOnInit(): void {
  }

  get isLoggedIn() {
    return this.authService.isLoggedIn(); 
  }

  logout() {
    this.authService.logout();
    Swal.fire({
      icon: 'success',
      title: 'You Are Logout Successfully',
      showConfirmButton: false,
      timer: 2000
    });  
  }

}
