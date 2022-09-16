import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PostsService } from '../services/posts.service';
import { PostsComponent } from './posts.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        RouterModule.forChild([{ path: '', component: PostsComponent }]),
    ],
    exports: [PostsComponent],
    declarations: [PostsComponent],
    providers: [PostsService],
})
export class PostsModule {}
