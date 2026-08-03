import { PriceRangeChartData } from './models/price-range-chart.model';


export class PriceRangeChartUtils {
    static chartMin(data: PriceRangeChartData): number {
        const values = [
            data.askingPrice,
            data.estimatedLow,
            data.estimatedHigh,
            data.dvfPrice ?? data.estimatedLow,
        ];

        const min = Math.min(...values);

        return Math.floor(min * 0.9);
    }

    static chartMax(data: PriceRangeChartData): number {
        const values = [
            data.askingPrice,
            data.estimatedLow,
            data.estimatedHigh,
            data.dvfPrice ?? data.estimatedHigh,
        ];

        const max = Math.max(...values);

        return Math.ceil(max * 1.1);
    }

    static rangeCenter(data: PriceRangeChartData): number {
        return (data.estimatedLow + data.estimatedHigh) / 2;
    }

    static isUnderEstimated(data: PriceRangeChartData): boolean {
        return data.askingPrice < data.estimatedLow;
    }

    static isOverEstimated(data: PriceRangeChartData): boolean {
        return data.askingPrice > data.estimatedHigh;
    }
}
