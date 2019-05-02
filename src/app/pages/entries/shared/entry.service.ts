import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { Entry } from './entry.model';
import { flatMap } from 'rxjs/operators';
import { CategoryService } from '../../categories/shared/category.service';
import { BaseResourceService } from '../../../shared/services/base-resource.service';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry>{

  constructor(
    protected injector: Injector,
    private categoryService: CategoryService
  ) { super('api/entries', injector) }

  create(entry: Entry): Observable<any> {
    return this.categoryService.getById(entry.categoryId).pipe(flatMap(category => {
        entry.category = category;
        return super.create(entry);
      })
    );
  }

  update(entry: Entry): Observable<Entry> {
    return this.categoryService.getById(entry.categoryId).pipe(flatMap(category => {
        entry.category = category;
        return super.update(entry);
      })
    );
  }
}