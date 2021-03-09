import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-google',
  templateUrl: './google.component.html',
  styleUrls: ['./google.component.scss']
})
export class GoogleComponent implements OnInit {
  emailVerified: boolean = false;
  verifyStatus: any ={};
  urlParams: any = {};

  constructor(private route: ActivatedRoute, private authService: AuthService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.urlParams.token = this.route.snapshot.queryParamMap.get('code');
    this.loginGoogleSocialite();
  }

  loginGoogleSocialite() {
    // this.isLoading = true;
    this.authService.loginGoogleCallback(this.urlParams.token).subscribe((res: any) => {    
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
