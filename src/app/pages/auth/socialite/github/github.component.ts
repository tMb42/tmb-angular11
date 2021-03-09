import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-github',
  templateUrl: './github.component.html',
  styleUrls: ['./github.component.scss']
})
export class GithubComponent implements OnInit {
  emailVerified: boolean = false;
  verifyStatus: any ={};
  urlParams: any = {};

  constructor(private route: ActivatedRoute, private authService: AuthService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.urlParams.token = this.route.snapshot.queryParamMap.get('code');
    this.loginGitHubSocialite();
  }

  loginGitHubSocialite() {
    // this.isLoading = true;
    this.authService.loginGitHubCallback(this.urlParams.token).subscribe((res: any) => {    
      this.emailVerified = true;
      this.verifyStatus = res;
      
      Swal.fire({ position: 'top-end', icon: 'success', title: res, showConfirmButton: false, timer: 4000 });
    }, 
    (err : any) => {
      this.emailVerified = false;
      this.verifyStatus = err.message;

      Swal.fire({ position: 'top-end', icon: 'error', title: err, showConfirmButton: false, timer: 4000});
    })
  }

}

