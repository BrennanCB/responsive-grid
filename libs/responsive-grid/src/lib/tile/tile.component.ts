import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'bcb-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
})
export class TileComponent implements AfterViewInit, OnChanges {
  @ViewChild('backdrop', { static: true })
  private _backdropElement?: ElementRef<HTMLDivElement>;

  private readonly _minSizeMap: { [key: number]: number } = {
    2: 265,
    3: 265,
    4: 265,
  };

  private _prevClass = '';

  @Input() public cols = 0;
  @Input() public innerCols = 0;

  public innerColsToApply = 0;
  public amountOfBackDropCols: unknown[] = [];

  constructor(
    private _renderer: Renderer2,
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef<HTMLElement>
  ) {}

  private setCorrectCols(cols: number): void {
    const minColes = this._elementRef.nativeElement.offsetWidth / cols;
    const requiredSize = this._minSizeMap[cols];

    console.log(cols, minColes, requiredSize);

    if (minColes >= requiredSize) {
      this.innerColsToApply = cols;

      console.log('a size fits');

      if (cols === this.innerCols) {
        this._renderer.setStyle(
          this._elementRef.nativeElement,
          'height',
          '64px'
        );
      } else {
        if (cols % 2 !== 0) {
          console.log('odd?');
          this._renderer.setStyle(
            this._elementRef.nativeElement,
            'height',
            `${64 * this.innerCols}px`
          );
          this.innerColsToApply = 1;
        } else {
          const colsForCalcs: number = this.innerCols / cols;

          this._renderer.setStyle(
            this._elementRef.nativeElement,
            'height',
            `${64 * colsForCalcs}px`
          );
          this.innerColsToApply = colsForCalcs;

          console.log(this.innerColsToApply);
        }
      }

      this._prevClass = `rds-tile-col-${this.innerColsToApply}`;

      return;
    }

    if (cols % 2 !== 0) {
      this._renderer.setStyle(
        this._elementRef.nativeElement,
        'height',
        `${64 * this.innerCols}px`
      );
      this.innerColsToApply = 1;
      this._prevClass = `rds-tile-col-${this.innerColsToApply}`;

      return;
    }

    this.setCorrectCols(cols / 2);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this._changeDetectorRef.detectChanges();
      this.setItemPosition();
    }, 2000);
  }

  public setItemPosition(): void {
    this.amountOfBackDropCols = new Array(this.innerCols);

    // if (!this._elementRef.nativeElement.offsetWidth) return;

    if (this._prevClass)
      this._renderer.removeClass(
        this._backdropElement?.nativeElement,
        this._prevClass
      );
    this._prevClass = '';

    this.setCorrectCols(this.innerCols);
    console.log(this.innerColsToApply);

    this._renderer.addClass(
      this._backdropElement?.nativeElement,
      this._prevClass
    );
    this._changeDetectorRef.markForCheck();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.cols?.currentValue || changes.innerCols?.currentValue)
      this.setItemPosition();
  }
}
