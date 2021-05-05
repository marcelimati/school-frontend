import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd} from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { User } from '../users/user';
import { UsersService } from '../users/users.service';

import { Subject } from '../settings/subject';
import { SubjectsService } from '../settings/subjects.service';
import { SubjectService } from '../subject/subject.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: User;
  subjects: Subject[];
  tasks: any = [];
  subjectname: string[] = [];
  grade: string[] = [];

  constructor(
        private router: Router,
        private subjectsService: SubjectsService,
        private authService: AuthService,
        private usersService: UsersService,
        private subjectService: SubjectService,
  ) {
      this.authService.currentUser.subscribe(x => this.currentUser = x);
        this.router.events.subscribe( val => {
          if (this.currentUser)
          {
            if (val instanceof NavigationEnd) {
            this.getSubjects();
            this.getTasks();
            }
          }

        });
    }

  ngOnInit(): void {
  }

  getSubjects()
    {
      this.usersService.getOwnUser(this.currentUser.id).subscribe(user => {
      this.subjectsService.getSubjects().subscribe(subjects => this.subjects = user.subjects);
      });
    }
    getTasks()
    {
      this.tasks = [];
      this.grade = [];
      this.subjects = [];
      this.usersService.getOwnUser(this.currentUser.id).subscribe(user => {

        this.subjectService.getAllTasksFromClassroom(user.classroom).subscribe(task => {
          this.tasks = task;
          // this.grade.push(task.grade)
          // console.log(this.tasks.grade);
          var editedtasks = JSON.stringify(task);
          var parsed = JSON.parse(editedtasks);

          // console.log(parsed);
          for (var j = 0; j<parsed.length; j++)
          {
            if (parsed[j].grade != undefined)
            {
              var filtered = parsed[j].grade.filter(o => o.user === this.currentUser.id);
              if (filtered.length != 0)
              {
                this.grade.push(filtered[0].grade);
              }
            }
          }
          // if complete don't show
          // console.log(task);
          for (var i = 0; i<Object.keys(task).length; i++)
          {
            this.subjectsService.getSubject(task[i].subject).subscribe( subject => {
              this.subjectname.push(subject.name);
            });
          }
        });
        
        // this.subjectService.getDataByClassroom(user.classroom).subscribe(task => {
        //     this.tasks = task;
        //     for (var i = 0; i<Object.keys(task).length; i++)
        //     {
        //       this.subjectsService.getSubject(task[i].subject).subscribe( subject => {
        //         this.subjectname.push(subject.name);
        //       });
        //     }
        //   });
      });
    }

}
