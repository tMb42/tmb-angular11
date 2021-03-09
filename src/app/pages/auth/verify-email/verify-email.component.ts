import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AlertService } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  emailVerified: boolean = false;
  verifyStatus: any ={};
  urlParams: any = {};
  // isLoading = false;

  constructor(private route: ActivatedRoute, private authService: AuthService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.urlParams.token = this.route.snapshot.queryParamMap.get('token');
    this.urlParams.userId = this.route.snapshot.queryParamMap.get('userId');
    this.confirmEmail();
  }
  confirmEmail() {
    // this.isLoading = true;
    this.authService.getEmailVarification(this.urlParams).subscribe((res: any) => {
      this.emailVerified = true;
      this.verifyStatus = res.message;

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
