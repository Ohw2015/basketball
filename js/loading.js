;(function(){
  //网页加载进度条。
  var $loading = $('.loading_mask');
  var $progress = $('.percent');
  var $protxt = $('.percentNum');
  var picComplete = false; //图片加载完毕。
  var ajaxComplete = true;//ajax加载完毕
  var prg = 0
  var timerLoading = 0
  function progress (dist, delay, callback) {
    clearInterval(timerLoading)
    timerLoading = setInterval(function(){
      if (prg >= dist) {
        window.clearInterval(timerLoading)
        prg = dist
        callback && callback()
      } else {
        prg++
      }
      $progress.width(prg + '%');
      $protxt.html(prg + '%')
      console.log(prg)
    }, delay)
  }
  progress(60, 50);
  window.onload = function(){
    var img  = new Image();
    img.src = '../img/stage_bg_big';
    img.onload = function(){
       alert(123);
       picComplete = true;
    };
    $(document).ajaxSend(function(event,xhr,options){
       ajaxComplete = true;
    });
    if(picComplete && ajaxComplete){//图片加载完成，ajax请求完成了，进度条加载100。
        progress(100,1,function(){
         $loading.hide()
        })
    }
  }
})()

/* by wxl
网页加载进度条实现思路
1.判断ajax是够加载完成$(document).ajaxSend(function(event,xhr,options));
2.判断大图是否加载完成
img1.onload =function() {}
参考这篇文章：
http://blog.csdn.net/z69183787/article/details/17393793
3.判断dom节点是否加载完成
4.判断js是否加载完成
*/
