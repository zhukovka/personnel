jQuery(document).ready(function($) {
    PopupView.template = $('#popupTemplate').html();
    var personnelView = new PersonnelView({
        collection: data,
        el: $('#personnel'),
        template: $('#workerTemplate').html()
    });
    var collection = personnelView.collection,
        renderedWorkerViews;

    renderedWorkerViews = personnelView.renderCollection(personnelView.collection);

    $('#team-filter').change(function(event) {
        /* Act on the event */
        var filter = $(this).find('option:selected').val();
        if (filter == 'all') {
            renderedWorkerViews = personnelView.renderCollection(collection);
        } else {
            var filteredCollection = {};
            filteredCollection[filter] = collection[filter];
            renderedWorkerViews = personnelView.renderCollection(filteredCollection);
        }
    });

    $('body').on('mouseup', function(event) {
        event.preventDefault();
        var popup = $(this).find('#taskdetails:visible');
        if (popup.length && !$(popup).has(event.target).length) {
            $('.clicked').removeClass('clicked');
            popup.handsontable('destroy');
            popup.hide();
        }
    });


});