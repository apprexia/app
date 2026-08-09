import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Sidebar } from '../../layout/sidebar/sidebar';

@Component({
    selector: 'app-terms',
    imports: [RouterLink, Sidebar],
    templateUrl: './terms.html',
    styleUrl: './terms.scss',
})
export class Terms {}
