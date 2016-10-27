var app = app || {};

app.AppView = Backbone.View.extend({

    el: '#book-app',

    templates: window.templates,

    events: {
        'click .go-back': 'render',
        'click .registration': 'renderRegistrationForm',
        'click #save': 'saveConfig'
    },

    initialize: function () {
        this.render()
    },

    render: function () {
        //TODO: chage template for logged user
        this.$el.find('.app-body').html(this.templates.render('hello', {greet: 'hello world'}));
        this.$el.find('#nav-mobile').html(this.templates.render('navigation-bar', this.getUser()));
        this.applyStyles();
        $('.modal-trigger').leanModal();
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
    
    applyStyles: function(){
        if(this.getUser().token){
            $.ajax({
                url: '/config',
                method: 'GET',
                headers:{
                    token: this.getUser().token
                }
            }).done(function (data) {
                BookApplication.$el.find('style').html(BookApplication.templates.render('config-styles', data))
            }).fail(function (error) {
                alert('Server not respond!');
            });
            
        } else {
           this.$el.find('style').html('');
        }
    },

    saveConfig: function(){
        var newConfig = {
            hOne: {
                color: this.$el.find('.hOne input[name="color"]').val(),
                fontSize: this.$el.find('.hOne input[name="fontSize"]').val()
            },
            hTwo: {
                color: this.$el.find('.hTwo input[name="color"]').val(),
                fontSize: this.$el.find('.hTwo input[name="fontSize"]').val()
            },
            p: {
                marginTop: this.$el.find('.paragraph input[name="marginTop"]').val(),
                marginBottom: this.$el.find('.paragraph input[name="marginBottom"]').val(),
                color: this.$el.find('.paragraph input[name="color"]').val(),
                fontSize: this.$el.find('.paragraph input[name="fontSize"]').val()
            }
        };

        $.ajax({
            url: '/config',
            method: 'POST',
            headers:{
                token: this.getUser().token
            },
            data: {
                config: newConfig
            }
        }).done(function (data) {
            alert(data.message);
            BookApplication.applyStyles();
        }).fail(function (error) {
            alert('Server not respond!');
        });

    }


});