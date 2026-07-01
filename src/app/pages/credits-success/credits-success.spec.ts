import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditsSuccess } from './credits-success';

describe('CreditsSuccess', () => {
    let component: CreditsSuccess;
    let fixture: ComponentFixture<CreditsSuccess>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CreditsSuccess],
        }).compileComponents();

        fixture = TestBed.createComponent(CreditsSuccess);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
