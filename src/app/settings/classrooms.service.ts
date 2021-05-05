import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Classroom } from './classroom';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClassroomsService {
  
  private classroomUrl = `${environment.API}/classrooms/create`;
  private getClassroomUrl = `${environment.API}/classrooms`;

  constructor(
    private http: HttpClient) { }

    create(classroom: Classroom) {
      return this.http.post<Classroom>(this.classroomUrl, classroom);
    }
    getClassrooms() {
      return this.http.get<Classroom[]>(this.getClassroomUrl);
    }
    getClassroom(subject: Classroom | string) {
      const id = typeof subject === 'string' ? subject : subject._id;
      const url = `${this.getClassroomUrl}/${id}`;

      return this.http.get<Classroom>(url);
    }
    
    deleteClassroom(subject: Classroom | string) {
      const id = typeof subject === 'string' ? subject : subject._id;
      const url = `${this.getClassroomUrl}/${id}`;

      return this.http.delete<Classroom>(url);
    }
}