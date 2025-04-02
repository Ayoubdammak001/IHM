import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {Category} from "../models/category.model";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'assets/db.json';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => data.categories)
    );
  }

  getById(id: number): Observable<Category> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => data.categories.find((category: Category) => category.id === id))
    );
  }

  add(category: Omit<Category, 'id'>): Observable<Category> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => {
        const newCategory = {
          ...category,
          id: Math.max(...data.categories.map((c: Category) => c.id)) + 1
        };
        data.categories.push(newCategory);
        return newCategory;
      })
    );
  }

  update(id: number, category: Partial<Category>): Observable<Category> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => {
        const index = data.categories.findIndex((c: Category) => c.id === id);
        if (index !== -1) {
          data.categories[index] = { ...data.categories[index], ...category };
          return data.categories[index];
        }
        throw new Error('Category not found');
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => {
        const index = data.categories.findIndex((c: Category) => c.id === id);
        if (index !== -1) {
          data.categories.splice(index, 1);
        }
      })
    );
  }
}
