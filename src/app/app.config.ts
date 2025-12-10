import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withInMemoryScrolling, withPreloading } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { environment } from '../environment/environment';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { withComponentInputBinding } from '@angular/router';
import { withInterceptors } from '@angular/common/http';


import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {
  withAutoRefreshToken,
  provideKeycloak,
  AutoRefreshTokenService,
  UserActivityService,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  createInterceptorCondition,
  IncludeBearerTokenCondition,
  includeBearerTokenInterceptor
} from 'keycloak-angular';

const urlCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: new RegExp(`^(${environment.apiServiceUrl})(/.*)?$`, 'i'),
  bearerPrefix: 'Bearer'
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideToastr(),
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withFetch()),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideKeycloak({
      config:{
        url:environment.keycloak.url,
        realm:environment.keycloak.realm,
        clientId:environment.keycloak.clientId,
      },

      initOptions:{
        onLoad:'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      },

      features:[
        withAutoRefreshToken({
          onInactivityTimeout:'logout',
          sessionTimeout:360000,
        }),
      ],
      providers:[
        AutoRefreshTokenService,
        UserActivityService,
        {
          provide:INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
          useValue:[urlCondition],
        },
      ],
    }),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({
        anchorScrolling:'enabled',
        scrollPositionRestoration:'enabled',
      }),
      withComponentInputBinding(),
    ),
    provideHttpClient(withInterceptors([includeBearerTokenInterceptor])),
  ]
};


