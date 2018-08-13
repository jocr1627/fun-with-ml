import { NgModule } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LineChartComponent } from './line-chart.component';

@NgModule({
  declarations: [LineChartComponent],
  exports: [LineChartComponent],
  imports: [NgxChartsModule]
})
export class LineChartModule {}
