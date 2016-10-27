var app = app || {};

app.AppView = Backbone.View.extend({

    el: '#book-app',

    templates: window.templates,

    booksCollection: new app.UserBooksCollection(),

    selectedBook: null,

    selectedChapter: null,

    events: {
        'click .go-back': 'render',
        'click .registration': 'renderRegistrationForm',
        'click #save': 'saveConfig',
        'click #add-book': 'addBook',
        'click #add-paragraph': 'addParagraph',
        'click .remove-paragraph':'removeParagraph'
    },

    initialize: function () {
        this.listenTo(this.booksCollection, "update", this.render);
        this.render()
    },

    render: function () {
        var obj = this.getUser();
        obj.books = {};
        //TODO: change hello template
        this.$el.find('.app-body').html(this.templates.render('hello', {greet: 'hello world'}));
        this.$el.find('#nav-mobile').html(this.templates.render('navigation-bar', obj));
        this.applyStyles();
        this.booksCollection.fetch({beforeSend: this.setHeader});
        //modal initialization
        $('.modal-trigger').leanModal();
        // Dropdown initialization
        $('.dropdown-button').dropdown({
                inDuration: 300,
                outDuration: 225,
                constrain_width: false,
                hover: true,
                gutter: 0,
                belowOrigin: false,
                alignment: 'left'
            }
        );
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

    },

    addBook: function (){
        this.$el.find('.app-body').html(this.templates.render('book-add-template', {}));
    },

    addParagraph: function(){
        this.$el.find('#paragraphs').append(this.templates.render('template-paragraph', {}));

    },

    removeParagraph: function(event){
        event.currentTarget.parentElement.remove();
    },
    //TODO: connect this to app
    changePage: function(event){
        var data = {
            page: this.selectedBook.getPage(this.selectedChapter, parseInt(event.currentTarget.dataset.page) - 1),
            pages: this.selectedBook.getChapter(this.selectedChapter).pages.length
        };
        console.log(data);

        var template = _.template(this.$el.find('#page-content').html());

        this.$el.find('.page-content').html(template(data));
    }


});