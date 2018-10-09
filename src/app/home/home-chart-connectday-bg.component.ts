import { Component, ElementRef, EventEmitter, Input, OnInit} from '@angular/core';

declare const d3: any;

@Component({
  selector: 'svg-chart-connectday-bg',
  template: `<svg id="svgConnectdayChartBg" [style.width.px]="options.width" [style.height.px]="options.height"></svg>`,
  inputs: ['chartData', 'options', 'margin'],
  outputs:['complete']
})
export class HomeChartConnectdayBgComponent implements OnInit {

  chartData:any = [];
  options = { width: 100, height: 100};
  margin = { top: 0, right: 0, bottom: 0, left: 0 };
  complete = new EventEmitter<any>();

  ngOnInit() {
    this.drawChart();
  }

  drawChart() {

    let scope = this;
    let data =this.chartData.concat();    
    
    if (!data) {
      console.log('This is no valid data');
      return;
    }
    
    let svgBg = d3.select("#svgConnectdayChartBg"),
      height = + this.options.height - this.margin.top - this.margin.bottom,
      g = svgBg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    //let parseUTCTime = d3.utcParse("%Y-%m-%d");
    let parseTime = d3.timeParse("%Y-%m-%d");
    data.forEach(function(d) {
      d.total_count = +d.total_count;
    });

    let y = d3.scaleLinear().rangeRound([height, 0]);
    y.domain(d3.extent(data, function(d) { return d.total_count; }));

    g.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Hits");
  }

  onComplete() {
    this.complete.emit(null);
  }
}