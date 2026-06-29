import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-auth-success',
    imports: [],
    templateUrl: './auth-success.html',
    styleUrl: './auth-success.scss',
})
export class AuthSuccess implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private platformId = inject(PLATFORM_ID);
    protected energy = signal(0);
    protected status = signal('SYSTEM ONLINE');
    protected isAuthorized = signal(false);
    protected backgroundPosition = signal('0px 0px, 0px 0px');

    ngOnInit(): void {
        const token = this.route.snapshot.queryParamMap.get('token');
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        if (token) {
            localStorage.setItem('token', token);
        }
        this.authorize();
    }

    onMouseMove(event: MouseEvent): void {
        const x = event.clientX / window.innerWidth;
        const y = event.clientY / window.innerHeight;

        this.backgroundPosition.set(`${x * 200}px ${y * 200}px, ${x * 200}px ${y * 200}px`);
    }

    authorize(): void {
        this.status.set('AUTHORIZING');

        const interval = setInterval(() => {
            const value = this.energy() + 1;

            this.energy.set(value);

            this.status.set(`AUTHORIZING ${value}%`);

            if (value >= 100) {
                clearInterval(interval);

                this.status.set('ACCESS GRANTED');

                this.isAuthorized.set(true);

                setTimeout(() => {
                    this.router.navigate(['/account']);
                }, 1000);
            }
        }, 40);
    }
}
