import { AfterViewInit, Component } from '@angular/core';
import * as globals from '../../../environments/globals';
import { EChartOption } from 'echarts';
import { StatsService } from 'src/app/API/stats.service';
import * as env from 'src/environments/env';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})

export class DashboardComponent implements AfterViewInit {

  constructor(private statsService: StatsService) { }

  env = env;

  loggedUser = globals.userid;
  userType = globals.userRole;
  loadingTachos = true;
  loadingGps = true;
  loadingApplicativis = true;

  tachoOptions: EChartOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c}',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: [],
      textStyle: {
        color: 'white',
      },
    },
    series: [
      {
        name: 'Tachigrafo',
        type: 'pie',
        radius: '60%',
        center: ['50%', '50%'],
        data: []
      }
    ]
  };

  GPSOptions: EChartOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c}',
    },
    legend: {
      orient: 'vertical',
      left: 'right',
      data: [],
      textStyle: {
        color: 'white',
      },
    },
    series: [
      {
        name: 'GPS',
        type: 'pie',
        radius: '60%',
        center: ['50%', '50%'],
        data: []
      }
    ]
  };

  applicativisOptions: EChartOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c}',
    },
    legend: {
      orient: 'vertical',
      left: 'right',
      data: [],
      textStyle: {
        color: 'white',
      },
    },
    series: [
      {
        name: 'Applicativi',
        type: 'pie',
        radius: '60%',
        center: ['50%', '50%'],
        data: []
      }
    ]
  };

  ngAfterViewInit(): void {
    this.getTachos();
    this.getGps();
    this.getApplicativis();
  }

  getTachos(): void {
    this.statsService.getTachoStats().subscribe(resp => {
      resp.forEach(element => {
        this.loadingTachos = false;
        this.tachoOptions.legend.data.push(element.modello);
        this.tachoOptions.series[0].data.push({ value: element.count, name: element.modello });
      });
    });
  }

  getGps(): void {
    this.statsService.getGPSStats().subscribe(resp => {
      resp.forEach(element => {
        this.loadingGps = false;
        this.GPSOptions.legend.data.push(element.modello);
        this.GPSOptions.series[0].data.push({ value: element.count, name: element.modello });
      });
    });
  }

  getApplicativis(): void {
    this.statsService.getApplicativisStats().subscribe(resp => {
      resp.forEach(element => {
        this.loadingApplicativis = false;
        this.applicativisOptions.legend.data.push(element.tipologia);
        this.applicativisOptions.series[0].data.push({ value: element.count, name: element.tipologia });
      });
    });
  }

}
