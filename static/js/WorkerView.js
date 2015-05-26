function WorkerView(opts) {

    this.model = opts.model;
    this.id = this.model.id;
    this.el = opts.el || document.createElement('div');
    this.$el = $(this.el);

    this.$el.addClass('row worker');

    if (opts.className) {
        this.$el.addClass(opts.className);
    }

    this.model.imgPath = this.model.name + this.model.lastname.replace("'", "") + '.jpg';

    if (this.model.tasks) {

        var overdue = this.model.tasks.overdue || '',
            done = this.model.tasks.done || 0,
            inprogress = this.model.tasks.inprogress || 0;

        var chart = {
            id: this.model.id,
            type: 'doughnut2d',
            renderAt: 'chart' + this.model.name + this.model.lastname,
            width: '100%',
            height: '150',
            dataFormat: 'json',
            dataSource: {
                "chart": {
                    // "caption": "",
                    // "subCaption": "",
                    // "numberPrefix": "",
                    "paletteColors": "#ffffff, #1aaf5d,#f2c500,#f45b00,#8e0000",
                    "bgColor": "#ffffff",
                    "showBorder": "0",
                    "use3DLighting": "0",
                    "showShadow": "0",
                    "enableSmartLabels": "0",
                    "startingAngle": "90",
                    "showLabels": "1",
                    "useDataPlotColorForLabels": "1",
                    // "showPercentValues": "1",
                    // "showLegend": "1",
                    "legendShadow": "0",
                    "legendBorderAlpha": "0",
                    "defaultCenterLabel": overdue + '',
                    "centerLabel": "$value",
                    "centerLabelBold": "1",
                    "showTooltip": "0",
                    "decimals": "0",
                    "captionFontSize": "14",
                    "subcaptionFontSize": "14",
                    "subcaptionFontBold": "0",
                    "labelDistance": "-20",
                    "pieRadius": "50"
                },
                "data": [{
                    "value": Math.max(10 - (done + inprogress + overdue), 0)
                }]

            }
        };

        if (done) {
            chart.dataSource["data"].push({
                // "label": "Done",
                "value": done
            });
        }
        if (inprogress) {
            chart.dataSource["data"].push({
                // "label": "In progress",
                "value": inprogress
            });
        }
        if (overdue) {
            this.$el.addClass('overdue');
            chart.dataSource["data"].push({
                // "label": "Overdue",
                "value": overdue
            });
        }

        this.chart = new FusionCharts(chart);
    }
}

WorkerView.prototype = Object.create(View);
WorkerView.prototype.renderChart = function() {
    if (this.chart) {

        this.chart.render();
    }
};