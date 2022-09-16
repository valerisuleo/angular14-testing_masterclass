import { TestBed } from '@angular/core/testing';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';

import { CoursesService } from './courses.service';
import { TODOS } from '../mock/todos';
import { HttpErrorResponse } from '@angular/common/http';

describe('CoursesService', () => {
    let service: CoursesService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CoursesService],
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(CoursesService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should be return a list of todos', () => {
        service.getAll().subscribe((response: any[]) => {
            expect(response).toBeTruthy();
            expect(response.length).toBe(200);
        });
        const req = httpTestingController.expectOne(
            'https://jsonplaceholder.typicode.com/todos'
        );
        expect(req.request.method).toEqual('GET');

        req.flush(TODOS);
    });

    it('should find item by id', () => {
        service.getItem(2).subscribe((res: any) => {
            expect(res).toBeTruthy();
            expect(res.id).toBe(2);
        });

        const req = httpTestingController.expectOne(
            'https://jsonplaceholder.typicode.com/todos/2'
        );

        expect(req.request.method).toEqual('GET');
        req.flush(TODOS[1]);
    });

    it('should updated a todo', () => {
        const id = 5;
        const payload = {
            userId: 1,
            title: 'viva la pasta',
            completed: true,
        };
        service.updateItem(id, payload).subscribe((res: any) => {
            console.log('coddio', res);

            expect(res).toBeTruthy();
        });

        const req = httpTestingController.expectOne(
            'https://jsonplaceholder.typicode.com/todos/5'
        );

        expect(req.request.method).toEqual('PUT');
        // Next, we are going to validate the body of the PUT request sent to the server.
        expect(req.request.body.title).toEqual(payload.title);
        // The last step of our test is to actually triggered the mock request.
        req.flush({
            ...TODOS[4], // we got the original obj
            ...payload, // we replace some origal obj props with the latest changes
        });
    });

    it('should be return an error if save todo fails', () => {
        const id = 5;
        const payload = {
            userId: 1,
            title: 'viva la pasta',
            completed: true,
        };
        service.updateItem(id, payload).subscribe({
            next: () => fail(),
            error: (error: HttpErrorResponse) => {
                expect(error.status).toBe(500);
            },
        });

        const req = httpTestingController.expectOne(
            'https://jsonplaceholder.typicode.com/todos/5'
        );

        expect(req.request.method).toEqual('PUT');

        req.flush('Oooops!', { status: 500, statusText: 'Server error' });
    });
});
