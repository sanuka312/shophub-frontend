export interface ProductImage {
  image_id: number;
  product_id: number;
  image_url: string;
}

export interface Product {
  product_id: number;
  product_name: string;
  price: number;
  product_stock: number;
  category_id: number;
  category_name: string;
  img_url_main:string;
  images: ProductImage[];
}


