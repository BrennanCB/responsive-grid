import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { ResizeObserver } from '@juggle/resize-observer';
import { Dictionary } from '@responsive-grid/abstractions';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ViewMode } from './types/view-mode.type';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  private readonly _breakpoints: Dictionary<ViewMode> = {
    '(max-width: 599px)': 'xs',
    '(min-width: 600px) and (max-width: 767px)': 'sm',
    '(min-width: 768px) and (max-width: 959px)': 'md',
    '(min-width: 960px) and (max-width: 1359px)': 'lg',
    '(min-width: 1360px) and (max-width: 1919px)': 'xl',
    '(min-width: 1920px)': 'xxl'
  };

  private _activeBreakpoint?: ViewMode = undefined;

  constructor(
    private _breakpointObserver: BreakpointObserver
  ) { }

  private parseBreakpoints(breakpoints: Dictionary<boolean>): ViewMode {
    this._activeBreakpoint = undefined;
    const breakpointKeys: string[] = Object.keys(breakpoints);

    for (let i = 0; i < breakpointKeys.length; i++) {
      if (breakpoints[breakpointKeys[i]]) {
        this._activeBreakpoint = this._breakpoints[breakpointKeys[i]];
        break;
      }
    }

    return this._activeBreakpoint ?? 'xs';
  }

  public relativeBreakpointChanges(observedElement: HTMLElement, debounce: number = 50): Observable<ViewMode> {
    return new Observable<ViewMode>(observer => {
      const resizeObserver: ResizeObserver = new ResizeObserver(entries => {
        let viewMode: ViewMode = 'xs';
        const width: number = entries[0].contentRect.width;

        if (width <= 599) {
          viewMode = 'xs';
        } else if (width > 599 && width <= 767) {
          viewMode = 'sm';
        } else if (width > 767 && width <= 959) {
          viewMode = 'md';
        } else if (width > 959 && width <= 1359) {
          viewMode = 'lg';
        } else if (width > 1359 && width <= 1919) {
          viewMode = 'xl';
        } else if (width > 1919) {
          viewMode = 'xxl';
        }

        observer.next(viewMode);
      });

      resizeObserver.observe(observedElement);
      return () => resizeObserver.disconnect();
    }).pipe(
      debounceTime(debounce),
      distinctUntilChanged()
    );
  }

  /**
   * Listen to the normal bootstrap breakpoints. This will return the current breakpoint
   * 'xs', 'sm', 'md', 'lg' and 'xl'.
   */
  public breakpointChanges(): Observable<ViewMode> {
    return this._breakpointObserver
      .observe(Object.keys(this._breakpoints))
      .pipe(
        map(response => this.parseBreakpoints(response.breakpoints))
      );
  }

  /**
   * Returns true when the breakpoint matches 'md', 'lg' or 'xl'.
   */
  public isDesktopBreakpoint(): Observable<boolean> {
    return this.breakpointChanges().pipe(
      map(viewMode => viewMode === 'md' || viewMode === 'lg' || viewMode === 'xl' || viewMode === 'xxl')
    );
  }

  /**
   * Returns true when the breakpoint matches 'xs' or 'sm'.
   */
  public isMobileBreakpoint(): Observable<boolean> {
    return this.breakpointChanges().pipe(
      map(viewMode => viewMode === 'xs' || viewMode === 'sm')
    );
  }

  /**
   * Returns true if the current active breakpoint matched the argument.
   */
  public isBreakpointActive(breakpoint: string): boolean {
    return this._activeBreakpoint === breakpoint;
  }
}
