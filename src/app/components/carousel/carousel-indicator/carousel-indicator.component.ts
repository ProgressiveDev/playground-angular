import { Component, Input, OnInit, Output } from '@angular/core';
import {
  debounceTime,
  interval,
  map,
  of,
  scan,
  Subject,
  takeWhile,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-carousel-indicator',
  template: `
    <div class="indicators">
      <div
        class="indicator"
        *ngFor="let indicator of indicators; index as idx"
        (click)="!indicator.active && onIndicatorClick$.next(idx)"
      >
        <div
          *ngIf="indicator.active"
          class="progress"
          [ngStyle]="{
            width: (indicator.progress$ | async) + '%',
            transition: 'all ' + this.slideDuration / 100 + 'ms'
          }"
        ></div>
      </div>
    </div>
    <br />
    <button (click)="pause = true">Pause</button>
    <button (click)="pause = false">Resume</button>
  `,
  styleUrls: ['./carousel-indicator.component.scss'],
})
export class CarouselIndicatorComponent implements OnInit {
  @Input() onScrollChange$ = of(0);
  @Output() changeSlide$ = new Subject<{ from: number; to: number }>();
  @Input() indicatorsCount = 4;
  @Input() pause = false;
  @Input() slideDuration = 4000;

  onIndicatorClick$ = new Subject<number>();

  private _indicators = Array(this.indicatorsCount)
    .fill(true)
    .map(() => {
      return {
        active: false,
        progress$: this.getProgress$(),
      };
    });

  indicators = this._indicators;

  getProgress$() {
    return interval(this.slideDuration / 100).pipe(
      scan((progress: number) => {
        if (this.pause) {
          return progress;
        }
        return (progress + 1) * 1;
      }, 4), // increase by 1% every 30ms
      tap((progress) => {
        if (progress === 100) {
          const from = this.indicators.findIndex(({ active }) => active);
          this.setNextIndicator();
          const to = this.indicators.findIndex(({ active }) => active);
          this.changeSlide$.next({ from, to });
        }
      }),
      takeWhile((value: number) => value <= 100) // stop emitting after reaching 100%,
    );
  }

  setActiveIndicator(index: number) {
    this.indicators = this.indicators.map((indicator, i) => ({
      ...indicator,
      active: i === index % this.indicators.length,
    }));
  }

  setNextIndicator() {
    const nextIndex =
      (this.indicators.findIndex(({ active }) => active) + 1) %
      this.indicatorsCount;

    this.indicators = this.indicators.map((indicator, i) => ({
      ...indicator,
      active: i === nextIndex,
    }));
  }

  ngOnInit(): void {
    this.indicators = this.indicators.map((indicator, i) => ({
      ...indicator,
      active: i === 0,
    }));

    this.onScrollChange$.pipe().subscribe((idx) => {
      this.setActiveIndicator(idx);
    });

    this.changeSlide$
      .pipe(debounceTime(this.slideDuration / 100))
      .subscribe((indx) => {});

    this.onIndicatorClick$
      .pipe(
        map((idx) => ({
          from: this.indicators.findIndex(({ active }) => active),
          to: idx,
        }))
      )
      .subscribe((changeSlide) => {
        this.changeSlide$.next(changeSlide);
        this.setActiveIndicator(changeSlide.to);
      });
  }
}
