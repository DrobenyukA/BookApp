/**
 * Created by drobenyuk on 05.10.16.
 */
var dbManager = require('./../services/DataService'),
            _ = require('lodash');

module.exports = (function(){
    var BOOKS_PATH = './../data/books.json';

    var saveBook = function(data, userId){
        var book = {};
        _.forEach(data, function(item){
           if (!item.id){
               book = item;
               console.log(book);
           }
        });
        book.id = dbManager.getData(BOOKS_PATH).length + 1;
        book.userId = userId;

        return dbManager.saveData(BOOKS_PATH, book);

    };
    
    var getBook = function(userId){
        var books = dbManager.getData(BOOKS_PATH),
            result = [];
        for(var i = 0; i < books.length; i++){
            if (books[i].userId == userId){
                delete books[i].userId;
                result.push(books[i]);
            }
        }
        return result;
    };
    
    
    return{
        saveBook: saveBook,
        getBook: getBook
    }
    
})();
