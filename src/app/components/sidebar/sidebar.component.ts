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
  role?: any;
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
    role: 'visitor',
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
      {path: 'users', title: 'Users', ab:'U'},
      {path: 'roles', title: 'Roles', ab:'R'},
      {path: 'active-users', title: 'Active User', ab:'AU'},
      {path: 'block-users', title: 'Blocked User', ab:'BU'},
    ]
  },
  {
    path: '/engrs',
    title: 'WB PWD Engineers',
    role: 'junior_engineer',
    type: 'link',
    icontype: 'architecture'
  },
  {
    path: '/pwd-works',
    title: 'PWD-Works',
    role: 'junior_engineer',
    type: 'link',
    icontype: 'work'
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
  }
  
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

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
      this.ps = new PerfectScrollbar(elemSidebar);
    }

    this.authService.getAuthUser().pipe(first()).subscribe( (response: any) => {
      this.authUser = response.data;
      console.log('sidebar1', this.authUser);

    });
    
    this.authService.getAuthUserUpdateListener().subscribe( (res:any) => {
      this.authUser = res.user;
      console.log('sidebar2', this.authUser);
    });
    
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

}