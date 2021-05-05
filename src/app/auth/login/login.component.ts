import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService } from '../alert.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) { 
    // redirect to home if already logged in
    if (this.authService.currentUserValue) { 
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

   // convenience getter for easy access to form fields
   get f() { return this.loginForm.controls; }

  onSubmit() {

    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;

    this.authService.login(this.f.username.value, this.f.password.value)
    .pipe(first())
    .subscribe(
        data => {
            this.router.navigate(['/']);
            this.show();
        },
        error => {
            this.alertService.error(error);
            this.loading = false;
        });
  }

  show() {
    document.getElementById("sidenav").style.width = "230px";
    document.getElementById("openmenu").style.display = "none";
    document.getElementById("container").style.position = "fixed";
    document.getElementById("container").style.marginTop = "3%";
    document.getElementById("container").style.marginBottom = "3%";
    document.getElementById("container").style.left = "250px";
    document.getElementById("container").style.marginRight = "5%";
    document.getElementById("container").style.marginLeft = "5%";
    document.getElementById("container").style.width = "calc(90% - 250px)";
  }
}
