import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponsiveGridComponent } from './responsive-grid.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ResponsiveGridComponent],
  exports: [ResponsiveGridComponent],
})
export class ResponsiveGridModule {}
