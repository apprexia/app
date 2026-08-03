import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircularScore } from './circular-score';

describe('CircularScore', () => {
    let component: CircularScore;
    let fixture: ComponentFixture<CircularScore>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CircularScore],
        }).compileComponents();

        fixture = TestBed.createComponent(CircularScore);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
