import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleInfoTooltip } from './title-info-tooltip';

describe('TitleInfoTooltip', () => {
    let component: TitleInfoTooltip;
    let fixture: ComponentFixture<TitleInfoTooltip>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TitleInfoTooltip],
        }).compileComponents();

        fixture = TestBed.createComponent(TitleInfoTooltip);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
