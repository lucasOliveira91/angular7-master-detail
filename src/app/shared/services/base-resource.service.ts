import { BaseResourceModel } from '../models/base-resource.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { tap } from 'rxjs/operators';

export abstract class BaseResourceService<T extends BaseResourceModel> {

    protected http: HttpClient;

    constructor(
        protected apiPath: string,
        protected injector: Injector
    ) {
        this.http = this.injector.get(HttpClient);
    }

    getAll(): Observable<T[]> {
        return this.http.get<T[]>(`${this.apiPath}`)
    }

    getById(id: number): Observable<T> {
        return this.http.get<T>(`${this.apiPath}/${id}`);
    }

    create(resource: T): Observable<T> {
        return this.http.post<T>(`${this.apiPath}`, resource);
    }

    update(resource: T): Observable<any> {
        return this.http.put(`${this.apiPath}/${resource.id}`, resource).pipe(
            tap(() => resource)
        );
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.apiPath}/${id}`);
    }
}