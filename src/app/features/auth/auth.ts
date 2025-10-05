import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class Auth {
  private router = inject(Router);

  onLogin(event: Event) {
    event.preventDefault();
    // Aquí puedes agregar tu lógica de autenticación
    // Por ahora, simplemente redirige al home
    this.router.navigate(['/home']);
  }
}
