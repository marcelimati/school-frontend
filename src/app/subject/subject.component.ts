import { Component, OnInit } from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService } from '../auth/alert.service';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { SubjectService } from './subject.service';

import { saveAs } from 'file-saver';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css'],
})
export class SubjectComponent implements OnInit {

  files: any[] = [];
  uploadedFiles: any = [];
  gradedFiles: any = [];
  tasks: any = [];
  subject: string;
  role: string;
  classroom: string;
  nickname: string[] = [];
  taskid: string;
  teacherfiles: any = [];
  taskname: string[] = [];

  constructor(
    private subjectService: SubjectService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private usersService: UsersService,
    private router: Router,
    ) {
      route.url.subscribe( url => {
        const currentUser = this.authService.currentUserValue;
        this.role = currentUser.role;
        const subject = route.snapshot.paramMap.get('id');
        const taskid = route.snapshot.paramMap.get('task');
        this.taskid = taskid;
        
        this.usersService.getOwnUser(currentUser.id).subscribe(user => {
          this.classroom = user.classroom;
          if (user.role != "ADMIN"){
            if (!user.subjects.find(s => s._id === subject)){
              this.router.navigate(['/']);
            }
          }
        });

        if (this.role == "TEACHER"){
          if (taskid != null)
          {
            this.usersService.getOwnUser(currentUser.id).subscribe(user => {

              this.subjectService.getTask(taskid).subscribe(task => {
                var toJson = JSON.stringify(task);
                var parsed = JSON.parse(toJson);
                this.tasks = Array(parsed);
                this.subjectService.getFile(parsed.file).subscribe( res => {

                  this.teacherfiles = Array(res);
                });

                this.subjectService.getDataByClassroomSubject(subject, user.classroom).subscribe( obj => {
                  this.uploadedFiles = [];
                  this.nickname = [];
                  var array = [];
                  var filtered = [];

                  //Tablica bez nauczyciela w danym tasku
                  for (var i = 0; i<Object.keys(obj).length; i++)
                  {
                    if(obj[i].userid != parsed.teacher && obj[i].task == taskid)
                    {
                      array.push(obj[i]);
                    }
                  }
                  if (parsed.complete != undefined)
                  {
                    //Tablica bez tych co zrobili
                    filtered = array;
                    for (var j = 0; j<parsed.complete.length; j++)
                    {
                     filtered = filtered.filter(o => o.userid !== parsed.complete[j].user);
                    }
                  }
                  if (parsed.complete == undefined)
                  {
                    for (var k = 0; k<array.length; k++)
                    {
                      this.uploadedFiles.push(array[k]);
                      this.usersService.getUserTeacher(array[k].userid).subscribe( user => {
                        this.nickname.push(user.username);
                      });
                    }
                  }
                  else
                  {
                    //Pokazywanie tych co zostali do oceny
                    if (array.length != filtered.length)
                    {
                      for (var k = 0; k<filtered.length; k++)
                      {
                        this.uploadedFiles.push(filtered[k]);
                        this.usersService.getUserTeacher(filtered[k].userid).subscribe( user => {
                          this.nickname.push(user.username);
                        });
                      }
                    }
                  }
                });
              });
            });
          }
          else
          {
            //Posegregowanie ocenionych itp
            this.usersService.getOwnUser(currentUser.id).subscribe(user => {

              this.subjectService.getAllTasksFromClassroom(user.classroom).subscribe(tasks => {
                var toJson = JSON.stringify(tasks);
                var parsed = JSON.parse(toJson);
                this.tasks = parsed;

                this.teacherfiles = [];
                for (var i = 0; i<parsed.length; i++)
                {
                  this.subjectService.getFile(parsed[i].file).subscribe( res => {
                    this.teacherfiles.push(res);
                  });
                }

                this.subjectService.getDataByClassroomSubject(subject, user.classroom).subscribe( obj => {
                  this.uploadedFiles = [];
                  this.nickname = [];
                  var array = [];
                  var filtered = [];

                  //Tablica bez nauczyciela
                  for (var j = 0; j<Object.keys(obj).length; j++)
                  {
                    if(obj[j].userid != parsed[0].teacher)
                    {
                      array.push(obj[j]);
                    }
                  }

                  filtered = array;
                  for (var j = 0; j<parsed.length; j++)
                  {
                    if (parsed[j].complete != undefined)
                    {
                      for (var k = 0; k<parsed[j].complete.length; k++)
                      {
                        filtered = filtered.filter(o => o.userid !== parsed[j].complete[k].user);
                      }
                    }
                    
                  }
                  this.uploadedFiles = filtered;
                  this.gradedFiles = array;
                  // if (parsed.complete != undefined)
                  // {
                  //   //Tablica bez tych co zrobili
                  //   filtered = array;
                  //   for (var j = 0; j<parsed.complete.length; j++)
                  //   {
                  //    filtered = filtered.filter(o => o.userid !== parsed.complete[j].user);
                  //   }
                  // }
                  // if (parsed.complete == undefined)
                  // {
                  //   for (var k = 0; k<array.length; k++)
                  //   {
                  //     this.uploadedFiles.push(array[k]);
                  //     this.usersService.getUserTeacher(array[k].userid).subscribe( user => {
                  //       this.nickname.push(user.username);
                  //     });
                  //   }
                  // }
                  // else
                  // {
                  //   //Pokazywanie tych co zostali do oceny
                  //   if (array.length != filtered.length)
                  //   {
                  //     for (var k = 0; k<filtered.length; k++)
                  //     {
                  //       this.uploadedFiles.push(filtered[k]);
                  //       this.usersService.getUserTeacher(filtered[k].userid).subscribe( user => {
                  //         this.nickname.push(user.username);
                  //       });
                  //     }
                  //   }
                  // }

                  for (var i = 0; i<array.length; i++)
                  {
                    this.subjectService.getTask(array[i].task).subscribe( t => {
                      var k = Object(t)
                      this.taskname.push(k.name);
                    });
                    
                    this.usersService.getUserTeacher(array[i].userid).subscribe( user => {
                      this.nickname.push(user.username);
                    });
                  }

                });
              });
            });
          }
        }
        if (this.role == "USER") {
          if (taskid != null)
          {
            this.usersService.getOwnUser(currentUser.id).subscribe(user => {

              this.subjectService.getTask(taskid).subscribe(task => {
                // this.tasks = task;
                // if complete don't show
                // console.log(task);
                if (task)
                {
                  var toJson = JSON.stringify(task);
                  var parsed = JSON.parse(toJson);
  
                  this.subjectService.getFileFromClassroom(parsed.file, parsed.classroom).subscribe(result => {
                    // console.log(result);
                    this.tasks = Array(result);
                  });
                }
                else
                {
                  this.router.navigate(['/']);
                }
                

                // for (var i = 0; i<Object.keys(task).length; i++)
                // {
                //   this.subjectsService.getSubject(task[i].subject).subscribe( subject => {
                //     this.subjectname.push(subject.name);
                //   });
                // }
              });
              
              // this.subjectService.getDataByClassroom(user.classroom, tas).subscribe(task => {
              //   //show only not completed tasks + file info 
              //     for (var i = 0; i<Object.keys(task).length; i++)
              //     {
              //       if (task[i].subject == subject)
              //       {
              //         this.tasks.push(task[i]);
              //       }
              //       // this.subjectsService.getSubject(task[i].subject).subscribe( subject => {
              //       //   this.subjectname.push(subject.name);
              //       // });
              //     }
              //   });
            });

            this.subjectService.getDataByTask(subject, currentUser.id, taskid).subscribe( obj => {
              this.uploadedFiles = obj;
            });
            
          } 
          else
          {
            this.usersService.getOwnUser(currentUser.id).subscribe(user => {

              // this.subjectService.getDataByClassroom(user.classroom).subscribe(task => {
              //   //show only not completed tasks + file info 
              //     for (var i = 0; i<Object.keys(task).length; i++)
              //     {
              //       if (task[i].subject == subject)
              //       {
              //         this.tasks.push(task[i]);
              //       }
              //       // this.subjectsService.getSubject(task[i].subject).subscribe( subject => {
              //       //   this.subjectname.push(subject.name);
              //       // });
              //     }
              //   });
            });
            this.subjectService.getData(subject, currentUser.id).subscribe( obj => {
              this.uploadedFiles = obj;
            });
            
          }
          
        }
        this.subjectService.getSubject(subject).subscribe( subj => {
          this.subject = subj.name;
        });
      });
    }

  ngOnInit(): void {
    
  }

  fileHandler(event) {
    this.alertService.clear();
    var files = event.target.files;
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
  }

  uploadFile(file, name, id){

    let formData = new FormData();
    formData.append("file", file, name);
    var date = Date.now();
    
    const currentUser = this.authService.currentUserValue;
    var subject = this.route.snapshot.paramMap.get('id');

    this.subjectService.upload(formData)
    .subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          this.files[id].progress = Math.round(event.loaded / event.total * 100);
          break;
        case HttpEventType.Response:
          if (event.status === 201)
          {
            if (this.role == "TEACHER"){
              this.subjectService.insertData(event.body, subject, currentUser.id, date, this.classroom, null).subscribe();

              var taskname = document.getElementById("taskname") as HTMLInputElement;
              this.subjectService.getFileByName(event.body.filename).subscribe( file => {
                this.subjectService.insertTask(taskname.value, currentUser.id, subject, this.classroom, file[0]._id).subscribe();
              });
            }
            else
            {
              this.subjectService.insertData(event.body, subject, currentUser.id, date, this.classroom, this.taskid).subscribe();
            }
          }
          
          if (id < this.files.length-1)
          {
            this.uploadFile(this.files[id+1], this.files[id+1].name, id+1);
          }
          if (id  == this.files.length-1)
          {
            this.alertService.success('Files uploaded successfully!', false);
            this.files = [];
            const currentUser = this.authService.currentUserValue;
            const subject = this.route.snapshot.paramMap.get('id');
            if (this.taskid != null)
            {
              this.subjectService.getDataByTask(subject, currentUser.id, this.taskid).subscribe( obj => {
                this.uploadedFiles = obj;
              });
            }
            else
            {
              this.subjectService.getData(subject, currentUser.id).subscribe( obj => {
                this.uploadedFiles = obj;
              });
            }
          }
        }
    })
  }

  submitForm() {

    if (this.files.length != 0)
    {
      this.uploadFile(this.files[0], this.files[0].name, 0);
    }
    else
    {
      this.alertService.error("You didn't choose any file(s)", false);
    }
  }

  putGrade(index, userid) {
    var option = document.getElementById( `ocena${index}` ) as HTMLSelectElement;
    var gradenumber = option.options[option.selectedIndex].value;
    const taskid = this.route.snapshot.paramMap.get('task');

    var complete = { user: userid, completed: true };
    var gradeMark = { user: userid, grade: gradenumber };

    this.subjectService.getTask(taskid).subscribe( task => {
      
      var toJson = JSON.stringify(task);
      var parsed = JSON.parse(toJson);

      if (parsed.complete == undefined)
      {
        this.subjectService.updateTask(taskid, Array(complete), Array(gradeMark));
      }
      else
      {
        var completeArr = parsed.complete;
        var gradeArr = parsed.grade;
        completeArr.push(complete);
        gradeArr.push(gradeMark);

        this.subjectService.updateTask(taskid, completeArr, gradeArr);

        var filtered = this.uploadedFiles;
        for (var j = 0; j<parsed.complete.length; j++)
        {
          filtered = filtered.filter(o => o.userid !== parsed.complete[j].user);
        }
        this.uploadedFiles = filtered;
      }

    });
    
    this.alertService.success('Oceniono', false);
  }

  editGrade(index, userid) {
    // var option = document.getElementById( `ocena${index}` ) as HTMLSelectElement;
    // var gradenumber = option.options[option.selectedIndex].value;
    // const taskid = this.route.snapshot.paramMap.get('task');

    // var complete = { user: userid, completed: true };
    // var gradeMark = { user: userid, grade: gradenumber };

    // // console.log(complete);
    // // console.log(gradeMark);
    
    // this.subjectService.getTask(taskid).subscribe( task => {
      
    //   var toJson = JSON.stringify(task);
    //   var parsed = JSON.parse(toJson);
    //   // console.log(parsed.complete);
    //   if (parsed.complete == undefined)
    //   {
    //     this.subjectService.updateTask(taskid, Array(complete), Array(gradeMark));
    //   }
    //   else
    //   {
    //     var completeArr = parsed.complete;
    //     var gradeArr = parsed.grade;
    //     completeArr.push(complete);
    //     gradeArr.push(gradeMark);

    //     this.subjectService.updateTask(taskid, completeArr, gradeArr);

    //     var filtered = this.uploadedFiles;
    //     for (var j = 0; j<parsed.complete.length; j++)
    //     {
    //       filtered = filtered.filter(o => o.userid !== parsed.complete[j].user);
    //     }
    //     this.uploadedFiles = filtered;
    //   }

    // });
    
    // this.alertService.success('Oceniono', false);
  }

  downloadFile(id: string, index: number) {
    this.subjectService.getFile(id)
    .subscribe( file => {
      this.subjectService.downloadFile(id)
      .subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.DownloadProgress:
            this.uploadedFiles[index].progress = Math.round(event.loaded / event.total * 100);
            break;
          case HttpEventType.Response:
            this.alertService.success('Files downloaded successfully!', false);
            saveAs(event.body, file.file.originalname)
            break;
        }
      });
    });
    
  }
  downloadTeacherFile(id: string) {
    this.subjectService.getFile(id)
    .subscribe( file => {
      this.subjectService.downloadFile(id)
      .subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.DownloadProgress:
            this.teacherfiles.progress = Math.round(event.loaded / event.total * 100);
            break;
          case HttpEventType.Response:
            this.alertService.success('Files downloaded successfully!', false);
            saveAs(event.body, file.file.originalname)
            break;
        }
      });
    });
  }

  downloadFileFromClassroom(id: string, index: number) {
    this.subjectService.getFileFromClassroom(id, this.classroom)
    .subscribe( file => {
      var obj = JSON.stringify(file);
      var parsed = JSON.parse(obj);
      this.subjectService.downloadFileFromClassroom(id, this.classroom)
      .subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.DownloadProgress:
            this.tasks[index].progress = Math.round(event.loaded / event.total * 100);
            break;
          case HttpEventType.Response:
            this.alertService.success('Files downloaded successfully!', false);
            saveAs(event.body, parsed.file.originalname)
            break;
        }
      });
    });
    
  }

  deleteFile(index: number) {
    var result = confirm("Delete?");
    if (result == true)
    {
      if (this.files[index].progress < 100 && this.files[index].progress != 0) {
        this.alertService.error('Upload in progress!', false);
        return;
      }
      this.files.splice(index, 1);
    }
  }

  removeFile(id: string, index: number) {
    var result = confirm("Delete?");
    if (result == true)
    {
      this.uploadedFiles.splice(index, 1);
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

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
}
