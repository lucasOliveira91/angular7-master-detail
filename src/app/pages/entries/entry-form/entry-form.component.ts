import { Entry } from '../shared/entry.model';
import { Validators } from '@angular/forms';
import { EntryService } from '../shared/entry.service';
import { Component, Injector } from '@angular/core';
import { BaseResourceFormComponent } from '../../../shared/components/base-resource-form/base-resource-form.component';
import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent extends BaseResourceFormComponent<Entry>{

  categories: Array<Category>;
  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '.',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  };

  constructor(
    private categoryService:CategoryService,
    protected entryService: EntryService,
    protected injector: Injector
  ) {
    super(injector, new Entry(), entryService, Entry.fromJson)
  }

  
  ngOnInit() {
    this.loadCategories();
    super.ngOnInit();
  }

  protected buildResourceForm() {
    this.resourceForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ["expense", [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]],
    });
  }
  
  protected creationPageTitle(): string {
    return 'Cadastro de novo lançamento';
  }

  protected editionPageTitle() {
    const entryName = this.resource.name || '';
    return `Editando lançamento: ${entryName}`;
  }

  get typeOptions():Array<any> {
    return Object.entries(Entry.types).map(
      ([value, text]) => {
        return {
          value: value,
          text: text
        }
      }
    );
  }

  private loadCategories() {
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories;
    })
  }
}
