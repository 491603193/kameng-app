(function() {
    var m = {};
    //打开选择sheet，从相机拍摄还是刘览相册选取图片
    m.openPhoto = function (fuc, max) {//四个参数分别为是否为ios的判断、上传成功的回调函数、最多可以上传的图片数、当前图片数
        if (max) {
            max_photo = max;
        }
        Imgs = [];//压缩后的路径
        isIOS = api.systemType == "ios" ? "1" : "0";//把是否为ios付给isIOS
        addHtml = function () {//把上传完毕的回调函数赋值给addHtml变量（实际是一个匿名函数）
            fuc();
        };
        api.actionSheet({
            title: '选择图片来源',
            buttons: ['相机', '浏览相册']
        }, function (ret, err) {
            var index = ret.buttonIndex;
            switch (index) {
                case 1 :
                    photoNum = 1;
                    openCamera();
                    break;
                case 2 :
                    photoSelect();
                    break;
                default :
                    break;
            }
        });
    };

    window.media = m;
})();

var photoNum = 1;//本次选择传的图片数(默认为拍摄数量1)
var max_photo = 5;//最多可以上传的图片数
var temRet;//photoSelect的回调函数
var isIOS;//是否为ios手机
var Imgs = [];//图片路径
var addHtml = function(){};
var images;


//通过相册选择图片
function photoSelect(){
    images = api.require('UIMediaScanner');
    images.open({
        type : 'picture',
        column : 3,
        classify : true,
        max : max_photo,
        sort :{
            key : 'time',
            order : 'desc'
        },
        texts : {
            stateText : "可选择"+max_photo+"张",
            cancelText: '取消',
            finishText: '完成'
        }
    },function (ret){
        if (ret) {
            temRet = ret;
            photoNum = temRet.list.length;
            if(photoNum>0) {
                base.apicloud.showProgress();
            }
            dotime(0);

        }
    });
}



//间隔一定时间，执行压缩，防止内存溢出
function dotime(_j){
    var photoSize = temRet.list[_j].size;
    var quality = isCompress(photoSize);
    var timeOut = 0;
    var nextPhotoSize = temRet.list[_j].size;
    var nextSize = isCompress(nextPhotoSize);
    if(nextSize >= 0.35){
        timeOut = 100;
    }else if(nextSize >= 0.25){
        timeOut = 300;
    }else if(nextSize >= 0.22){
        timeOut = 500;
    }else {
        timeOut = 900;
    }
    var temNum = _j;
    if(isIOS == "1"){
        // IOS需要将虚拟路径转换为本地路径才可以压缩
        var selectimgPath = temRet.list[temNum].path;
        images.transPath({
            path : selectimgPath
        }, function(transObj) {
            if(quality < 1){
                imgCompress(transObj.path,quality,temNum,timeOut);
            }else if(quality == 1){
                Imgs.push(temRet.list[temNum].path);
                if(temNum +1==photoNum){
                    addHtml();
                }else{
                    temNum++;
                    setTimeout('dotime('+temNum+')',timeOut);
                }
            }else{
                api.toast({
                    msg: "图片大小不能超过10M",
                    duration: 2000,
                    location: 'bottom'
                });
            }
        });
    }else{
        if(quality < 1){
            imgCompress(temRet.list[temNum].path,quality,temNum,timeOut);
        }else if(quality == 1){
            Imgs.push(temRet.list[temNum].path);
            if(temNum+1==photoNum){
                addHtml();
            }else{
                temNum++;
                setTimeout('dotime('+temNum+')',timeOut);
            }
        }else{
            api.toast({
                msg: "图片大小不能超过10M",
                duration: 2000,
                location: 'bottom'
            });
        }

    }
}

//根据大小获取时间间隔区间
function isCompress(size){
    var quality;
    if(size > 0 && size <= 300 * 1024){
        quality = 1;
    }else if(size < 1000 * 1024){//1m
        quality = 0.7;
    }else if(size < 3000 * 1024){//3m
        quality = 0.35;
    }else if(size < 5000 * 1024){//5m
        quality = 0.25;
    }else if(size < 1024 * 1024 * 8){//8m
        quality = 0.22;
    }else if(size < 1024 * 1024 * 10){//10m
        quality = 0.18;
    }else{
        quality = -1;
    }
    return quality;
}

//通过相机拍摄图片
function openCamera(){
    api.getPicture({
        sourceType: 'camera',
        encodingType: 'jpg',
        mediaValue: 'pic',
        destinationType: 'url',
        quality: 80,
        saveToPhotoAlbum: true
    }, function(ret, err){

        if (ret && ret.data) {
            var url = ret.data;
            if(url) {
                base.apicloud.showProgress();
            }
            getPhotoSize(url, function (size) {
                var quality = isCompress(size);
                if (quality < 1) {
                    imgCompress(url, quality, 0,300);
                } else if (quality == 1) {
                    Imgs.push(url);
                    addHtml();
                } else {
                    api.toast({
                        msg: "图片大小不能超过10M",
                        duration: 2000,
                        location: 'bottom'
                    });
                }
            });

        } else {
            //api.toast({
            //    msg: "没有选择，或者选择出错",
            //    duration: 2000,
            //    location: 'bottom'
            //});
        }
    });
}

//通过路径用fs获取图片大小
function getPhotoSize(path,callback){
    var fs = api.require('fs');
    fs.getAttribute({
        path: path
    },function(ret,err){
        if (ret.status) {
            size = ret.attribute.size;
            callback(size);
        } else {
            api.toast({
                msg: err.msg,
                duration: 2000,
                location: 'bottom'
            });
        }
    });
}





//图片压缩
function imgCompress(imgsrc, quality, j,timeOut) {
    var savePath = api.cacheDir + "/pic/" + getNowFormatDate() + "/";
    var savename = NewGuid() + ".jpg";
    var imageFilter = api.require('imageFilter');
    imageFilter.compress({
        img : imgsrc,
        quality : quality,
        scale : quality,
        save : {
            album : false,
            imgPath : savePath,
            imgName : savename
        }
    }, function(ret, err) {
        if (ret) {
            Imgs.push(savePath + savename);
            if(j+1==photoNum){
                addHtml();
            }else{
                j++;
                setTimeout('dotime('+j+')',timeOut);
            }
        } else {
        }
    });
}

//重新命名文件名
function NewGuid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4());
}


//获得当前时间
function getNowFormatDate() {
    var date = new Date();
    var nowTime = date.getTime();
    var currentdate = "" + nowTime;
    return currentdate;
}