import { Component ,OnInit} from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit{
  products:Product[]=[];

  isLoading=true;

  constructor(private productService:ProductService){}

  ngOnInit(): void {
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
}


