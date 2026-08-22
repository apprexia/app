import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAnalyses } from './admin-analyses';

describe('AdminAnalyses', () => {
    let component: AdminAnalyses;
    let fixture: ComponentFixture<AdminAnalyses>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AdminAnalyses],
        }).compileComponents();

        fixture = TestBed.createComponent(AdminAnalyses);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
