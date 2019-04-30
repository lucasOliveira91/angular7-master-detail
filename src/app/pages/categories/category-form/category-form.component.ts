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

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction !== 'edit') {
      this.createCategory();
      return;
    }
    
    this.updateCategory();
  }
  
  private createCategory() {
    const category: Category = Object.assign(new Category, this.categoryForm.value);
    this.categoryService.create(category).subscribe(
      category => this.acttionForSuccess(category),
      error => this.actionsForError(error)
    );
  }

  private updateCategory() {
    const category: Category = Object.assign(new Category, this.categoryForm.value);
    this.categoryService.update(category).subscribe(
      category => this.acttionForSuccess(category),
      error => this.actionsForError(error)
    );
  }
  
  private acttionForSuccess(category: Category) {
    // toastr.success('Solicitação processada com sucesso.');

    //It doen't add to navigate history
    this.router.navigateByUrl('categories', { skipLocationChange: true }).then(() => {
      this.router.navigate([`categories`, category.id, 'edit']);
    });
  }

  private actionsForError(error) {
    toastr.error(`Error em sua solicitação. ${error}`)
    this.submittingForm = false;

    if(error.status === '422') {
      this.serverErrorMessages = JSON.parse(error._body).erros;
    }else {
      this.serverErrorMessages = ['Falha na comunicação.'];
    }
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
    if (this.currentAction === 'edit' && this.category) {
      this.pageTitle = `Edição de Categoria ${this.category.name}`;
    }
  }
}
