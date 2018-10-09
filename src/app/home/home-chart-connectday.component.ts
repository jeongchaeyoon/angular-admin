import { Component, ElementRef, EventEmitter, Input, OnInit} from '@angular/core';

declare const d3: any;

@Component({
  selector: 'svg-chart-connectday',
  template: `<svg id="svgConnectdayChart" [style.width.px]="options.width" [style.height.px]="options.height"></svg>`,
  inputs: ['chartData', 'options', 'margin'],
  outputs:['complete']
})
export class HomeChartConnectdayComponent implements OnInit {

  chartData:any = [];
  options = { width: 100, height: 100};
  margin = { top: 0, right: 0, bottom: 0, left: 0 };
  timer: number = -1;
  complete = new EventEmitter<any>();

  ngOnInit() {
    this.drawChart();
  }

  drawChart() {

    let data =this.chartData.concat();    
    
    if (!data) {
      console.log('This is no valid data');
      return;
    }

    let scope = this;
    let svg = d3.select("#svgConnectdayChart"),
      width = + this.options.width - this.margin.left - this.margin.right,
      height = + this.options.height - this.margin.top - this.margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    //let parseUTCTime = d3.utcParse("%Y-%m-%d");
    let parseTime = d3.timeParse("%Y-%m-%d");
    data.forEach(function(d) {
      d.date = parseTime(d.date);
      d.total_count = +d.total_count;
    });

    let x = d3.scaleTime().rangeRound([0, width]);
    let y = d3.scaleLinear().rangeRound([height, 0]);

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain(d3.extent(data, function(d) { return d.total_count; }));

    let line = d3.line()
      .x(function(d) { 
        return x(d.date); })
      .y(function(d) { return y(d.total_count); });

    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .select(".domain")
      .remove();

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1)
      .attr("d", line);

    g.selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", 2)
      .attr("fill","steelblue")
      .attr("cx", function(d) { return x(d.date) })
      .attr("cy", function(d) { return y(d.total_count) });

    this.onComplete();  
  }

  onComplete() {
    this.complete.emit(null);
  }
}