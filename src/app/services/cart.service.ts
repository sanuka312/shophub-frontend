import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environment/environment";
import { Cart } from "../models/cart.model";
import { CartItem } from "../models/cart.model";




export interface AddToCartRequest{
  user_id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
}

@Injectable({providedIn:'root'})

export class CartService{

  private baseUrl=`${environment.apiServiceUrl}/cart`;

  constructor(private http:HttpClient){}

  //add items to cart
  addToCart(request:AddToCartRequest):Observable<any>{
    return this.http.post(`${this.baseUrl}/item`,request);
  }

  //TODO:get cart by user_id
  getCartByUserId(userId:number):Observable<Cart>{
    return this.http.get<Cart>(`${this.baseUrl}/${userId}`)
  }

  //TODO:remove item from cart
  removeItemFromCart(id:number):Observable<CartItem>{
    return this.http.delete<CartItem>(`${this.baseUrl}/item/{:id}`)
  }

  clearCart(userId:number):Observable<Cart>{
    return this.http.delete<Cart>(`${this.baseUrl}`)
  }


}










