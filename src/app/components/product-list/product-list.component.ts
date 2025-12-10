import { Component, OnInit, inject } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import Keycloak from 'keycloak-js';
import { AddToCartRequest, CartService } from '../../services/cart.service';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-product-list',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit{
  products:Product[]=[];

  isLoading = true;
  isLoggedIn = false;
  private readonly keycloak = inject<InstanceType<typeof Keycloak>>(Keycloak);

  // Injecting the product service
  constructor(
    private productService:ProductService,
    private cartService:CartService,

    private toastr:ToastrService
  ){}

  async ngOnInit(): Promise<void> {
    // Checking login state
    this.isLoggedIn = this.keycloak.authenticated === true;

    // Fetching products
    this.productService.getAllProducts().subscribe({
      next:(productData)=>{
        this.products=productData;
        this.isLoading=false;
      },
      error:(err)=>{
        console.error("Failed to fetch the products")
        this.isLoading=false;
      }
    });
  }

  forceLogin(): void {
    this.keycloak.login({
      redirectUri: window.location.origin,
    }).catch((error) => {
      console.error("Login error:", error);
    });
  }

  async addToCart(product: Product): Promise<void> {
    // If user is not logged in, redirect to login
    if (!this.keycloak.authenticated) {
      this.keycloak.login({
        redirectUri: window.location.origin,
      });
      return;
    }

    // Backend only needs product_id and quantity
    // user_id is extracted from JWT token automatically by backend
    // cart_id is handled automatically by backend
    const addToCartRequest: AddToCartRequest = {
      product_id: product.product_id,
      quantity: 1
    };

    this.cartService.addToCart(addToCartRequest).subscribe({
      next:()=>{
        this.toastr.success(`${product.product_name} added to the cart successfully`)
      },
      error:(err)=>{
        console.error("Add to cart error:", err);
        console.error("Error details:", {
          status: err?.status,
          statusText: err?.statusText,
          error: err?.error,
          message: err?.message,
          url: err?.url
        });
        // Extract error message from response if available
        const errorMessage = err?.error?.message || err?.error?.error || err?.message || err?.statusText || "Unknown error";
        const statusCode = err?.status || "N/A";

        // Provide more specific error messages based on status codes
        if (err?.status === 0 || err?.status === undefined) {
          this.toastr.error("Unable to connect to the server. Please check if the backend API is running at http://localhost:9002");

        } else if (err?.status === 400) {
          // 400 Bad Request - show backend error description
          const backendError = err?.error?.error_description || err?.error?.message || err?.error?.error || "Invalid request format";
          this.toastr.error(`Unable to add item: ${backendError}`);

        } else if (err?.status === 401) {
          this.toastr.error("Authentication failed. Please log in again.");

        } else if (err?.status === 403) {
          this.toastr.error("You don't have permission to perform this action.");

        } else if (err?.status === 404) {
          this.toastr.error("Cart endpoint not found. Please check the API configuration.");

        } else if (err?.status >= 500) {
          this.toastr.error("Server error occurred. Please try again later.");

        } else {
          this.toastr.error(`Unable to add the item to the cart: ${errorMessage} (Status: ${statusCode})`);
        }

      }
    });
  }











}


