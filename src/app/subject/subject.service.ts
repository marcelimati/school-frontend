import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';

import { Subject } from '../settings/subject';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  private insertUrl = `${environment.API}/files/insert`;
  private getUrl = `${environment.API}/files`;
  private subjectUrl = `${environment.API}/subjects`;
  private uploadUrl = `${environment.API}/files/upload`;
  private dateUrl = `${environment.API}/files/date`;
  private taskUrl = `${environment.API}/tasks`;

  constructor(private http: HttpClient) { }

  getSubject(subjectId) {
    var url = this.subjectUrl + `/${subjectId}`;
    return this.http.get<Subject>(url);
  }

  upload(formData: FormData)
  {
    return this.http.post(this.uploadUrl, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.errorMgmt)
    );
  }

  insertData(file, subject, userid, date, classroom, task)
  {
    var object = {file, subject, userid, date, classroom, task };
    return this.http.post(this.insertUrl, object);
  }

  insertTask(name, teacher, subject, classroom, file)
  {
    var object = {name, teacher, subject, classroom, file};
    var url = this.taskUrl + `/create`;
    return this.http.post(url, object);
  }

  getTask(taskId)
  {
    var url = this.taskUrl + `/${taskId}`;
    return this.http.get(url);
  }

  getAllTasksFromClassroom(classroom)
  {
    var url = this.taskUrl + `/classroom/${classroom}`;
    return this.http.get(url);
  }

  downloadFile(id): any {
    var body = {fileid: id};

    const url = `${this.getUrl}/download`;
    return this.http.post(url, body, {
      reportProgress: true,
      observe: 'events',
      responseType : 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    }).pipe(
      catchError(this.errorMgmt)
    );
  }

  downloadFileFromClassroom(id, classroom): any {
    var body = {fileid: id, classroom: classroom};

    const url = `${this.getUrl}/classroom/download`;
    return this.http.post(url, body, {
      reportProgress: true,
      observe: 'events',
      responseType : 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    }).pipe(
      catchError(this.errorMgmt)
    );
  }

  updateTask(task, complete, grade){
    const url = `${this.taskUrl}/${task}`;
    const body = 
    {
      complete: complete,
      grade: grade,
    };
    return this.http.patch(url, body).subscribe();;
  }

  getFile(id): any {
    var url = this.getUrl + `/${id}`;
    return this.http.get(url);
  }
  
  getFileFromClassroom(id, classroom) {
    var url = this.getUrl + `/classroom`;
    var body = {fileid: id, classroom: classroom};
    return this.http.post(url, body);
  }

  getFileByName(filename) {
    var url = this.getUrl + `/teacher/by-name/${filename}`;
    return this.http.get(url);
  }

  getByDate(year, month, day)
  {
    var body = { year: year, month: month, day: day }
    const url = `${this.dateUrl}`;
    return this.http.post(url, body);
  }

  getByDateAll(year, month, day)
  {
    var body = { year: year, month: month, day: day }
    const url = `${this.dateUrl}/all`;
    return this.http.post(url, body);
  }

  getData(subjectId, userId)
  {
    var url = this.getUrl + `/${subjectId}/${userId}`;
    return this.http.get(url);
  }

  getDataByTask(subjectId, userId, taskId)
  {
    var url = this.getUrl + `/task/${taskId}/${subjectId}/${userId}/`;
    return this.http.get(url);
  }

  getDataByClassroomSubject(subjectId, classroomId)
  {
    var url = this.getUrl + `/classroom/${subjectId}/${classroomId}`;
    return this.http.get(url);
  }

  getDataByClassroom(classroomId, teacher)
  {
    var url = this.getUrl + `/classrooms/classroom/${classroomId}/${teacher}`;
    return this.http.get(url);
  }

  removeData(id: string){
    const url = `${this.getUrl}/${id}`;
    return this.http.delete(url);
  }

  adminRemoveData(id: string){
    const url = `${this.getUrl}/admin/${id}`;
    return this.http.delete(url);
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
