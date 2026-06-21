import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyzisInput } from './analyzis-input';

describe('AnalyzisInput', () => {
    let component: AnalyzisInput;
    let fixture: ComponentFixture<AnalyzisInput>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AnalyzisInput],
        }).compileComponents();

        fixture = TestBed.createComponent(AnalyzisInput);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
