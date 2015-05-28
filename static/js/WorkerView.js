function WorkerView(opts) {
    var self = this;
    this.model = opts.model;
    this.id = this.model.id;
    this.el = opts.el || document.createElement('div');
    this.$el = $(this.el);

    this.$el.addClass('row worker');

    if (opts.className) {
        this.$el.addClass(opts.className);
    }

    var firstLastname = this.model.name + this.model.lastname.replace("'", "");
    this.model.imgPath = firstLastname + '.jpg';
    this.model.chartname = firstLastname;

    if (this.model.tasks) {

        var overdue = this.model.tasks.overdue || 0,
            done = this.model.tasks.done || 0,
            inprogress = this.model.tasks.inprogress || 0,
            totalTasks = done + inprogress + overdue;

        this.chart = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false,
                height: 150
            },
            title: {
                text: overdue,
                align: 'center',
                verticalAlign: 'middle',
                style: {
                    "color": '#CC1000'
                },
                y: 5
            },
            tooltip: {
                pointFormat: '{point.y}'
            },
            plotOptions: {
                pie: {
                    colors: ['#FFD30D', '#FE6D18', '#CC1000'],
                    dataLabels: {
                        enabled: true,
                        distance: -12,
                        format: '{point.y}',
                        style: {
                            fontWeight: 'bold',
                            color: 'white',
                            textShadow: '0px 1px 2px black'
                        }
                    },
                    size: 100,
                    startAngle: 0,
                    endAngle: 360 * Math.min(totalTasks / 10, 1),
                }
            },
            series: [{
                type: 'pie',
                innerSize: '50%',
                data: []
            }]
        };

        if (done) {
            this.chart.series[0].data.push({
                y: done,
                name: "Done",
                color: "#FFD30D"
            });
        }
        if (inprogress) {
            this.chart.series[0].data.push({
                y: inprogress,
                name: "In progress",
                color: "#FE6D18"
            });
        }
        if (overdue) {
            this.$el.addClass('overdue');
            this.chart.series[0].data.push({
                y: overdue,
                name: 'Overdue',
                color: '#CC1000'
            });
        }


    }

    if (this.model.taski) {
        var calendarStart = +moment(),
            calendarEnd = +moment(),
            taskDays = [];
        /*dayNames = [""],
        dayNumbers = [""];*/
        this.dailyData = {
            dayNames: [""],
            dayNumbers: [""],
            tasknumber: this.model.taski,
            taskProgress: []
        };

        this.model.taski.forEach(function(task, index) {
            task['startDate'] = moment(task['startDate']);
            task['dueDate'] = moment(task['dueDate']);
            calendarStart = Math.min(calendarStart, +task['startDate']);
            calendarEnd = Math.max(calendarEnd, +task['dueDate']);
            // var days = task['dueDate'].diff(task['startDate'], 'days');
            task.days = [];
            // this.dailyData.taskProgress.push([]);
        }, this);

        calendarStart = moment(calendarStart).subtract(1, 'days');
        calendarEnd = moment(calendarEnd).add(1, 'd');
        var days = calendarEnd.diff(calendarStart, 'days');
        while (days >= 0) {
            taskDays.push(+calendarStart);
            // var momDay = moment(day);
            this.dailyData.dayNames.push(calendarStart.format('dd'));
            this.dailyData.dayNumbers.push(calendarStart.date());
            this.model.taski.forEach(function(task, i) {
                if (calendarStart.isBefore(task['startDate']) || calendarStart.isAfter(task['dueDate'])) {
                    task.days.push('');
                } else {
                    task.days.push(+calendarStart);
                }
                if (days === 0) {
                    this.dailyData.taskProgress.push([task.id].concat(task.days).concat([task.id, task.description, '']));
                }
            }, this);
            calendarStart.add(1, 'd');
            days--;
        }
        this.dailyData.dayNames = this.dailyData.dayNames.concat(['id', 'Task description', '']);
        this.dailyData.data = [this.dailyData.dayNumbers.concat(['', '', ''])].concat(this.dailyData.taskProgress);
    }
}

WorkerView.prototype = Object.create(View);
WorkerView.prototype.renderChart = function() {
    var $chart = this.$el.find('#chart' + this.model.chartname);
    if (this.chart) {
        $chart.highcharts(this.chart);
    }
};