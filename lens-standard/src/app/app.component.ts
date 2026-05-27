import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="flex min-h-screen bg-dark-900">
      <app-sidebar />
      <main class="flex-1 ml-64 overflow-auto">
        <router-outlet />
      </main>
    </div>
  `,
  styles: []
})
export class AppComponent {}
