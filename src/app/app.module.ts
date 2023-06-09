import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CarouselIndicatorComponent } from './components/carousel/carousel-indicator/carousel-indicator.component';
import { CarouselComponent } from './components/carousel/carousel.component';

@NgModule({
  declarations: [AppComponent, CarouselIndicatorComponent, CarouselComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
