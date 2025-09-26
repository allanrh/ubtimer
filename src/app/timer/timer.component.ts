import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { StorageService } from '../storage.service'
import { SeccPipe } from '../secc.pipe';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [
    CommonModule,
    SeccPipe,
    RouterLink,
  ],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss'
})
export class TimerComponent {

  timerId: number|null = null;
  timer: any;

  // init prep running paused done
  public state: string = 'init';

  public work: boolean = true; // else 'rest'

  public round: number = 1;
  public elapsed: number = 0;
  public prep: number = 0;

  private _interval: ReturnType<typeof setInterval>|null = null;
  public multiIndex: number = 0

  @Input({required: true})
  set id(timerId: number) {
    this.timerId = timerId;
    this.timer = this.service.getTimer(timerId);
    this._initialize();
  }

  constructor(
    private service: StorageService
  ) { }

  public getTypeClass() {
    return {
      'counter': this.timer.type != 'interval',
      'interval': this.timer.type == 'interval',
      'rest': !this.work || (this.timer.type == 'stopwatch-multi' && this.multiIndex % 2 == 1),
      'done': this.state == 'done',
    };
  }

  get init() { return this.state == 'init'; }
  get prepping() { return this.state == 'prepping'; }
  get running() { return this.state == 'running'; }
  get paused() { return this.state == 'paused'; }
  get done() { return this.state == 'done'; }

  get working() { return this.work; }

  private _initialize() {
    this.round = 1;
    this.elapsed = 0;
    this.prep = this.timer.prep;
    this.multiIndex = 0;
    this.state = 'init';
  }

  private _tick() {
    if (this.prepping) {
      this.prep -= 1;
      if (this.prep <= 0) {
        this.state = 'running';
        this.elapsed = 0;
      }
    }
    else if (this.running) {

      if (this.timer.type == 'stopwatch') {
        this.elapsed += 1;
        if (this.elapsed >= this.timer.time) {
          this.stop();
        }

      } else if (this.timer.type == 'stopwatch-multi') {
        this.elapsed += 1;
        let t = this.timer.times[this.multiIndex];
        if (this.elapsed >= t) {
          if (this.multiIndex == this.timer.times.length - 1) {
            this.stop();
          } else {
            this.multiIndex += 1;
            this.elapsed = 0;
          }
        }

      } else if (this.timer.type == 'interval') {
        this.elapsed += 1;
        if (this.working && this.elapsed == this.timer.work) {
          this.elapsed = 0;
          this.work = false;
        } else if (!this.working && this.elapsed == this.timer.rest) {
          this.round += 1;
          this.elapsed = 0;
          this.work = true;
        }
      }
    }

  }

  public start() {
    this._initialize();
    this.state = this.prep > 0 ? 'prepping' : 'running';
    this._startTimer();
  }

  public pause() {
    this.state = 'paused';
  }

  public continue() {
    this.state = 'continue';
  }

  public reset() {
    this._initialize();
    this.state = 'init';
  }

  public stop() {
    if (this.prepping) {
      this.reset();
    } else {
      this.state = 'done';
      this._stopTimer();
    }
  }

  private _startTimer() {
    this._stopTimer();
    this._interval = setInterval(() => this._tick(), 1000);
  }

  private _stopTimer() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }
}
