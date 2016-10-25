var app = app || {};
app.AppView = Backbone.View.extend({

    el: '#book-app',

    templates: window.templates,

    initialize: function () {
        this.render()
    },

    render: function () {
        this.$el.find('.app-body').html(this.templates.render('hello', {greet: 'hello world'}));
    }

});