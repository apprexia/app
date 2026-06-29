import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-login',
    imports: [RouterLink],
    templateUrl: './login.html',
    styleUrl: './login.scss',
})
export class Login implements OnInit {
    private router = inject(Router);

    ngOnInit() {
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
