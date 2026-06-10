import { Component } from '@angular/core';

//import { PageWrapper } from '../../../shared/components/page-wrapper/page-wrapper';
import { FormRole } from '../form-role/form-role';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.html',
  styleUrls: ['./create-role.scss'],
  imports: [ FormRole],
})
export class CreateRole {}
