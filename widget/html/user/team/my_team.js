apiready = function() {
  api.parseTapmode();
  $api.fixStatusBar($api.byId('aui-header'));
  $api.fixStatusBar($api.byId('aui-header'));
  vm.userId = $apiLocal.getUserId()
  vm.loadData();
  vm.loadTeam();
}

var vm = new Vue({
  el: '#app',
  data: {
    isMy: true,
    imgPath: $apiAjax.kameng_image,
    defaultImg: '../../../image/user/header1.png',
    userId: '',
    user: {},
    otherUser: {},
    teamNum: {},
    month: 'now',
    floor: 1,
    teamList: [],
    index: 0
  },
  created () {
  },
  methods: {
    openLower (index) {
      if(!this.teamList[index].onOpen){
        this.userId = vm.teamList[index].userId;
        this.floor = vm.teamList[index].floor+1;
        this.index = index
        this.loadTeam();
      }else{
        var floor = this.teamList[index].floor;
        for(var i = index + 1; i < this.teamList.length; i++){
          if(floor >= this.teamList[i].floor){
            break;
          }else{
            this.teamList.splice(i,1);
            --i;
          }
        }
      }
      this.teamList[index].onOpen = !this.teamList[index].onOpen;
    },
    search (name) {
      var self = this;
      $apiAjax.postBody("/user/team/findLowerWidthName", {
        name: name,
      },function (data) {
        if (data) {
          if (data.success) {
            self.userId = data.user.userId
            self.teamNum = data.user.teamNum
            self.otherUser = data
            self.isMy = false
            self.loadTeam()
          } else {
            $apiAjax.setErrorMessage(data.msg)
          }
        }
      }, true);
    },
    loadTeam () {
      var self = this;
      $apiAjax.postBody("/user/team/list", {
        userId: self.userId,
        floor: self.floor,
        month: self.month
      },function (data) {
        if (data) {
          if(self.floor === 1){
            self.teamList = data
          } else {
            for(var i=0; i < data.length; i++){
              var entity =  data[i]
              entity['indexF'] = i + 1
              self.teamList.splice(self.index+i+1, 0, entity)
            }
          }
        }
      }, true);
    },
    loadData () {
      var self = this;
      $apiAjax.postBody("/user/team/list", {
        userId: self.userId,
        floor: self.floor,
        month: self.month
      },function (data) {
        if (data) {
          if(self.floor === 1){
            self.teamList = data
          } else {
            for(var i=0; i < data.length; i++){
              var entity =  data[i]
              entity['indexF'] = i + 1
              self.teamList.splice(self.index+i+1, 0, entity)
            }
          }
        }
      }, false);
    }
  }
})




var searchBar = document.querySelector(".aui-searchbar");
var searchBarInput = document.querySelector(".aui-searchbar input");
var searchBarBtn = document.querySelector(".aui-searchbar .aui-searchbar-btn");
var searchBarClearBtn = document.querySelector(".aui-searchbar .aui-searchbar-clear-btn");
if(searchBar){
  searchBarInput.onclick = function(){
    searchBarBtn.style.marginRight = 0;
  }
  searchBarInput.oninput = function(){
    if(this.value.length){
      searchBarClearBtn.style.display = 'block';
      searchBarBtn.classList.add("aui-text-info");
      searchBarBtn.textContent = "搜索";
    }else{
      searchBarClearBtn.style.display = 'none';
      searchBarBtn.classList.remove("aui-text-info");
      searchBarBtn.textContent = "取消";
    }
  }
}
searchBarClearBtn.onclick = function(){
  this.style.display = 'none';
  searchBarInput.value = '';
  searchBarBtn.classList.remove("aui-text-info");
  searchBarBtn.textContent = "取消";
  vm.userId = $apiLocal.getUserId()
  vm.floor = 1
  vm.isMy = true
  vm.loadTeam()

}
searchBarBtn.onclick = function(){
  var keywords = searchBarInput.value;
  if(keywords.length){
    searchBarInput.blur();
    vm.search(keywords)
  }else{
    this.style.marginRight = "-"+this.offsetWidth+"px";
    searchBarInput.value = '';
    searchBarInput.blur();
  }
}
