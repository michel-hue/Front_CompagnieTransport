import {
  Directive,
  inject,
  input,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { UserService } from '../../tools/user.service';

@Directive({
  selector: '[hasPermission]',
  standalone: true,
})
export class HasPermissionDirective {
  private templateRef = inject<TemplateRef<string>>(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);
  private userService = inject(UserService);

  readonly permission = input<string | string[]>(undefined, { alias: 'hasPermission' });

  private isViewCreated = false;

  ngOnInit() {
    this.checkPermissions();
    
    // S'abonner aux changements d'utilisateur pour mettre à jour les permissions en temps réel
    this.userService.currentUser$.subscribe(() => {
      this.checkPermissions();
    });
  }

  private checkPermissions() {
    // Permissions désactivées : toujours afficher les éléments
      this.showElement();
      return;
  }

  private showElement() {
    if (!this.isViewCreated) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
      this.isViewCreated = true;
    }
  }

  private hideElement() {
    if (this.isViewCreated) {
      this.viewContainerRef.clear();
      this.isViewCreated = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['permission'] && !changes['permission'].firstChange) {
      this.checkPermissions();
    }
  }
}
