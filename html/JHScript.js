//基类概念级别的js
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * 模板内置方法 装载参数 到模板中 返回模板本身 
 * */
setParam=function(paramKey,paramValue) 
{
	this["param"][paramKey]=paramValue;
	return this;
};

/**
 * 模板内置方法 装载参数 到模板中 返回模板本身 
 * */
setParams=function(params) 
{
	for(var j in params)
		this["param"][j]=params[j];
	return this;
}; 
/**
 * ※独立方法※如果有参数template 则将该模板增加 'row' 的 'class属性' 作为Bootstrap流式布局的box
 * */
 addBSRow=function(template) 
{
	if(template===undefined)
		return buildTemplate("div","row")
	template.class=template.class+"  row  ";
};
/**
 * 模板内置方法 addItems 增加模板
 * */
addItem=function(template) 
{
	if(this.childs===undefined)
		this.childs=[]
	this.childs.push(template);
	return this;
};
/**
 * 模板内置方法 addItems 增加模板数组
 * */
addItems=function(items)
{
	if(this.childs===undefined)
		this.childs=[]
	for(var j in items)
		this.childs.push(items[j]);
	return this;
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * 核心※创建默认模板template 
 * 可调用buildHtml函数传入创建好的模板数组 和要输出到的jQuery对象中(html对标签容器的jQuery) 
 * 标签名tagName必填
 * 类名class  样式赋予 空格隔开 可以多个class 可输入内容有: 样式 Bootstrap等其他前端框架 不冲突的class
 * 子节点 childs 子节点赋予 可以直接在模板中加上子模板数组 
 * 同时生成好的模板 拥有一部分内置函数 之后这些函数和模板的属性可能会逐渐增加
 * */
buildTemplate=function(tagName,clazz,childs,id) 
{
	return {
		//tagName 
		tagName:tagName,
		//params
		param:{id:id,class:clazz},
		//childs node
		childs:(childs===undefined?[]:childs),
		//functions↓
		setParam:setParam,
		setParams:setParams,
		addItem:addItem,
		addItems:addItems
	};
};
/**
 * 根据传入树形模板解析 生成页面到指定JQUERY对象中
 * 参数 templates:模板对象数组 [template1,template2]
 * 参数 JQObj : JQuery 对象
 * 异常: 如果报错提示某节点不存在 请检查输入的模板对象参数
 * */
 buildHtml=function(templates,JQObj) 
{
     console.log("buildHtmlbuildHtmlbuildHtmlbuildHtml");
	for(var j in templates)
	{
		if(isNaN(j))
		{
			return JQObj;
		}
		tempObj=templates[j];
		tempJQ=$("<"+tempObj.tagName+">",tempObj.param);
		tempJQ.text(tempObj.param.innerText);
		JQObj.append(buildHtml(tempObj.childs,tempJQ));
	}
	return JQObj;
};
/**
 * 清空重新加载 原理机制和buildHtml一致
 * */
updateCell=function(template,JQObj) 
{
	JQObj=JQObj.html("");
	temp=buildHtml(template, JQObj);
	return temp; 
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

load=function(){
    
    tmpTemplate= buildTemplate("img").setParams( 
	    {
		click:function(){
		    this.src="http://i0.hdslb.com/bfs/space/359fc6fef17ae0a15df4e4f98bd37ca3f18bdf44.png";
		}});
    tableTemplate=buildTemplate("table");
    for(var i=0;i<10;i++){
	for(var j=0;j<10;j++){
	    tr=buildTemplate("tr")
	    console.log(i*j%2==1);
	    if(i*j%2==1)
		tr.addItem(buildTemplate("td").addItem(tmpTemplate.setParam("src","http://i0.hdslb.com/bfs/archive/0ac04c23af3b3297bf02dca163474326898d211d.png")));
	    else
		tr.addItem(buildTemplate("td").addItem(tmpTemplate.setParam("src","http://i0.hdslb.com/bfs/space/359fc6fef17ae0a15df4e4f98bd37ca3f18bdf44.png")));
	}
	tableTemplate.addItem(tr);
    }
    
    buildHtml([tableTemplate],$("#main1"));
    
}







