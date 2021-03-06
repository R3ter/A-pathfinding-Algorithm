var canvas = document.getElementById("canvas");
var button = document.getElementById("start");
var playerpos = document.getElementById("player");
var foodpos = document.getElementById("food");
var restart = document.getElementById("restart");
var warning = document.getElementById("warning");
var speedval = document.getElementById("speed");
var removewalls = document.getElementById("removewalls");
var ctx = canvas.getContext("2d");
var checkbox=document.getElementById("check");
var gotocornars=checkbox.checked;
var speed=1;
var pixlsize=30;
var player={x:pixlsize*15,y:pixlsize*15};
var food={x:pixlsize*0,y:pixlsize*0};
var neighbors=new Array();
var waypoints=new Array();
var path=new Array();
var timer;
var walls=new Array();
var changeplayer=false;
var changefood=false;


var draw=function(){
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    neighbors.forEach((x)=>{
        ctx.fillStyle = "#990000";
        ctx.fillRect(x.x,x.y,pixlsize,pixlsize);
    })
    waypoints.forEach((x)=>{
        ctx.fillStyle = "#000000";
        ctx.fillRect(x.x,x.y,pixlsize,pixlsize);
    })

    for(var i=0; i<canvas.width/pixlsize; i++){
        for(var j=0; j<canvas.height/pixlsize; j++){
            ctx.rect(i*pixlsize, j*pixlsize, pixlsize, pixlsize);
        }
    }
    walls.forEach((element)=>{
        ctx.fillStyle="green";
        ctx.fillRect(element.x, element.y,pixlsize,pixlsize);
    })
    path.forEach((element)=>{
        ctx.fillStyle="blue";
        ctx.fillRect(element.x, element.y,pixlsize,pixlsize);
    })

    ctx.fillStyle="gray";
    ctx.fillRect(food.x,food.y,pixlsize,pixlsize);

    ctx.fillStyle="darkgray";
    ctx.fillRect(player.x,player.y,pixlsize,pixlsize);    
    ctx.stroke();
}


var current=player;
var integer=0;
function waleed(){
    integer++;
    if(current.x<canvas.width-pixlsize){
        neighbors.push({x:current.x+pixlsize,y:current.y,parent:current})
        if(current.y>0&&gotocornars){
            neighbors.push({x:current.x-pixlsize,
                y:current.y-pixlsize,parent:current})
        }
    }
    if(current.x>0){
        neighbors.push({x:current.x-pixlsize,y:current.y,parent:current})
        if(current.y<canvas.height-pixlsize&&gotocornars){
             neighbors.push({x:current.x-pixlsize,
                y:current.y+pixlsize,parent:current})
        }
    }
    if(current.y<canvas.height-pixlsize){
        neighbors.push({x:current.x,y:current.y+pixlsize,parent:current})
        if(current.x<canvas.width-pixlsize&&gotocornars){
            neighbors.push({x:current.x+pixlsize,y:current.y,parent:current}) 
        }
    }
    if(current.y>0){
        neighbors.push({x:current.x,y:current.y-pixlsize,parent:current})
        if(current.x>0&&gotocornars){
            neighbors.push({x:current.x-pixlsize,y:current.y,parent:current})
        }
    }
   
    if(!waypoints.includes({x:current.x,y:current.y})){
        waypoints.push({x:current.x,y:current.y,parent:current.parent});
    }
    

    if(current.x==food.x&&food.y==current.y){
        while(true){
            try{
                var point= waypoints.find((x)=>x.x==current.x&&x.y==current.y)
                path.push({x:point.parent.x,y:point.parent.y});
                current=point.parent;
            }catch{
                clearTimeout(timer);
                break;
            }
        }
        console.log(path);
        path.push(player)
    }

    var f_cost=999999999999999;
    neighbors.forEach(element => {
        var skip=false;
        
        waypoints.forEach((x)=>{
            if((element.x==x.x&&x.y==element.y)){skip=true;}})
        walls.forEach((x)=>{
                if((element.x==x.x&&x.y==element.y)){skip=true;}})
        if(!skip){
            
            var a = element.x-food.x  ;
            var b = element.y-food.y ;
            var c = Math.sqrt( a*a + b*b );
            var g_cost=c;
            
            
            var a = element.x-player.x ;
            var b = element.y-player.y ;
            var c = Math.sqrt( a*a + b*b );
            var h_cost=c;


            if(g_cost+h_cost<f_cost){
                f_cost=g_cost+h_cost;
                current=element;
            }
        }
    });
draw();
}

canvas.addEventListener("mousedown",(e)=>{
    const rect = canvas.getBoundingClientRect()
    const ox = event.clientX - rect.left
    const oy = event.clientY - rect.top
    
    x=Math.floor(ox/pixlsize)*pixlsize
    y=Math.floor(oy/pixlsize)*pixlsize

    if(changeplayer){player={x:x,y:y};current=player;changeplayer=false;
    walls=walls.filter((e)=>(e.x!=x||e.y!=y));
    warning.innerText="";changefood=false;draw();return}
    if(changefood){food={x:x,y:y};
    walls=walls.filter((e)=>(e.x!=x||e.y!=y));
    warning.innerText="";changeplayer=false;changefood=false;draw();return}

    var include=false;
    walls.forEach((e)=>{
        if(e.x==x&&e.y==y){
            include=true;
        }
    })
    if(!include){
        walls.push({x:x,y:y})
    }else{
        walls=walls.filter((e)=>{return (e.x!=x||e.y!=y)})
    }
    var x="";
    walls.forEach((e)=>{
        x=x+","+JSON.stringify(e)
        x=x.replace(/"/g,"");
    })
    console.log(x)
    draw();
})
var stop=function(){
    clearTimeout(timer);
    start=false;
}
var restartfun=function(){
    start=false;
    button.innerText="Start Searching";
    current=player;
    clearTimeout(timer);
    path.splice(0,path.length)
    neighbors.splice(0,neighbors.length)
    waypoints.splice(0,waypoints.length);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw()
}

var start=false;
button.onclick=()=>{
    if(start){stop(); button.innerText="Start Searching"; return}
    else{
        timer=setInterval(waleed, speed*10); 
        button.innerText="Stop Searching";
        start=true;
    }
}

restart.onclick=()=>{
   restartfun()
}

    
checkbox.onclick=()=>{
    gotocornars=checkbox.checked;
}
var removewallsfun=function(){
    walls=new Array();
    draw()
}
playerpos.onclick=()=>{
    changeplayer=true;
    changefood=false;
    warning.innerText="Select position for first point";
}
foodpos.onclick=()=>{
    changefood=true;
    changeplayer=false;
    warning.innerText="Select position for second point";
}
removewalls.onclick=()=>{
   removewallsfun()
}
draw();
speedval.oninput=()=>{
    if(speedval.value.length>2){speedval.value=speedval.value.slice(0,2);}
    speed=(speedval.value);

}
ctx.stroke();
