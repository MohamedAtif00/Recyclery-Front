import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './core/services/authentcation.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorInterceptor } from './core/interceptor/error.interceptor';
import { HeaderComponent } from './layout/header/header.component';
import { NgbCarouselModule, NgbModalModule,NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {SlickCarouselModule } from 'ngx-slick-carousel';
import { FooterComponent } from './layout/footer/footer.component'
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    SlickCarouselModule,
    NgbModule,
    NgbModalModule,
    NgbCarouselModule,
    NgbDropdownModule 
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
