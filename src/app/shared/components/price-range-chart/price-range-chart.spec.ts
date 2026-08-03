import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceRangeChart } from './price-range-chart';

describe('PriceRangeChart', () => {
    let component: PriceRangeChart;
    let fixture: ComponentFixture<PriceRangeChart>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PriceRangeChart],
        }).compileComponents();

        fixture = TestBed.createComponent(PriceRangeChart);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
