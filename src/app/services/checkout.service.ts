import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environment/environment";

export interface PlaceOrderRequest {
  payment_method: 'CARD' | 'COD';
  address: {
    line1: string;
    line2?: string;
    city: string;
    postal_code: string;
    country: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private baseUrl = `${environment.apiServiceUrl}/checkout`;

  constructor(private http: HttpClient) {}

  placeOrder(orderData: PlaceOrderRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/order`, orderData);
  }
}

