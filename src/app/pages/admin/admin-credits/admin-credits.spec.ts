import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCredits } from './admin-credits';

describe('AdminCredits', () => {
    let component: AdminCredits;
    let fixture: ComponentFixture<AdminCredits>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AdminCredits],
        }).compileComponents();

        fixture = TestBed.createComponent(AdminCredits);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
