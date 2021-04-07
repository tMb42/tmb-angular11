import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-github',
  templateUrl: './github.component.html',
  styleUrls: ['./github.component.scss']
})
export class GithubComponent implements OnInit {
  urlParams: any = {};
  returnUrl: string;
  error = '';
  isLoading = false;
  
  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.urlParams.code = this.route.snapshot.queryParamMap.get('code');
    this.loginGitHubSocialite();
  }

  loginGitHubSocialite() {
    this.isLoading = true;
    this.authService.loginGitHubCallback(this.urlParams).subscribe({ next: () => {
      // get return url from query parameters or default to home page
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
      this.router.navigateByUrl(returnUrl);
       this.isLoading = false;
      Swal.fire({ position: 'top-end', icon: 'success', title: 'Github Logged In Successfully', showConfirmButton: false, timer: 4000 });
    },
      error: err => {
        this.error = err;
        this.isLoading = false;
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Email associated with Github has already been Registered',
          showConfirmButton: false,
          timer: 4000
        });
      }

    });
  }

}