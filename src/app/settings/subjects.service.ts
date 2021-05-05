import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Subject } from './subject';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {
  
  private subjectUrl = `${environment.API}/subjects/create`;
  private getSubjectsUrl = `${environment.API}/subjects`;

  constructor(
    private http: HttpClient) { }

    create(subject: Subject) {
      return this.http.post<Subject>(this.subjectUrl, subject);
    }
    getSubjects() {
      return this.http.get<Subject[]>(this.getSubjectsUrl);
    }
    getSubject(subject: Subject | string) {
      const id = typeof subject === 'string' ? subject : subject._id;
      const url = `${this.getSubjectsUrl}/${id}`;

      return this.http.get<Subject>(url);
    }
    
    deleteSubject(subject: Subject | string) {
      const id = typeof subject === 'string' ? subject : subject._id;
      const url = `${this.getSubjectsUrl}/${id}`;

      return this.http.delete<Subject>(url);
    }
}