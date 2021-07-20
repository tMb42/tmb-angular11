import { Component, OnInit } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';
import { first } from 'rxjs/operators';
import { AuthUser } from '../../models/auth-user.model';
import { AuthService } from '../../services/auth.service';

declare const $: any;

//Metadata
export interface RouteInfo {
  path: string;
  title: string;
  role?: string;
  ablity?: number;
  permission?: any;
  is_departmental?: number;
  inforce?: number;
  display?: number;
  type: string;
  icontype: string;
  collapse?: string;
  children?: ChildrenItems[];
}

export interface ChildrenItems {
  path: string;
  title: string;
  ab: string;
  type?: string;
}

//Menu Items
export const ROUTES: RouteInfo[] = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    inforce: 1,
    type: 'link',
    icontype: 'dashboard'
  },
  {
    path: '/dashboard',
    title: 'User Management',
    role: 'super_admin',
    type: 'sub',
    icontype: 'widgets',
    collapse: 'superadmin',
    children: [
      {path: 'user-role', title: 'User - Role', ab:'UR'},
      {path: 'user-permission', title: 'User - Permission', ab:'UP'},
      {path: 'users', title: 'Users', ab:'U'},
      {path: 'roles', title: 'Roles', ab:'R'},
      {path: 'active-users', title: 'Active User', ab:'AU'},
      {path: 'block-users', title: 'Blocked User', ab:'BU'},
    ]
  },
  {
    path: '/engrsCpanel',
    title: 'Cpanel - PWD Engineers',
    role: 'super_admin',
    type: 'sub',
    icontype: 'school',
    collapse: 'pwdEngrs',
    children: [
      {path: 'update-je', title: 'Junior Engineer', ab:'UJE'},
      {path: 'update-ae', title: 'Assistant Engineer', ab:'UAE'},
      {path: 'update-se', title: 'Senior Engineer', ab:'USE'},
    ]
  },
  {
    path: '/engrs',
    title: 'WB PWD Engineers',
    ablity: 1,
    type: 'link',
    icontype: 'architecture'
  },
  {
    path: '/pwd-works',
    title: 'PWD-Works',
    ablity: 1,
    // is_departmental: 1,
    type: 'link',
    icontype: 'work'
  },
  {
    path: 'dashboard/tweety',
    title: 'Discussion Room',
    ablity: 1,
    type: 'link',
    icontype: 'mail'
    // collapse: 'chat',
    // children: [
    //   {path: 'chat', title: 'Chat', ab:'C'},
    //   {path: 'inbox', title: 'Inbox', ab:'IB'},
    // ]
  },

  {
    path: '/developers',
    title: 'Web Development',
    role: 'programmer',
    type: 'sub',
    icontype: 'widgets',
    collapse: 'developers',
    children: [
      {path: 'laravel', title: 'Laravel', ab:'LAR'},
      {path: 'angular', title: 'Angular', ab:'ANG'},
      {path: 'vue', title: 'Vue', ab:'VUE'},
    ]
  },
  {
    path: '/tutorials',
    title: 'Video Tutorial',
    role: 'academy',
    type: 'sub',
    icontype: 'image',
    collapse: 'tutorials',
    children: [
      {path: 'software', title: 'Software', ab:'S'},
      {path: 'dev', title: 'Coding', ab:'C'},
    ]
  },


];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  authUser: AuthUser = null;
  imagePreview: null;
  avatar: string;

  public menuItems: any[];
  ps: any;

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };

  constructor(private authService: AuthService) {
    this.authService.getAuthUser().pipe(first()).subscribe( (response: any) => {
      this.authUser = response.data;
    });

  }

  ngOnInit(): void {
    this.authService.getAuthUserUpdateListener().subscribe( (res: any) => {
      this.authUser = res.userData;
    });

    this.menuItems = ROUTES.filter(menuItem => menuItem);

    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
      this.ps = new PerfectScrollbar(elemSidebar);
    }



  }

  updatePS(): void  {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      this.ps.update();
    }
  }

  isMac(): boolean {
    let bool = false;
    if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
      bool = true;
    }
    return bool;
  }

  //  for a single link menu
  isPwdEngineer(menuitem): boolean {
    if(this.authUser.is_departmental == 1){
      if(menuitem.is_departmental === this.authUser.is_departmental ||
          menuitem.ablity === this.authUser.is_pwd_engineer ||
          (menuitem.type === 'link' && this.authUser.roles.includes(menuitem.role)) ||
          menuitem.inforce === this.authUser.inforce){
        return true;
      }

      if(this.authUser.is_pwd_engineer == 1){
        if((menuitem.ablity === this.authUser.is_pwd_engineer) ||
          (menuitem.type === 'link' && this.authUser.roles.includes(menuitem.role))){
          return true;
        }
        return false;
      }else{
        if(menuitem.type === 'link' && this.authUser.roles.includes(menuitem.role)){
          return true;
        }
        return false;
      }

    }else{
      if( menuitem.inforce === this.authUser.inforce || menuitem.type === 'link' && this.authUser.roles.includes(menuitem.role)){
        return true;
      }
      return false;
    }

  }

  //  for a sub menu link
  activeSubMenu(menuitem): boolean{
    if(menuitem.display === this.authUser.display || (menuitem.type === 'link' && this.authUser.roles.includes(menuitem.role))){
      return true;
    }
    return false;
  }


}
