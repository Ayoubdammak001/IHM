import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

import { IconSetService } from '@coreui/icons-angular';
import {
  cilChatBubble,
  cilBriefcase,
  cilFolder,
  cilTask,
  cilCommentSquare,
  cilUser,
  cilSettings,
  cilCreditCard,
  cilFile,
  cilLockLocked,
  cilAccountLogout,
  cilMenu,
  cilBell,
  cilList,
  cilEnvelopeOpen,
  // Nouveaux icônes détectés dans ta dernière capture :
  cilSpeedometer,
  cilCalendar,
  cilStar,
  cilPeople,
  cilSun,
  cilMoon,
  cilContrast,

} from '@coreui/icons';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    IconSetService
  ]
}).then(appRef => {
  const iconSetService = appRef.injector.get(IconSetService);
  iconSetService.icons = {
    cilChatBubble,
    cilBriefcase,
    cilFolder,
    cilTask,
    cilCommentSquare,
    cilUser,
    cilSettings,
    cilCreditCard,
    cilFile,
    cilLockLocked,
    cilAccountLogout,
    cilMenu,
    cilBell,
    cilList,
    cilEnvelopeOpen,
    cilSpeedometer,
    cilCalendar,
    cilStar,
    cilPeople,
    cilSun,
    cilMoon,
    cilContrast,
  
  };
}).catch(err => console.error(err));
