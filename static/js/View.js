var View = {
    render: function(tpl) {
        var template = tpl || this.template;
        var html = Handlebars.compile(template);
        this.$el.html(html(this.model));
        return this.$el;
    }
};

PopupView = {
    el: document.createElement('div'),
    get $el() {
        return $(this.el);
    },
    render: function(dailyData) {

        var popup = $('#taskdetails'),
            cols = [],
            removed = false,
            row = 0,
            data = [dailyData.dayNumbers].concat(dailyData.taskProgress);

        popup.show();

        if (dailyData) {
            for (var i = 0; i < dailyData.dayNames.length; i++) {
                cols.push({
                    renderer: "html"
                });
            }
        }

        function firstRowRenderer(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            td.style.fontWeight = 'bold';
            td.style.color = 'green';
            td.style.background = '#CEC';
        }

        popup.handsontable({
            data: data,
            // minSpareRows: 1,
            // rowHeaders: true,
            colHeaders: dailyData.dayNames,
            cells: function(row, col, prop) {
                var cellProperties = {};
                if (row === 0) {
                    cellProperties.renderer = firstRowRenderer; // uses function directly
                } else if (row < data.length) {
                    cellProperties.renderer = 'html';
                }
                return cellProperties;
            },
            // columns: cols,
            contextMenu: true,
            width: 200,
            // manualColumnMove: true,
            // manualRowMove: true,
            disableVisualSelection: true,

            afterRender: function(e) {
                var self = this;
                var tbody = $(this.rootElement).find('.htCore tbody').first();
                console.log('rendered', this);
                tbody.sortable({
                    // helper: fixHelperModified,
                    connectWith: tbody,
                    handle: ".dragging-handler",
                    sort: function(event, ui) {

                        if (ui.offset.top >= $(this).height() - ui.item.height() + $(this).offset().top) {
                            if (!removed) {

                                console.log('selfcountRows()', self.countRows());

                                removed = true;
                            }
                        }
                    },
                    start: function(event, ui) {
                        row = $('tr').index(ui.item);
                        console.log('START', row);
                    },
                    stop: function(event, ui) {
                        if (removed) {
                            ui.item.remove();
                            removed = false;
                        }
                        console.log('STOP');
                        // if (out) {
                        //     ui.item.remove();
                        // } else {
                        //     // renumber_table('#diagnosis_list');
                        // }
                    },
                    out: function(event, ui) { /*out=true;*/
                        console.log('OUT');
                    },
                    over: function(event, ui) {
                        console.log('OVER');
                    }
                }).disableSelection();
            }
        });

        return $('#taskdetails');
    }
};