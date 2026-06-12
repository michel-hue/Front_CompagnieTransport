import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/ssr';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { appConfig } from './app.config';
import { ServerInterceptor } from './core/interceptors/server.interceptor';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerInterceptor,
      multi: true,
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
