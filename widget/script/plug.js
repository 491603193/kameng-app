/* openWin */
function openWin(name){
  var delay = 0;
  if(api.systemType != 'ios'){
      delay = 300;
  }
  api.openWin({
      name: ''+name+'',
      url: ''+name+'.html',
      bounces:false,
      delay: delay,
      slidBackEnabled:true,
      vScrollBarEnabled:false
  });
}
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = {openWin}
} else {
  if (typeof define === 'function' && defin.amd) {
    define([], function () {return {openWin}})
  } else {
    window.openWin = openWin
  }
}