/**
 * Created by Drobenyuk.A on 06.08.16.
 */
module.exports = function (user) {

    var getId = function () {
        return user.id;
    };

    var isCurrentUser = function (login, password) {
        return login === user.login && password === user.password;
    };

    var getFullName = function () {
        return user.first_name + " " + user.last_name;
    };

    var checkLogin = function (email) {
        return email === user.login;
    };

    return {
        getId: getId,
        isCurrentUser: isCurrentUser,
        getFullName: getFullName,
        checkLogin: checkLogin
    }
};