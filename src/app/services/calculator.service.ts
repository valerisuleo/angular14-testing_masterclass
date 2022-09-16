import { Injectable } from '@angular/core';
import { LoggerService } from 'src/app/services/loggers.service';

@Injectable({
    providedIn: 'root',
})
export class CalculatorService {
    constructor(private logger: LoggerService) {}

    add(n1, n2) {
        this.logger.logs('add');
        return n1 + n2;
    }

    remove(n1, n2) {
        this.logger.logs('remove');
        return n1 - n2;
    }
}
