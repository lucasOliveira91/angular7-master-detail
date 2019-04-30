import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entry } from './entry.model';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private apiPath: string = 'api/entries'

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<Entry[]> {
    return this.http.get<Entry[]>(`${this.apiPath}`)
  }

  getById(id: number): Observable<Entry> {
    return this.http.get<Entry>(`${this.apiPath}/${id}`);
  }

  create(entry: Entry): Observable<any> {
    return this.http.post(`${this.apiPath}`, entry);
  }

  update(entry: Entry): Observable<Entry> {
    return this.http.put<Entry>(`${this.apiPath}/${entry.id}`, entry).pipe(
      map(() => entry)
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiPath}/${id}`);
  }
}
