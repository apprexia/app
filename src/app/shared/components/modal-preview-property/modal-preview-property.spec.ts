import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPreviewProperty } from './modal-preview-property';

describe('ModalPreviewProperty', () => {
    let component: ModalPreviewProperty;
    let fixture: ComponentFixture<ModalPreviewProperty>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ModalPreviewProperty],
        }).compileComponents();

        fixture = TestBed.createComponent(ModalPreviewProperty);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
