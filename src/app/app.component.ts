import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { RouterModule, RouterOutlet, ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { delay, filter, map, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ColorModeService } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet],
  template: '<router-outlet />'
})
export class AppComponent implements OnInit {
  readonly #destroyRef = inject(DestroyRef);
  readonly #router = inject(Router);
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #titleService = inject(Title);
  readonly #colorModeService = inject(ColorModeService);
  readonly #iconSetService = inject(IconSetService);

  title = 'Standalone CoreUI App';

  constructor() {
    this.#titleService.setTitle(this.title);
    this.#iconSetService.icons = { ...iconSubset };
    this.#colorModeService.localStorageItemName.set('theme');
    this.#colorModeService.eventName.set('ThemeChange');
  }

  ngOnInit(): void {
    this.#router.events.pipe(
      takeUntilDestroyed(this.#destroyRef),
      filter(evt => evt instanceof NavigationEnd)
    ).subscribe();

    this.#activatedRoute.queryParams.pipe(
      delay(1),
      map(params => <string>params['theme']?.match(/^[A-Za-z0-9\s]+/)?.[0]),
      filter(theme => ['dark', 'light', 'auto'].includes(theme)),
      tap(theme => this.#colorModeService.colorMode.set(theme)),
      takeUntilDestroyed(this.#destroyRef)
    ).subscribe();
  }
}
