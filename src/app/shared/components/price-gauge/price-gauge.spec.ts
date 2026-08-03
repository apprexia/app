import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceGauge } from './price-gauge';

describe('PriceGauge', () => {
    let component: PriceGauge;
    let fixture: ComponentFixture<PriceGauge>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PriceGauge],
        }).compileComponents();

        fixture = TestBed.createComponent(PriceGauge);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
