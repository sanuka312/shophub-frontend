import { Component, OnInit, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Cart, CartItem } from '../../models/cart.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  isLoading = true;
  errorMessage: string | null = null;
  removingItemId: number | null = null; // Track which item is being removed
  updatingItemId: number | null = null; // Track which item is being updated
  selectedItems: Set<number> = new Set<number>(); // Track selected item IDs

  constructor(
    private cartService: CartService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit():void{
    // Backend extracts user_id from JWT token automatically
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.cartService.getUserCart().subscribe({
      next: (cartResponse) => {
        this.cart = cartResponse;
        this.isLoading = false;
        console.log('Cart loaded:', cartResponse);
        // Debug: Log cart items structure
        if (cartResponse?.cart_items) {//checks whether the cart items exists in the response
          console.log('Cart items:', cartResponse.cart_items);
          cartResponse.cart_items.forEach((item, index) => {
            console.log(`Item ${index}:`, {
              id: item.id,
              quantity: item.quantity,
              total_price: item.total_price,
              product: item.product
            });
          });
          // Initialize selection based on is_selected field if available, otherwise select all by default
          this.initializeSelection();
        }
      },
      error: (err) => {
        console.error('Error loading cart:', err);
        this.isLoading = false;
        if (err?.status === 404) {
          // Empty cart - not an error
          //Manually setting an empty cart object to avoid breaking the UI
          this.cart = {
            cart_id: 0,
            keycloak_user_id: '',
            cart_items: []
          };
        } else {
          const errorMsg = 'Failed to load cart';
          this.errorMessage = errorMsg;
          this.toastr.error(errorMsg);
        }
      }
    });
  }

  decrease(item: CartItem): void {
    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      this.updateQuantity(item, newQuantity);
    }
  }

  increase(item: CartItem): void {
    const newQuantity = item.quantity + 1;
    // Check if quantity exceeds available stock
    const availableStock = item.product?.product_stock || 0;
    if (newQuantity > availableStock) {
      this.toastr.warning(`Only ${availableStock} item(s) available in stock`);
      return;
    }
    this.updateQuantity(item, newQuantity);
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (this.updatingItemId === item.id) return; // Prevent duplicate requests

    // Validate item has a valid ID
    if (!item.id || item.id <= 0) {
      console.error('Invalid item ID:', item.id);
      this.toastr.error('Invalid cart item. Please refresh the page.');
      return;
    }

    // Validate quantity
    if (newQuantity <= 0) {
      this.toastr.error('Quantity must be greater than 0');
      return;
    }

    this.updatingItemId = item.id;
    this.cartService.updateCartItemQuantity(item.id, newQuantity).subscribe({
      next: () => {
        this.updatingItemId = null;
        // Reload cart to get updated data from backend
        this.loadCart();
        this.toastr.success('Quantity updated');
      },
      error: (err) => {
        this.updatingItemId = null;
        console.error('Error updating quantity:', err);
        console.error('Error details:', {
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
          this.toastr.error("Unable to connect to the server. Please check if the backend API is running.");

        } else if (err?.status === 400) {
          // 400 Bad Request - show backend error description
          const backendError = err?.error?.error_description || err?.error?.message || err?.error?.error || "Invalid request format";
          this.toastr.error(`Failed to update quantity: ${backendError}`);

        } else if (err?.status === 401) {
          this.toastr.error("Authentication failed. Please log in again.");

        } else if (err?.status === 403) {
          this.toastr.error("You don't have permission to update this item.");

        } else if (err?.status === 404) {
          this.toastr.error("Cart item not found. The item may have been removed.");

        } else if (err?.status >= 500) {
          this.toastr.error("Server error occurred. Please try again later.");

        } else {
          this.toastr.error(`Failed to update quantity: ${errorMessage} (Status: ${statusCode})`);
        }

        // Reload cart to sync with backend state
        this.loadCart();
      }
    });
  }

  removeItem(item: CartItem): void {
    if (!this.cart || !item.id || this.removingItemId === item.id) return;

    // Confirm removal
    if (!confirm('Are you sure you want to remove this item from your cart?')) {
      return;
    }

    this.removingItemId = item.id;

    // Call backend API to remove item
    this.cartService.removeItemFromCart(item.id).subscribe({
      next: () => {
        this.removingItemId = null;
        this.toastr.success('Item removed from cart');
        // Reload cart to ensure sync with backend
        this.loadCart();
      },
      error: (err) => {
        this.removingItemId = null;
        console.error('Error removing item:', err);
        const errorMsg = 'Failed to remove item';
        this.toastr.error(errorMsg);
        // Reload cart to sync with backend state
        this.loadCart();
      }
    });
  }

  getSubtotal(): number {
    if (!this.cart?.cart_items || this.cart.cart_items.length === 0) {
      return 0;
    }

    let subTotal = 0;
    for (const item of this.cart.cart_items) {
      subTotal += item.total_price;
    }
    return subTotal;
  }

  getCartItemsCount(): number {
    return this.cart?.cart_items?.length || 0;
  }

  hasCartItems(): boolean {
    return !!(this.cart?.cart_items && this.cart.cart_items.length > 0);
  }

  // Selection management methods
  initializeSelection(): void {
    if (!this.cart?.cart_items) return;

    // Preserve existing selection for items that still exist
    const existingSelectedItems = new Set<number>();

    this.cart.cart_items.forEach(item => {
      // If backend provides is_selected, use it
      if (item.is_selected !== undefined) {
        if (item.is_selected) {
          existingSelectedItems.add(item.id);
        }
      } else {
        // If backend doesn't provide is_selected, preserve user's current selection
        // or select all if this is the first load (selectedItems is empty)
        if (this.selectedItems.size === 0) {
          // First load: select all by default
          existingSelectedItems.add(item.id);
        } else if (this.selectedItems.has(item.id)) {
          // Preserve existing selection
          existingSelectedItems.add(item.id);
        }
      }
    });

    // Update selectedItems to only include items that still exist
    this.selectedItems = existingSelectedItems;
  }

  isItemSelected(itemId: number): boolean {
    return this.selectedItems.has(itemId);
  }

  toggleItemSelection(itemId: number, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedItems.add(itemId);
    } else {
      this.selectedItems.delete(itemId);
    }
  }

  areAllItemsSelected(): boolean {
    if (!this.cart?.cart_items || this.cart.cart_items.length === 0) {
      return false;
    }
    return this.cart.cart_items.every(item => this.selectedItems.has(item.id));
  }

  areSomeItemsSelected(): boolean {
    return this.selectedItems.size > 0;
  }

  toggleSelectAll(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (!this.cart?.cart_items) return;

    if (checkbox.checked) {
      // Select all items
      this.cart.cart_items.forEach(item => {
        this.selectedItems.add(item.id);
      });
    } else {
      // Deselect all items
      this.selectedItems.clear();
    }
  }

  getSelectedSubtotal(): number {
    if (!this.cart?.cart_items || this.selectedItems.size === 0) {
      return 0;
    }

    let subTotal = 0;
    for (const item of this.cart.cart_items) {
      if (this.selectedItems.has(item.id)) {
        subTotal += item.total_price;
      }
    }
    return subTotal;
  }

  getSelectedItemsCount(): number {
    return this.selectedItems.size;
  }

  hasSelectedItems(): boolean {
    return this.selectedItems.size > 0;
  }

  proceedToCheckout(): void {
    if (!this.hasSelectedItems()) {
      this.toastr.warning('Please select at least one item to checkout');
      return;
    }

    // Get selected cart items
    const selectedCartItems = this.cart?.cart_items?.filter(item =>
      this.selectedItems.has(item.id)
    ) || [];

    if (selectedCartItems.length === 0) {
      this.toastr.warning('No items selected for checkout');
      return;
    }

    sessionStorage.setItem('selectedCartItems', JSON.stringify(selectedCartItems));

    this.toastr.info(`Proceeding to checkout with ${this.selectedItems.size} item(s)`);

    // Navigate to checkout
    this.router.navigate(['/checkout']).then(
      (success) => {
        if (!success) {
          console.error('Navigation to checkout failed');
          this.toastr.error('Failed to navigate to checkout page');
        }
      },
      (error) => {
        console.error('Navigation error:', error);
        this.toastr.error('An error occurred while navigating to checkout');
      }
    );

    console.log('Navigating to checkout with selected items:', selectedCartItems);
    console.log('Selected items:', this.selectedItems);
  }
}
