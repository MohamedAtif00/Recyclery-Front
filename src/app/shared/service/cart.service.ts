import { HttpClient } from "@angular/common/http";
import { Injectable, computed, signal } from "@angular/core";
import { Cart } from "../model/cart.model";
import { Product } from "../model/product.model";


@Injectable({
    providedIn:'root'
})
export class CartService
{
    private _productsSignal = signal<Product[]>([]);
  
    cart = computed(() => ({
        products: this._productsSignal()
    }));

    constructor(private _http: HttpClient) {}

    addProduct(product: Product) {
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


}