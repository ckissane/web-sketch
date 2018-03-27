(function(){
var can=document.createElement("canvas");
can.id="sketch";
can.style="position: fixed;top:0px;left:0px;background: white;z-index: 10000;pointer-events: none;";
document.body.appendChild(can);
const rc = rough.canvas(document.getElementById('sketch'));

var generated=[];
rc.canvas.width=window.innerWidth;
rc.canvas.height=window.innerHeight;
var tnode = document.body;
function drawNode(node,c,root){
  var generator = c.generator;
  var gens=[];
  var strokeDir=Math.random()*180;
  var genCond=[];
  var style=node.style;
  if(style){
  style=window.getComputedStyle(node);
}
  if(style){
    genCond.push(style.width+"");
    genCond.push(style.height+"");
    genCond.push(style.background+"");
    genCond.push(style.color+"");
    genCond.push(style.padding+"");
    genCond.push(style.border+"");
  }
  if(node.getBoundingClientRect){
    var rect=node.getBoundingClientRect();
    genCond.push(rect.x+"");
    genCond.push(rect.y+"");

  }
  var needToGen=true;
  if(node.generatedSketch){
    needToGen=false;
    gens=node.generatedSketch[0];
    //genCond=node.generatedSketch[1];
  }
  if(!needToGen){
    if(JSON.stringify(genCond)!=node.generatedSketch[1]){
      needToGen=true;
    }
  }
if(node==c.canvas){
  return;
}
  var rootRect=root.getBoundingClientRect();
  //rootRect.y+=window.scrollY;
  var style=node.style;
  if(style){
  style=window.getComputedStyle(node);
}
  if(style && style.display=="none"){
    return;
  }
  /*if(needDraw(node)){

  }*/
  //console.log(node);
  if(needToGen){
node.strokeDir=strokeDir;
  }else{
    if(node.strokeDir){
      strokeDir=node.strokeDir;
    }
  }
if(needToGen){

  gens=[];
  if(node.getBoundingClientRect){
    var rect=node.getBoundingClientRect();
    rect.x-=rootRect.x;
    rect.y-=rootRect.y;
    //console.log(node,rect);
    if(style.backgroundColor!=="rgba(0, 0, 0, 0)"){
    gens.push(generator.rectangle(rect.x,rect.y,rect.width,rect.height,{fill:style.backgroundColor,strokeWidth:0,stroke:"rgba(0,0,0,0)",
    hachureAngle: strokeDir, // angle of hachure,
  hachureGap: 0.5,
  roughness: 2.8
}));
  }
  var bow=200;
  if(style.borderTopWidth!=="0px"){
    gens.push(generator.line(rect.x,rect.y,rect.x+rect.width,rect.y,{stroke:style.borderTopColor||"rgba(0,0,0,0)",strokeWidth:style.borderTopWidth,bowing:bow/rect.width}));
  }
  if(style.borderLeftWidth!=="0px"){
    gens.push(generator.line(rect.x,rect.y,rect.x,rect.y+rect.height,{stroke:style.borderLeftColor||"rgba(0,0,0,0)",strokeWidth:style.borderLeftWidth,bowing:bow/rect.height}));
  }
  if(style.borderBottomWidth!=="0px"){
    gens.push(generator.line(rect.x,rect.y+rect.height,rect.x+rect.width,rect.y+rect.height,{stroke:style.borderBottomColor||"rgba(0,0,0,0)",strokeWidth:style.borderBottomWidth,bowing:bow/rect.width}));
  }
  if(style.borderRightWidth!=="0px"){
    gens.push(generator.line(rect.x+rect.width,rect.y,rect.x+rect.width,rect.y+rect.height,{stroke:style.borderRightColor||"rgba(0,0,0,0)",strokeWidth:style.borderRightWidth,bowing:bow/rect.height}));
  }
  }
  node.generatedSketch=[gens,JSON.stringify(genCond)];
  //console.log(gens)
}
for(var i=0;i<gens.length;i++){
  c.draw(gens[i]);
}
  if(node.nodeType!==3 && node.getBoundingClientRect){
    var rect=node.getBoundingClientRect();
    var style=node.style;
    if(style){
      style=window.getComputedStyle(node);
    }
    rect.x-=rootRect.x;
    rect.y-=rootRect.y;
    if(style){
      rect.x+=parseFloat(style.paddingLeft);
      rect.y+=parseFloat(style.paddingTop);
    }
    //console.log(node,rect);
    c.ctx.beginPath();
    c.ctx.fillStyle="black";
    c.ctx.font=style.font;
    c.ctx.textBaseline ="top";// style.verticalAlign;
    c.ctx.fillText((node.value||""),rect.x,rect.y);
    c.ctx.fill();
    /*c.rectangle(rect.x,rect.y,rect.width,rect.height,{fill:style.backgroundColor,strokeWidth:0,stroke:"rgba(0,0,0,0)"});
    if(style.borderTopWidth){
    c.line(rect.x,rect.y,rect.x+rect.width,0,{stroke:style.borderTopColor||"rgba(0,0,0,0)",strokeWidth:style.borderTopWidth});
  }*/
  }
  if(node.nodeType==3 && !node.parentElement.value){
    var rect=node.parentElement.getBoundingClientRect();
    var range = document.createRange();
    range.selectNodeContents(node);
    var rects = range.getClientRects();
    if (rects.length > 0) {
      var style=node.parentElement.style;
      if(style){
        style=window.getComputedStyle(node.parentElement);
      }
      c.ctx.beginPath();
      c.ctx.font=style.font;
      c.ctx.fillStyle=style.color;
      c.ctx.textBaseline ="top";//style.verticalAlign;
      var textToDo=node.textContent.replace(/\n/g,"");
      var startText=0;
      var endText=0;
      for(var i=0;i<rects.length;i++){
        while(textToDo[startText]===" "){
          startText++;
        }
        endText=startText+0;
        var textPart="";
        var textWidth=c.ctx.measureText(textPart).width;
        rect=rects[i];
        rect.x-=rootRect.x;
        rect.y-=rootRect.y;
        while(endText<textToDo.length && textWidth<rect.width){
          endText++;
          textPart=textPart+textToDo[endText-1];
          textWidth=c.ctx.measureText(textPart).width;
        }
        //  console.log("Text node rect: ", rects[0]);


        //console.log(node,rect);

        c.ctx.fillText(textPart,rect.x,rect.y);
        startText=endText+0;
      }
      c.ctx.fill();
    }
    /*c.rectangle(rect.x,rect.y,rect.width,rect.height,{fill:style.backgroundColor,strokeWidth:0,stroke:"rgba(0,0,0,0)"});
    if(style.borderTopWidth){
    c.line(rect.x,rect.y,rect.x+rect.width,0,{stroke:style.borderTopColor||"rgba(0,0,0,0)",strokeWidth:style.borderTopWidth});
  }*/
  }
  if(node.tagName=="CANVAS"){
    var rect=node.getBoundingClientRect();
    var style=node.style;
    if(style){
    style=window.getComputedStyle(node);
    }
    rect.x-=rootRect.x;
    rect.y-=rootRect.y;
    c.ctx.drawImage(node,rect.x,rect.y,rect.width,rect.height);

  }
  if(node.tagName=="IMG"){
    var rect=node.getBoundingClientRect();
    var style=node.style;
    if(style){
    style=window.getComputedStyle(node);
    }
    rect.x-=rootRect.x;
    rect.y-=rootRect.y;
    c.ctx.drawImage(node,rect.x,rect.y,rect.width,rect.height);

  }


  //node.element.getClie
  if(node.childNodes && node.getBoundingClientRect && style && style.display!=="none"){
    var child=[];
    for(var i=0;i<node.childNodes.length;i++){
      var cn=node.childNodes[i];
      child.push(cn);
    }
    child.sort(function(a,b){return zIndex(a)-zIndex(b)});
    for(var i=0;i<node.childNodes.length;i++){
      var cn=child[i];
      drawNode(cn,c,root);
    }
  }
}
function zIndex(node){
  var style=node.style;
  if(style){
  style=window.getComputedStyle(node);
  return parseFloat(style.zIndex);
}else{
  return 0;
}

}
function drawSelection(c,root){
  var rootRect=root.getBoundingClientRect();
    //rootRect.y+=window.scrollY;
  var selObj = window.getSelection();
  for(var j=0;j<selObj.rangeCount;j++){
  var range  = selObj.getRangeAt(j);
  var rects=range.getClientRects();
  for(var i=0;i<rects.length;i++){
    rect=rects[i];
    rect.x-=rootRect.x;
    rect.y-=rootRect.y;
    c.rectangle(rect.x,rect.y,rect.width,rect.height,{fill:"blue",strokeWidth:0,stroke:"rgba(0,0,0,0)",
    hachureAngle: 60, // angle of hachure,
  hachureGap: 10
  });
  }
}
}
function reDraw(){
  rc.ctx.clearRect(0,0,rc.canvas.width,rc.canvas.height);
  rc.ctx.save();
  rc.ctx.translate(-window.scrollX,-window.scrollY);
  drawNode(tnode,rc,tnode)
  drawSelection(rc,tnode);
  rc.ctx.restore();
  requestAnimationFrame(reDraw);
}

//var drawInterval=window.setInterval(reDraw,100);
//draw(tnode,rc,tnode)
reDraw();
window.addEventListener("resize",function(){
  rc.canvas.width=window.innerWidth;
  rc.canvas.height=window.innerHeight;
});
})();
