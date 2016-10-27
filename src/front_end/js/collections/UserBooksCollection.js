var app = app || {};

app.UserBooksCollection = Backbone.Collection.extend({

    user: sessionStorage.getItem('token'),

    model: app.BookModel,

    url: '/user-books',
    
    getBooks: function(){
        var books = {
            quantity: this.length,
            items: []
        };

        _.each(this.models, function(model){
            books.items.push({
                name: model.get('name'),
                author: model.get('author'),
                id: model.get('id')
            })
        });

        return books;
    }


});
