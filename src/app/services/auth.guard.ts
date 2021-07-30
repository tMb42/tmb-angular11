import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AlertService } from './alert.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

  constructor(private authService: AuthService, private router: Router, private alertService: AlertService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const currentUser = this.authService.userValue;

    if(currentUser) {
      const Roles = currentUser.userData.roles;
      const permissibleRoles = route.data.roles;
      console.log("User's Roles =>", Roles);
      console.log("permissibleRoles =>", permissibleRoles);
      if(permissibleRoles){
        // check if route is restricted by role
        for (let i = 0; i < Roles.length; i++) {
        // console.log("User's Roles =>", Roles[i]);
        if(permissibleRoles.indexOf(Roles[i]) === -1) {
          // role not authorised so redirect to home page
          this.router.navigate(['/auth']);
          Swal.fire({ position: 'center', icon: 'warning', title: 'Sorry! ' + currentUser.userData.first_name +' you are not authorised for this page', showConfirmButton: false, timer: 7000 });
          return false;
        }
      }
    }
    // authorised so return true
    return true;

    }
    // not logged in so redirect to login page with the return url
    this.router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
    Swal.fire({ position: 'center', icon: 'error', title: 'Please login first', showConfirmButton: false, timer: 4000 });
    return false;
  }










}
