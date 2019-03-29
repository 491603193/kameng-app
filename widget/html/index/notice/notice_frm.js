var page;
var userId;
apiready = function () {
    userId = base.storage.getLocalStorage("userId");
    loadData(0);
    // 下拉刷新
    api.setRefreshHeaderInfo({
        visible: true,
        loadingImg: '',//下拉刷新的图片
        bgColor: '#ebebeb',
        textColor: '#000',
        textDown: '下拉刷新...',
        textUp: '松开刷新...',
        showTime: true
    }, function (ret, err) {
        loadData(1); // 第一次加载
    });
    // 默认第一次打开页面就下拉加载数据
    // api.refreshHeaderLoading();  //此时 totalData  totalPages 会自动赋值了
    // 结合上拉加载：
    api.addEventListener({
        name: 'scrolltobottom',
        extra: {
            threshold: 0 //设置距离底部多少距离时触发，默认值为0，数字类型
        }
    }, function (data, err) {
        if (page.isLastPage) {
            api.toast({
                msg: '没有更多数据了！',
                duration: 2000,
                location: 'bottom'
            });
        } else {
            loadData(page.nextPage);
        }
    });
};
// 加载数据
// @currentPage:当前页码
// @isReload：是否为刷新操作
// @searchContent：搜索的内容
function loadData(nowPage) {
    if (nowPage == 0) {
        nowPage = 1;
        base.apicloud.showProgress();
    }
    api.ajax({
        url: base.ip.kmservice + '/mNoticeAction/findNoticePage',
        method: 'post',
        timeout: 20,
        dataType: 'json',
        returnAll: false,
        data: {
            values: {
                userId: userId,
                page: nowPage
            }
        }
    }, function (ret, err) {
        //将刷新完成后关闭
        api.refreshHeaderLoadDone();
        base.apicloud.hideProgress();
        if (!!ret && ret.success) {
            page = ret.page;
            if (nowPage == 1) {
                var html = template('tempMain', ret);
                $("#data-list").html(html);
            } else {
                var html = template('tempSub', ret);
                $("#content").append(html);
            }

        } else {
            api.toast({
                msg: '网络错误，请重试！',
                duration: 2000,
                location: 'bottom'
            });
        }
    });
}

function openDetail(noticeId, obj) {
    api.openWin({
        name: "notice/notice_detail_win",
        url: "./notice_detail_win.html",
        pageParam: {
            noticeId: noticeId
        }
    });
    var object = $(obj).find('div').hasClass("color-999");
    if(!object){
        setNoticeRead(noticeId);
        $(obj).find('div').addClass("color-999");
    }

}

function setNoticeRead(noticeId) {
    var noticeRead = {
        noticeId: noticeId,
        userId: userId
    };
    api.ajax({
        url: base.ip.kmservice + '/mNoticeReadAction/addNoticeRead',
        method: 'post',
        timeout: 20,
        dataType: 'json',
        returnAll: false,
        data: {
            values: noticeRead
        }
    }, function (ret, err) {
        //将刷新完成后关闭
        if (!!ret && ret.success) {
            api.execScript({
                name:'html/index/index',
                script: 'countNum();'
            });
        }
    });
}


