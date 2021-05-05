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
// /** GET User by id. Return `undefined` when id not found */
// getHeroNo404<Data>(id: number): Observable<Hero> {
//   const url = `${this.heroesUrl}/?id=${id}`;
//   return this.http.get<Hero[]>(url)
//     .pipe(
//       map(heroes => heroes[0]), // returns a {0|1} element array
//       tap(h => {
//         const outcome = h ? `fetched` : `did not find`;
//         this.log(`${outcome} hero id=${id}`);
//       }),
//       catchError(this.handleError<Hero>(`getHero id=${id}`))
//     );
// }

// /** GET hero by id. Will 404 if id not found */
// getHero(id: number): Observable<Hero> {
//   const url = `${this.heroesUrl}/${id}`;
//   return this.http.get<Hero>(url).pipe(
//     tap(_ => this.log(`fetched hero id=${id}`)),
//     catchError(this.handleError<Hero>(`getHero id=${id}`))
//   );
// }

// /* GET heroes whose name contains search term */
// searchHeroes(term: string): Observable<Hero[]> {
//   if (!term.trim()) {
//     // if not search term, return empty hero array.
//     return of([]);
//   }
//   return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
//     tap(x => x.length ?
//        this.log(`found heroes matching "${term}"`) :
//        this.log(`no heroes matching "${term}"`)),
//     catchError(this.handleError<Hero[]>('searchHeroes', []))
//   );
// }

//////// Save methods //////////
//////// Admin only //////////

/** POST: add a new user to the server */
// register(user: User): Observable<User> {
//   return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
//     tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
//     catchError(this.handleError<Hero>('addHero'))
//   );
// }

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
