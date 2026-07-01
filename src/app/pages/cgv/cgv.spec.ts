import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cgv } from './cgv';

describe('Cgv', () => {
    let component: Cgv;
    let fixture: ComponentFixture<Cgv>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Cgv],
        }).compileComponents();

        fixture = TestBed.createComponent(Cgv);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
