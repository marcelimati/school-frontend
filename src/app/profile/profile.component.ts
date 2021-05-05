import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users/users.service';
import { UserProfile } from './userprofile'; 

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  returnUrl: string;
  user: UserProfile;

  constructor(
    private usersService: UsersService
    //private alertService: AlertService
    ) { }

  ngOnInit() {
    this.getProfile();
  }

  getProfile() {
    this.usersService.profile().subscribe(user => this.user = user);
  }
}
