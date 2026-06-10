import { Component } from '@angular/core';


import { FormUser } from '../form-user/form-user';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.html',
  styleUrls: ['./create-user.scss'],
  imports: [ FormUser],
})
export class CreateUser {}
