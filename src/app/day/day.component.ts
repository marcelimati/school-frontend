import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { SubjectService } from '../subject/subject.service';
import { UsersService } from '../users/users.service';


@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.css']
})
export class DayComponent implements OnInit {

  files: any = [];
  role: string;
  nickname: string[] = [];
  subjectname: string[] = [];

  constructor(
    private subjectService: SubjectService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
  ) { 
    route.url.subscribe( url => {
      const currentUser = this.authService.currentUserValue;
      this.role = currentUser.role;
      const year = route.snapshot.paramMap.get('year');
      const month = route.snapshot.paramMap.get('month');
      const day = route.snapshot.paramMap.get('day');
      if (currentUser.role == 'ADMIN') {
        this.subjectService.getByDateAll(year, month, day).subscribe( files => {
          this.files = files;
          // console.log(files);
          for (var i = 0; i<Object.keys(files).length; i++)
          {
            this.usersService.getUser(files[i].userid).subscribe( user => {
              this.nickname.push(user.username);
            });
            this.subjectService.getSubject(files[i].subject).subscribe( subject => {
              this.subjectname.push(subject.name);
            });
          }
        });
      }
      else
      {
        this.subjectService.getByDate(year, month, day).subscribe( files => {
          this.files = files;
        });
      }
    });
  }

  ngOnInit(): void {
  }

  formatDate(date){
    var date_to_format = new Date(date);
    var Amonth = new Array();
    Amonth[0] = "January";
    Amonth[1] = "February";
    Amonth[2] = "March";
    Amonth[3] = "April";
    Amonth[4] = "May";
    Amonth[5] = "June";
    Amonth[6] = "July";
    Amonth[7] = "August";
    Amonth[8] = "September";
    Amonth[9] = "October";
    Amonth[10] = "November";
    Amonth[11] = "December";
    var day = date_to_format.getDate();
    var month = Amonth[date_to_format.getMonth()];
    var year = date_to_format.getFullYear();

    var hour = date_to_format.getHours();
    var minutes = date_to_format.getMinutes();
    var seconds = date_to_format.getSeconds();

    var full_date = `${(day < 10) ? "0" + day : day} ${month} ${year} ${(hour<10) ? "0" + hour : hour}:${(minutes)<10 ? "0" + minutes: minutes}:${(seconds < 10) ? "0" + seconds : seconds}`;
    return full_date;
  }

  removeFile(id: string, index: number) {
    var result = confirm("Delete?");
    if (result == true)
    {
      this.files.splice(index, 1);
      if (this.role == 'ADMIN')
      {
        return this.subjectService.adminRemoveData(id).subscribe();
      }
      else
      {
        return this.subjectService.removeData(id).subscribe();
      }
    }
  }
}
