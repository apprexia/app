import { Component, input } from '@angular/core';

@Component({
    selector: 'app-title-info-tooltip',
    imports: [],
    templateUrl: './title-info-tooltip.html',
    styleUrl: './title-info-tooltip.scss',
})
export class TitleInfoTooltip {
    label = input<string>('');
    text = input<string>('');
    formula = input<string>('');
    class = input<string>('');
}
