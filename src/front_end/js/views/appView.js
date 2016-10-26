var app = app || {};
app.AppView = Backbone.View.extend({

    el: '#book-app',

    templates: window.templates,

    user: {
        token: sessionStorage.getItem('token'),
        user_name: sessionStorage.getItem('user_name')
    },
    
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
    },

    switchUserView: function (){
        $('#nav-mobile').html(this.templates.render('navigation-bar', this.user));
        $('.modal-trigger').leanModal();

    },
    
    renderUserConfig: function(){
        if(this.user.token){
            this.$el.append('<style></style>').html(this.templates.render('navigation-bar', this.config.attributes))
        } else {
           this.$el.remove('style').remove();
        }
    }


});