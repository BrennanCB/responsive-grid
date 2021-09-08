import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { LayoutService, ViewMode } from '@responsive-grid/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'bcb-responsive-grid',
  templateUrl: './responsive-grid.component.html',
  styleUrls: ['./responsive-grid.component.scss']
})
export class ResponsiveGridComponent implements OnInit, OnDestroy {
  private _destroy$: Subject<void> = new Subject();

  public viewMode: ViewMode = 'sm';

  constructor(
    private _layoutService: LayoutService,
    private _cd: ChangeDetectorRef
  ) { }

  public ngOnInit(): void {
    this._layoutService.breakpointChanges().pipe(
      takeUntil(this._destroy$)
    ).subscribe(mode => {
      this.viewMode = mode;
      this._cd.markForCheck();
    });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
