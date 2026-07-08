import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-login',
    imports: [RouterLink],
    templateUrl: './login.html',
    styleUrl: './login.scss',
})
export class Login implements OnInit {
    private router = inject(Router);

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

    ngOnInit() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const token = localStorage.getItem('token');
        if (token) {
            this.router.navigate(['/analyze-list']);
        }
    }

    loginWithGoogle() {
        window.location.href = 'http://localhost:3000/auth/google';
    }

    loginWithX() {
        window.location.href = 'http://localhost:3000/auth/x';
    }
}
