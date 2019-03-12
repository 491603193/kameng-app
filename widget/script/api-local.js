/*
 * 衣永康
 * 本地存储
 */
(function(window){
    var u = {};

    var USER_ID = 'userId';
    var USER = 'user';
    var SMS_CODE_TIME = 'smsCodeTime';

    u.USER_ID = USER_ID;
    u.USER = USER;
    u.SMSCODETIME = SMS_CODE_TIME;

    u.getUserId = function(){
        return $api.getStorage(USER_ID)
    };

    u.getUser = function(){
        return $api.getStorage(USER)
    };

    u.getSmsCodeTime = function(){
        return $api.getStorage(SMS_CODE_TIME)
    };


    window.$apiLocal = u;
})(window);


