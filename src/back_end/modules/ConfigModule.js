var dbManager = require('./../services/DataService'),
            _ = require('lodash');

module.exports = (function(){

    var saveConfig = function (data, userId){
        var path = './../data/configs.json',
            configs = dbManager.getData(path),
            newConfig = {
                userId: userId,
                config: data.config
            },
            result = {
                status: false,
                message: 'Sorry, something went wrong. \n Please try again later.'
            },
            firstConfig = true;
        if (userId){
            _.forEach(configs, function(item){
                if(item.userId == userId){
                    item.config = data.config;
                    console.log(configs);
                    dbManager.rewriteData(path, configs);
                    firstConfig = false;
                }
            });
            if (firstConfig) {dbManager.saveData(path, newConfig)}
            result.status = true;
            result.message = "Your config was successfully saved!";

        } else {
            result.message = "There is no such user";
        }
        
        return result;
    };
    
    var getUserConfig = function(userId){
        var path    = './../data/configs.json',
            configs = dbManager.getData(path),
            config  = [];

        for(var i = 0; i < configs.length; i++){
            if (userId == configs[i].userId){
                config.push(configs[i].config);
                return config[0];
            }            
        }
    };
    
    return{
        saveConfig: saveConfig,
        getUserConfig: getUserConfig
    }
})();