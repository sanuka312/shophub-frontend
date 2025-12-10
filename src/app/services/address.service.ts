import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Address } from "../models/address.model";
import { environment } from "../../environment/environment";
import { Injectable } from "@angular/core";



@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private apiBaseUrl=`${environment.apiServiceUrl}/address`;

  constructor(
    private http: HttpClient
  ) {}

  //get all addresses for the user
  getUserAddresses(): Observable<Address[]>{
    return this.http.get<Address[]>(`${this.apiBaseUrl}/user`);
  }

  //Create a new address for the user
  createAddress(address:Address):Observable<Address>{
    return this.http.post<Address>(`{this.apiBaseUrl}/user`,address);
  }

}
