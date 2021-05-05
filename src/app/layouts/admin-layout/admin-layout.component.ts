import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { NavItem } from '../../md/md.module';
import { Location, PopStateEvent } from '@angular/common';
import 'rxjs/add/operator/filter';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import PerfectScrollbar from 'perfect-scrollbar';

declare const $: any;

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})

export class AdminLayoutComponent implements OnInit, AfterViewInit {
  public navItems: NavItem[];
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];
  url: string;
  location: Location;

  @ViewChild('sidebar', {static: false}) sidebar: any;
  @ViewChild(NavbarComponent, {static: false}) navbar: NavbarComponent;

  constructor( private router: Router, location: Location ) {
    this.location = location;
  }

  ngOnInit(): void {
    const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
    const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
    this.location.subscribe((ev:PopStateEvent) => {
      this.lastPoppedUrl = ev.url;
    });

    this.router.events.subscribe((event:any) => {
      if (event instanceof NavigationStart) {
        if (event.url != this.lastPoppedUrl)
          this.yScrollStack.push(window.scrollY);
      } else if (event instanceof NavigationEnd) {
        if (event.url == this.lastPoppedUrl) {
          this.lastPoppedUrl = undefined;
          window.scrollTo(0, this.yScrollStack.pop());
        }
        else
          window.scrollTo(0, 0);
      }
    });

    const html = document.getElementsByTagName('html')[0];
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      let ps = new PerfectScrollbar(elemMainPanel);
      ps = new PerfectScrollbar(elemSidebar);
      html.classList.add('perfect-scrollbar-on');
    }
    else {
      html.classList.add('perfect-scrollbar-off');
    }


  }
  ngAfterViewInit() {
    this.runOnRouteChange();
  }
  public isMap() {
    if (this.location.prepareExternalUrl(this.location.path()) === '/maps/fullscreen') {
      return true;
    } else {
      return false;
    }
  }
  runOnRouteChange(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
      const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
      let ps = new PerfectScrollbar(elemMainPanel);
      ps = new PerfectScrollbar(elemSidebar);
      ps.update();
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
