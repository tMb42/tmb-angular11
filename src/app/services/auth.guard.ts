import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  userSub: Subscription;
  constructor(private authService: AuthService, private router: Router) {}
  
  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
  : Observable<boolean> | Promise<boolean> | boolean {
    const authUser = this.authService.userValue;
    // console.log('authguard', authUser);
    if (authUser) {
      // check if route is restricted by role
      if (route.data.roles && route.data.roles.indexOf(authUser.userData.user.roleId) === -1) {
        // role not authorised so redirect to home page
        this.router.navigate(['/auth']);
        return false;
      }
      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  
}
