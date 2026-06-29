import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserProfile } from '../../models/user.model';


@Service()
export class UserService {
    private http = inject(HttpClient);

    private apiUrl = 'http://localhost:3000';

    getMe() {
        return this.http.get<UserProfile>(`${this.apiUrl}/users/me`);
    }
}
