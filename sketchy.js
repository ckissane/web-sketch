var can=document.createElement("canvas");
can.id="sketch";
can.style="position: fixed;top:0px;left:0px;background: white;z-index: 10000;pointer-events: none;";
document.body.appendChild(can);
const rc = rough.canvas(document.getElementById('sketch'));
rc.canvas.width=window.innerWidth;
rc.canvas.height=window.innerHeight;
var tnode = document.body;
function draw(node,c,root){
if(node==c.canvas){
  return;
}
  var rootRect=root.getBoundingClientRect();
  rootRect.y+=window.scrollY;
  var style=node.style;
  if(style){
  style=window.getComputedStyle(node);
}
  if(style && style.display=="none"){
    return;
  }
  //console.log(node);

  if(node.getBoundingClientRect){
    var rect=node.getBoundingClientRect();
    rect.x-=rootRect.x;
    rect.y-=rootRect.y;
    //console.log(node,rect);
    if(style.backgroundColor!=="rgba(0, 0, 0, 0)"){
    c.rectangle(rect.x,rect.y,rect.width,rect.height,{fill:style.backgroundColor,strokeWidth:0,stroke:"rgba(0,0,0,0)",
    hachureAngle: 60, // angle of hachure,
  hachureGap: 1
  });
  }
  var bow=200;
    if(style.borderTopWidth!=="0px"){
    c.line(rect.x,rect.y,rect.x+rect.width,rect.y,{stroke:style.borderTopColor||"rgba(0,0,0,0)",strokeWidth:style.borderTopWidth,bowing:bow/rect.width});
  }
  if(style.borderLeftWidth!=="0px"){
  c.line(rect.x,rect.y,rect.x,rect.y+rect.height,{stroke:style.borderLeftColor||"rgba(0,0,0,0)",strokeWidth:style.borderLeftWidth,bowing:bow/rect.height});
}
if(style.borderBottomWidth!=="0px"){
c.line(rect.x,rect.y+rect.height,rect.x+rect.width,rect.y+rect.height,{stroke:style.borderBottomColor||"rgba(0,0,0,0)",strokeWidth:style.borderBottomWidth,bowing:bow/rect.width});
}
  if(style.borderRightWidth!=="0px"){
  c.line(rect.x+rect.width,rect.y,rect.x+rect.width,rect.y+rect.height,{stroke:style.borderRightColor||"rgba(0,0,0,0)",strokeWidth:style.borderRightWidth,bowing:bow/rect.height});
}
  }
  if(node.nodeType!==3 && node.getBoundingClientRect){
    var rect=node.getBoundingClientRect();
    var style=node.style;
    if(style){
    style=window.getComputedStyle(node);
  }
    rect.x-=rootRect.x;
    rect.y-=rootRect.y;
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
      rect=rects[0];
      //  console.log("Text node rect: ", rects[0]);
    }

    var style=node.parentElement.style;
    if(style){
    style=window.getComputedStyle(node.parentElement);
  }
    rect.x-=rootRect.x;
    rect.y-=rootRect.y;
    //console.log(node,rect);
    c.ctx.beginPath();
    c.ctx.fillStyle="black";
    c.ctx.font=style.font;
    c.ctx.fillStyle=style.color;
    c.ctx.textBaseline =style.verticalAlign;
    c.ctx.fillText(node.textContent.replace("\n",""),rect.x,rect.y);
    c.ctx.fill();
    /*c.rectangle(rect.x,rect.y,rect.width,rect.height,{fill:style.backgroundColor,strokeWidth:0,stroke:"rgba(0,0,0,0)"});
    if(style.borderTopWidth){
    c.line(rect.x,rect.y,rect.x+rect.width,0,{stroke:style.borderTopColor||"rgba(0,0,0,0)",strokeWidth:style.borderTopWidth});
  }*/
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
      draw(cn,c,root);
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
    rootRect.y+=window.scrollY;
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
  draw(tnode,rc,tnode)
  drawSelection(rc,tnode);
  requestAnimationFrame(reDraw);
}

//window.setInterval(reDraw,10);
//draw(tnode,rc,tnode)
reDraw();
window.addEventListener("resize",function(){
  rc.canvas.width=window.innerWidth;
  rc.canvas.height=window.innerHeight;
});
