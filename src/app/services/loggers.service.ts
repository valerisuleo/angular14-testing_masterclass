import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggerService {
    constructor() {}

    logs(message: string) {
        console.log(message);
    }
}
