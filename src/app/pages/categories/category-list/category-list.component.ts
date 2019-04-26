import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../shared/category.service';
import { Category } from '../shared/category.model';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  categories: Category[] = [];

  constructor(
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories;
    });
  }

  deleteCategory(id) {
    const mustDelele = confirm('Are you sure to delete this catetory?')
    if(mustDelele) {
      this.categoryService.delete(id).subscribe(() => {
        this.categories = this.categories.filter(e => e.id !== id)
      });
    }
  }

}
