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

      // UNBROKEN 2024

      // { id: 3, name: 'KORKKARIT KATTOON', type: 'stopwatch',    sponsor: 'BOXATHLETICS', logo: 'images/ba-logo.png', prep: 0, time: 720 },
      // { id: 4, name: 'JATKOTIKKAAT',      type: 'interval',     sponsor: 'ROCK TAPE',    logo: 'images/rt-logo.png', prep: 0, work: 30, rest: 15 },
      // { id: 5, name: 'LIIAN HAPOKASTA',   type: 'stopwatch',    sponsor: 'GARMIN',       logo: 'images/g-logo.png', prep: 0, time: 360 },
      // { id: 6, name: 'TOIS PUOL YOKE', type: 'stopwatch-multi', sponsor: 'VELITES',      logo: 'images/v-logo.png', prep: 0, times: [ 180, 120, 420 ] },
      // { id: 7, name: 'TEST', type: 'stopwatch-multi', sponsor: 'VELITES',      logo: 'images/v-logo.png', prep: 0, times: [ 5, 5, 7 ] },

      // UNBROKEN 2025

      { 
        id: '2025-2', 
        name: 'SEKAISIN TIINASTA', 
        type: 'stopwatch', prep: 10, time: 360,
        logo: 'images/optishake-logo-w2.jpg', 
        weights: 'ub2025-e2-weights.png',
      },
      { 
        id: '2025-3', 
        name: 'PIRU MERRASSA', 
        // type: 'stopwatch', prep: 5, time: 15,
        type: 'interval', prep: 5, work: 15, rest: 10,
        heats: 14,
        logo: 'images/league-logo.jpg', 
        weights: null,
        clock: true, // HH:MM:SS.s
      },
      { 
        id: '2025-4',
        name: 'SIIVOUSPÄIVÄ', 
        type: 'interval', prep: 5, work: 30, rest: 15,
        logo: 'images/nocco-logo.jpg', 
        weights: null, // TODO
      },
      { 
        id: '2025-5m', 
        name: 'LEGENDOJEN LOPPUNÄYTÖS', 
        type: 'stopwatch', prep: 10, time: 600,
        logo: 'images/teho-logo.jpg', 
      },
      { 
        id: '2025-5rx', 
        name: 'ARRIN SYNTYMÄPÄIVÄ', 
        type: 'stopwatch', prep: 10, time: 300,
        logo: 'images/wise-gym-logo.jpg', 
      },
      { 
        id: '2025-6', 
        name: 'PYSSYHIIHTO', 
        type: 'stopwatch', prep: 10, time: 960,
        logo: 'images/erg-sport-logo.jpg', 
      },
      { 
        id: '2025-7', 
        name: 'MINÄ PYSTYN MINÄ HALUAN', 
        type: 'stopwatch', prep: 10, time: 360,
        logo: 'images/icaniwill-logo.jpg', 
      },
    ];
  }

  getTimer(timerId: number): any {
    return this.getTimers().find(t => t.id == timerId)
  }
}
