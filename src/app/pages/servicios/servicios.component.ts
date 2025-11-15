import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './servicios.component.html'
})
export class ServiciosComponent {
  servicios: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>('http://localhost:3000/api/servicios', { headers }).subscribe({
      next: res => this.servicios = res,
      error: err => console.error('❌ Error al cargar servicios:', err)
    });
  }
}
