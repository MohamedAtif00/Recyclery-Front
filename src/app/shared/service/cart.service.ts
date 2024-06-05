import { HttpClient } from "@angular/common/http";
import { Injectable, computed, signal } from "@angular/core";
import { Cart } from "../model/cart.model";
import { Product } from "../model/product.model";
import { environment } from "../../../environment";
import { Basket } from "../model/basket.model";
import { Observable, switchMap, tap } from "rxjs";
import { Item } from "../model/item.model";
import { Order } from "../model/order.model";
import { Address } from "../model/address.model";
import { AuthService } from "../../core/services/authentcation.service";
import { DeliveryMethod } from "../model/delivery-method.model";


@Injectable({
    providedIn:'root'
})
export class CartService
{

    private CreateOrUpdate = `${environment.localhost}Basket`
    private getBusket = `${environment.localhost}Basket?basketId=1`
    private createOrder = `${environment.localhost}ClientOrders`
    private createCompanyOrder = `${environment.localhost}CompanyOrders`
    private getDeliveryMehtods = `${environment.localhost}CompanyOrders/DeliveryMethods`

    private _productsSignal = signal<Item[]>([]);
    deliveryMethods!:DeliveryMethod[];
  
    cart = computed(() => ({
        products: this._productsSignal()
    }));
    count = computed<number>(() => {
        return this._productsSignal().length;
    });
    Basket!:Basket;

    constructor(private _http: HttpClient,private authServ:AuthService) {
        _http.get<Basket>(this.getBusket).subscribe(data=>{
            this.Basket = data;
            this._productsSignal.set(data.items)
        })

        _http.get<DeliveryMethod[]>(this.getDeliveryMehtods).subscribe(data=>{
            this.deliveryMethods  = data
        })

    }

    addProduct(product: Item) {

        this._productsSignal.update(products => {
            const productIndex = products.findIndex(p => p.productName === product.productName);
            if (productIndex !== -1) {
            const updatedProducts = [...products];
            updatedProducts[productIndex] = {
                ...updatedProducts[productIndex],
                quantity: updatedProducts[productIndex].quantity + 1
            };
            return updatedProducts;
            } else {
            return [...products, { ...product, quantity: 1 }];
            }
        });
        this.Basket.items = this._productsSignal()
        this._http.post<Basket>(this.CreateOrUpdate,this.Basket).subscribe()
        console.log(this._productsSignal());
    
    }

    removeProduct(productName: string) {
        this._productsSignal.update(products => {
            const productIndex = products.findIndex(p => p.productName === productName);
            if (productIndex !== -1) {
            const updatedProducts = [...products];
            const currentQuantity = updatedProducts[productIndex].quantity;
            if (currentQuantity > 1) {
                updatedProducts[productIndex] = {
                ...updatedProducts[productIndex],
                quantity: currentQuantity - 1
                };
                return updatedProducts;
            } else {
                return updatedProducts.filter(p => p.productName !== productName);
            }
            }
            return products;
        });
        this.Basket.items = this._productsSignal()
        this._http.post<Basket>(this.CreateOrUpdate,this.Basket).subscribe()
    }

    removeWholeProduct(productName: string) {
        this._productsSignal.update(products => products.filter(p => p.productName !== productName));
      }
    

    getProducts() {
        return this._productsSignal();
    }



    getCart() {

        return this.cart();
    }

    getTotalQuantity() {
        return this.cart().products.reduce((total, product) => total + product.quantity, 0);
    }


   getTotalPrice() {
    return this.cart().products.reduce((total, product) => total + (product.price * product.quantity), 0);
    }

    CreateOrder(address: Address): Observable<Order> {
        let order: Order = {
          basketId: '1',
          deliveryMethodId: 1,
          shipAddress: address
        };
    
        return this.authServ.stateItem$.pipe(
          switchMap(data => {
            if (data?.role === 'user') {
              return this._http.post<Order>(this.createOrder, order).pipe(
                tap(() => {
                  this._productsSignal.update(() => []);
                })
              );
            } else {
              return this._http.post<Order>(this.createCompanyOrder, order).pipe(
                tap(() => {
                  this._productsSignal.update(() => []);
                })
              );
            }
          })
        );
      }

}