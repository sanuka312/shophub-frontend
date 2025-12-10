import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {CartItem} from '../../models/cart.model'
import { Address } from '../../models/address.model';
import { ToastrService } from 'ngx-toastr';
import { Cart } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { AddressService } from '../../services/address.service';
import { CheckoutService } from '../../services/checkout.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  cart: Cart |null=null;
  //make sure only selected items are in the checkout
  selectedCartItems: CartItem[]=[];

  selectedAddress: Address |null=null;

  isLoading=true;
  isPlacingOrder=false;
  address: Address = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    postal_code: '',
    country: '',
  };

  //checking whether the user has any saved address
  hasSavedAddress=false;

  //Payment fields
  paymentMethod: 'CARD' | 'COD' = 'CARD';
  cardNumber='';
  cardHolderName='';
  cardExpirationDate='';
  cardCvv='';

  constructor(
    private cartService: CartService,
    private addressService: AddressService,
    private checkoutService: CheckoutService,
    private toastr:ToastrService,
    private router:Router
  ){}

  //load cart and load saved address
  async ngOnInit(){
    this.loadCart();
    this.loadSavedAddress();
  }

  loadCart(){
    this.cartService.getUserCart().subscribe({
      next:(cartResponse)=>{
        this.cart=cartResponse;

        // Get selected items from sessionStorage (set by cart component)
        const selectedItemsFromStorage = sessionStorage.getItem('selectedCartItems');

        if (selectedItemsFromStorage) {
          try {
            this.selectedCartItems = JSON.parse(selectedItemsFromStorage);
          } catch (error) {
            console.error('Error parsing selectedCartItems from sessionStorage:', error);
            // Fallback: filter by is_selected if sessionStorage fails
            this.selectedCartItems = cartResponse.cart_items.filter(item => item.is_selected === true);
          }
        } else {
          // Fallback: if no sessionStorage data, filter by is_selected from backend
          this.selectedCartItems = cartResponse.cart_items.filter(item => item.is_selected === true);
        }

        if(this.selectedCartItems.length===0){
          this.toastr.warning('No items selected for checkout');
          this.router.navigate(['/cart']);
          return;
        }
        //stop the loader
        this.isLoading=false;
      },
      //if unable to get the cart response
      error:()=>{
        this.toastr.error('Failed to load cart');
        this.router.navigate(['/cart']);
        this.isLoading=false;
      }
    });
  }

  loadSavedAddress(){
    this.addressService.getUserAddresses().subscribe({
      next:(userAddress: Address[])=>{
        this.hasSavedAddress=userAddress.length>0;
        if(this.hasSavedAddress){
          this.selectedAddress=userAddress[0];

          //Fill the fields with saved address
          this.address.line1=userAddress[0].line1;
          this.address.line2=userAddress[0].line2;
          this.address.city=userAddress[0].city;
          this.address.postal_code=userAddress[0].postal_code;
          this.address.country=userAddress[0].country;
        }

        //stop the loader
        this.isLoading=false;
      },
      error:()=>{
        this.hasSavedAddress=false;
        this.isLoading=false;
      }
    });
  }

  getItemTotal(item: CartItem): number {
    // Calculate item total as unit_price * quantity to ensure accuracy
    return (item.unit_price || item.product?.product_price || 0) * item.quantity;
  }

  get SubTotal(): number{
    // Calculate subtotal by summing all item totals
    return this.selectedCartItems.reduce((sum, item) => sum + this.getItemTotal(item), 0);
  }

  get total(){
    return this.SubTotal;
  }

  isCardPayment():boolean{
    return this.paymentMethod === 'CARD';
  }

  placeOrder(){
    if(!this.paymentMethod){
      this.toastr.warning('Please select a payment method');
      return;
    }

    if(!this.address.line1 || !this.address.city || !this.address.postal_code || !this.address.country){
      this.toastr.warning('Please fill in all address fields');
      return;
    }

    if(this.isCardPayment()){
      if(!this.cardNumber || !this.cardHolderName || !this.cardExpirationDate || !this.cardCvv){
        this.toastr.warning('Please fill in all card fields');
        return;
      }
    }

    const addressPayload={
      payment_method:this.paymentMethod,
      address:{
        line1:this.address.line1,
        line2:this.address.line2,
        city:this.address.city,
        postal_code:this.address.postal_code,
        country:this.address.country,
      },
    };

    this.isPlacingOrder=true;

    this.checkoutService.placeOrder(addressPayload).subscribe({
      next:(orderResponse)=>{
        this.toastr.success('Order placed successfully');
        this.router.navigate(['/order']);
        this.isPlacingOrder=false;
      },
      error:(error)=>{
        this.toastr.error('Failed to place order');
        this.isPlacingOrder=false;
      },
    });
  }
}
