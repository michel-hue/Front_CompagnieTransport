import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-seller-logo',
  template: `
    <div class="seller-logo-wrapper" [class]="size" [class.with-bg]="withBackground">
      <img 
        src="assets/images/logo_principal.png" 
        [alt]="altText" 
        class="seller-logo"
        [class.clickable]="clickable"
        (click)="onClick()"
      />
    </div>
  `,
  styleUrls: ['./seller-logo.component.scss']
})
export class SELLERLogoComponent {
  @Input() size: 'small' | 'medium' | 'large' | 'xlarge' = 'medium';
  @Input() altText: string = 'Saller App Admin';
  @Input() clickable: boolean = false;
  @Input() withBackground: boolean = false;

  onClick(): void {
    if (this.clickable) {
      // Émettre un événement ou rediriger
      console.log('Logo cliqué');
    }
  }
}

