import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs';
import { CoursesService } from '../services/courses.service';

@Component({
    selector: 'courses',
    templateUrl: './courses.component.html',
    styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit {
    todos = [];
    current;
    constructor(private coursesService: CoursesService) {}

    private getTodo(): void {
        this.coursesService.getItem(2).subscribe((data) => {
            // console.log(data);
        });
    }

    private getTodos(): void {
        this.coursesService.getAll().subscribe((data: any) => {
            // console.log(data);
            this.todos = data;
        });
    }

    private updateTodo() {
        const id = 3;
        const payload = {
            userId: 1,
            title: 'viva la pasta!',
            completed: true,
        };
        this.coursesService.updateItem(id, payload).subscribe((data) => {
            console.log(data);
            this.todos[2] = data;
        });
    }

    private newTodo() {
        const payload = {
            userId: 1,
            title: 'stocazzoStanis',
            completed: true,
        };
        this.coursesService.createItem(payload).subscribe((data: any) => {
            console.log(data);
            payload['id'] = data.id;
            this.todos.unshift(data);
        });
    }

    ngOnInit(): void {
        this.getTodo();
        this.getTodos();

        setTimeout(() => {
            // this.newTodo();
            this.updateTodo();
        }, 1000);
    }
}
