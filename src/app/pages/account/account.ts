import { Component, OnInit, signal } from '@angular/core';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user/user';
import { UserProfile } from '../../core/models/user.model';

@Component({
    selector: 'app-account',
    imports: [Sidebar],
    templateUrl: './account.html',
    styleUrl: './account.scss',
})
export class Account implements OnInit {
    user = signal<UserProfile | null>(null);

    constructor(
        private userService: UserService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.getMe();
    }

    getMe() {
        this.userService.getMe().subscribe((user: UserProfile) => {
            this.user.set(user);
        });
    }

    logout() {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }
}
