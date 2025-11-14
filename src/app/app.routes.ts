import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { Cart } from './components/cart/cart.component';

export const routes: Routes = [
  {
    path: '',
    component: ProductListComponent,
    title: 'Home - ShopHub'
  },
  {
    path: 'products',
    component: ProductListComponent,
    title: 'Products - ShopHub'
  },
  {
    path: 'cart',
    component: Cart,
    title: 'Cart - ShopHub'
  },
  // TODO: Uncomment and implement when page components are created
  // {
  //   path: 'products/:id',
  //   loadComponent: () => import('./pages/home-page/product-details/product-details.component').then(m => m.ProductDetailsComponent),
  //   title: 'Product Details - ShopHub'
  // },
  // {
  //   path: 'checkout',
  //   loadComponent: () => import('./pages/home-page/product-details/checkout/checkout.component').then(m => m.CheckoutComponent),
  //   title: 'Checkout - ShopHub'
  // },
  // {
  //   path: 'orders',
  //   loadComponent: () => import('./pages/home-page/product-details/checkout/orders/orders.component').then(m => m.OrdersComponent),
  //   title: 'Orders - ShopHub'
  // },
  // {
  //   path: 'login',
  //   loadComponent: () => import('./pages/home-page/product-details/checkout/orders/login-page/login-page.component').then(m => m.LoginPageComponent),
  //   title: 'Login - ShopHub'
  // },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
