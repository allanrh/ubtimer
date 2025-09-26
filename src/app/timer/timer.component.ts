import { Component, Input, Inject, PLATFORM_ID } from '@angular/core'
import { RouterLink } from '@angular/router'
import { CommonModule, isPlatformBrowser } from '@angular/common'

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
  
  // Heat tracking
  public currentHeat: number = 1
  public totalHeats: number = 1
  public nextHeatPrep: number = 0
  private isInitialPrep: boolean = true

  private _interval: ReturnType<typeof setInterval>|null = null
  private _clockInterval: ReturnType<typeof setInterval>|null = null
  public multiIndex: number = 0
  private startTime: number = 0
  private pausedTime: number = 0
  
  // Clock display
  public currentTime: string = ''

  @Input({required: true})
  set id(timerId: number) {
    this.timerId = timerId
    this.timer = this.service.getTimer(timerId)
    this._initialize()
  }

  constructor(
    private service: StorageService,
    @Inject(PLATFORM_ID) private platformId: Object
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
  
  get hasMultipleHeats() { return this.totalHeats > 1 }
  get showHeatHeader() { return this.hasMultipleHeats && (this.prepping || this.running || this.paused || this.done) }
  get showNextHeatPrep() { return this.hasMultipleHeats && this.nextHeatPrep > 0 }

  private _initialize() {
    this.round = 1
    this.elapsed = 0
    this.prep = this.timer.prep
    this.multiIndex = 0
    this.state = 'init'
    
    // Initialize heat tracking
    this.currentHeat = 1
    this.totalHeats = this.timer.heats || 1
    this.nextHeatPrep = 0
    this.isInitialPrep = true
    
    // Start clock if enabled (only in browser)
    if (this.timer.clock && isPlatformBrowser(this.platformId)) {
      this._startClock()
    }
  }

  private _tick() {
    const now = Date.now()
    const realElapsed = Math.floor((now - this.startTime) / 1000)
    
    if (this.prepping) {
      // Handle initial prep or next heat prep
      if (this.isInitialPrep) {
        this.prep = Math.max(0, this.timer.prep - realElapsed)
        if (this.prep <= 0) {
          this.state = 'running'
          this.elapsed = 0
          this.startTime = now // Reset start time for running phase
          this.isInitialPrep = false
        }
      } else {
        // Next heat prep countdown
        this.nextHeatPrep = Math.max(0, this.timer.prep - realElapsed)
        if (this.nextHeatPrep <= 0) {
          this.state = 'running'
          this.elapsed = 0
          this.startTime = now // Reset start time for running phase
        }
      }
    }
    else if (this.running) {
      // Only update if the second has actually changed
      if (realElapsed !== this.elapsed) {
        this.elapsed = realElapsed
        
        if (this.timer.type == 'stopwatch') {
          // Check if we should start next heat prep countdown
          if (this.currentHeat < this.totalHeats && this.timer.prep > 0) {
            const timeRemaining = this.timer.time - this.elapsed
            if (timeRemaining <= this.timer.prep && timeRemaining > 0) {
              // Start showing next heat prep countdown
              this.nextHeatPrep = timeRemaining
            }
          }
          
          if (this.elapsed >= this.timer.time) {
            // Check if we have more heats to run
            if (this.currentHeat < this.totalHeats) {
              this._startNextHeat()
            } else {
              this.stop()
            }
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
          // Check if we should start next heat prep countdown during rest period
          if (!this.working && this.currentHeat < this.totalHeats && this.timer.prep > 0) {
            const restTimeRemaining = this.timer.rest - this.elapsed
            if (restTimeRemaining <= this.timer.prep && restTimeRemaining > 0) {
              // Start showing next heat prep countdown
              this.nextHeatPrep = restTimeRemaining
            }
          }
          
          if (this.working && this.elapsed == this.timer.work) {
            this.elapsed = 0
            this.work = false
            this.startTime = now // Reset start time for rest phase
          } else if (!this.working && this.elapsed == this.timer.rest) {
            // Check if we have more heats to run
            if (this.currentHeat < this.totalHeats) {
              this._startNextHeat()
            } else if (this.totalHeats > 1) {
              // Only stop if we have a specific number of heats and completed them all
              this.stop()
            } else {
              // For interval timers without heats parameter, cycle endlessly
              this.elapsed = 0
              this.work = true
              this.startTime = now // Reset start time for next work phase
            }
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

  private _startNextHeat() {
    this.currentHeat += 1
    this.elapsed = 0
    this.startTime = Date.now()
    this.nextHeatPrep = 0 // Reset next heat prep
    
    if (this.timer.type == 'interval') {
      // For interval timers, reset work/rest cycle
      this.work = true
      this.round = 1
    }
    
    this.state = 'running' // Go directly to running since prep was already shown
  }

  private _startClock() {
    if (!isPlatformBrowser(this.platformId)) return
    
    this._stopClock()
    this._updateClock() // Initial update
    this._clockInterval = setInterval(() => this._updateClock(), 100) // Update every 100ms for tenths of seconds
  }

  private _stopClock() {
    if (this._clockInterval) {
      clearInterval(this._clockInterval)
      this._clockInterval = null
    }
  }

  private _updateClock() {
    if (!isPlatformBrowser(this.platformId)) return
    
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const seconds = now.getSeconds().toString().padStart(2, '0')
    const tenths = Math.floor(now.getMilliseconds() / 100).toString()
    
    this.currentTime = `${hours}:${minutes}:${seconds}.${tenths}`
  }

  public getClockChars(): string[] {
    // Provide a fallback for SSR
    if (!isPlatformBrowser(this.platformId)) {
      return '00:00:00.0'.split('')
    }
    return this.currentTime.split('')
  }

  public getPrepChars(): string[] {
    return this.prep.toString().split('')
  }

  public getElapsedChars(): string[] {
    // Format elapsed time as MM:SS using the same logic as secc pipe
    const formatted = new Date(this.elapsed * 1000).toISOString().substring(14, 19)
    return formatted.split('')
  }
}
