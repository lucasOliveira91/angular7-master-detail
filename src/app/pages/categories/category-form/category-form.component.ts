import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../shared/category.service';
import { toastr } from 'toastr';
import { Category } from '../shared/category.model';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string = 'new';
  categoryForm: FormGroup;
  pageTitle: string = 'Cadastro de nova categoria';
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  category: Category;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path !== 'new') {
      this.currentAction = 'edit'
    }
  }

  private buildCategoryForm() {
    this.categoryForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  private loadCategory() {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(switchMap(params => this.categoryService.getById(+params.get('id')))).subscribe(category => {
        this.category = category;
        this.categoryForm.patchValue(this.category);
      }, error => alert('Ocorreu um erro'));
    }
  }

  private setPageTitle() {
    if(this.currentAction === `edit` && this.category){
      this.pageTitle = `Edição de Categoria ${this.category.name}`;
    }
  }
}
