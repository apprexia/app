import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserProfile } from '../../models/user.model';
import { environment } from '../../../../environments/environment';


@Service()
export class UserService {
    private http = inject(HttpClient);

    private apiUrl = environment.apiUrl;

    getMe() {
        return this.http.get<UserProfile>(`${this.apiUrl}/users/me`);
    }
}
