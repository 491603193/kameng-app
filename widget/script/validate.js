/*
 * validate
 * 自定义校验 YiYK
 */
(function (window) {
    var current = {};

    current.valEmpty = function (text, options){
        if(text == null){
            setErrorMessage(options+'内容为空')
            return false
        } else if(text.replace(/\s*/g,'') === ''){
            setErrorMessage(options+'内容为空')
            return false
        } else {
            return true
        }
    };

    current.valPhone = function (phone) {
        if (!current.valEmpty(phone, '手机号')){
            return false
        } else if(!(/^1[345789]\d{9}$/.test(phone))){
            setErrorMessage('手机号格式不正确')
            return false
        } else {
            return true
        }
    };

    function setErrorMessage(msg){
        $apiAjax.setErrorMessage(msg);
        return false
    }
    window.$val = current;
})(window);
