import { Component, Input } from '@angular/core';

@Component({
  selector: 'line-chart',
  styleUrls: ['./line-chart.component.scss'],
  templateUrl: './line-chart.component.html'
})
export class LineChartComponent<T> {
  @Input()
  data: {
    name: string;
    series: { name: string; value: number }[];
  }[] = [];

  public view: [number, number] = [700, 400];
}
