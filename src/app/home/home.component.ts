import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { StorageService } from '../storage.service'
import { SeccPipe } from '../secc.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SeccPipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  public timers: Array<any>;

  constructor(
    private service: StorageService
  ) {
    this.timers = service.getTimers();
  }

  // public timers(): any[] {
  //   return this.service.getTimers();
  // }

  getBaseFilename(filepath: string): string {
    if (!filepath) return '';
    return filepath.split('/').pop() || filepath;
  }

}
