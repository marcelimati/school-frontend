import { Component } from '@angular/core';
import { Router, NavigationEnd} from '@angular/router';

import { AuthService } from './auth/auth.service';
import { User } from './users/user';
import { UsersService } from './users/users.service';

import { Subject } from './settings/subject';
import { SubjectsService } from './settings/subjects.service';
import { SubjectService } from './subject/subject.service';

import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentUser: User;
  subjects: Subject[];
  tasks: any = [];
  subjectname: string[] = [];
  grade: string[] = [];

  public isCollapsed = true;

    constructor(
        private router: Router,
        private subjectsService: SubjectsService,
        private authService: AuthService,
        private usersService: UsersService,
        private appService: AppService,
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

        })
    }

    ngOnInit(): void {
      if (this.currentUser)
      {
        this.show();
      }
      else
      {
        this.hide();
      }
    }

    collapse() {
      this.isCollapsed = !this.isCollapsed;
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
        this.hide();
    }
    hide() {
      document.getElementById("sidenav").style.width = "0";
      document.getElementById("openmenu").style.display = "block";
      document.getElementById("container").style.position = "fixed";
      document.getElementById("container").style.marginTop = "3%";
      document.getElementById("container").style.marginBottom = "3%";
      document.getElementById("container").style.left = "0";
      document.getElementById("container").style.marginRight = "5%";
      document.getElementById("container").style.marginLeft = "5%";
      document.getElementById("container").style.width = "90%";

      
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