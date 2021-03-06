import { Component, OnInit } from '@angular/core';
import { User } from './user';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[];


  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.usersService.getUsers()
    .subscribe(users => this.users = users);
  }

  delete(user: User): void {
    var result = confirm("Delete?");
    if (result == true)
    {
      this.users = this.users.filter(u => u !== user);
      this.usersService.deleteUser(user).subscribe();
    }
  }

}
