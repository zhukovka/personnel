jQuery(document).ready(function($) {

    var personnelView = new PersonnelView({
        collection: data,
        el: $('#personnel'),
        template: $('#workerTemplate').html()
    });
    var collection = personnelView.collection;
    personnelView.renderCollection(personnelView.collection);

    $('#team-filter').change(function(event) {
        /* Act on the event */
        var filter = $(this).find('option:selected').val(),
            renderedIDs;
        if (filter == 'all') {
            renderedIDs = personnelView.renderCollection(collection);
        } else {
            var filteredCollection = {};
            filteredCollection[filter] = collection[filter];
            renderedIDs = personnelView.renderCollection(filteredCollection);
        }
        console.log('this', filter);
        var i = 0;
        for (; id = renderedIDs[i++];) {
            if (FusionCharts.items[id]) {
                FusionCharts.items[id].render();
            }
        };

    });


    console.log(personnelView);

    FusionCharts.ready(function() {
        for (var item in FusionCharts.items) {
            FusionCharts(item).render();
        }
    });
});