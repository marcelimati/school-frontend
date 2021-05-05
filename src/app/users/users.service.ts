import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { User } from './user';

import { UserProfile } from '../profile/userprofile';


import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private usersUrl = `${environment.API}/users`;
  private userUrl = `${environment.API}/users/user`;
  private registerUrl = `${environment.API}/users/register`;
  private profileUrl = `${environment.API}/auth/profile`;
  
  constructor(
    private http: HttpClient) { }

  /** GET users from the server */
  getUsers() {
    return this.http.get<User[]>(this.usersUrl);
  }

  register(user: User) {
  return this.http.post<User>(this.registerUrl, user)
  }

  profile(){
    return this.http.get<UserProfile>(this.profileUrl);
  }

  getUser(id: String) {
    const url = `${this.usersUrl}/${id}`;
    return this.http.get<User>(url);
  }
  getUserTeacher(id: String) {
    const url = `${this.usersUrl}/teacher/${id}`;
    return this.http.get<User>(url);
  }

  getOwnUser(id: String) {
    const url = `${this.userUrl}/${id}`;
    return this.http.get<User>(url);
  }

/** DELETE: delete the user from the server */
deleteUser(user: User | string) {
  const id = typeof user === 'string' ? user : user._id;
  const url = `${this.usersUrl}/${id}`;

  return this.http.delete<User>(url);
}

/** PATCH: update the user on the server */
  updateUser(user: User, subjectArr, role, classroom){
    const id = typeof user === 'string' ? user : user._id;
    const url = `${this.usersUrl}/${id}`;
    const body = 
    {
      subjects: subjectArr,
      role: role,
      classroom: classroom,
    };

    return this.http.patch(url, body).subscribe();;
  }
  
}
