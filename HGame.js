/**
 * Created by Administrator on 2017/11/26.
 * author 375361172@qq.com
 * 基类
 * V1.0.00 (20171210) 明确版本的概念 2d对象 canvas对象 资源对象 动画对象 完成实例演示填色小游戏;
 * V1.0.01 (20171210) 编写镜头对象 完成实例演示天火决;
 * V1.0.02 (20180123) 完善2d对象 canvas对象 新增全局变量 METHOD 备份一些方法;
 */
function empty(arr){
    if(!arr.length)return;
    arr.splice(0,arr.length);
}
function extend(O1,O2){
    if(typeof O2=="undefined"||typeof O1=="undefined")return;
    for(var i in O2){
        O1[i]=O2[i];
    }
}
function each(arr,f){
    for(var i = 0;i<arr.length;i++){
        f.call(arr[i],i,arr[i]);
    }
}
/*判断透明度是否执行函数*/
function dataInfo(Obj,x,y){
    var c=document.createElement("canvas");
    var txt= c.getContext("2d");
    c.width=Obj.img.width;
    c.height=Obj.img.height;
    txt.drawImage(Obj.img,0,0);
    var data=txt.getImageData(x-1,y-1,3,3);
    var num=0;
    for(var q=0;q<data.data.length;q+=4){
        num+=data.data[q+3];
    }
    num=num/9;
    return parseInt(num);
}
var HGAME=new Object();
var METHOD = new Object();
HGAME.version="1.0.01";
METHOD.showMethod=function(){
    if(!METHOD["SAY"])return;
    for(var i in METHOD){
        if(!METHOD["SAY"][i])continue;
        console.log(i+":"+METHOD["SAY"][i]);
    }
};

//两点之间的角度
METHOD.pointAngleInfo=function(point1,point2){
    if(point2.x==point1.x&&point2.y==point1.y){
        return 0;
    }
    if(point2.x>point1.x&&point2.y>point1.y){//第一象限
        return Math.atan((point2.y-point1.y)/(point2.x-point1.x))/Math.PI*180
    }else if(point2.x<point1.x&&point2.y>point1.y){
        return Math.atan((point1.x-point2.x)/(point2.y-point1.y))/Math.PI*180+90
    }else if(point2.x<point1.x&&point2.y<point1.y){
        return Math.atan((point1.y-point2.y)/(point1.x-point2.x))/Math.PI*180+180
    }else if(point2.x>point1.x&&point2.y<point1.y){
        return Math.atan((point2.x-point1.x)/(point1.y-point2.y))/Math.PI*180+270
    }
    if(point2.x==point1.x&&point2.y>point1.y){
        return 90;
    }else if(point2.x==point1.x&&point2.y<point1.y){
        return 270;
    }else if(point2.x>point1.x&&point2.y==point1.y){
        return 360;
    }else{
        return 180;
    }
};
METHOD.createImg=function(src){
    var img = new Image();
    img.src=src;
    return img;
}
METHOD.arrToImg=function(arr){
    var arrs=new Array();
    for(var i =0;i<arr.length;i++){
        arrs[i]=new Image();
        arrs[i].src= arr[i];
    }
    return arrs;
};
//极坐标位移
METHOD.polarCoordinates=function(point,angle,distance){
    angle=angle%360;
    var p2={x:0,y:0};
    if(angle>0&&angle<90){
        p2.x=point.x+Math.cos(angle*2*Math.PI/360)*distance;
        p2.y=point.y+Math.sin(angle*2*Math.PI/360)*distance;
    }else if(angle>90&&angle<180){
        p2.x=point.x-Math.sin((angle-90)*2*Math.PI/360)*distance;
        p2.y=point.y+Math.cos((angle-90)*2*Math.PI/360)*distance;
    }else if(angle>180&&angle<270){
        p2.x=point.x-Math.cos((angle-180)*2*Math.PI/360)*distance;
        p2.y=point.y-Math.sin((angle-180)*2*Math.PI/360)*distance;
    }else if(angle>270&&angle<360){
        p2.x=point.x+Math.sin((angle-270)*2*Math.PI/360)*distance;
        p2.y=point.y-Math.cos((angle-270)*2*Math.PI/360)*distance;
    }
    if(angle==0||angle==360){
        p2.x=point.x+distance;
        p2.y=point.y;
    }else if(angle==90){
        p2.x=point.x;
        p2.y=point.y+distance;
    }else if(angle==180){
        p2.x=point.x-distance;
        p2.y=point.y;
    }else if(angle==270){
        p2.x=point.x;
        p2.y=point.y-distance;
    }
    return p2;
};
//判断点是否在矩形里面
METHOD.inRect=function(point,Obj){
    if(point.x>=Obj.x&&Obj.x+Obj.w>=point.x&&point.y>=Obj.y&&Obj.y+Obj.h>=point.y)return true;
    return false
};
//贝塞尔曲线2次
METHOD.bezierCurve=function(O){
    var defaultObj={
        t:0,
        P0:0,
        P1:0,
        P2:0
    };
    extend(defaultObj,O);
    //defaultObj=null;
    return (1-defaultObj.t)*(1-defaultObj.t)*defaultObj.P0+2*defaultObj.t*(1-defaultObj.t)*defaultObj.P1+defaultObj.t*defaultObj.t*defaultObj.P2;
}
METHOD.getRotatePoint=function(O){
    var ang=O.angle%360;
    var x = O.CONST_BUF_X+ O.rotatePointX;
    var y = O.CONST_BUF_Y+ O.rotatePointY;
    var x2=0;
    var y2=0;
    if(ang!=0){
        var cos =Math.cos(Math.PI/180*ang);
        var sin =Math.sin(Math.PI/180*ang);

        var bufX = (-O.rotatePointX)*cos - sin*(-O.rotatePointY);
        var bufY = (-O.rotatePointX)*sin + cos*(-O.rotatePointY);
        x2=bufX;
        y2=bufY;
    }else if(ang==0){
        x = O.CONST_BUF_X;
        y = O.CONST_BUF_Y;
    }
    return {x:x+x2,y:y+y2}
};
METHOD.getPoint=function(arr,o){
    var ang = o.angle%360;
    var bufX = 0;
    var bufY = 0;
    var sin = Math.sin(Math.PI/180*(360-ang));
    var cos = Math.cos(Math.PI/180*(360-ang));
    for(var i = 0 ;i<arr.length;i++){
        bufX=(arr[i].x- o.CONST_BUF_X- o.rotatePointX)*cos - sin *(arr[i].y- o.CONST_BUF_Y- o.rotatePointY);
        bufY=(arr[i].x- o.CONST_BUF_X- o.rotatePointX)*sin + cos *(arr[i].y- o.CONST_BUF_Y- o.rotatePointY);
        arr[i].x=bufX;
        arr[i].y=bufY;
    }
};
//托管对象的属性
METHOD.defineEx=function(O,key,val,after,before){
    var buf=val;
    Object.defineProperty(O,key,{
        set:function(v){
            before&&before.call(O,buf);
            buf=v;
            after&&after.call(O,buf);
        },
        get:function(){
            return buf;
        }
    });
};
HGAME.event=new Object();//事件对象
HGAME.event.clickBuffer=new Array();//缓存要添加事件的节点 click buffer
HGAME.attr=new Object();
HGAME.attr.bufCanvs=document.createElement("canvas");//缓存一个canvas做一些旋转 放大的操作
HGAME.attr.bufTxt=HGAME.attr.bufCanvs.getContext("2d");
HGAME.animate=function(Obj){
    Obj=Obj||{};
    var defaultObj={
        time:30,//动画间隔
        frequency:-1,//动画次数 -1表示无限制
        action:function(){},//动画每一帧的动作
        lastAction:function(){},//最后一次动画执行完成触发函数
        aSecondAction:function(){//每隔一秒指向的函数

        }
    };
    extend(defaultObj,Obj);
    var THIS = this;
    var oldTime=new Date();
    var newTime=null;
    this.time=defaultObj.time;
    this.frequency=defaultObj.frequency;

    this.action=defaultObj.action;
    this.lastAction=defaultObj.lastAction;
    this.aSecondAction=defaultObj.aSecondAction;
    this._struct="animate";
    this.stop=function(){
        cancelAnimationFrame(THIS.INT_BUFFER);
    };



    /*FPS相关*/
    this.fpsDom=document.createElement("div");
    this.fpsInt=0;
    this.showFPS=function(){
        document.body.appendChild(this.fpsDom);
        this.fpsDom.style.cssText="position:fixed;left:0;top:0;z-index:1000;";
        this.showFPSBool=true;
    };
    this.showFPSBool=false;
    this.fpsTime=new Date();
    THIS.INT_BUFFER=0;
    THIS.aSecondTime=new Date();
    this.run=function(){
        THIS.INT_BUFFER=requestAnimationFrame(THIS.run);
        newTime=new Date();
        if(THIS.showFPSBool==true){
            THIS.fpsInt++;
            if(newTime-THIS.fpsTime>=1000){
                THIS.fpsTime=newTime;
                THIS.fpsDom.innerHTML="FPS:"+THIS.fpsInt;
                THIS.fpsInt=0;
            }
        }
        if(newTime-THIS.aSecondTime>=1000){
            THIS.aSecondTime=newTime;
            THIS.aSecondAction.call(THIS,THIS);
        }
        if(newTime-oldTime>THIS.time){

            oldTime=newTime;

            if(THIS.frequency!=-1){
                if(THIS.frequency-1==0){
                    THIS.frequency--;
                    THIS.action.call(THIS,THIS);
                    THIS.lastAction.call(THIS,THIS);
                    THIS.stop();
                    return;
                }
                if(THIS.frequency==0){
                    THIS.stop();
                    return;
                }
                THIS.frequency--;
                THIS.action.call(THIS,THIS);
            }else{
                THIS.action.call(THIS,THIS);
            }
        }
        //THIS.INT_BUFFER=0;
    };
    this.action=Obj.action;
    return this;
};
/**
 * 2d对象类型
 * x 对象的x坐标
 * y 对象的y坐标
 * w 对象的宽度
 * h 对象的高度
 * color 对象的颜色
 * img 对象的img
 * child 对象的子代 子代的x y会相对于父代
 * W_INT 当一张图出现多帧的时候需要使用
 * H_INT 当一张图出现多帧的时候需要使用
 * CONST_BUF_X 在画布上的x 不用修改 修改了也没用
 * CONST_BUF_Y 在画布上的y 不用修改 修改了也没用
 *
 * click相关
 * clickFun 点击
 * isClick 是否添加点击事件
 */
HGAME.Object2D=function(Obj){
    Obj=Obj||{};
    var defaultObj={
        x:0,
        y:0,
        w:20,
        h:20,
        W_INT:0,
        H_INT:0,
        color:"#cccccc",
        img:null,
        child:new Array(),
        CONST_BUF_X:0,
        CONST_BUF_Y:0,
        clickFun:function(){},
        isClick:false,
        angle:0,//旋转角度
        faceAngle:0,//面向角度
        shadowColor:"",
        shadowBlur:0,
        shadowOffsetX:0,
        shadowOffsetY:0,
        repeatType:"none"
    };
    extend(defaultObj,Obj);
    extend(this,defaultObj);
    this.CONST_BUF_X=this.x;
    this.CONST_BUF_Y=this.y;
    this.rotatePointX=Obj.rotatePointX?Obj.rotatePointX:this.w/2;
    this.rotatePointY=Obj.rotatePointY?Obj.rotatePointY:this.h/2;
    this.rotateX=this.x;
    this.rotateY=this.y;
    this._struct="Object2D";
    if(this.isClick){
        HGAME.event.clickBuffer.push(this);
    }
    this.add=function(Obj){
        this.child.push(Obj);
        Obj.parent=this;
    };
    this.remove=function(o){
        var index= this.child.indexOf(o);
        if(index>-1){
            this.child.splice(index,1);
        }
    };
    this.empty=function(){
        each(this.child,function(){
            this.parent=null;
        });
        this.child.splice(0,this.child.length);
    }
};
/**
 * 画布类型
 * dom 节点
 * w 宽度
 * h 高度
 * clearColor 默认的颜色
 * child 对象的子代 子代的x y会相对于父代
 * W_INT 当一张图出现多帧的时候需要使用
 * H_INT 当一张图出现多帧的时候需要使用
 * x 画布的x 相对于画布来说x应该是不需要改变的
 * y 画布的y 相对于划不来说y应该是不需要改变的
 * CONST_BUF_X 在画布上的x 不用修改 修改了也没用
 * CONST_BUF_Y 在画布上的y 不用修改 修改了也没用
 */
HGAME.canvas=function(Obj){
    Obj=Obj||{};
    var defaultObj={
        dom:document.createElement("canvas"),
        w:500,
        h:500,
        W_INT:0,
        H_INT:0,
        color:"#cccccc",
        child:new Array(),
        x:0,
        y:0,
        angle:0,//旋转角度
        faceAngle:0,//面向角度
        CONST_BUF_X:0,
        CONST_BUF_Y:0,
        shadowColor:"",
        shadowBlur:0,
        shadowOffsetX:0,
        shadowOffsetY:0,
        repeatType:"none"
    };
    var THIS = this;

    Object.defineProperty(this,"w",{
        set:function(a){
            THIS.dom.width=a;
        },
        get:function(){
            return THIS.dom.width;
        }
    });
    Object.defineProperty(this,"h",{
        set:function(a){
            THIS.dom.height=a;
        },
        get:function(){
            return THIS.dom.height;
        }
    });
    extend(defaultObj,Obj);
    extend(this,defaultObj);
    this.CONST_BUF_X=this.x;
    this.CONST_BUF_Y=this.y;
    this.rotateX=this.x;
    this.rotateY=this.y;
    this.rotatePointX=Obj.rotatePointX?Obj.rotatePointX:this.w/2;
    this.rotatePointY=Obj.rotatePointY?Obj.rotatePointY:this.h/2;
    this._struct="canvas";
    //由于canvas只兼容ie9及以上所以这里就不对事件进行兼容了
    this.dom.addEventListener("click",function(e){
        var event=typeof window.event!="undefined"?window.event:typeof e!="undefined"?e:event;
        var x =event.offsetX;
        var y =event.offsetY;
        var aX=0;
        var aY=0;
        var buf=null;
        for(var i =0;i<HGAME.event.clickBuffer.length;i++){
            buf=HGAME.event.clickBuffer[i];
            if(x>buf.x&&x<buf.x+buf.w&&y>buf.y&&y<buf.y+buf.h){
                if(buf.img){
                    aX=x-buf.x;
                    aY=y-buf.y;
                    if(dataInfo(buf,aX,aY)>80){
                        buf.clickFun.call(buf);
                    };
                }else{
                    buf.clickFun.call(buf);
                }
            }
        }
    });
    this.txt=this.dom.getContext("2d");

    this.txt.draw=function(O){
        var ang=O.angle%360;
        var x = O.CONST_BUF_X;
        var y = O.CONST_BUF_Y;
        var txt=THIS.txt;
        txt.save();
        txt.shadowColor=O.shadowColor,
        txt.shadowBlur=O.shadowBlur,
        txt.shadowOffsetX=O.shadowOffsetX,
        txt.shadowOffsetY=O.shadowOffsetY;
        if(ang!=0){
            txt.translate(O.rotatePointX, O.rotatePointY);
            txt.rotate(Math.PI/180*ang);
            txt.translate(-O.rotatePointX,-O.rotatePointY);
            var cos =Math.cos(Math.PI/180*(360-ang));
            var sin =Math.sin(Math.PI/180*(360-ang));
            var bufX = x*cos- sin*y;
            var bufY=x*sin+cos*y;
            x=bufX;
            y=bufY;
        }
        O.rotateX=x;
        O.rotateY=y;
        if(O.repeatType=="none"){
            if(O.img){
                txt.drawImage( O.img, O.w* O.W_INT,  O.h* O.H_INT, O.w, O.h, x, y, O.w, O.h);
            }else if(O.dom){
                txt.drawImage( O.dom, O.w* O.W_INT,  O.h* O.H_INT, O.w, O.h, x, y, O.w, O.h);
            }else{
                txt.fillStyle= O.color;
                txt.fillRect(x, y, O.w, O.h);
            }
            txt.shadowColor="",
            txt.shadowBlur=0,
            txt.shadowOffsetX=0,
            txt.shadowOffsetY=0;
            txt.restore();
        }else if(O.repeatType=="repeat"){
            txt.translate(x,y);
            txt.fillStyle=txt.createPattern(O.img,"repeat");
            txt.fillRect(0, 0, O.w,O.h);
            txt.shadowColor="",
            txt.shadowBlur=0,
            txt.shadowOffsetX=0,
            txt.shadowOffsetY=0;
            txt.restore();
        }

    };
    this.clear=function(){
        this.txt.clearRect(0,0,THIS.w,THIS.h);
    };
    this.render=function(){
        this.clear();
        this.txt.beginPath();
        function f(O){
            each(O.child,function(){
                this.CONST_BUF_X= O.CONST_BUF_X+this.x;
                this.CONST_BUF_Y= O.CONST_BUF_Y+this.y;
                THIS.txt.draw(this);
                if(this.child.length){
                    f(this);
                }
            });
        }
        f(THIS);
        this.txt.closePath();
    };
    this.add=function(Obj){
        this.child.push(Obj);
        Obj.parent=this;
    };
    this.remove=function(o){
        var index= this.child.indexOf(o);
        if(index>-1){
            this.child.splice(index,1);
        }
    };
    this.empty=function(){
        each(this.child,function(){
            this.parent=null;
        });
        this.child.splice(0,this.child.length);
    }
};
/**
 * 获取资源类型
 * data 一个资源字符串地址
 * loaded 所有资源加载完成
 * loadCall 加载资源的数字发生改变触发函数
 * loadNum 当前已经加载了多少资源
 * loadedSource 主动加载资源 当前资源对象的data会被改变 loadNum也会改变 触发的函数是第二个传入的参数
 * */
HGAME.source=function(Obj){
    Obj=Obj||{};
    var defaultObj={
        data:[],
        loaded:function(THIS){

        },
        loadCall:function(num,allNum){

        },
        loadNum:0
    };
    extend(defaultObj,Obj);
    extend(this,defaultObj);
    var THIS = this;
    var $valueBuff="";
    THIS._struct="source";
    Object.defineProperty(this,"loadNum",{
        get:function(){
            return $valueBuff;
        },
        set:function(v){
            if(THIS.data)THIS.loadCall.call(THIS,v,THIS.data.length);
            $valueBuff=v;
        }
    });
    var buf="";
    this.loadedSource=function(data,callBack){
        if(!THIS.data)return;
        THIS.data=data;
        THIS.loadNum=0;
        for(var i=0;i<THIS.data.length;i++){
            if(typeof this.data[i]=="string"){
                buf=THIS.data[i];
                THIS.data[i]=new Image();
                THIS.data[i].src=buf;
            }

        }
        for(i=0;i<THIS.data.length;i++){
            if(THIS.data[i].complete==true){
                THIS.data[i].width=parseInt(THIS.data[i].width);
                THIS.data[i].height=parseInt(THIS.data[i].height);
                THIS.loadNum++;
                if(THIS.loadNum==THIS.data.length){
                    callBack.call(THIS,THIS);
                }
            }else{
                THIS.data[i].onload=function(){
                    THIS.loadNum++;
                    if(THIS.loadNum==THIS.data.length){
                        callBack.call(THIS,THIS);
                    }
                    THIS.width=parseInt(THIS.width);
                    THIS.height=parseInt(THIS.height);
                };
                THIS.data[i].onerror=function(){
                    window.debuggerSource=THIS;
                }
            }
        }
    };
    for(var i=0;i<this.data.length;i++){
        if(typeof this.data[i]=="string"){
            buf=this.data[i];
            this.data[i]=new Image();
            this.data[i].src=buf;
        }
    }
    for(i=0;i<this.data.length;i++){
        if(this.data[i].complete==true){
            this.data[i].width=parseInt(this.data[i].width);
            this.data[i].height=parseInt(this.data[i].height);
            this.loadNum++;
            if(this.loadNum==this.data.length){
                console.log(this);
                console.log("not Load:"+this.loadNum);
                this.loadNum=0;
                this.loaded.call(this,this);
            }
        }else{
            this.data[i].onload=function(){
                THIS.loadNum++;
                if(THIS.loadNum==THIS.data.length){
                    console.log(THIS.loadNum);
                    console.log("Load:"+THIS.loadNum);
                    THIS.loadNum=0;
                    THIS.loaded.call(THIS,THIS);
                }
                this.width=parseInt(this.width);
                this.height=parseInt(this.height);
            };
            this.data[i].onerror=function(){
               // window.debuggerSource=THIS;
                console.log(THIS)
            }
        }
    }

};
/**
 * Camera 镜头对象
 * w 镜头节点的宽度
 * h 镜头节点的高度
 * x 镜头相对于源canvas的x
 * y 镜头相对于源canvas的y
 * child 整合的canvas对象
 * srcCanvas源canvas
 * 方法
 * this.render 着色 会自动着色child canvas对象里面的所有
 * this.initSrcCanvasWH 设置源canvas的宽高
 * this.initSrcCanvasImg 绘制源canvas
 * this.add 新增一个子canvas对象
 * */
HGAME.camera=function(Obj){
    Obj=Obj||{};
    var defaultObj={
        srcCanvas:null, //源canvas对象
        w:500,
        h:500,
        x:0,
        y:0,
        child:new Array()
    };
    extend(defaultObj,Obj);//深继承
    extend(this,defaultObj);
    this._struct="camera";
    this.canvas=new HGAME.canvas({
        w:this.w,
        h:this.h,
        x:this.x,
        y:this.y
    });//视图canvas 呈现canvas的canvas
    var keys=["w","h","x","y","dom"];
    var THIS = this;
    this.obj2d=new HGAME.Object2D({
        x:this.x,
        y:this.y
    });
    for(var i =0;i<keys.length;i++){
        (function(key){
            Object.defineProperty(THIS,key,{
                set:function(v){
                    THIS.canvas[key]=v;
                    if(key=="x"){
                        THIS.obj2d.x=v;
                    }else if(key=="y"){
                        THIS.obj2d.y=v;
                    }

                },
                get:function(){
                    return THIS.canvas[key];
                }
            });
        })(keys[i]);
    }
    this.srcCanvas=this.srcCanvas==null?new HGAME.canvas():this.srcCanvas;
    this.render=function(){
        if(this.srcCanvas==null)return console.log("srcCanvas is null");
        this.initSrcCanvasWH();
        this.initSrcCanvasImg();
        this.canvas.child[0]=this.obj2d;
        this.canvas.render();
    };
    this.getSrcWidth=function(){
        if(!this.child.length)return console.log("not find child");
        var bufMin=0;
        var bufMax=0;
        var bufW=0;
        for(var o =0;o<this.child.length;o++){
            if(this.child[o].x<bufMin){
                bufMin=this.child[o].x;
            }
            if(this.child[o].x>bufMax){
                bufMax=this.child[o].x;
            }
            if(this.child[o].w>bufW){
                bufW=this.child[o].w;
            }
        }
        bufMax=bufMax+bufW;
        return Math.abs(bufMin-bufMax);
    };
    this.getSrcHeight=function(){
        if(!this.child.length)return console.log("not find child");
        var bufMin=0;
        var bufMax=0;
        var bufH=0;
        for(var o =0;o<this.child.length;o++){
            if(this.child[o].y<bufMin){
                bufMin=this.child[o].y;
            }
            if(this.child[o].y>bufMax){
                bufMax=this.child[o].y;
            }
            if(this.child[o].h>bufH){
                bufH=this.child[o].h;
            }
        }
        bufMax=bufMax+bufH;
        return Math.abs(bufMin-bufMax);
    };
    this.initSrcCanvasWH=function(){
        this.srcCanvas.w=this.getSrcWidth();
        this.srcCanvas.h=this.getSrcHeight();
        this.obj2d.w=this.srcCanvas.w;
        this.obj2d.h=this.srcCanvas.h;
    };
    this.initSrcCanvasImg=function(){
        this.srcCanvas.child=this.child;
        this.srcCanvas.render();
        this.obj2d.img=this.srcCanvas.dom;
    };
    this.add=function(o){
        this.child.push(o);
        o.parent=this;
    };
    this.remove=function(o){
       var index= this.child.indexOf(o);
        if(index>-1){
            this.child.splice(index,1);
        }
    };
    this.empty=function(){
        each(this.child,function(){
            this.parent=null;
        });
        this.child.splice(0,this.child.length);
    }
};
/**
 * 碰撞对象
 *
 * */
HGAME.collision=function(Obj){
    Obj=Obj||{};
    var defaultObj={
        x1:"CONST_BUF_X",
        y1:"CONST_BUF_Y",
        x2:"CONST_BUF_X",
        y2:"CONST_BUF_Y",
        w1:"w",
        w2:"w",
        h1:"h",
        h2:"h"
    };
    extend(defaultObj,Obj);//深继承
    extend(this,defaultObj);
    this._struct="collision";
    /*非旋转碰撞AABB*/
    this.test=function(o1,o2){
            var o3={

            };
            extend(o3,this);
            var strQz="";
            var fun=function(){
                if(o1[o3.x1]>o2[o3.x2]&&o1[o3.x1]<o2[o3.x2]+o2[o3.w2]&&o1[o3.y1]>o2[o3.y2]&&o1[o3.y1]<o2[o3.y2]+o2[o3.h2]){
                    return strQz+"pzRT";//右顶部
                }else if(o1[o3.x1]+o1[o3.w1]>o2[o3.x2]&&o1[o3.x1]+o1[o3.w1]<o2[o3.x2]+o2[o3.w2]&&o1[o3.y1]>o2[o3.y2]&&o1[o3.y1]<o2[o3.y2]+o2[o3.h2]){
                    return strQz+"pzLT";//左顶部
                }else if(o1[o3.x1]>o2[o3.x2]&&o1[o3.x1]<o2[o3.x2]+o2[o3.w2]&&o1[o3.y1]+o1[o3.h1]>o2[o3.y2]&&o1[o3.y1]+o1[o3.h1]<o2[o3.y2]+o2[o3.h2]){
                    return strQz+"pzRB";//右底部
                }else if((o1[o3.x1]+o1[o3.w1]>o2[o3.x2]&&o1[o3.x1]+o1[o3.w1]<o2[o3.x2]+o2[o3.w2]&&o1[o3.y1]+o1[o3.h1]>o2[o3.y2]&&o1[o3.y1]+o1[o3.h1]<o2[o3.y2]+o2[o3.h2])){
                    return strQz+"pzLB";//左底部
                }else if((o1[o3.y1]+o1[o3.h1])==o2[o3.y2]&&o1[o3.x1]>o2[o3.x2]-o1[o3.w1]&&o1[o3.x1]<o2[o3.x2]+o2[o3.w2]){
                    return strQz+"pzBT";//顶部边框
                }else if(o1[o3.y1]==o2[o3.y2]+o2[o3.h2]&&o1[o3.x1]>o2[o3.x2]-o1[o3.w1]&&o1[o3.x1]<o2[o3.x2]+o2[o3.w2]){
                    return strQz+"pzBB";//底部边框
                }else if(o1[o3.x1]+o1[o3.w1]==o2[o3.x2]&&o1[o3.y1]>o2[o3.y2]-o1[o3.h1]&&o1[o3.y1]<o2[o3.y2]+o2[o3.h2]){
                    return strQz+"pzBL";//左部边框
                }else if(o1[o3.x1]==o2[o3.x2]+o2[o3.w2]&&o1[o3.y1]>o2[o3.y2]-o1[o3.h1]&&o1[o3.y1]<o2[o3.y2]+o2[o3.h2]){
                    return strQz+"pzBR";//右部边框
                }else{
                    return "pzNO"
                }
            };
        var str=fun();
        var O4=null;

        if(str=="pzNO"){
            O4=o1;
            o1=o2;
            o2=O4;
            strQz="jh";
            return fun();

        }else{
            return str;
        }

    };
    function changeVal(O1,O2){
        O2=O2||{a:"x0",b:"x1"};
        if(O1[O2.a]>O1[O2.b]){
            var buf = O1[O2.a];
            O1[O2.a]=O1[O2.b];
            O1[O2.b]=buf;
        }
    }
    /*旋转碰撞OBB*/
    this.rotateTest=function(o1,o2,txt){

        //获得矩形的八个点
        function a(o1,o2){
            var bool1=false;
            var bool2=false;
            var p1=METHOD.getRotatePoint(o1);//获取旋转的左顶点
            var p2=METHOD.polarCoordinates(p1,o1.angle,o1.w);//获取o1对象的右顶点
            var p3=METHOD.polarCoordinates(p1,o1.angle+90,o1.h);//获取o1对象的左底顶点
            var p4=METHOD.polarCoordinates(p3,o1.angle,o1.w);

            var p21=METHOD.getRotatePoint(o2);//获取旋转的左顶点
            var p22=METHOD.polarCoordinates(p21,o2.angle,o2.w);//获取o1对象的右顶点
            var p23=METHOD.polarCoordinates(p21,o2.angle+90,o2.h);//获取o1对象的左底顶点
            var p24=METHOD.polarCoordinates(p23,o2.angle,o2.w);
            var arr3=[p1,p2,p3,p4,p21,p22,p23,p24];
            METHOD.getPoint(arr3,o1);
          /*  txt.save();
            txt.translate(100,100);
            for(var w=0;w<arr3.length;w++){
                txt.beginPath();
                txt.arc(arr3[w].x,arr3[w].y,2,0,2*Math.PI);
                txt.fillText(w+"",arr3[w].x,arr3[w].y);
                txt.fill();
                txt.closePath();
            }
            txt.restore();
            txt.beginPath();
            txt.arc(o1.CONST_BUF_X+o1.w/2,o1.CONST_BUF_Y+o1.h/2,2,0,2*Math.PI);
            txt.fill();
            txt.closePath();*/
            var jxXxd={
                x0:Math.min(p1.x,p2.x,p3.x,p4.x),
                x1:Math.max(p1.x,p2.x,p3.x,p4.x)
            };
            var jxXxd2={
                x0:Math.min(p21.x,p22.x,p23.x,p24.x),
                x1:Math.max(p21.x,p22.x,p23.x,p24.x)
            };
            var jxYxd={
                x0:Math.min(p1.y,p2.y,p3.y,p4.y),
                x1:Math.max(p1.y,p2.y,p3.y,p4.y)
            };
            var jxYxd2={
                x0:Math.min(p21.y,p22.y,p23.y,p24.y),
                x1:Math.max(p21.y,p22.y,p23.y,p24.y)
            };
            if(jxXxd.x0<jxXxd2.x1&&jxXxd.x0>jxXxd2.x0){
                bool1=true;
            }else if(jxXxd.x1<jxXxd2.x1&&jxXxd.x1>jxXxd2.x0){
                bool1=true;
            }else if(jxXxd.x0+(jxXxd.x1-jxXxd.x0)/2<jxXxd2.x1&&jxXxd.x0+(jxXxd.x1-jxXxd.x0)/2>jxXxd2.x0){
                bool1=true;
            }

            if(jxYxd.x0<jxYxd2.x1&&jxYxd.x0>jxYxd2.x0){
                bool2=true;
            }else if(jxYxd.x1<jxYxd2.x1&&jxYxd.x1>jxYxd2.x0){
                bool2=true;
            }else if(jxYxd.x0+(jxYxd.x1-jxYxd.x0)/2<jxYxd2.x1&&jxYxd.x0+(jxYxd.x1-jxYxd.x0)/2>jxYxd2.x0){
                bool2=true;
            }

            if(bool1==true&&bool2==true){
                return true;
            }
            return false;
        }

        if(a(o1,o2)==true){
            return  a(o2,o1);
        }else{
            return false;
        }
    };
};


