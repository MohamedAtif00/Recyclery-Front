import { Component, ElementRef, HostListener, OnInit, TemplateRef, computed } from '@angular/core';
import { IAuthInfo } from '../../core/model/user.model';
import { AuthService } from '../../core/services/authentcation.service';
import { NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterRequest } from '../../core/model/request/register.model';
import { LoginRequest } from '../../core/model/request/login.model';
import { CartService } from '../../shared/service/cart.service';
import { Product } from '../../shared/model/product.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  
})
export class HeaderComponent implements OnInit{

  authUser!: IAuthInfo | null;
  registerForm!:FormGroup;
  loginForm!: FormGroup;
  passwordVisible: boolean = false;

  //totalOrders:number = computed();
  constructor(public authService: AuthService,
              private modalServ:NgbModal,
              private fb:FormBuilder,
              public cartServ:CartService,
              private elementRef: ElementRef) {}

  slides = [
    { name: 'Sports Equipment' },
    { name: 'Kids Toys' },
    { name: 'Plastic' },
    { name: 'Paper' },
    { name: 'Cooking Oil' },
    { name: 'Electronics' },
    { name: 'Metals' },
    { name: 'Home Appliances' },
    { name: 'Antiques' },
    { name: 'Spare Parts' }
  ];
  
  isOpen = false;

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const clickedInsideIcon = this.elementRef.nativeElement.querySelector('.img-fluid') === event.target ;
    const btn =  this.elementRef.nativeElement.querySelector('.bi') === event.target

    if (!this.isInsideBasket(event.target) && !clickedInsideIcon && !btn) {
      this.closeBasketDrawer();
    }
  }

  isInsideBasket(target: any): boolean {
    // Check if the target element or any of its parents is inside the basket drawer
    let element = target;
    while (element) {
      if (element.classList && element.classList.contains('basket-drawer')) {
        return true;
      }
      element = element.parentElement;
    }
    return false;
  }

  closeBasketDrawer() {
    this.isOpen = false;
  }

  ngOnInit(): void {
    //this.totalItemsInCart = this.cartServ.cart().products.length
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group(
      {
        FullName:['',Validators.required],
        Email:['',Validators.required],
        RecyclingPreferences:['',Validators.required],
        PhoneNumber:['',Validators.required],
        Password:['',Validators.required]
      }
    )



    this.authService.stateItem$.subscribe(data => {
      this.authUser = data;
      if (this.authUser) {
        console.log(this.authUser.displayName); // Assuming you want to log the displayName
      }
    });
  }

  
  increaseQuantity(product: Product) {
    this.cartServ.addProduct(product);
  }

  decreaseQuantity(productName: string) {
    this.cartServ.removeProduct(productName);
  }

  removeProduct(productName: string) {
    this.cartServ.removeProduct(productName);
  }

  onRegisterSubmit(): void {
    if (this.registerForm.valid) {
      let request:RegisterRequest = {displayName:this.fullName?.value,
                                     email:this.email?.value,
                                     recyclingPreferences:this.recyclingPreferences?.value,
                                     phoneNumber:this.phoneNumber?.value,
                                     password:this.password?.value}
      this.authService.register(request).subscribe(
        (response) => {
          console.log('Registration successful', response);
          // Handle successful registration, e.g., update UI, close modal, etc.
          this.modalServ.dismissAll();
        },
        (error) => {
          console.error('Registration failed', error);
          // Handle registration error, e.g., show error message
        }
      );
    } else {
      console.log('Form is not valid');
    }
  }



  


  RegisterOpen(content: TemplateRef<any>) {
		this.modalServ.open(content, { centered: true,windowClass:'custom-animation' });
	}
  open(content: TemplateRef<any>) {
    this.modalServ.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }



  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    const passwordField = document.getElementById('login-password') as HTMLInputElement;
    passwordField.type = this.passwordVisible ? 'text' : 'password';
  }


  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      let request:LoginRequest = this.loginForm.value
      this.authService.login(request).subscribe(
        (response) => {
          console.log('Login successful', response);
          // Handle successful registration, e.g., update UI, close modal, etc.
          this.modalServ.dismissAll();
        },
        (error) => {
          console.error('Login failed', error);
          // Handle registration error, e.g., show error message
        }
      );
    } else {
      console.log('Form is not valid');
    }
  }

  forgotPassword(): void {
    // Handle forgot password logic
  }

  removePlaceholder(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    selectElement.classList.remove('placeholder');
  }





  get fullName() {
    return this.registerForm.get('FullName');
  }

  get email() {
    return this.registerForm.get('Email');
  }

  get recyclingPreferences() {
    return this.registerForm.get('RecyclingPreferences');
  }

  get phoneNumber() {
    return this.registerForm.get('PhoneNumber');
  }

  get password() {
    return this.registerForm.get('Password');
  }


}
