import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { AlertService } from '../../../../services/alert.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.scss']
})
export class FacebookComponent implements OnInit {
  emailVerified: boolean = false;
  verifyStatus: any ={};
  urlParams: any = {};

  constructor(private route: ActivatedRoute, private authService: AuthService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.urlParams.token = this.route.snapshot.queryParamMap.get('code');
    this.loginFacebookSocialite();
  }

  loginFacebookSocialite() {
    // this.isLoading = true;
    this.authService.loginFacebookCallback(this.urlParams.token).subscribe((res: any) => {    
      this.emailVerified = true;
      this.verifyStatus = res.message;
      console.log('eweew', res);

      Swal.fire({ position: 'top-end', icon: 'success', title: res.message, showConfirmButton: false, timer: 4000 });
    }, 
    (err : any) => {
      console.log(err);
      this.emailVerified = false;
      this.verifyStatus = err.message;

      Swal.fire({ position: 'top-end', icon: 'error', title: 'err.message', showConfirmButton: false, timer: 4000});
    })
  }

}
