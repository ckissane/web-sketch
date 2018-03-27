//(function(){
// offsetRelative (or, if you prefer, positionRelative)
(function($){
    $.fn.offsetRelative = function(top){
        var $this = $(this);
        var $parent = $this.offsetParent();
        var offset = $this.position();
        if(!top) return offset; // Didn't pass a 'top' element
        else if($parent.get(0).tagName == "BODY") return offset; // Reached top of document
        else if($(top,$parent).length) return offset; // Parent element contains the 'top' element we want the offset to be relative to
        else if($parent[0] == $(top)[0]) return offset; // Reached the 'top' element we want the offset to be relative to
        else { // Get parent's relative offset
            var parent_offset = $parent.offsetRelative(top);
            offset.top += parent_offset.top;
            offset.left += parent_offset.left;
            return offset;
        }
    };
    $.fn.positionRelative = function(top){
        return $(this).offsetRelative(top);
    };
}(jQuery));
var can=document.createElement("canvas");
can.id="sketch";
can.style="position: fixed;top:0px;left:0px;background: white;z-index: 10000;pointer-events: none;";
document.body.appendChild(can);
const rc = rough.canvas(document.getElementById('sketch'));
window.rc=rc;

var generated=[];
rc.canvas.width=window.innerWidth;
rc.canvas.height=window.innerHeight;
var tnode = document.body;

function drawText(ctx, text, fontSize, fontColor,font,max_width,pos,align) {
    var lines      =  new Array();
    var width = 0, i, j;
    var result;
    var color = fontColor || "white";

    // Font and size is required for ctx.measureText()
    ctx.beginPath();
    ctx.font=font;


    // Start calculation
    while ( text.length ) {
    	for( i=text.length; ctx.measureText(text.substr(0,i)).width > max_width; i-- );

    	result = text.substr(0,i);

    	if ( i !== text.length )
    		for( j=0; result.indexOf(" ",j) !== -1; j=result.indexOf(" ",j)+1 );

    	lines.push( result.substr(0, j|| result.length) );
    	width = Math.max( width, ctx.measureText(lines[ lines.length-1 ]).width );
    	text  = text.substr( lines[ lines.length-1 ].length, text.length );
    }


    ctx.fillStyle = color;
    for ( i=0, j=lines.length; i<j; ++i ) {
      if(align==="center"){
      	ctx.fillText( lines[i], pos.x+max_width/2-ctx.measureText(lines[ i]).width/2,  fontSize/1.4 + (fontSize) * i+pos.y );
      }else{
        ctx.fillText( lines[i], pos.x,  fontSize/1.4 + (fontSize) * i+pos.y );
      }
    }
    ctx.fill();
}
function drawNode(node,c,root,offset){
  var sketchRotation=Math.random()*Math.PI*2;
  var generator = c.generator;
  var gens=[];
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
    genCond.push(style.textAlign+"");
  }
  if(node.getBoundingClientRect){
    var rect=node.getBoundingClientRect();
    genCond.push(rect.x+"");
    genCond.push(rect.y+"");

  }
  if(node.sketchRotation && false){
    sketchRotation=node.sketchRotation;

  }else{
    node.sketchRotation=sketchRotation;
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
  c.ctx.save();
  var offset={x:0,y:0};
  var size={x:0,y:0};
  var center={x:0,y:0};
  var relOff={left:0,top:0};
  if(node.style){
  relOff=$(node).offsetRelative(node.parentElement);
   relOff={left:node.getBoundingClientRect().left-node.parentElement.getBoundingClientRect().left,top:node.getBoundingClientRect().top-node.parentElement.getBoundingClientRect().top};
}
  if(node.getBoundingClientRect){

    center.x=relOff.left+node.offsetWidth/2;
    center.y=relOff.top+node.offsetHeight/2;
    size={x:parseFloat(style.width),y:parseFloat(style.height)};
  }
  c.ctx.translate(center.x,center.y);
    c.ctx.translate(-size.x/2,-size.y/2);
if(needToGen){

  gens=[];
  if(node.getBoundingClientRect){
    var rect=node.getBoundingClientRect();
    rect.x=0;//parseFloat(node.offsetLeft)+node.style.marginLeft;
    rect.y=0;//parseFloat(node.offsetTop)+node.style.marginTop;
    offset.x=parseFloat(rect.x)+parseFloat(node.style.paddingLeft);
    offset.y=parseFloat(rect.y)+parseFloat(node.style.paddingTop);
    size={x:parseFloat(style.width),y:parseFloat(style.height)};
    //rect.x-=rootRect.x;
    //rect.y-=rootRect.y;
    //console.log(node,rect);
    if(style.backgroundColor!=="rgba(0, 0, 0, 0)"){
    gens.push(generator.rectangle(0,0,size.x,size.y,{fill:style.backgroundColor,strokeWidth:0,stroke:"rgba(0,0,0,0)",
    hachureAngle: sketchRotation/Math.PI*180, // angle of hachure,
  hachureGap: 1
}));
  }
  var bow=200;
  rect.x=0;
  rect.y=0;
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
    if(style.textAlign=="center"){
      drawText(c.ctx,(node.value||""),parseFloat(style.lineHeight),style.color,style.font,parseFloat(style.width),{x:parseFloat(0),y:parseFloat(0)},"center");

  }else{

   drawText(c.ctx,(node.value||""),parseFloat(style.lineHeight),style.color,style.font,parseFloat(style.width),{x:parseFloat(0),y:parseFloat(0)});
    /*c.ctx.beginPath();
    c.ctx.fillStyle="black";
    c.ctx.font=style.font;
    c.ctx.textBaseline ="top";// style.verticalAlign;
    c.ctx.textAlign="start";
    c.ctx.fillText((node.value||""),rect.x,rect.y);
    c.ctx.fill();*/
  }
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
    var style=node.parentElement.style;
    if(style && rect.width>2){
      style=window.getComputedStyle(node.parentElement);

    drawText(c.ctx,node.textContent,parseFloat(style.lineHeight),style.color,style.font,parseFloat(style.width),{x:0,y:0},style.textAlign);
  }
    /*if (rects.length > 0) {
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

  c.ctx.restore();
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
  drawNode(tnode,rc,tnode,{x:0,y:0})
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
//})();
