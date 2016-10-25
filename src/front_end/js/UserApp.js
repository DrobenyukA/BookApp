$(function () {
    window.UsersApp = (function (){
        var session = null;

        var initialize = function (){
            var token = sessionStorage.getItem('token');

            if (token && (token != 'undefined')) {
                session = {};
                session.token = token;
                session.user_name = sessionStorage.getItem('user_name');
            }

        };

        var registered = function (){
            var userData = {
                email: $('input[name="email"]').val(),
                password: $('input[name="password"]').val(),
                first_name: $('input[name="fname"]').val(),
                last_name: $('input[name="lname"]').val()
            };

            //TODO: change this if statement to validate function
            if (isValidLogin(userData.email)
                    && isSamePassword(userData.password)
                    && userData.first_name
                    && userData.last_name ){
                $.ajax({
                    url: '/register-user',
                    method: 'POST',
                    data: userData
                }).done(function (data) {
                    var message = data ? 'Registration was success!' : 'Oops, something went wrong, please try again';
                    alert(message);
                }).fail(function (error) {
                    alert('Server not respond!');
                });
            } else {
                alert('Registration deni! Please Enter correct data.');
            }


        };

        var authenticate = function(){
            var login    = $('input[name="login"]').val(),
                password = $('input[name="passwd"]').val();

            $.ajax({
                url: '/authenticate',
                method: 'POST',
                data: {
                    login: login,
                    password: password
                }
            }).done(function (data) {
                console.log(data);
                if (!data){
                    alert("Login failed");
                    return;
                }
                session = data;
                sessionStorage.setItem('token', session.token);
                sessionStorage.setItem('user_name', session.user_name);
                loadConfig();
            }).fail(function (error) {
                alert('Server not respond!');
            });

        };

        var clearSession = function(){
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user_name');
            session = null;

        };

        var logOut = function(){
            clearSession();
        };

        var isNewUser = function(){
            var login  = $('input[name="email"]').val();

            if (isValidLogin(login)){
                $.ajax({
                    url: '/check-login',
                    method: 'POST',
                    data:{
                        login: login
                    }
                }).done(function(data){
                    if (data){
                        $('input[type="email"]').removeClass('error');
                    } else {
                        $('input[type="email"]').addClass('error');
                        alert("This email is already in use!")
                    }
                });
            }

        };

        var isValidLogin = function(login){
            var reg = /([\w\.]+)@(([\w]+\.)+)([a-zA-z]{2,4})/igm,
                result = reg.test(login);
            if (!result){
                alert('Please enter correct email;');
                $('input[type="email"]').addClass('error');
            } else {
                $('input[type="email"]').removeClass('error');
            }
            return result;
        };

        var isSamePassword = function(password, confpassword){
            var password     = password ? password : $('input[name="password"]').val(),
                confpassword = confpassword ? confpassword : $('input[name="confpassword"]').val();

            if (password === confpassword){
                $('input[type="password"]').removeClass('error');
                return true;
            } else {
                alert('Passwords are not the same!');
                $('input[type="password"]').addClass('error');
                return false;
            }
        };

        // TODO: remove this Backbone view
        // var loadConfig = function(){
        //     var user = sessionStorage.getItem('token');
        //     if (user){
        //         $.ajax({
        //             url: '/loadconfig',
        //             method: 'POST',
        //             headers:{
        //                 token: user
        //             }
        //         }).done(function (data) {
        //             if(data){
        //
        //             } else {
        //                 alert('You don`t have any configs!');
        //             }
        //         }).fail(function (error) {
        //             alert('Server not respond!');
        //         });
        //     }
        // };

        initialize();

        return {
            authenticate: authenticate,
            registered: registered,
            isNewUser: isNewUser,
            isSamePassword: isSamePassword,
            logOut: logOut
        }

    })();
});