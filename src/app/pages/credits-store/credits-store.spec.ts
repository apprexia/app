import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditsStore } from './credits-store';

describe('CreditsStore', () => {
    let component: CreditsStore;
    let fixture: ComponentFixture<CreditsStore>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CreditsStore],
        }).compileComponents();

        fixture = TestBed.createComponent(CreditsStore);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
