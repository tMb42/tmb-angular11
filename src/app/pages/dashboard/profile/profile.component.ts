import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { HttpEventType } from '@angular/common/http';
import Swal from 'sweetalert2';
import { first } from 'rxjs/operators';
import { AuthUser } from '../../../models/auth-user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  authUser: AuthUser = null;
  // authUsers: AuthUser;
  selectedFile: File = null;
  imagePreview: null;
  isLoading = false;
  imageSending = false;

  avatar: string;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.authService.getAuthUser().pipe(first()).subscribe((response: any) => {
      this.isLoading = false;
      this.authUser = response.data;
    });

    // this.authService.getAvaratUpdateListener().subscribe( res => {
    //   this.imageSending = false;
    //   this.avatar = res;
    //   console.log('profile', res)
    // });

    this.authService.getAuthUserUpdateListener().subscribe( (res: any) => {
      this.imageSending = false;
      this.authUser = res.userUpDateData;
    });

  }

  //to preview image after selection of image file
  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
    // console.log(this.selectedFile);
    if(event.target.files){
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = (event:any) => {
        this.imagePreview = event.target.result;
      }
    }
  }

  //upload and save images in database through service.js
  profilePictureUpload() {
    this.imageSending = true;
    const avatarFormData = new FormData();
    avatarFormData.append('image', this.selectedFile, this.selectedFile.name);
    this.authService.uploadUserProfileImage(avatarFormData).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress){
        this.imageSending = false;
        console.log('Upload Progress: ', Math.round(event.loaded/event.total*100) + '%');
          Swal.fire({
          icon: 'success',
          title: 'Profile picture updated successfully',
          showConfirmButton: false,
          timer: 3000
        });

      }else if (event.type === HttpEventType.Response){
        console.log(event);
      }
    },
    err => {
      this.imageSending = false;
      console.log(err);
      // this.alertService.error(err);
      Swal.fire({ icon: 'error',  title: err.errors.image[0], showConfirmButton: false, timer: 2000 });
    });

  }







}
