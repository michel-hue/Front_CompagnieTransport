import { Component, input } from '@angular/core';

//import { PageWrapper } from '../../../shared/components/page-wrapper/page-wrapper';
import { FormTag } from '../form-tag/form-tag';

@Component({
  selector: 'app-create-tag',
  templateUrl: './create-tag.html',
  styleUrls: ['./create-tag.scss'],
  imports: [ FormTag],
})
export class CreateTag {
  readonly tagType = input<string | null>('product');
}
