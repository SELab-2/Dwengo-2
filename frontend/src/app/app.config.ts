import { routes } from './app.routes';
import { provideRouter, } from '@angular/router';
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from "@angular/common/http";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
  ]
};
