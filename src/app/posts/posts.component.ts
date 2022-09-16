import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { PostsService } from '../services/posts.service';
import { IPost } from './interfaces';

@Component({
    selector: 'posts',
    templateUrl: './posts.component.html',
    styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {
    all = [];
    constructor(private service: PostsService) {}

    postsIndex() {
        this.service.getPosts().subscribe((response: IPost[]) => {
            const groupBy = response.reduce((acc, current) => {
                acc[current.userId] = acc[current.userId] || [];
                acc[current.userId].push({
                    id: current.id,
                    title: current.title,
                    body: current.body,
                });
                return acc;
            }, {});

            this.all = Object.keys(groupBy).map((key, i) => {
                return {
                    userId: key,
                    posts: groupBy[i + 1],
                };
            });
        });


    }

    ngOnInit(): void {
        this.postsIndex();
    }
}
