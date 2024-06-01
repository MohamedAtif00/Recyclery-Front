import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { UserRoutingModule } from './user-routing/user-routing.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { BookComponent } from './book/book.component';
import { NgbCarouselModule, NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorInterceptor } from '../../core/interceptor/error.interceptor';
import { AuthService } from '../../core/services/authentcation.service';
import { CompanyRegisterComponent } from './company-register/company-register.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    HomeComponent,
    BookComponent,
    CompanyRegisterComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SlickCarouselModule,
    NgbCarouselModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbDropdownModule
  ],
  providers: [
    AuthService
  ],
})
export class UserModule { }
