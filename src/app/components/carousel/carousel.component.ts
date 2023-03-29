import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-carousel',
  template: `
    <app-carousel-indicator
      (changeSlide$)="currentIndicatorIndex$.next($event)"
    ></app-carousel-indicator>
    <div class="carousel" #carousel>
      <div class="carousel-inner">
        <div
          class="carousel-item"
          *ngFor="let banner of banners; index as idx"
          [ngClass]="idx % 2 === 0 ? 'light' : 'dark'"
        >
          {{ banner.id }}
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements AfterViewInit {
  @ViewChild('carousel') carousel!: ElementRef<HTMLDivElement>;
  banners = [
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
    {
      id: 4,
    },
  ];

  currentIndicatorIndex$ = new Subject<{ from: number; to: number }>();

  onScroll$ = new Subject<number>();

  scrollTo(scrollIndex: number, currentIdx: number) {
    this.onScroll$.next(scrollIndex);
    const carousel = this.carousel.nativeElement;

    const isRight = scrollIndex > currentIdx;

    if (isRight) {
      carousel.scrollLeft += carousel.clientWidth * (scrollIndex - currentIdx);
    } else {
      carousel.scrollLeft -= Math.abs(
        carousel.clientWidth * (currentIdx - scrollIndex)
      );
    }
  }

  ngAfterViewInit(): void {
    this.currentIndicatorIndex$.pipe().subscribe(({ to, from }) => {
      console.log('scrollTo', to, from);
      this.scrollTo(to, from);
    });
  }
}
