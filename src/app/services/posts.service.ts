import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class PostsService {
    constructor(private http: HttpClient) {}

    getPosts(): Observable<Object> {
        return this.http.get('https://jsonplaceholder.typicode.com/posts');
    }
}
