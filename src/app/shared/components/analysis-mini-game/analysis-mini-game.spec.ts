import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisMiniGame } from './analysis-mini-game';

describe('AnalysisMiniGame', () => {
    let component: AnalysisMiniGame;
    let fixture: ComponentFixture<AnalysisMiniGame>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AnalysisMiniGame],
        }).compileComponents();

        fixture = TestBed.createComponent(AnalysisMiniGame);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
