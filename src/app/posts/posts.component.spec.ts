import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { POSTS } from '../mock/posts';
import { PostsModule } from '../posts/posts.module';
import { PostsService } from '../services/posts.service';
import { PostsComponent } from './posts.component';

import { fakeAsync, tick } from '@angular/core/testing';

fdescribe('PostsComponent', () => {
    let component: PostsComponent;
    let fixture: ComponentFixture<PostsComponent>;
    let de: DebugElement;
    let service: PostsService;

    beforeEach(() => {
        const spyService = jasmine.createSpyObj('PostsService', ['getPosts']);
        TestBed.configureTestingModule({
            imports: [PostsModule, HttpClientTestingModule],
            providers: [
                {
                    provide: PostsService,
                    useValue: spyService,
                },
            ],
        });
        fixture = TestBed.createComponent(PostsComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        service = TestBed.inject(PostsService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get the posts from API', () => {
        (service.getPosts as jasmine.Spy).and.returnValue(of(POSTS));
        fixture.detectChanges();
        expect(component.all.length).toBeGreaterThan(2);
    });

    it('should display a collection of cards', () => {
        (service.getPosts as jasmine.Spy).and.returnValue(of(POSTS));

        fixture.detectChanges();

        const cards = de.queryAll(By.css('.example-card'));

        expect(cards).toBeTruthy();
        expect(cards.length).toBe(10);
    });

    it('should display the first post inside the first card', () => {
        (service.getPosts as jasmine.Spy).and.returnValue(of(POSTS));

        fixture.detectChanges();

        const firstPost = component.all[0];
        const firstCard = de.query(By.css('.example-card:first-child'));
        const firstCardTitle = firstCard.query(By.css('.mat-card-title'));
        const el: HTMLElement = firstCardTitle.nativeElement;

        expect(firstCard).toBeTruthy();
        expect(el.innerText).toContain(firstPost.userId); // expect(Post 1).toContain(1);
    });

    fit('should get Posts onclick btn', () => {
        let btn = fixture.debugElement.query(By.css('.btn-primary'));
        (service.getPosts as jasmine.Spy).and.returnValue(of(POSTS));
        btn.triggerEventHandler('click', null);

        fixture.detectChanges();

        const cards = de.queryAll(By.css('.example-card'));
        expect(cards).toBeTruthy();
        expect(component.all.length).toBe(10);
        expect(cards.length).toBe(10);
    });
});

// describe('Async tests', () => {
//     it('Async test with the done() jasmine callback', (done: DoneFn) => {
//         let test = false;

//         setTimeout(() => {
//             console.log('run');
//             test = true;
//             expect(test).toBeTruthy();

//             done();
//         }, 1000);
//     });

//     it('Async test - setTimeout', fakeAsync(() => {
//         let test = false;

//         setTimeout(() => {
//             console.log('run');
//             test = true;
//         }, 1000);

//         tick(1000);
//         expect(test).toBeTruthy();
//     }));

//     fit('Async test - Promise + setTimeout', fakeAsync(() => {
//         let count = 0;

//         Promise.resolve().then(() => {
//             count += 10;

//             setTimeout(() => {
//                 count += 1;
//             }, 1000);
//         });

//         expect(count).toBe(0)
//     }));
// });
