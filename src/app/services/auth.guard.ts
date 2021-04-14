import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{
  
  constructor(private authService: AuthService, private router: Router) {} 

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {    
    const currentUser = this.authService.userValue;
    
    if (currentUser) {
      const Roles = currentUser.userData.roles;
      const permissibleRoles = route.data.roles;
      // console.log("User's Roles =>", Roles);
      // console.log("permissibleRoles =>", permissibleRoles); 
      if(permissibleRoles){
        for (let i = 0; i < Roles.length; i++) {
          // const matchedRole = permissibleRoles.indexOf(Roles[i])
          // console.log('role =>', Roles[i]);
          // console.log('matchedRole =>', matchedRole);
          if (permissibleRoles.indexOf(Roles[i]) > -1) {
            return true;
          }
         
        }
        // role not authorised so redirect to home page
        console.log('you are not authorised for this page');
        this.router.navigate(['/auth']);
        return false; 
              
      }
      return true;

    }    
    // not logged in so redirect to login page with the return url
    this.router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  
}