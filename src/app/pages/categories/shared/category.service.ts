import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from './category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiPath: string = 'api/categories'

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiPath}`)
  }

  getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiPath}/${id}`);
  }

  create(category: Category): Observable<Category> {
    return this.http.post(`${this.apiPath}`,  category);
  }

  update(category: Category) {
    this.http.put(`${this.apiPath}/${category.id}`, category);
  }

  delete(id: number): Observable<any> {
   return this.http.delete(`${this.apiPath}/${id}`);
  }
}
