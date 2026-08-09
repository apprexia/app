import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Sidebar } from '../../layout/sidebar/sidebar';

@Component({
    selector: 'app-cgu',
    imports: [RouterLink, Sidebar],
    templateUrl: './cgu.html',
    styleUrl: './cgu.scss',
})
export class Cgu {}
