/*
 * validate
 * 自定义校验 YiYK
 */
(function (window) {
    var current = {};

    current.valEmpty = function (text, options){
        if(text == null || text === ''){
            setErrorMessage(options+'内容为空')
            return false
        } else if((text+'').replace(/\s*/g, '') === ''){
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

    current.valMoney = function (val, type) {
        if (val) {
            var money = 0;
            if(type === '1') {
                money = parseFloat(val)
            } else {
                money = parseInt(val)
            }
            if (money) {
                if (money >= 0){
                    var maxNum = 999999
                    if (money > maxNum) {
                        setErrorMessage('数值太大')
                        return maxNum
                    } else {
                        return money
                    }
                } else {
                    setErrorMessage('不能输入负数')
                    return 0
                }
            } else {
                setErrorMessage('请输入数字')
                return false
            }
        } else {
            return false
        }
    };


    function setErrorMessage(msg){
        $apiAjax.setErrorMessage(msg);
        return false
    }
    window.$val = current;
})(window);
