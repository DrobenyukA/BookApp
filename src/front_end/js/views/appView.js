var app = app || {};
app.AppView = Backbone.View.extend({

    el: '#book-app',

    templates: window.templates,

    events: {
        'click .registration': 'renderRegistrationForm',
        'click .go-back': 'render'
    },

    initialize: function () {
        this.render()
    },

    render: function () {
        this.$el.find('.app-body').html(this.templates.render('hello', {greet: 'hello world'}));
    },
    
    renderRegistrationForm: function(){
        var template = this.templates.get('registration-form');
        this.$el.find('.app-body').html(template);
    }

});