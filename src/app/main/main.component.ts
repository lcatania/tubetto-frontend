import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IconsModule } from '../icons/icons.module';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterOutlet, IconsModule, RouterLink,RouterLinkActive],
  templateUrl: './main.component.html',
})
export class MainComponent {

  private router: Router;

  constructor() {
    this.router = inject(Router)
  }


  home() {
    this.router.navigate(['pipeline'])
  }
}
