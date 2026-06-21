import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInfo } from './modal-info';

describe('ModalInfo', () => {
    let component: ModalInfo;
    let fixture: ComponentFixture<ModalInfo>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ModalInfo],
        }).compileComponents();

        fixture = TestBed.createComponent(ModalInfo);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
