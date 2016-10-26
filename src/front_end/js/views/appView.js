var app = app || {};

app.AppView = Backbone.View.extend({

    el: '#book-app',

    templates: window.templates,

    configModel: new app.AppConfigModel(),

    events: {
        'click .go-back': 'render',
        'click .registration': 'renderRegistrationForm',
        'click #save': 'saveConfig',
    },

    initialize: function () {
        this.listenTo(this.configModel, "change", this.renderUserConfig);
        this.render()
    },

    render: function () {
        //TODO: chage template for logged user
        this.$el.find('.app-body').html(this.templates.render('hello', {greet: 'hello world'}));
        this.switchUserView();
    },

    setHeader : function (xhr){
        xhr.setRequestHeader('token', sessionStorage.getItem('token'));
    },
    
    renderRegistrationForm: function(){
        var template = this.templates.get('registration-form');
        this.$el.find('.app-body').html(template);
    },

    getUser: function() {
        return {
            token: sessionStorage.getItem('token'),
            user_name: sessionStorage.getItem('user_name')
        }
    },

    switchUserView: function (){
        this.$el.find('#nav-mobile').html(this.templates.render('navigation-bar', this.getUser()));
        $('.modal-trigger').leanModal();
        this.configModel.fetch({beforeSend : this.setHeader});
        //TODO fetch from collection
        
    },
    
    renderUserConfig: function(){
        if(this.getUser().token){
            this.$el.find('style').html(this.templates.render('config-styles', this.configModel.attributes))
        } else {
           this.$el.find('style').html('');

        }
    },

    saveConfig: function(){
        var config = {
            hOne:{
                color: this.$el.find('.hOne input[name="color"]').val(),
                fontSize: this.$el.find('.hOne input[name="fontSize"]').val()
            },
            hTwo:{
                color: this.$el.find('.hTwo input[name="color"]').val(),
                fontSize: this.$el.find('.hTwo input[name="fontSize"]').val()
            },
            p:{
                marginTop: this.$el.find('.paragraph input[name="marginTop"]').val(),
                marginBottom: this.$el.find('.paragraph input[name="marginBottom"]').val(),
                color: this.$el.find('.paragraph input[name="color"]').val(),
                fontSize: this.$el.find('.paragraph input[name="fontSize"]').val()
            }
        };
        $.ajax({
            url: '/config',
            method: 'POST',
            headers:{token: sessionStorage.getItem('token')},
            data: {config: config}
        }).done(function (data) {
            if(data.status){
                BookApplication.configModel.fetch({beforeSend : this.setHeader});
                console.log(this.configModel);
            }
            alert(data.message)
        }).fail(function (error) {
            alert('Server not respond!');
        });
    }


});