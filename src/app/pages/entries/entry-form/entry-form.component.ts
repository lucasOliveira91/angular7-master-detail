import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EntryService } from '../shared/entry.service';
import { toastr } from 'toastr';
import { Entry } from '../shared/entry.model';
import { switchMap } from 'rxjs/operators';
import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string = 'new';
  entryForm: FormGroup;
  pageTitle: string = 'Cadastro de novo lançamento';
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  entry: Entry;
  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '.',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  };
  categories: Category[];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private entryService: EntryService,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
    this.loadCategories();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;
    if (this.currentAction !== 'edit') {
      this.createEntry();
      return;
    }
    
    this.updateEntry();
  }

  get typeOptions(): Array<any> {
    return Object.entries(Entry.types).map((value, text) => {
      console.log(value, text)
      return {
        text: text,
        value: value
      }
    });
  }
  
  private createEntry() {
    const entry: Entry = Object.assign(new Entry, this.entryForm.value);
    this.entryService.create(entry).subscribe(
      entry => this.acttionForSuccess(entry),
      error => this.actionsForError(error)
    );
  }

  private updateEntry() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);

    this.entryService.update(entry).subscribe(
      entry => this.acttionForSuccess(entry),
      error => this.actionsForError(error)
    );
  }
  
  private acttionForSuccess(entry: Entry) {
    console.log('entidade', entry)
    // toastr.success('Solicitação processada com sucesso.');

    //It doen't add to navigate history
    this.router.navigateByUrl('entries', { skipLocationChange: true }).then(() => {
      this.router.navigate([`entries`, entry.id, 'edit']);
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

  private buildEntryForm() {
    this.entryForm = this.fb.group({
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

  private loadEntry() {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(switchMap(params => this.entryService.getById(+params.get('id')))).subscribe(entry => {
        this.entry = entry;
        this.entryForm.patchValue(this.entry);
      }, error => alert('Ocorreu um erro'));
    }
  }

  private loadCategories() {
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories;
    })
  }

  private setPageTitle() {
    if (this.currentAction === 'edit' && this.entry) {
      this.pageTitle = `Edição de Lançamento ${this.entry.name}`;
    }
  }
}
