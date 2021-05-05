import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User } from '../users/user';
import { Subject } from '../settings/subject';
import { Classroom } from '../settings/classroom';
import { UsersService } from '../users/users.service';
import { SubjectsService } from '../settings/subjects.service';
import { ClassroomsService } from '../settings/classrooms.service';
import { AlertService } from '../auth/alert.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  public id: string;
  user : User;
  subjects : Subject[];
  onesubject : Subject;
  currentSubjects : Subject[];
  classrooms : Classroom[];
  roles: Object;

  constructor(
    private usersService: UsersService, 
    private route: ActivatedRoute,
    private subjectsService: SubjectsService,
    private alertService: AlertService,
    private classroomsService: ClassroomsService,
    ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    this.usersService.getUser(this.id).subscribe(user => {
      this.user = user;
      this.currentSubjects = user.subjects;
      // console.log(user);
    });

    this.subjectsService.getSubjects().subscribe(subjects => {
      this.subjects = subjects;
      this.checkSubjects();
    });

    this.classroomsService.getClassrooms().subscribe(classrooms => {
      this.classrooms = classrooms;
    });

    this.roles = [
      { value: "ADMIN", name: "Admin" },
      { value: "TEACHER", name: "Nauczyciel" },
      { value: "USER", name: "Użytkownik" },
    ];
  }

  checkSubjects() {
    this.usersService.getUser(this.id).subscribe(user => {
      this.user = user; 
      for (var i=0; i<user.subjects.length; i++)
      {
        document.getElementById(user.subjects[i]._id).style.backgroundColor = "green";
      }
    });
  }

  setSubject(id : string) {
    this.subjectsService.getSubject(id).subscribe(onesubject => {
      this.onesubject = onesubject;

      var ifExist = this.currentSubjects.find(s => s.name === onesubject.name);

      if (ifExist == undefined) {
        this.currentSubjects.push(onesubject);
        document.getElementById(onesubject._id).style.backgroundColor = "green";
      }
      else {
        document.getElementById(onesubject._id).style.backgroundColor = "red";
        this.currentSubjects = this.currentSubjects.filter(function(s) {return s.name != onesubject.name});
      }
    });
  }

  selectAll() {
    this.currentSubjects = this.subjects;

    for (var i = 0; i<this.currentSubjects.length; i++) {
      document.getElementById(this.currentSubjects[i]._id).style.backgroundColor = "green";
    }
  }

  updateUser() {
    var option = document.getElementById( "role" ) as HTMLSelectElement;
    var role = option.options[option.selectedIndex].value;
    var classroomoption = document.getElementById( "classroom" ) as HTMLSelectElement;
    var classroom = classroomoption.options[classroomoption.selectedIndex].value;
    this.usersService.updateUser(this.user, this.currentSubjects, role, classroom);
    this.alertService.success('User updated', false);
  }

}
