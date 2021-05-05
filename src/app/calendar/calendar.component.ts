import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SubjectService } from '../subject/subject.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  currentDate: Date;
  day: number;
  month: number;
  year: number;
  weekDay: number;
  startDate: Date;
  startDay: number;

  objectName: string;
  divId: string;
  tableId: string;
  monthNames: Array<string>;
  shortDayNames: Array<string>;
  monthDays: Array<number>;
  divTable: any;
  divDateText: any;
  divButtons: any;
  defaultOptions: any;
  options: any;
  divHeader: any;
  calendarWrapper: any;

  currentUser: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private subjectService: SubjectService,
    ) {
      this.currentUser = this.authService.currentUserValue;
     }

  ngOnInit(): void {
    var cal = this.Calendar("cal");
    cal = this.Display("calendar");
  }
  
  Calendar(name)
  {
    this.objectName = name;
    this.divId = "calendar";
    
    this.monthNames = new Array(
      "Styczeń",
      "Luty",
      "Marzec",
      "Kwiecień",
      "Maj",
      "Czerwiec",
      "Lipiec",
      "Sierpień",
      "Wrzesień",
      "Październik",
      "Listopad",
      "Grudzień" );

    this.shortDayNames = new Array("Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd");

    this.monthDays = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);

    this.currentDate = new Date();
    this.year = this.currentDate.getFullYear();
    this.month = this.currentDate.getMonth();
    this.day = this.currentDate.getDate();
    this.weekDay = this.currentDate.getDay();
    this.startDate = new Date(this.year, this.month, 1);
    this.startDay = this.startDate.getDay();

  }

  Display(divId)
  {
    this.divId = divId;
    this.show();
  }
  
  Refresh = function(year, month)
  {
    this.init(year, month);
    this.show();
  }
  
  init(year, month)
  {
    this.year = year;
    this.month = month;
    this.startDate = new Date(this.year, this.month, 1);
    this.startDay = this.startDate.getDay();
  
    if (this.isLeapYear())
      this.monthDays[1] = 29;
    else
      this.monthDays[1] = 28;
  }  

  isLeapYear()
  {
    if ((this.year % 400 == 0) || (this.year % 100 != 0 && this.year % 4 == 0))
      return(true);
    else
      return(false);
  }
  
  isToday(day)
  {
    var currentDate = new Date();
    if (
        (day == currentDate.getDate()) &&
        (this.month == currentDate.getMonth()) &&
        (this.year == currentDate.getFullYear())
      )
      return true;
    else
      return false;
  }

  hasFile(day)
  {
    

  }
  
  clearDiv()
  {
    var div = document.getElementById(this.divId);
    while (div.hasChildNodes())
      div.removeChild(div.lastChild);
  }

  createDayNames()
  {
    var div = document.getElementById(this.divId);
    var divnames = document.createElement("div");
    divnames.className = "row justify-content-center";
    div.appendChild(divnames);
    for (var i = 0; i< 7; i++)
    {
      var dayname = document.createElement("div");
      dayname.className = "dayname";
      dayname.style.width = "14%";
      dayname.style.textAlign = "center";
      var textNode = document.createTextNode(this.shortDayNames[i]);
      dayname.appendChild(textNode);
      divnames.appendChild(dayname);
    }
  }

  addRow()
  {
    var div = document.getElementById(this.divId);
    var divrow = document.createElement("div");
    divrow.className = "row justify-content-center";
    divrow.id= "days"
    div.appendChild(divrow);
  }
  
  addCell(day)
  {
    var divrow = document.getElementById("days");

    var textNode;

    var daybox = document.createElement("div");
    daybox.className = "daybox";
    daybox.style.width = "14%";
    daybox.style.textAlign = "center";
    daybox.style.border = "1px solid";
    daybox.style.height = "auto";
    daybox.style.lineHeight = "4.5rem";
    if (this.currentUser.role == 'ADMIN') {
      if (this.isToday(day)) daybox.style.backgroundColor = "cyan";
      var month = this.month + 1;
      var year = this.year;
      this.subjectService.getByDateAll(year, month, day).subscribe( files => {
        // if (files.length > 0) daybox.style.backgroundColor = "lime";
      });
    }
    else
    {
      if (this.isToday(day)) daybox.style.backgroundColor = "cyan";
      var month = this.month + 1;
      var year = this.year;
      this.subjectService.getByDate(year, month, day).subscribe( files => {
        // if (files.length > 0) daybox.style.backgroundColor = "lime";
      });
    }

    daybox.style.cursor = "pointer";
    if (day > 0)
    {
      textNode= document.createTextNode(day);
    }
    else
    {
      textNode= document.createTextNode(" ");
    }
    daybox.addEventListener("click", e => {
      this.router.navigate([`/calendar/${this.year}/${this.month+1}/${day}`]);
     });
    daybox.appendChild(textNode);
    divrow.appendChild(daybox);
  }

  createNavigation()
  {
    //Header
    var div = document.getElementById(this.divId);
    var divButtons = document.createElement("div");
    divButtons.style.display = "flex";
    divButtons.style.justifyContent = "space-between";
    //Prev button
    var buttonPrev = document.createElement("button");
    buttonPrev.innerText = "<";
    buttonPrev.type = "button";
    buttonPrev.style.width = "40px";
    buttonPrev.addEventListener("click", e => {
      this.month--;
      if (this.month < 0) {
          this.month = 11;
          this.year--;
      }
      this.Refresh(this.year,this.month);
    });
    divButtons.appendChild(buttonPrev);
    //Text between
    var divText = document.createElement("div");
    divText.innerHTML = `${(this.day < 10) ? "0" + this.day : this.day}.${((this.month + 1) < 10) ? "0" + (this.month + 1) : this.month + 1}.${this.year}`;
    divText.style.textAlign = "center";
    divButtons.appendChild(divText);

    //Next button
    var buttonNext = document.createElement("button");
    buttonNext.innerText = ">";
    buttonNext.type = "button";
    buttonNext.style.width = "40px";
    buttonNext.addEventListener("click", e => {
      this.month++;
      if (this.month > 11) {
          this.month = 0;
          this.year++;
      }
      this.Refresh(this.year,this.month);
    });
    divButtons.appendChild(buttonNext);
    div.appendChild(divButtons);
  }
  
  show()
  {
    this.clearDiv();
    this.createNavigation();
    this.createDayNames();

    var day = 1;
    var offset = this.startDay;

    if (offset == 0)
    {
      offset = 7;
    }
     
    var rowCount = Math.ceil((this.monthDays[this.month] + offset-1) / 7);
    this.addRow();

    for (var i = 0; i < rowCount; i++)
    {
      for (var j = 0; j < 7; j++)
      {
        if (offset > 1)
        {
          this.addCell(0);
          offset--;
        }
        else
        {
          if (day > this.monthDays[this.month])
            this.addCell(0);
          else
            this.addCell(day);
          day++;
        }
      }
    }
  }

}
