import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { AlertService } from '../../../../services/alert.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.scss']
})
export class FacebookComponent implements OnInit {
  urlParams: any = {};
  returnUrl: string;
  error = '';
  isLoading = false;

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router, private alertService: AlertService) { }

  ngOnInit(): void {
    this.urlParams.code = this.route.snapshot.queryParamMap.get('code');
    this.loginFacebookSocialite();
  }

  loginFacebookSocialite() {
    this.isLoading = true;
    // this.isLoading = true;
    this.authService.loginFacebookCallback(this.urlParams).subscribe({ next: () => {
      // get return url from query parameters or default to home page
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      this.router.navigateByUrl(returnUrl);
      this.isLoading = false;
      Swal.fire({ position: 'top-end', icon: 'success', title: 'Facebook Logged In Successfully', showConfirmButton: false, timer: 4000 });
    },
      error: err => {
        this.error = err;
        this.isLoading = false;
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Email associated with Facebook has already been Registered',
          showConfirmButton: false,
          timer: 4000
        });
      }

    });
  }


}
