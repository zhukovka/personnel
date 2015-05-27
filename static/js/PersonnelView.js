function PersonnelView(opts) {
    this.collection = {};
    opts.collection.forEach(function(worker) {
        if (!this.collection[worker.team]) {
            this.collection[worker.team] = {};

        }
        if (this.collection[worker.team]) {
            if (worker.position == 'Director') {
                this.collection[worker.team].director = new WorkerView({
                    model: worker
                });
            } else if (worker.position == 'Line Manager') {
                if (!this.collection[worker.team].subdivisions) {
                    this.collection[worker.team].subdivisions = {};
                }
                if (!this.collection[worker.team].subdivisions[worker.subdivision]) {
                    this.collection[worker.team].subdivisions[worker.subdivision] = {};
                }
                this.collection[worker.team].subdivisions[worker.subdivision].lineManager = new WorkerView({
                    model: worker
                });
            } else {
                if (!this.collection[worker.team].subdivisions[worker.subdivision].lineWorkers) {
                    this.collection[worker.team].subdivisions[worker.subdivision].lineWorkers = [];
                }
                this.collection[worker.team].subdivisions[worker.subdivision].lineWorkers.push(new WorkerView({
                    model: worker
                }));
            }
        }

    }, this);
    this.el = opts.el || document.createElement('div');
    this.$el = $(this.el);
    if (opts.className) {
        this.$el.addClass(opts.className);
    }
    this.template = opts.template;

}

// PersonnelView.prototype = Object.create(View);

PersonnelView.prototype.renderCollection = function(collection) {
    console.log('collection', collection);
    this.$el.html('');
    var subdivisionsDiv, teamFragment, directorDiv,
        template = this.template,
        renderedWorkerViews = [];


    Object.keys(collection).forEach(function(team, index) {
        teamFragment = document.createDocumentFragment();
        subdivisionsDiv = document.createElement('div');
        directorDiv = document.createElement('div');

        var subdivisions = Object.keys(collection[team].subdivisions);
        $(subdivisionsDiv).addClass('subdivisions row');
        $(directorDiv).addClass('director');
        $(directorDiv).append(collection[team].director.render(template));
        renderedWorkerViews.push(collection[team].director);

        $(teamFragment).append(directorDiv);

        subdivisions.forEach(function(subdivision, index) {

            var managerDiv = document.createElement('div'),
                workersDiv = document.createElement('div');
            $(managerDiv).addClass('linemanager large-' + 12 / subdivisions.length + ' columns');
            $(managerDiv).append(collection[team].subdivisions[subdivision].lineManager.render(template));
            renderedWorkerViews.push(collection[team].subdivisions[subdivision].lineManager);

            $(workersDiv).addClass('lineworkers');

            collection[team].subdivisions[subdivision].lineWorkers.forEach(function(worker, index) {
                worker.$el.addClass('lineworker');
                $(workersDiv).append(worker.render(template));
                renderedWorkerViews.push(worker);

            });

            $(managerDiv).append(workersDiv);
            $(subdivisionsDiv).append(managerDiv);

        }, this);

        $(teamFragment).append(subdivisionsDiv);
        this.$el.append(teamFragment);
    }, this);

    renderedWorkerViews.forEach(function(view, index) {
        view.renderChart();
    });

    return renderedWorkerViews;
};