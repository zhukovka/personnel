var View = {
    render: function(template) {
        var html = Handlebars.compile(template);
        this.$el.html(html(this.model));
        return this.$el;
    }
};