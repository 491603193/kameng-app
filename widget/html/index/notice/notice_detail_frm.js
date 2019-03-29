var noticeId;
apiready = function(){
    noticeId = api.pageParam.noticeId;
    detail();
};

function detail(){
    api.ajax({
        url: base.ip.kmservice+'/mNoticeAction/findNoticeById',
        method: 'post',
        timeout: 20,
        dataType: 'json',
        returnAll:false,
        data : {
            values:{
                noticeId:noticeId
            }
        }
    },function(ret,err){
        //将刷新完成后关闭
        api.refreshHeaderLoadDone();
        base.apicloud.hideProgress();
        if (!!ret && ret.success) {
                var html = template('content', ret.data);
                $("#data").html(html);
        } else {
            api.toast({
                msg: '网络错误，请重试！',
                duration: 2000,
                location: 'bottom'
            });
        }
    });
}