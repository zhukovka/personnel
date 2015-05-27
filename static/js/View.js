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
        var cols = [];
        if (dailyData) {
            for (var i = 0; i < dailyData[0].length; i++) {
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

        $('#taskdetails').handsontable({
            data: dailyData,
            // minSpareRows: 1,
            rowHeaders: true,
            cells: function(row, col, prop) {
                var cellProperties = {};
                if (row === 0) {
                    cellProperties.renderer = firstRowRenderer; // uses function directly
                }
                return cellProperties;
            },
            columns: cols,
            contextMenu: true,
            width: 200
        });

        return $('#taskdetails');
    }
};