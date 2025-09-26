import { Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { CommonModule } from '@angular/common'

import { StorageService } from '../storage.service'
import { SeccPipe } from '../secc.pipe'

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

  timerId: number|null = null
  timer: any

  // init prep running paused done
  public state: string = 'init'

  public work: boolean = true // else 'rest'

  public round: number = 1
  public elapsed: number = 0
  public prep: number = 0

  private _interval: ReturnType<typeof setInterval>|null = null
  public multiIndex: number = 0
  private startTime: number = 0
  private pausedTime: number = 0

  @Input({required: true})
  set id(timerId: number) {
    this.timerId = timerId
    this.timer = this.service.getTimer(timerId)
    this._initialize()
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
    }
  }

  get init() { return this.state == 'init' }
  get prepping() { return this.state == 'prepping' }
  get running() { return this.state == 'running' }
  get paused() { return this.state == 'paused' }
  get done() { return this.state == 'done' }

  get working() { return this.work }

  private _initialize() {
    this.round = 1
    this.elapsed = 0
    this.prep = this.timer.prep
    this.multiIndex = 0
    this.state = 'init'
  }

  private _tick() {
    const now = Date.now()
    const realElapsed = Math.floor((now - this.startTime) / 1000)
    
    if (this.prepping) {
      this.prep = Math.max(0, this.timer.prep - realElapsed)
      if (this.prep <= 0) {
        this.state = 'running'
        this.elapsed = 0
        this.startTime = now // Reset start time for running phase
      }
    }
    else if (this.running) {
      // Only update if the second has actually changed
      if (realElapsed !== this.elapsed) {
        this.elapsed = realElapsed
        
        if (this.timer.type == 'stopwatch') {
          if (this.elapsed >= this.timer.time) {
            this.stop()
          }

        } else if (this.timer.type == 'stopwatch-multi') {
          let t = this.timer.times[this.multiIndex]
          if (this.elapsed >= t) {
            if (this.multiIndex == this.timer.times.length - 1) {
              this.stop()
            } else {
              this.multiIndex += 1
              this.elapsed = 0
              this.startTime = now // Reset start time for next phase
            }
          }

        } else if (this.timer.type == 'interval') {
          if (this.working && this.elapsed == this.timer.work) {
            this.elapsed = 0
            this.work = false
            this.startTime = now // Reset start time for rest phase
          } else if (!this.working && this.elapsed == this.timer.rest) {
            this.round += 1
            this.elapsed = 0
            this.work = true
            this.startTime = now // Reset start time for work phase
          }
        }
      }
    }
  }

  public start() {
    this._initialize()
    this.state = this.prep > 0 ? 'prepping' : 'running'
    this._startTimer()
  }

  public pause() {
    this.state = 'paused'
    this.pausedTime = Date.now()
  }

  public continue() {
    this.state = 'running'
    // Adjust startTime to account for pause duration
    const pauseDuration = Date.now() - this.pausedTime
    this.startTime += pauseDuration
  }

  public reset() {
    this._initialize()
    this.state = 'init'
  }

  public stop() {
    if (this.prepping) {
      this.reset()
    } else {
      this.state = 'done'
      this._stopTimer()
    }
  }

  private _startTimer() {
    this._stopTimer()
    this.startTime = Date.now() - this.elapsed * 1000 // Account for current elapsed
    this._interval = setInterval(() => this._tick(), 50) // 50ms tick for accurate second transitions
  }

  private _stopTimer() {
    if (this._interval) {
      clearInterval(this._interval)
      this._interval = null
    }
  }
}
