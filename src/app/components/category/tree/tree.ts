import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { TreeNode } from './tree-node/tree-node';
import { NoData } from '../../../shared/components/ui/no-data/no-data';
import { ICategory } from '../../../shared/interface/category.interface';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.html',
  styleUrls: ['./tree.scss'],
  imports: [ReactiveFormsModule, TreeNode, NoData,  TranslateModule],
})
export class Tree {
  readonly type = input<string>('');
  readonly data = input<ICategory[]>([]);
  readonly recursionKey = input<string>('');
  readonly displayKey = input<string>('name');
  readonly categoryType = input<string | null>('product');

  public treeSearch = new FormControl('');
  public dataToShow: ICategory[] = [];

  constructor() {
    this.treeSearch.valueChanges.subscribe(data => {
      if (data) {
        this.dataToShow = [];
        this.data().forEach(item => {
          this.hasValue(item) && this.dataToShow.push(item);
        });
      } else {
        this.dataToShow = this.data();
      }
    });
  }

 ngOnChanges() {
    this.dataToShow = this.data();
  }


  hasValue(item: ICategory): boolean {
    const displayValue = String((item as any)[this.displayKey()] ?? '').toLowerCase();
    const searchValue = (this.treeSearch.value ?? '').toLowerCase();

    if (displayValue.includes(searchValue)) {
      return true;
    }

    const children = (item as any)[this.recursionKey()];
    if (!Array.isArray(children)) {
      return false;
    }

    return children.some((child: ICategory) => this.hasValue(child));
  }

}
