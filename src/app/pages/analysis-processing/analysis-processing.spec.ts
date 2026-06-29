import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisProcessing } from './analysis-processing';

describe('AnalysisProcessing', () => {
    let component: AnalysisProcessing;
    let fixture: ComponentFixture<AnalysisProcessing>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AnalysisProcessing],
        }).compileComponents();

        fixture = TestBed.createComponent(AnalysisProcessing);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
