import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormProperty } from './modal-form-property';

describe('ModalFormProperty', () => {
    let component: ModalFormProperty;
    let fixture: ComponentFixture<ModalFormProperty>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ModalFormProperty],
        }).compileComponents();

        fixture = TestBed.createComponent(ModalFormProperty);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
