# What's Jasmine?

It's a behaviour JS testing **framework**. With Jasmine we have everything we need to test our code. In Jasmine, our tests are known as specifications or *specs*, and they are grouped in test suites.

in order to define a test suite, we use the Jasmine `describe()` function.

It takes 2 args: the first one is then *name* of our test and the second one is a `fn` (this function is going to contain a series of specifications)

```
describe('CounterService', () => {
    
})
```

Let's define some specifications:

```
describe('CounterService', () => {
    it('should add two numbers', () => {});
    it('should subtract two numbers', () => {});
});
```


In order to give the indication to Jasmine that the test is not yet ready to be executed, we are going
to use the `pending()` utility function on both tests.

```
describe('CounterService', () => {
    it('should add two numbers', () => {
        pending();
    });
    it('should subtract two numbers', () => {
        pending();
    });
});
```

>To prevent the browser opening go to _karma.conf.js_ and add:

`browsers: ["ChromeHeadless"]`

Run `ng test`

This is going to compile all our application code along with our specifications using the Kharma test run.

```
    it('should add two numbers', () => {
        pending();
    });
    it('should subtract two numbers', () => {
        fail(); // We can also simulate a failing 

    });
```


So in order to test `CalculatorService`, the first thing that we're going to
need is an _instance_ of the `LoggerService`:

So we can instantiate it in a very simple way by calling its constructor.


```
    it('should add two numbers', () => {
        const calculatorService = new CalculatorService(new LoggerService());
    });
```

Lets go ahead and use it in order to add two numbers.

```
       it('should add two numbers', () => {
        // The Arrange part is where we initialise the system under test.
        const calculatorService = new CalculatorService(new LoggerService());
        // The Act part often involves calling a method or a function.
        const result = calculatorService.add(2, 2);
        // The last one is the Assertion.
        expect(result).toBe(4);
    });
```

Now in order to ensure that the result is correct, we are going to write our first test _assertion_.


## Jasmine Spy

Now, let's take these tests one step further: we wanna assert that not only the result of the calculation is correct, but also we want to make sure that the **logger service is only called once**.

> Let's imagine that the logger service consumes expensive resources that should not be overused.

To do that we are going to be introducing the concept of a _Jasmine spy_ before doing that.

With that spy we can:

- check if a method has been called;
- change the implementation of that method;
- return a different value;
- throw an error;

> `spyOn()` put a spy on a method in a class.

It takes 2 args:

1. the obj we wanna put a spy on
2. the name of the method in that obj

`spyOn(logger, 'logs')`

```
    it('should add two numbers', () => {
        const loggerService = new LoggerService();
        const calculatorService = new CalculatorService(loggerService);

        spyOn(loggerService, 'logs');

        const result = calculatorService.add(3, 2);
        expect(result).toBe(5);
        expect(loggerService.logs).toHaveBeenCalledTimes(1);
    });
```

What we are doing here is we are creating an actual instance of a `logger service` and then we are _spying_ on one of its methods.

In real world application instead of creating an actual logger instance `const loggerService = new LoggerService();` we can provide a complete fake version of the logger service: 

`const loggerService = jasmine.createSpyObj('')`


> In a test for testing the calculator service, the only actual instance of a service that should be present is the calculator service itself. Any other dependency should be mocked and replaced with a fake test implementation.


> These will ensure that the calculator service unit test will fail only due to problems in the calculator


it's pretty much the same 

1. the obj we wanna put a spy on
2. But this time the name of the method in that obj is inside an `[]`


```
 it('should add two numbers', () => {
        // const loggerService = new LoggerService();
        const loggerService = jasmine.createSpyObj('LoggerService', ['logs']);
        const calculatorService = new CalculatorService(loggerService);

        const result = calculatorService.add(3, 2);
        expect(result).toBe(5);
        expect(loggerService.logs).toHaveBeenCalledTimes(1);
    });

```


Now `logs` is not returning any data but let's say that we are dealing with a serveice returning a todos list. We can do something like this:

`loggerService.logs.and.returnValue()`

## Structuring Angular Unit Test - Setup using `beforeEach`

Let's refactoring our code:

```
   describe('CalculatorService', () => {
    let loggerService;
    let service: CalculatorService;

    beforeEach(() => {
        loggerService = jasmine.createSpyObj('LoggerService', ['logs']);
        service = new CalculatorService(loggerService);
    });

    it('should add two numbers', () => {
        const result = service.add(3, 2);

        expect(result).toBe(5);

        expect(loggerService.logs).toHaveBeenCalledTimes(1);
    });

    it('should subtract two numbers', () => {
        const result = service.remove(3, 2);
        expect(result).toBe(1);
    });
});

```

> the beforeEach block, as the name implies, is going to be executed before each of the specifications.

## Dependency Injection - `Testbed`

Testbed utility is going to allow us to provide the dependencies to our services by using dependency injection instead of calling constructor explicitly <s>service = new CalculatorService(loggerService)</s>

```
TestBed.configureTestingModule({
    
})
```

This method takes here one configuration object that contains properties that are very similar to the ones present in the angular module, such as declarations, imports, providers...

Now, in the case of our tests, we are not yet using components.
So we are only going to be using here the _providers_ part of the test.

```
        TestBed.configureTestingModule({
            providers: [
                CalculatorService,
            ]
        })
    });
```

> What about the `LoggerService` ?

If we did something like:

```
     providers: [
                CalculatorService,
                LoggerService
            ]
```

we creates an actual instance of the LoggerService and not the spy - `jasmine.createSpyObj('LoggerService', ['logs']);` - that we want to use to check how many times the log function has been called.

> How can we fix it?

We are going to provide here the _jasmine spy_ in its place.

```
     TestBed.configureTestingModule({
            providers: [
                CalculatorService,
                { provide: LoggerService, useValue: spyLogService },
            ],
        });
```

Now we can use `TestBed` to retrieve our `CalculatorService` instead of calling the constructor explicitly.

```
    let spyLogService;
    let service: CalculatorService;

    beforeEach(() => {
        spyLogService = jasmine.createSpyObj('LoggerService', ['logs']);
        TestBed.configureTestingModule({
            providers: [
                CalculatorService,
                { provide: LoggerService, useValue: spyLogService },
            ],
        });
        service = TestBed.inject(
            CalculatorService
        ) as jasmine.SpyObj<CalculatorService>;
    });
```

> NOTE: you might see around `TestBed.get(CalculatorService)`. It's DEPRECATED!

# Section 2: Testing Services

## Testing `Http` services

We want our `CoursesComponent` to fetch `onInit` a list of <s>courses</course></s> _todos_ item.

```
   private getTodos(): void {
        this.coursesService.getAll().subscribe((data: any) => {
            // console.log(data);
            this.todos = data;
        });
    }
```

Let's take a look at the `coursesService`: This service has a dependecies `constructor(private http: HttpClient) {}`. Hence in our test component we need to provide a _mock_ implementation of our test component.

```
import { HttpClientTestingModule } from '@angular/common/http/testing';

 beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CoursesService],
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(CoursesService);
    });
```


> HttpClientTestingModule includes a mock implementation of an http service but instead of issuing an actual http requests  is going to return test data that we provide.

In order to provide fake data we need the `HttpTestingController`

```
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
```

First we wanna test if it's calling the right endpoint and using a `GET` to perform the request:

```
    it('should be return a list of todos', () => {
        service.getAll().subscribe((response: any[]) => {
            expect(response).toBeTruthy();
            expect(response.length).toBe(200);
        });

        const req = httpTestingController.expectOne(
            'https://jsonplaceholder.typicode.com/todos'
        );
```

Now it's time to pass some mock data:

```
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
             ...payload  // we replace some origal obj props with the latest changes
         });
    });
```

## Testing Error Handling

Now we are going to learn how to test an error handling behaviour.

Let's see what should happen if a call  goes wrong on the server, for example we can't update our todo obj

- Assertion

    ```
        it('should be return an error if save todo fails', () => {
            const id = 5;
            const payload = {
                userId: 1,
                title: 'viva la pasta',
                completed: true,
            };
            service.updateItem(id, payload).subscribe({
                next: (v) => console.log(v),
                error: (error: HttpErrorResponse) => {
                    expect(error.status).toBe(500);
                },
            });
    ```

Now that we have written our assetion let's trigger the http request:

- Mock the http req by using `httpTestingController`

    ```
        const req = httpTestingController.expectOne(
                'https://jsonplaceholder.typicode.com/todos/5'
            );
    ```

- We are again going to flush our mock request, but this time we want to make it fail:

    ```
    req.flush('Oooops!', { status: 500, statusText: 'Server error' });
    ```


# Section 3: Testing Components

## Setup Code

```
describe('PostsComponent', () => {
    beforeEach(() => {
        
    });

    it('should create', () => {
        pending()
    });
});
```

In the `beforeEach` block we need to create an instance of our component but we can't write:

```
beforeEach(() => {
    new PostsComponent()
  });
```

in order to create an instance of this component we call: `TestBed.createComponent(PostsComponent)` and the arg. of this method is the component itself.

```
describe('PostsComponent', () => {
    let component: PostsComponent;
    let fixture: ComponentFixture<PostsComponent>

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [PostsModule],
        })
        fixture = TestBed.createComponent(PostsComponent);
    });
});
```

> This ComponentFixture is a wrapper around our component instance; with that we can get access to both the component's instance and its template.


from the fixture we can get the component's instance:

```
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [PostsModule],
        })
        fixture = TestBed.createComponent(PostsComponent);
        component = fixture.componentInstance;
        fixture.debugElement;
    });
```

## Integration Test

So we learned how to write unit test in isolation, but they have a limitation: we cannot test the integration of a component with its template.

That's what Integration Test are for!

> What are we gonna test here?

1. wanna ensure the `cards` are rendered properly `onInit`.
2. the first post `const firstPost = component.all[0];` is rendered inside the first card
3. when user click this btn the `getPosts()` method is called and the cards have been redered in the DOM.

Before start to write ot test we need to **setup code for fetching data from API**:

As usual we invoke an instance of `PostsService` (like we did before when we tested a _Service_) 

```
    // 1.INVOKE INSTANCE OF SERVICE
    let service: PostsService;

    beforeEach(() => {
        // 2. CREATE A SPY ON SERVICE
        const spyService = jasmine.createSpyObj('PostsService', ['getPosts']);

        TestBed.configureTestingModule({
            imports: [PostsModule, HttpClientTestingModule],
        // 3. REPLACE THE ACTUAL SERVICE WITH OUR SPY
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

        // 4. INJECT SERVICE
        service = TestBed.inject(PostsService);
```

Now that our setup is completed we are ready to test that `cards` are rendered properly `onInit`.

```
    it('should display a collection of cards', () => {
        (service.getPosts as jasmine.Spy).and.returnValue(of(POSTS));
        const cards = de.queryAll(By.css('.example-card'));
        expect(cards).toBeTruthy();
        expect(cards.length).toBe(10);
    });
```

The test failed! **Error: Expected 0 to be 10.**

> How come?

if we look `console.log(cards);` we'll notice that while the `all` array is filled with our posts the DOM is still empty. There are not cards!

> Why?

Because outside of these tests, angular regulary runs its algorithm to detect changes and updating the DOM, but here we have to tell esplicitly to do that. 

So if we do:

```
    it('should display a collection of cards', () => {
        (service.getPosts as jasmine.Spy).and.returnValue(of(POSTS));

        fixture.detectChanges();

        const cards = de.queryAll(By.css('.example-card'));
        expect(cards).toBeTruthy();
        expect(cards.length).toBe(10);
    });
```

Now it works!


Let's go a bit deeper: the first post `const firstPost = component.all[0];` should be rendered inside the first card

```
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
```

Finally we can write our third test:

```
    fit('should get Posts onclick btn', () => {
        let btn = fixture.debugElement.query(By.css('.btn-primary'));
        (service.getPosts as jasmine.Spy).and.returnValue(of(POSTS));
        btn.triggerEventHandler('click', null);
        expect(component.all.length).toBe(10);
    });
```

Great! The posts have been returned. Now we wanto to be sure they are also rendered in the DOM:

```
    fit('should get Posts onclick btn', () => {
        let btn = fixture.debugElement.query(By.css('.btn-primary'));
        (service.getPosts as jasmine.Spy).and.returnValue(of(POSTS));
        btn.triggerEventHandler('click', null);
        expect(component.all.length).toBe(10);

        const cards = de.queryAll(By.css('.example-card'));
        expect(cards).toBeTruthy();
        expect(cards.length).toBe(10);
    });
```

**Error: Expected 0 to be 10.** Again?


> We must call `fixture.detectChanges();` between triggering your event and your assertions then.

```
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
```

Cool! :)

# Section 4: Async Test

```
fdescribe('Async test example', () => {
    it('Async test with jasmine done()', () => {
        let test = false;

        setTimeout(() => {
            console.log('run');
            test = true;
            expect(test).toBeTruthy();
        }, 1000);
    });
});
```

Now this might seems to work but if we open the dev tool on chrome we can see this:

**Uncaught Error**: _'expect' was used when there was no current spec, this could be because an asynchronous test timed out_

>How can we fix it?

```
fdescribe('Async test example', () => {
    it('Async test with jasmine done()', (done: DoneFn) => {
        let test = false;

        setTimeout(() => {
            console.log('run');
            test = true;
            expect(test).toBeTruthy();

            done();
        }, 1000);
    });
});
```

The first conclusion that we might take from this very simple example is that even if our components,
directives or services are using internally Browsr asynchronous operations such as `settimeout, request, animation, frame, AJAX requests, setinterval` and many other asynchronous browser APIs, we can still write our tests using the Jasmine callback `done()`; **However**, this approach should be avoided.

> How can we fix it?

## `fakeAsync` Testing Zone

We need a mechanism that would detect the execution of asynchronous calls and wait for them to be resolved before considering the test completed.

> As we know Angular comes with the `Zone`. This is implemented by the [_Zone JS Library_](https://github.com/angular/angular/tree/master/packages/zone.js) and it's used by Angular to implement its change detection mechanism.

The best way to wrap our test execution inside the **Zone** is to use `fakeAsync`:

```
    fit('Async test - setTimeout', fakeAsync(() => {
        let test = false;

        setTimeout(() => {
            console.log('run');
            test = true;
            expect(test).toBeTruthy();
        }, 1000);
    }));
```

This is still **failing**!

> So how can we execute these assertions here inside this `setTimeout` block?

`fakeAsync` is going to replace the browser default implementation of the `setTimeout` fn with its own custom fn that simulates the passage of time: `tick()`

```
    fit('Async test - setTimeout', fakeAsync(() => {
        let test = false;

        setTimeout(() => {
            console.log('run');
            test = true;
        }, 1000);

        tick(1000);
        expect(test).toBeTruthy(); // we no longer have to keep this inside `setTimeout`
    }));
```

It works! :)

> Note: `tick()` can be called only inside `fakeAsync`  


## Intro to Microtasks







































