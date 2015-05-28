var View = {
    render: function(tpl) {
        var template = tpl || this.template;
        var html = Handlebars.compile(template);
        this.$el.html(html(this.model));
        var self = this;
        this.$el.on('click', '.worker-photo', function(event) {
            event.preventDefault();
            /* Act on the event */
            if (self.model.taski) {
                $(this).addClass('clicked');
                var offset = $(this).offset(),
                    width = $(this).width(),
                    height = $(this).height(),
                    top = offset.top,
                    left = offset.left + width;

                var popup = PopupView.render(self.dailyData).offset(function(index, currentCoordinates) {
                    console.log('left', offset.left);
                    var tableWidth = $(this).find('table').first().innerWidth();
                    if (left > $('body').width() - left) {
                        left = offset.left - tableWidth;
                        if (left < 0) {
                            left = (offset.left + width / 2) - tableWidth / 2;
                            top += height;
                        }
                    }
                    return {
                        top: top,
                        left: left
                    };
                });
            }
        });
        return this.$el;
    }
};

PopupView = {
    el: document.createElement('div'),
    get $el() {
        return $(this.el);
    },
    firstRowRenderer: function(instance, td, row, col, prop, value, cellProperties) {
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        $(td).addClass('first-row');
    },
    progressCellRenderer: function(instance, td, row, col, prop, value, cellProperties) {
        Handsontable.renderers.TextRenderer.apply(this, arguments);

        col.width = 20;
        if (value) {
            $(td).addClass('task-progress').attr('data-timestamp', value).html('');

        }
    },
    draggingHandlerCellRenderer: function(instance, td, row, col, prop, value, cellProperties) {
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        $(td).addClass('dragging-handler fa fa-bars');
    },
    render: function(dailyData) {
        var self = this,
            popup = $('#taskdetails'),
            // cols = [],
            removed = false,
            row = 0,
            last = dailyData.dayNames.length - 1,
            days = dailyData.dayNumbers.length,
            data = dailyData.data;

        popup.show();
        console.log('data', data, last);
        popup.handsontable({
            data: data,
            minSpareRows: 1,
            minSpareCols: 0,
            // rowHeaders: true,
            colWidths: function(i) {
                if (i === 0) {
                    return 40;
                } else if (i < days || i === last) {
                    return 25;
                }
            },
            autoColumnSize: true,
            colHeaders: dailyData.dayNames,
            cells: function(row, col, prop) {
                var cellProperties = {};
                if (row === 0 || col === 0) {
                    cellProperties.renderer = self.firstRowRenderer; // uses function directly
                } else if (row < data.length && col >= 1 && col < days) {
                    cellProperties.renderer = self.progressCellRenderer;
                } else if (col === last && row < data.length - 1) {
                    cellProperties.renderer = self.draggingHandlerCellRenderer;
                }
                return cellProperties;
            },
            // columns: cols,
            // minCols: dailyData.dayNames.length,
            // maxCols: dailyData.dayNames.length,
            // contextMenu: true,
            // wordWrap: true,
            // width: 200,
            // manualColumnMove: true,
            // manualRowMove: true,
            disableVisualSelection: true,

            afterRender: function(e) {
                var self = this;
                var tbody = $(this.rootElement).find('.htCore tbody').first();
                console.log('rendered', this);
                tbody.sortable({
                    // helper: fixHelperModified,
                    cursor: "move",
                    connectWith: tbody,
                    handle: ".dragging-handler",
                    sort: function(event, ui) {
                        if (ui.offset.top >= $(this).height() - ui.item.height() + $(this).offset().top) {
                            if (!removed) {
                                removed = true;
                            }
                        }
                    },
                    start: function(event, ui) {
                        row = $('tr').index(ui.item);
                    },
                    stop: function(event, ui) {
                            if (removed) {
                                ui.item.remove();
                                removed = false;
                            }
                        }
                        /*out: function(event, ui) { 
                        },
                        over: function(event, ui) {
                        }*/
                }).disableSelection();
            }
        });

        return $('#taskdetails');
    }
};