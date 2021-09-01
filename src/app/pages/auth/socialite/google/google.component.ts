import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-google',
  templateUrl: './google.component.html',
  styleUrls: ['./google.component.scss']
})

export class GoogleComponent implements OnInit {
  urlParams: any = {};
  returnUrl: string;
  error = '';
  isLoading = false;

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.urlParams.code = this.route.snapshot.queryParamMap.get('code');
    this.loginGoogleSocialite();
  }

  loginGoogleSocialite() {
    this.isLoading = true;
    this.authService.loginGoogleCallback(this.urlParams.code).subscribe( response => {
      // get return url from query parameters or default to home page
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
      this.router.navigateByUrl(returnUrl);
      this.isLoading = false;
      Swal.fire({ position: 'top-end', icon: 'success', title: 'Google Logged In Successfully', showConfirmButton: false, timer: 4000 });
    },

    (err: any) => {
      console.log('sdfgsgfs', err);
      //   this.isLoading = false;
      // if(err.error.message !=null){
      //   Swal.fire({ position: 'top-end', icon: 'info', title: err.error.message, showConfirmButton: false, timer: 4000 });
      // }else{

      // }
      //   Swal.fire({position: 'top-end', icon: 'error', title: err.error.errors.message, showConfirmButton: false, timer: 4000 });
      // }
      }
    );

      // error: err => {
      //   this.error = err;
      //   this.isLoading = false;
      //   Swal.fire({
      //     position: 'top-end',
      //     icon: 'error',
      //     title: 'Email associated with Google has already been Registered',
      //     showConfirmButton: false,
      //     timer: 4000,
      //   });
      // }

    // });
  }

}
