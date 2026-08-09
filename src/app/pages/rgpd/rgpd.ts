import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Sidebar } from '../../layout/sidebar/sidebar';

@Component({
    selector: 'app-rgpd',
    imports: [RouterLink, Sidebar],
    templateUrl: './rgpd.html',
    styleUrl: './rgpd.scss',
})
export class Rgpd {}
