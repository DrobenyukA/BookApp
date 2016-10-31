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
        'click #add-paragraph': 'addParagraph',
        'click .remove-paragraph':'removeParagraph',
        'click #add-book': 'addBook',
        'click .btn-book': 'showBook',
        'click #save-book': 'saveBook',
        'click .page': 'changePage'
    },

    initialize: function () {
        this.listenTo(this.booksCollection, "update", this.updateBook);
        this.render()
    },

    render: function () {
        var obj = this.getUser();
        this.$el.find('.app-body').html(this.templates.render('hello', {greet: 'hello world'}));
        this.$el.find('#nav-mobile').html(this.templates.render('navigation-bar', obj));
        this.applyStyles();
        this.booksCollection.fetch({beforeSend: this.setHeader});

        //modal initialization
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

    },

    addParagraph: function(){
        this.$el.find('#paragraphs').append(this.templates.render('template-paragraph', {}));

    },

    removeParagraph: function(event){
        event.currentTarget.parentElement.remove();
    },

    addBook: function (){
        this.$el.find('.app-body').html(this.templates.render('book-add-template', {}));
    },

    updateBook: function(){
        var books = this.booksCollection.getBooks();
        this.$el.find('.user-books').html(this.templates.render('user-books', books));
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

        this.showBook();
    },

    showBook: function (action){
        var data = {};
        try{
            data.bookId = action.currentTarget.dataset.book;
        } catch (err){
            data.bookId = _.first(this.booksCollection.models).cid;
        }
        this.selectedBook = this.booksCollection.get(data.bookId) || null;
        data.bookName = this.selectedBook.get('name');
        data.author = this.selectedBook.get('author');
        data.chapter = this.selectedBook.defaultChapter().name;
        data.page = this.selectedBook.defaultChapter().pages[0];
        data.pages = this.selectedBook.defaultChapter().pages.length;
        this.selectedChapter = this.selectedBook.defaultChapter().name;
        this.$el.find('.app-body').html(this.templates.render('book-content', data));
    },

    saveBook: function(){
        var book = {},
            chapter = {},
            page = {},
            element = $('#new-book');

        book.name = $(element).find('#book-name').val();
        book.author = $(element).find('#book-author').val();
        book.chapters = [];

        // gets one chapter
        chapter.name = $(element).find('#chapter-name').val();
        chapter.pages =[];

        //gets first page
        page.number = $(element).find('input[name="page"]').val();
        page.paragraphs = [];

        // gets paragraphs
        paragraphs = $(element).find('textarea[name="paragraph"]');

        _.each(paragraphs, function(el){
            page.paragraphs.push($(el).val());
        });
        chapter.pages.push(page);
        book.chapters.push(chapter);
        this.booksCollection.add(book);
        this.booksCollection.sync('create', this.booksCollection, {beforeSend: this.setHeader});

    },

    changePage: function(event){
        var data = {
            page: this.selectedBook.getPage(this.selectedChapter, parseInt(event.currentTarget.dataset.page) - 1),
            pages: this.selectedBook.getChapter(this.selectedChapter).pages.length
        };
        this.$el.find('.page-content').html(this.templates.render('page-content', data));
    }


});