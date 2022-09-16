import { TestBed } from '@angular/core/testing';
import { LoggerService } from 'src/app/services/loggers.service';

import { CalculatorService } from './calculator.service';

describe('CalculatorService', () => {
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

    it('should add two numbers', () => {
        const result = service.add(3, 2);

        expect(result).toBe(5);

        expect(spyLogService.logs).toHaveBeenCalledTimes(1);
    });

    it('should subtract two numbers', () => {
        const result = service.remove(3, 2);
        expect(result).toBe(1);
    });
});
