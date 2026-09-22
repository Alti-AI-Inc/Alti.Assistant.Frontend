const fs = require('fs');
const file = 'src/app/(protected)/c/[id]/_components/TradingViewNativeWidget.tsx';
let code = fs.readFileSync(file, 'utf8');

// Update imports
code = code.replace(
  "import { createChart, ColorType, CrosshairMode } from 'lightweight-charts';",
  "import { createChart, ColorType, CrosshairMode, CandlestickSeries, AreaSeries, HistogramSeries, LineSeries } from 'lightweight-charts';"
);

// Update addSeries
code = code.replace("chart.addCandlestickSeries({", "chart.addSeries(CandlestickSeries, {");
code = code.replace("chart.addAreaSeries({", "chart.addSeries(AreaSeries, {");
code = code.replace("chart.addHistogramSeries({", "chart.addSeries(HistogramSeries, {");
code = code.replace("chart.addLineSeries({", "chart.addSeries(LineSeries, {");

fs.writeFileSync(file, code);
