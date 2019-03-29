/*
 * 衣永康
 * 首页弹出文字
 */
(function(window){
    var u = {};

    u.popupTextList = []
    u.showIndx = 0

    u.showText = function (popup){
        var dialogBox = api.require('dialogBox');
        dialogBox.alert({
            texts: {
                title: popup.popupName,
                content: popup.popupContent,
                leftBtnTitle: '确认'
            },
            styles: {
                bg: '#fff',
                w: api.winWidth - 60,
                corner: 8,
                title: {
                    marginT: 10,
                    icon: '',
                    iconSize: 40,
                    titleSize: 16,
                    titleColor: '#000'
                },
                content: {
                    marginT: 5,
                    color: '#000',
                    size: 14
                },
                left: {
                    marginB: 20,
                    marginL: api.winWidth / 3 - 30,
                    w: api.winWidth / 3,
                    h: 35,
                    corner: 12,
                    bg: '#DEDEDE',
                    color: '#000',
                    size: 12
                }
            }
        }, function (ret) {
            if (ret.eventType === 'left') {
                var dialogBox = api.require('dialogBox');
                dialogBox.close({
                    dialogName: 'alert'
                });
                ++u.showIndx;
                if(u.showIndx <  u.popupTextList.length){
                    u.showText(u.popupTextList[u.showIndx]);
                }
            }
        });
    };

    u.setText = function (textList){
        if (!!textList && textList.length > 0) {
            u.popupTextList = textList
            u.showText(u.popupTextList[u.showIndx]);
        }
    }

    /*end*/
    window.$dialogBox = u;

})(window);
