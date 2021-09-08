import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ResponsiveGridComponent } from './responsive-grid.component';
import { TileComponent } from './tile/tile.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ResponsiveGridComponent, TileComponent],
  exports: [ResponsiveGridComponent]
})
export class ResponsiveGridModule {}
