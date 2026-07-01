import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditsCancel } from './credits-cancel';

describe('CreditsCancel', () => {
    let component: CreditsCancel;
    let fixture: ComponentFixture<CreditsCancel>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CreditsCancel],
        }).compileComponents();

        fixture = TestBed.createComponent(CreditsCancel);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
