import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-no-content',
    imports: [RouterLink],
    templateUrl: './no-content.html',
    styleUrl: './no-content.scss',
})
export class NoContent {
    readonly icon = input('bi-info-circle');

    readonly label = input('INFORMATION');

    readonly title = input('Aucun contenu');

    readonly highlight = input('');

    readonly description = input('');

    readonly actionLabel = input('');

    readonly actionRoute = input('');

    readonly showAction = input(true);
}
