import { Component, effect, Input, signal } from '@angular/core';

import {
    ApexAnnotations,
    ApexAxisChartSeries,
    ApexChart,
    ApexDataLabels,
    ApexGrid,
    ApexPlotOptions,
    ApexTheme,
    ApexTooltip,
    ApexXAxis,
    NgApexchartsModule,
} from 'ng-apexcharts';

export interface PriceRangeChartData {
    askingPrice: number;
    estimatedLow: number;
    estimatedHigh: number;
    dvfPrice?: number | null;
}

export type PriceRangeChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    plotOptions: ApexPlotOptions;
    dataLabels: ApexDataLabels;
    tooltip: ApexTooltip;
    annotations: ApexAnnotations;
    grid: ApexGrid;
    theme: ApexTheme;
    colors: string[];
};

@Component({
    selector: 'app-price-range-chart',
    imports: [NgApexchartsModule],
    templateUrl: './price-range-chart.html',
    styleUrl: './price-range-chart.scss',
})
export class PriceRangeChart {
    private _data = signal<PriceRangeChartData | null>(null);

    @Input()
    set data(value: PriceRangeChartData) {
        this._data.set(value);
    }

    chartOptions = signal<PriceRangeChartOptions | null>(null);

    constructor() {
        effect(() => {
            const data = this._data();

            if (data) {
                this.buildChart(data);
            }
        });
    }

    private buildChart(data: PriceRangeChartData) {
        const min = Math.floor(
            Math.min(data.askingPrice, data.estimatedLow, data.dvfPrice ?? data.estimatedLow) *
                0.85,
        );

        const max = Math.ceil(
            Math.max(data.askingPrice, data.estimatedHigh, data.dvfPrice ?? data.estimatedHigh) *
                1.15,
        );

        this.chartOptions.set({
            series: [
                {
                    name: 'Estimation Apprexia',

                    data: [
                        {
                            x: 'Valeur',

                            y: [data.estimatedLow, data.estimatedHigh],
                        },
                    ],
                },
            ],

            chart: {
                type: 'rangeBar',

                height: 180,

                background: 'transparent',

                toolbar: {
                    show: false,
                },

                animations: {
                    enabled: true,
                    speed: 800,
                },

                foreColor: '#94A3B8',
            },

            theme: {
                mode: 'dark',
            },

            colors: ['#8B5CF6'],

            plotOptions: {
                bar: {
                    horizontal: true,
                    borderRadius: 8,
                    rangeBarGroupRows: true,
                    barHeight: '15%',
                },
            },

            dataLabels: {
                enabled: false,
            },

            xaxis: {
                min,

                max,

                labels: {
                    style: {
                        colors: '#94A3B8',
                    },

                    formatter: (value) => {
                        return this.formatPrice(Number(value));
                    },
                },
            },

            grid: {
                show: true,

                borderColor: '#1E293B',

                strokeDashArray: 4,
            },

            tooltip: {
                enabled: true,

                theme: 'dark',

                y: {
                    formatter: (value) => {
                        return this.formatPrice(value);
                    },
                },
            },

            annotations: {
                xaxis: [
                    // Prix affiché

                    {
                        x: data.askingPrice,

                        borderColor: '#F8FAFC',

                        strokeDashArray: 0,

                        label: {
                            text: `Prix ${this.formatPrice(data.askingPrice)}`,

                            orientation: 'horizontal',

                            offsetY: -20,

                            style: {
                                background: '#F8FAFC',

                                color: '#0F172A',

                                fontWeight: 600,
                            },
                        },
                    },

                    // DVF

                    ...(data.dvfPrice !== null && data.dvfPrice !== undefined
                        ? [
                              {
                                  x: data.dvfPrice,

                                  borderColor: '#FF0769',

                                  strokeDashArray: 4,

                                  label: {
                                      text: `DVF ${this.formatPrice(data.dvfPrice)}`,

                                      orientation: 'horizontal',

                                      offsetY: 40,

                                      style: {
                                          background: '#FF0769',

                                          color: '#FFFFFF',

                                          fontWeight: 600,
                                      },
                                  },
                              },
                          ]
                        : []),
                ],
            },
        });
    }

    private formatPrice(value: number) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',

            currency: 'EUR',

            maximumFractionDigits: 0,
        }).format(value);
    }
}
