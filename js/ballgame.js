/*
by wxl 20170617 baseketBallGame
*/
    /*
    * cookie模块
    */
var NS = {
    'cookie' : {
        /*
        *@名称:  get 获取cookie
        *@作者： caoxl
        *@日期： 2016-06-29
        *@参数:  String name cookie名称
        *@描述:  使用方法TT_GET('cookiePkg').get('name');
        *@返回:  如果cookie存在返回cookie 否则返回null
        */
        'get': function(name){
            var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
            return arr != null ? unescape(arr[2]) : null;
        },
        /*
        *@名称:  set 设置cookie
        *@作者： caoxl
        *@日期： 2016-06-29
        *@参数:  String name cookie名称
        *@描述:  使用方法TT_GET('cookiePkg').set('name', 'value');
        *@返回:  boolean
        */
        'set':function(name, value){  
           var exp = new Date();  
           exp.setTime(exp.getTime() + 365 * 24 * 60 * 60 * 1000); //3天过期  
           document.cookie = name + "=" + encodeURIComponent(value) + ";domain=.tomtop.com;expires=" + exp.toGMTString()+";path=/";  
           return true;  
        },
        /*
        *@名称:  del 删除cookie
        *@作者： caoxl
        *@日期： 2016-06-29
        *@参数:  String name cookie名称
        *@描述:  使用方法TT_GET('cookiePkg').del('name');
        *@返回:  boolean
        */
        'del':function(name){
             var _this = this;
             var _exp = new Date();  //当前时间
             _exp.setTime(_exp.getTime() - 1);
             var _cval = _this.get(name);
             if(_cval != null){
                document.cookie= name + "="+_cval+";domain=.tomtop.com;expires="+_exp.toGMTString()+";path=/";
             }
        },
        'tem' : function(name, value) {
           var _domain = NS['config']['cookieDomain'];
           document.cookie = name + "=" + encodeURIComponent(value) + ";domain=.tomtop.com;path=/";
           return true;
        },
        'defauleCurr' : function(){
            if(this.get('TT_CURR') == null){
                this.set('TT_CURR','USD')
            }
        }
    }
};
//网页加载进度条。
var loadingBar = {
    loadbar: $("#loadBar"),
    percentEle: $(".percent", this.loadbar),
    percentNumEle : $(".percentNum", this.loadbar),
    currentProgress : 0,//初始值。
    max:100,
    timer:null,
    setProgress:function (val){
        if (val >= this.max)
        {
            val = this.max;
        }
        this.currentProgress = parseInt((val / this.max) * 100) + "%";
        this.percentEle.width(this.currentProgress);
        this.percentNumEle.text(this.currentProgress);
    },
    loadingRun:function(){
        _this = this;
        var i = 0;
        _this.time = setInterval(function ()
        {
            _this.setProgress(i);
            if (i == _this.max)
            {
                clearInterval(_this.time);
                _this.loadbar.parent().hide();
                return;
            }
            i += 1;
        }, 40);
    }
}
var ballGame = {
    'speed':1, //速度控制。
    'timer1':null,//篮球框滚动的定时器
    'timer2':null,//改变运动速度的定时器
    'timer3':null,//控制球时差的定时器
    'timer4':null,//控制球时差的定时器
    'timer5':null,//奖品弹出层的定时器
    'stopPos':'0',//最终停下来的位移。
    'scrollUl':$('.scroll_c').children('ul'),
	init:function(){
		var _this = this;
        this.stageHeight();
        _this.rimScroll();
		$(window).resize(function(){
            _this.stageHeight();
		});
        $('.base_ball').click(function(){
            _this.startGame();
            _this.timer2 = setTimeout(function(){
               _this.speed = 0;
               clearInterval(_this.timer1);
               _this.targetCenter();//球停下来
            },500)
            _this.timer3 = setTimeout(function(){
                $('.result_rim,.mask').addClass('show');
                $(".base_ball").css({'z-index':400});
            },400);
            _this.timer4 = setTimeout(function(){
                $(".base_ball").css({'z-index':34});
            },600);
        });
        _this.startAgain();
    },
    startGame:function(){
        var _this = this;
        clearTimeout(_this.timer5);
        _this.speed = 100;
        $(".base_ball,.ball_shadow,.hand").addClass('Ani');
        $('.start_tips').hide();
        var arr = [0,1,2,3,4,5];
        var i = Math.floor(Math.random()*5);//随机出现的概率。
        var prize = arr[i];
        switch(prize){
            case 0:
              var prize_Txt = '10 points';
              _this.setPrize(prize_Txt);
              break;
            case 1:
              var prize_Txt = '50 points';
              _this.setPrize(prize_Txt);
              break;
            case 2:
              var prize_Txt = '20 points';
              _this.setPrize(prize_Txt);
              break;
            case 3:
              var prize_Txt = '100 points';
              _this.setPrize(prize_Txt);
              break;
            case 4:
              var prize_Txt = '$5 coupon';
              _this.setPrize(prize_Txt);
              break;
            default:
              var prize_Txt = 'Sorry No Prizes';
              _this.setPrize(prize_Txt);
              break;
        }
        _this.timer5 = setTimeout(function(){
             //中奖
             if(prize == 0){
                 var res = '<p>Congratulations! <br/>You got</p>\
                  <span>10 points</span>'
                 _this.popshow(res,prize);
             }else if(prize == 1){
                 var res = '<p>Congratulations! <br/>You got</p>\
                  <span>50 points</span>';
                 _this.popshow(res,prize);
                 
             }else if(prize == 2){
                 var res = '<p>Congratulations! <br/>You got</p>\
                  <span>20 points</span>';
                 _this.popshow(res,prize);
                 
             }else if(prize == 3){
                 var res = '<p>Congratulations! <br/>You got</p>\
                  <span>100 points</span>';
                 _this.popshow(res,prize);
                 
             }else if(prize == 4){
                 var res = '<p>Congratulations! <br/>You got</p>\
                  <span>$5 coupon</span>';
                 _this.popshow(res,prize);
                 
             }else if(prize == 5){
                 var res = '<span>Sorry No Prizes</span>';
                 _this.popshow(res,prize);
                 
             }
        },1200)
    },
    setPrize:function(Txt){//设置奖品文字。
         var tagetLi = $(".scroll_c li").eq(4);
         var liP =  tagetLi.children('p');
         $(".result_rim p").text(Txt);
         var oldTxt = liP.text();
         $(".scroll_c li").each(function(i,el){
              var lip2 = $(el).children('p')
              if(lip2.text().toLowerCase() == Txt.toLowerCase()){
                  lip2.text(oldTxt);
              }
         })
         liP.text(Txt);
    },
    popshow:function(txt,p){
        //奖品弹窗
        $(".text_pop ").html(txt)
        if( p== 6){
            $(".dialog_pop").addClass('Ani no_prize');
        }else{
            $(".dialog_pop").addClass('Ani winning');
        }
        $('.result_rim').removeClass('show');
        $(".flower,.text_pop,.mask,.again_tips").addClass('Ani');
    },
    stageHeight:function(){
        //设置主体高度始终为屏幕高度。
    	var winH = $(window).height();
    	var rimH = $(".scroll_wrap").position().top;
    	var stegeH = winH + rimH;
    	$(".stage_wrap").css({"height":stegeH});
    },
    rimScroll:function(){
        //滚动函数。
        var _this = this;
        var sWrap = $('.scroll_c');
        var oUl = sWrap.children('ul');
        var oLi = oUl.children('li');
        var oLiw = oLi.eq(0).outerWidth(true);
        var cloneLi1 = oLi.eq(0).clone();
        var cloneLi2 = oLi.eq(1).clone();
        var cloneLi3 = oLi.eq(2).clone();
        oUl.append(cloneLi1);
        oUl.append(cloneLi2);
        oUl.append(cloneLi3);
        var oLi1 = oUl.children('li');
        var liLen = oLi1.length;
        console.log(liLen);
        oUl.width( liLen * oLiw);
        var dis = 0;
        var maxdis = - oLiw * oLi.length //滚动到最大距离的时候回归到初始位置。
        console.log(maxdis);
        _this.timer1 = setInterval(function(){
            dis -= _this.speed;
            if( dis <= parseInt(maxdis)){
                oUl.css({'left': 0 })//第一轮滚动完的时候回到初始位置。
                dis = 0
            }
            oUl.css({'left':dis})
        },0.1)
    },
    startAgain:function(){//重新开始。
        var _this  = this;
        $('.again_tips').click(function(){
            clearInterval(_this.timer1);
            _this.rimScroll();
            $('.Ani').removeClass('Ani');
            _this.speed = 1;
        })
    },
    pztest:function(){//碰撞检测，扎到哪个，就在哪个位置停下来。并且将它的奖品文字设为我们需要的那个。
            
    },
    targetCenter:function(){//目标居中。
       _this = this;
       var tagetLi = $(".scroll_c li").eq(4);
       var stegeW = 0;
       $(window).width() >1200 ? stageW = 1200 :stageW = $(window).width();
       _this.stopPos = tagetLi.position().left - stageW/2 + tagetLi.width()/2;
       console.log(_this.stopPos);
       _this.scrollUl.css('left',-_this.stopPos);
    }
}
$(function(){
     ballGame.init();
})
