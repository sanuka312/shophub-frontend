export interface CartItem{
  id:number;
  productId:number;
  productName:string;
  quantity:number;
  productPrice:number; //Price of the item at the time of adding to the cart
  totalPrice:number; // Product price * Quantity
  addedDate:Date;
}

export interface Cart{
  cartId:number;
  userId:number;
  itemCount:number; //keep tracks of number of items in the cart
  total:number;//keep tracks total of the all the items in the cart
  cartItems:CartItem[]
}

