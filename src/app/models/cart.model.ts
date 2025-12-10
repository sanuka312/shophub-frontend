export interface CartItem{
  id:number;
  cart_id:number;
  product_id:number;
  unit_price:number;
  quantity:number;
  total_price:number; // Product price * Quantity (fixed typo: was total_pice)
  is_selected:boolean;

  product?:{
    product_id:number;
    product_name:string;
    image_url_main:string;
    product_price:number;
    product_stock:number;
  };
}

export interface Cart{
  cart_id:number;
  keycloak_user_id:string;
  cart_items:CartItem[]; // Backend uses cart_items, not cartItems
}

