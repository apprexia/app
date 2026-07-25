import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { creditGuard } from './credit-guard';

describe('creditGuard', () => {
    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => creditGuard(...guardParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        expect(executeGuard).toBeTruthy();
    });
});
