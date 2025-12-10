export interface ProductImage {
  image_id: number;
  product_id: number;
  image_url: string;
}

export interface Product {
  product_id: number;
  product_name: string;
  product_price: number;
  product_stock: number;
  product_slug:string;
  category_id: number;
  category_name: string;
  image_url_main:string;
  product_images?: ProductImage[];
}




