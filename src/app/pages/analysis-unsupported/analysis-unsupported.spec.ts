import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisUnsupported } from './analysis-unsupported';

describe('AnalysisUnsupported', () => {
    let component: AnalysisUnsupported;
    let fixture: ComponentFixture<AnalysisUnsupported>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AnalysisUnsupported],
        }).compileComponents();

        fixture = TestBed.createComponent(AnalysisUnsupported);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
