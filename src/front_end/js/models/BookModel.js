var app = app || {};

app.BookModel = Backbone.Model.extend({

    selectedChapter: null,

    defaultChapter: function(){

        return this.get('chapters')[0]
    },

    getPage: function(chapterName, pageNumber){
        var result = null;
        var chapter = this.getChapter(chapterName);
        try{
            result = chapter.pages[pageNumber]
        } catch(e){
            alert('There is no such chapter');
            result = this.defaultChapter()
        }
        return result;
    },

    getChapter: function(chapterName){
        var result = {};
        _.each(this.get('chapters'), function(chapter){
            if (chapter.name == chapterName){
                result = chapter;
            }
        });

        return result;
    }
});