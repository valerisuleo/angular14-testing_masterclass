import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CoursesService {
    constructor(private http: HttpClient) {}

    getAll(): Observable<Object> {
        return this.http.get('https://jsonplaceholder.typicode.com/todos');
    }

    getItem(id): Observable<Object> {
        return this.http.get(
            `https://jsonplaceholder.typicode.com/todos/${id}`
        );
    }

    createItem(payload): Observable<Object> {
        return this.http.post(
            `https://jsonplaceholder.typicode.com/todos`,
            payload
        );
    }

    updateItem(id, payload): Observable<Object> {
        return this.http.put(
            `https://jsonplaceholder.typicode.com/todos/${id}`,
            payload
        );
    }
}
