import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SendMailService } from '../../services/send-mail.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-send-mail',
  templateUrl: './send-mail.component.html',
  styleUrls: ['./send-mail.component.scss']
})

export class SendMailComponent implements OnInit {
  contactForm: FormGroup;
  submitted = false;
  isLoading = false;
  feedback: string = null;
  error: {};
  
  constructor(private fb: FormBuilder, private router: Router, private mailService: SendMailService) { }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      fullname: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      mobile: new FormControl(null, [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      message: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(150)]),
    });
    
  }

  // convenience getter for easy access to form fields
  get f() { 
    return this.contactForm.controls; 
  }

  submitContactForm() {
    this.submitted = true;
    this.isLoading = true;

    const formData = this.contactForm.getRawValue();
    const contactData = {
      name: formData.fullname,
      email: formData.email,
      mobile: formData.mobile,
      message: formData.message,
    } 

    this.mailService.contactForm(contactData).pipe(first()).subscribe((response: any) => {
      this.isLoading = false;
      this.feedback = response.msg;
      Swal.fire({ position: 'bottom', icon: 'success', showConfirmButton: false, timer: 3000, title: response.msg });
    },
    (err: any) => {
      this.isLoading = false;
      Swal.fire({ position: 'center-start', icon: 'error', title: err, showConfirmButton: false, timer: 4000 }); 
     
    });
  }

  resetForm(): void {
    this.submitted = true;
    this.contactForm.reset();
  }

}
