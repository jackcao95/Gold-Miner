/**
 * Created by Administrator on 2018/2/1.
 */
(function(){
    var centerObj = new Object();
    centerObj.camera = new HGAME.camera();//镜头对象
    centerObj.animate=new HGAME.animate();//动画对象
    centerObj.animate2=new HGAME.animate({time:60});//动画对象
    centerObj.model=new HGAME.model();
    centerObj.maxBox = new HGAME.canvas({
        w:500,
        h:800
    });//canvas对象
    centerObj.start=false;
    centerObj.loadedObj=new HGAME.source();//加载资源
    centerObj.camera.add(centerObj.maxBox);
    var arr=new Array();
    centerObj.failFun=function(){
        if(centerObj.model.showView==true)return;
        centerObj.model.btnType="cx";
        centerObj.model.btn2Type="jx";
     
        centerObj.model.show(centerObj.maxBox,{
            w:400,
            addY:15,
            title:{
                txt:"哎,失败了",
                bgColor:"#ff9900",
                color:"#ffffff"
            },
            content:{
                txt:["好气,没有过关啊"],
                verticalAlign:"middle"
            },
            btn:{
                txt:"重新开始",
                fontSize:"20",
                bgColor:"#ffbb00",
                color:"#ffffff",
                w:200
            },
            btn2:{
                txt:"继续这关",
                fontSize:"20",
                bgColor:"#aaee00",
                color:"#ffffff",
                w:200
            }
        });
    }

    centerObj.animate2.action=function(){
        if(centerObj.model.showView==false){
            for(var i = 0;i<centerObj.stArr.length;i++){
                methodInfo(centerObj.stArr[i],"method2");
            }
        }
        if(centerObj.user.num>=gsImgInfo[centerObj.gs][2]){
          //  centerObj.gs++;
            //centerObj.user.num=0;
            if(centerObj.model.showView==false){
                centerObj.model.btnType="next";
                centerObj.model.show(centerObj.maxBox,{
                    w:400,
                    addY:30,
                    title:{
                        txt:"哇,好厉害",
                        bgColor:"#ff9900",
                        color:"#ffffff"
                    },
                    content:{
                        txt:["过关了,点击进行下一关"],
                        verticalAlign:"middle"
                    },
                    btn:{
                        txt:"下一关",
                        fontSize:"20",
                        bgColor:"#ffbb00",
                        color:"#ffffff"
                    }
                });
            }
          
       //     gsInfo(centerObj.gs);
        }
    }
    function clickNext(){
        if(centerObj.gs==centerObj.allGs){
            centerObj.model.btnType="cx";
            centerObj.model.show(centerObj.maxBox,{
                w:400,
                addY:30,
                title:{
                    txt:"哇哦",
                    bgColor:"#ff9900",
                    color:"#ffffff"
                },
                content:{
                    txt:["这么厉害啊，竟然打过全部的关卡了!!"],
                    verticalAlign:"middle"
                },
                btn:{
                    txt:"重新开始",
                    fontSize:"20",
                    bgColor:"#ffbb00",
                    color:"#ffffff"
                }
            });
            return ;
        }
        centerObj.model.close();
        centerObj.user.num=0;
        centerObj.nowTime=0;
        centerObj.gs++;
        localStorage.gs=centerObj.gs;
        gsInfo(centerObj.gs);
    }
    function continueFun(){
        centerObj.model.close();
        centerObj.user.num=0;
        centerObj.nowTime=0;
        gsInfo(centerObj.gs);
    }
    centerObj.animate2.aSecondAction=function(){
        if(centerObj.model.showView==true){return };
        centerObj.nowTime++;
        for(var i=0;i<centerObj.goodsArr.length;i++){
            methodInfo(centerObj.goodsArr[i],"method3");
        }
        if(centerObj.user.goodsAddInfo>0){
            centerObj.user.goodsAddInfo--;
        }else if(centerObj.user.goodsAddInfo==0){
            if(centerObj.user.goodsAdd==0)return;
            centerObj.user.goodsAdd=0;
        }
    }
    centerObj.animate.action=function(){
        centerObj.maxBox.render();
        if(centerObj.model.showView==true){        renderAfter();return };
        centerObj.user.angeleChangeFun();
        for(var i = 0;i<centerObj.stArr.length;i++){
            methodInfo(centerObj.stArr[i]);
        }
        for(i=0;i<centerObj.goodsArr.length;i++){
            methodInfo(centerObj.goodsArr[i]);
        }
        renderAfter();
    };
    centerObj.gs=0;
    centerObj.allGs=8;
    centerObj.stArr=new Array();
    centerObj.goodsArr=new Array();
    centerObj.nowTime=0;
    function changeAttr(struct){
        var arr = new Array();
        for(var i in struct){
            if(typeof struct[i] == "string"){
                status[i]&&(arr=status[i].split("=>"));
                //0 设置 1 对象 2 属性 3 偏差
                if(arr[0]=="set"){
                    struct[i]=centerObj[arr[1]][arr[2]]+arr[3];
                }
            }
        }
    }
    function methodInfo(struct,name){
        name=name||"method";
        if(typeof struct[name]!="undefined"){
            //debugger;
            for(var q = 0;q<struct[name].length;q++){
                if(typeof struct[struct[name][q].name]!="undefined"){
                    if(typeof struct[name][q].arguments=="string"){
                        arr = struct[name][q].arguments.split("=>");
                        if(arr.length>=2&&arr[0]=="set"){
                            struct[struct[name][q].name](centerObj);
                        }else{
                            struct[struct[name][q].name](struct[name][q].arguments);
                        }
                    }else{
                        struct[struct[name][q].name](struct[name][q].arguments);
                    }
                   
                }
            }
        }
    }
    function gsInfo(num){
        centerObj.gs=num;
        centerObj.animate.stop();
        centerObj.animate2.stop();
        centerObj.maxBox.empty();
        centerObj.stArr=new Array();
        centerObj.goodsArr=new Array();
        centerObj.loadedObj.loadCall=function(){
            var txt =centerObj.maxBox.txt;
            centerObj.maxBox.clear();
            txt.beginPath();
            txt.fillStyle="#000000";
            txt.fillRect(0,0,centerObj.maxBox.w,centerObj.maxBox.h);
            txt.fillStyle="#ffffff";
            txt.font=("normal normal {size}/{line} arial").replace("{size}","18px").replace("{line}","24px");
            txt.textBaseline="middle";
            txt.textAlign="center";
            txt.fillText("加载资源"+this.loadNum+"/"+(this.data.length-1),centerObj.maxBox.w/2,centerObj.maxBox.h/2);
            txt.closePath();
        }
        centerObj.loadedObj.loadedSource(gsImgInfo[centerObj.gs][0],function(){
            for(var i = 0;i<gsImgInfo[centerObj.gs][1].length;i++){
                changeAttr(gsImgInfo[centerObj.gs][1][i]);

                var obj =null;
                gsImgInfo[centerObj.gs][1][i].type=typeof gsImgInfo[centerObj.gs][1][i].type=="undefined"?"stone":gsImgInfo[centerObj.gs][1][i].type;
                if(gsImgInfo[centerObj.gs][1][i].type=="stone"){
                    obj = new HGAME.stone(gsImgInfo[centerObj.gs][1][i]);
                    if(!obj.nowPush){
                        centerObj.stArr.push(obj);   
                    }
                    centerObj.maxBox.add(obj);
                }else if(gsImgInfo[centerObj.gs][1][i].type=="goods"){
                    obj = new HGAME.goods(gsImgInfo[centerObj.gs][1][i],centerObj);
                    if(!obj.nowPush){
                        centerObj.goodsArr.push(obj);   
                    }
                }
            }
            setTimeout(function(){
                centerObj.maxBox.add(centerObj.user.user);
                centerObj.animate.run();
                centerObj.animate2.run();
            },500);
    
        });
    }
    centerObj.loadedObj.loadedSource(allImgData,function(){
        var userDate=METHOD.arrToImg(userImg);
        var uImgArr = [userDate[0],userDate[1],userDate[2],userDate[3]];
        var tImgArr=[userDate[4],userDate[5],userDate[6],userDate[4]]
        centerObj.user=new HGAME.userObj({
            uImgObj:{w:73,h:77,x:100,y:135},
            gzObj:{w:72,h:50},
            tImgArr:tImgArr,
            lineObj:{w:50,h:4,color:"#cccccc"},
            uImgArr:uImgArr,
            sW: centerObj.maxBox.w,
            sH: centerObj.maxBox.h,
            gzImg:userDate[8],
            maxBox:centerObj.maxBox
        });
        var txt = centerObj.maxBox.txt;
        var img = METHOD.createImg("img/bg/startBg.jpg");
        txt.drawImage(img,0,0);
        //gsInfo(centerObj.gs);
        //centerObj.animate.run();
    });
    centerObj.maxBox.dom.addEventListener("click",function(e){
        var e = e||window.event;
        var point ={
            x:e.offsetX,
            y:e.offsetY
        }
        if(centerObj.start==false){
            var rectStart={//开始游戏
                x:186,
                y:531,
                w:128,
                h:38
            }
            var rectStart02={//继续游戏
                x:186,
                y:577,
                w:128,
                h:38
            }
            if(METHOD.inRect(point,rectStart)){
                gsInfo(centerObj.gs);
                centerObj.start=true;
            }
            if(METHOD.inRect(point,rectStart02)){
                gsInfo(typeof localStorage.gs=="undefined"?0:localStorage.gs);
                centerObj.start=true;
            }
            return;
        }
        if(centerObj.model.showView){
            if(METHOD.inRect(point,{
                x:centerObj.model.btn.CONST_BUF_X,
                y:centerObj.model.btn.CONST_BUF_Y,
                w:centerObj.model.btn.w,
                h:centerObj.model.btn.h
            })){
                if(centerObj.model.btnType=="next"){
                    clickNext();
                }else if(centerObj.model.btnType=="cx"){
                    centerObj.model.close();
                    centerObj.user.num=0;
                    centerObj.nowTime=0;
                    centerObj.gs=0;
                    gsInfo(centerObj.gs);
                }
               
            }
            if(METHOD.inRect(point,{
                x:centerObj.model.btn2.CONST_BUF_X,
                y:centerObj.model.btn2.CONST_BUF_Y,
                w:centerObj.model.btn2.w,
                h:centerObj.model.btn2.h
            })){
                if(centerObj.model.btn2Type=="jx"){
                    continueFun();
                }
               
            }
        }
    });
    window.onkeydown=function(e){
        e= e||window.event;
        if(e.keyCode==74){

            if(centerObj.user.line.w!=centerObj.user.bufW)return;
            centerObj.user.grabFun(centerObj);
            centerObj.user.colFun(centerObj.stArr);
        }
        if(e.keyCode==68|| e.keyCode==39){
            centerObj.user.moveLeft();
        }
        if(e.keyCode==65|| e.keyCode==37){
            centerObj.user.moveRight();
        }
    };
    var constStruct={
        bufW:0,
        bufW02:0,
        bufH:0,
        fontStr:"normal normal {size}/{line} arial"
    };
    function renderAfter(){
        if(centerObj.nowTime>=gsImgInfo[centerObj.gs][3]){
            centerObj.failFun();
        }
        var txt = centerObj.maxBox.txt;
        var str = "";
        txt.beginPath();
    
        txt.fillStyle="#000000";
        txt.fillRect(0,0,centerObj.maxBox.w,30);
      //  debugger;
        txt.font=constStruct.fontStr.replace("{size}","18px").replace("{line}",'24px');
        str="通关分数:"+centerObj.user.num+"/"+gsImgInfo[centerObj.gs][2];
        txt.fillStyle="#ffffff";
        txt.textBaseline="top";
        txt.textAlign="left";
        txt.fillText(str,10,3);
        constStruct.bufW+=txt.measureText(str).width+20;

        txt.strokeStyle="#ffffff";
        txt.lineWidth=2;
        txt.strokeRect(centerObj.maxBox.w-100-10,7,100,14);
        txt.fillStyle="#ffffff";
        txt.fillRect(centerObj.maxBox.w-100-9,8,98*(1-centerObj.nowTime/gsImgInfo[centerObj.gs][3]),12);
        txt.fillText("时间:",centerObj.maxBox.w-100-10-txt.measureText("时间:").width-10,3);
        constStruct.bufH=30;
        if(centerObj.user.goodsAddInfo>0){
            txt.shadowColor = 'rgba(0, 0, 0, 0.9)';
            // 将阴影向右移动15px，向上移动10px
            txt.shadowOffsetX = 0;
            txt.shadowOffsetY = 0;
            // 轻微模糊阴影
            txt.shadowBlur = 10;
            str="拉力增加:"+centerObj.user.goodsAddInfo+"s";
            txt.font=constStruct.fontStr.replace("{size}","12px").replace("{line}",'12px');
            txt.fillStyle="rgba(0,0,0,0.6)";
            txt.fillText(str,10,constStruct.bufH+5);
            constStruct.bufW02=10+txt.measureText(str).width;
            constStruct.bufH+=17;
            txt.shadowBlur = 0;
        }
        
        txt.closePath();
    }
    document.getElementById("demo").appendChild(centerObj.maxBox.dom);
})();