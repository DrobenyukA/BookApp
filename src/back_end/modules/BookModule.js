/**
 * Created by drobenyuk on 05.10.16.
 */
var dbManager = require('./../services/DataService');

module.exports = (function(){
    var BOOKS_PATH = './../data/books.json';

    var saveBook = function(data, userId){

        data.book.id = dbManager.getData(BOOKS_PATH).length + 1;
        
        data.book.userId = userId;

        return dbManager.saveData(BOOKS_PATH, data.book);

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
