import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Sidebar } from '../../layout/sidebar/sidebar';

@Component({
    selector: 'app-cgv',
    imports: [RouterLink, Sidebar],
    templateUrl: './cgv.html',
    styleUrl: './cgv.scss',
})
export class Cgv implements OnInit {
    constructor() {}

    ngOnInit() {}
}
