import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  /*
LAJI 3:
”Korkkarit kattoon”
Powered by: BOXATHLETICS
Kello: ylöspäin juokseva kello 12 minuuttiin asti

LAJI 4:
”Jatkotikkaat”
Powered by: ROCK TAPE
Kello: Intervalliajastin 30sec ON 15sec OFF ja 50 kertaa ainakin toistumaan, niin pitäisi riittää

LAJI 5: ”Liian hapokasta”
Powered by: GARMIN
Kello ylöspäin juokseva kello 6 minuuttiin asti

FINAALI: ”Tois puol Yoke”
Powered by: VELITES
Kello:Tää on vähän hankalampi. Tarvis sellaisen joka on päällä ylöspäin juoksevasti 3 min – 2 min – 7 min
   */

  getTimers(): any[] {
    return [
      { id: 3, name: 'KORKKARIT KATTOON', type: 'stopwatch',    sponsor: 'BOXATHLETICS', logo: 'xxx', prep: 10, time: 720 },
      { id: 4, name: 'JATKOTIKKAAT',      type: 'interval',     sponsor: 'ROCK TAPE',    logo: 'xxx', prep: 10, work: 30, rest: 15 },
      { id: 5, name: 'LIIAN HAPOKASTA',   type: 'stopwatch',    sponsor: 'GARMIN',       logo: 'xxx', prep: 10, time: 360 },
      { id: 6, name: 'TOIS PUOL YOKE', type: 'stopwatch-multi', sponsor: 'VELITES',      logo: 'xxx', prep: 10, times: [ 180, 120, 420 ] },
    ];
  }

  getTimer(timerId: number): any {
    return this.getTimers().find(t => t.id == timerId)
  }
}
