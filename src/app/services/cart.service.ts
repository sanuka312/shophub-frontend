import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environment/environment";
import { Cart } from "../models/cart.model";
import { CartItem } from "../models/cart.model";




export interface AddToCartRequest{
  product_id: number;
  quantity: number;
}

@Injectable({providedIn:'root'})

export class CartService{

  private baseUrl=`${environment.apiServiceUrl}/cart`;

  constructor(private http:HttpClient){}

  //add items to cart
  // Backend only expects product_id and quantity
  // user_id is extracted from JWT token, cart_id is handled automatically
  addToCart(request:AddToCartRequest):Observable<any>{
    return this.http.post(`${this.baseUrl}/item`, request);
  }

  // Get user cart - backend extracts user_id from JWT token automatically
  getUserCart():Observable<Cart>{
    return this.http.get<Cart>(`${this.baseUrl}/`);
  }

  // Remove item from cart by itemId
  removeItemFromCart(itemId:number):Observable<any>{
    return this.http.delete(`${this.baseUrl}/item/${itemId}`);
  }

  // Update cart item quantity
  updateCartItemQuantity(itemId:number, quantity:number):Observable<any>{
    return this.http.patch(`${this.baseUrl}/item/${itemId}`, { quantity });
  }

  // Clear entire cart - backend extracts user_id from JWT token
  clearCart():Observable<any>{
    return this.http.delete(`${this.baseUrl}/items`);
  }
}










