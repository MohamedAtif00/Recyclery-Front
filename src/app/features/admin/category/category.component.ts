import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../shared/service/category.service';
import { Category } from '../../../shared/model/category.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit{


  categories!:Category[];
  constructor(private categoryServ:CategoryService){}

  ngOnInit(): void {
    this.categoryServ.GetAllCategories().subscribe(data=>{
      this.categories = data
    })
  }

  addCategory()
  {}

  editCategory(category:Category)
  {}

  deleteCategory(id:number)
  {}
}
