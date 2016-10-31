var app = app || {};

app.UserBooksCollection = Backbone.Collection.extend({
    
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
                id: model.cid
            })
        });

        return books;
    },

    selectedBook: function(){
        var id = _.first(this.models).id;
        return this.get(id)
    }


});
