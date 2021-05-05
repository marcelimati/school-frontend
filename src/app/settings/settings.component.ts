import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService } from '../auth/alert.service';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';

import { Subject } from './subject';
import { SubjectsService } from './subjects.service';

import { Classroom } from './classroom';
import { ClassroomsService } from './classrooms.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  subjects: Subject[];
  classrooms: Classroom[];
  addSubjectForm: FormGroup;
  addClassroomForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private usersService: UsersService,
    private alertService: AlertService,
    private subjectsService: SubjectsService,
    private classroomsService: ClassroomsService,
) {
}

ngOnInit() {
  this.addSubjectForm = this.formBuilder.group({
      name: ['', Validators.required]
  });
  this.addClassroomForm = this.formBuilder.group({
    name: ['', Validators.required]
  })
  this.getSubjects();
  this.getClassrooms();
}

// convenience getter for easy access to form fields
get f() { return this.addSubjectForm.controls; }
get c() { return this.addClassroomForm.controls; }

onSubmit() {
  this.submitted = true;

  // reset alerts on submit
  this.alertService.clear();

  // stop here if form is invalid
  if (this.addSubjectForm.invalid) {
      return;
  }

  this.loading = true;
  this.subjectsService.create(this.addSubjectForm.value)
      .pipe(first())
      .subscribe(
          data => {
              this.alertService.success('Subject created', true);
              this.loading = false;
              this.getSubjects();
          },
          error => {
              this.alertService.error(error);
              this.loading = false;
          });
  }

  onSubmitClassroom() {
    this.submitted = true;
  
    // reset alerts on submit
    this.alertService.clear();
  
    // stop here if form is invalid
    if (this.addClassroomForm.invalid) {
        return;
    }
  
    this.loading = true;
    this.classroomsService.create(this.addClassroomForm.value)
        .pipe(first())
        .subscribe(
            data => {
                this.alertService.success('Classroom created', true);
                this.loading = false;
                this.getClassrooms();
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }

  getSubjects()
  {
    this.subjectsService.getSubjects()
    .subscribe(subjects => this.subjects = subjects)
  }

  getClassrooms()
  {
    this.classroomsService.getClassrooms()
    .subscribe(classrooms => this.classrooms = classrooms)
  }

  deleteSubject(subject: Subject): void {
    var result = confirm("Delete?");
    if (result == true)
    {
      this.subjects = this.subjects.filter(s => s !== subject);
      this.subjectsService.deleteSubject(subject).subscribe();
    }
  }

  deleteClassroom(classroom: Classroom): void {
    var result = confirm("Delete?");
    if (result == true)
    {
      this.classrooms = this.classrooms.filter(s => s !== classroom);
      this.classroomsService.deleteClassroom(classroom).subscribe();
    }
  }

}
