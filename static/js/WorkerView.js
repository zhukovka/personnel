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

                    // center: ['50%', '75%']
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
            taskDays = [],
            dayNames = [""],
            dayNumbers = [""];
        this.dailyData = [dayNames, dayNumbers];

        this.model.taski.forEach(function(task, index) {
            var startDate = moment(task['startDate']);
            var dueDate = moment(task['dueDate']);
            calendarStart = Math.min(calendarStart, +startDate);
            calendarEnd = Math.max(calendarEnd, +dueDate);
            var days = dueDate.diff(startDate, 'days');
            this.dailyData.push([task.id]);
        }, this);

        calendarStart = moment(calendarStart);
        calendarEnd = moment(calendarEnd);
        var days = calendarEnd.diff(calendarStart, 'days');
        while (days >= 0) {
            taskDays.push(+calendarStart);
            calendarStart.add(1, 'd');
            days--;
        }

        taskDays.forEach(function(day, index) {
            var momDay = moment(day);
            dayNames.push(momDay.format('dd'));
            dayNumbers.push(momDay.date());
            this.model.taski.forEach(function(task, i) {
                var startDate = moment(task['startDate']);
                var dueDate = moment(task['dueDate']);
                if (momDay.isBefore(startDate) || momDay.isAfter(dueDate)) {
                    this.dailyData[(this.dailyData.length - 1) - i].push('');
                } else {
                    this.dailyData[(this.dailyData.length - 1) - i].push('<span class="task-progress"></span>');
                }
            }, this);
        }, this);
    }

    this.$el.on('click', '.worker-photo', function(event) {
        event.preventDefault();
        /* Act on the event */
        console.log('ev', event);
        $(this).addClass('clicked');
        // $(this).append(PopupView.render());
        // $('#taskdetails').highcharts(PopupView.chart);
        var top = $(this).offset().top;
        var popup = PopupView.render(self.dailyData).offset({
            top: top,
            left: 0
        });

        // console.log('this offset', );
    });
}

WorkerView.prototype = Object.create(View);
WorkerView.prototype.renderChart = function() {
    var $chart = this.$el.find('#chart' + this.model.chartname);
    if (this.chart) {
        $chart.highcharts(this.chart);
    }
};