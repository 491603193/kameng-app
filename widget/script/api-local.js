/*
 * 衣永康
 * 本地存储 和常量配置
 */
(function(window){
    var u = {};

    var USER_ID = 'userId'; // 用户id
    var USER_NAME = 'userName';  // 用户姓名
    var USER = 'user';  // 代理信息
    var SMS_CODE_TIME = 'smsCodeTime'; // 短信验证码倒计时

    var CLOUD_CART = 'cloudCart'; // 云仓购物车
    var COMMON_CART = 'commonCart'; // 非云仓购物车

    u.USER_ID = USER_ID;
    u.USER_NAME = USER_NAME;
    u.USER = USER;
    u.SMS_CODE_TIME = SMS_CODE_TIME;

    u.CLOUD_CART = CLOUD_CART;
    u.COMMON_CART = COMMON_CART;

    u.getUserId = function(){
        return $api.getPrefs(USER_ID)
    };

    u.getUserName = function(){
        return $api.getPrefs(USER_NAME)
    };

    u.getUser = function(){
        return $api.getPrefs(USER)
    };

    u.getSmsCodeTime = function(){
        return $api.getPrefs(SMS_CODE_TIME)
    };

    u.setUserId = function(userId){
        $api.setPrefs(USER_ID, userId)
    };

    u.setUserName = function(userName){
        $api.setPrefs(USER_NAME, userName)
    };

    u.setUser = function(user){
        $api.setPrefs(USER, user)
    };

    u.setSmsCodeTime = function(smsCodeTime) {
        $api.setPrefs(SMS_CODE_TIME, smsCodeTime)
    };

    u.setUserCloudCart = function(userCloudCart){
        var cloudCart = u.getCloudCart();
        cloudCart[u.getUserId()] = userCloudCart
        $api.setPrefs(CLOUD_CART, cloudCart)
    };

    u.setUserCommonCart = function(userCommonCart){
        var commonCart = u.getCommonCart();
        commonCart[u.getUserId()] = userCommonCart
        $api.setPrefs(COMMON_CART, commonCart)
    };

    u.getUserCloudCart = function(){
        return u.getCloudCart()[u.getUserId()] || []
    };

    u.getUserCommonCart = function(){
        return u.getCommonCart()[u.getUserId()] || []
    };


    u.getCloudCart = function(){
        return $api.getPrefs(CLOUD_CART) || {}
    };

    u.getCommonCart = function(){
        return $api.getPrefs(COMMON_CART) || {}
    };



    window.$apiLocal = u;
})(window);


