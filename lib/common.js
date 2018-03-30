/**
 * app mh3 banner 示例创建页面banner
 * */
makeBanner=function()
{
	console.log("it 's time to load banner ! ");
	buildCellByAjax(ctx+"/mainPage/getBanner.do", $("#banner"), parseDataToBanner);
};

makeBannerNoHeaderNav=function()
{
	console.log("it 's time to load banner ! ");
	buildCellByAjax(ctx+"/mainPage/getBanner.do", $("#banner"), parseDataToBannerNoHeaderNav);
};

/**
 * app mh3 footer 示例创建页面footer
 * */
makeFooter=function()
{
	console.log("it 's time to load footer ! ");
	footerJsonTemplate=
		[
		 			addBSRow().addItem(
		 					buildTemplate("div","col-xs-12").addItems(
			 					[
						 			 buildTemplate("div","blue-line"),
						 			 buildTemplate("div","pageInfo").
						 			 addItems([
						 			          buildTemplate("span").setParam("innerText","Copyrigbt＠广东省精神卫生中心服务平台"),
						 			          buildTemplate("span").setParam("innerText","粤ICP12345678号-1版权所有"),
						 			          buildTemplate("span").setParam("innerText","备案号：粤ICP备12345678号")
						 			          ]),
						 			 buildTemplate("div","pageInfo").
						 			 addItems([
						 			          buildTemplate("span").setParam("innerText","地址：广东省广州市某某大街236号"),
						 			          buildTemplate("span").setParam("innerText","技术支持：中科软选择股份有限公司"),
						 			         buildTemplate("span").setParam("innerText","邮箱：12345678@163.com")
						 			         ])
						 		]
		 			))
		];
	buildHtml(footerJsonTemplate,$("#footer"))
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//define
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
afficheClass={//可以有配置项目表等
		 1:{class:"green",beginWith:"【置顶】"},
		 2:{class:"red",beginWith:"【紧急】"},
		 3:{class:"black",beginWith:""}
};

/**
 * 取两个框体
 * */
maxHeight = function(t1,t2)
{
	r0h=parseInt($(t1).css("height"));
	r1h=parseInt($(t2).css("height"));
	maxr1=((r0h>r1h)?r0h:r1h);
	$(t1).css("height",maxr1);
	$(t2).css("height",maxr1);
};

/**
 * 加载数据
 * */
loadData=function(selector,data,type){
		//清空所有错误信息
		debugger;
		switch(type){
			case "span":
				$(selector+" span[name]").each(function(){
					var text=data[$(this).attr("name").toUpperCase()||data[$(this).attr("name")]];
					if($(this).hasClass("ue-span")){
						$(this).html(text||"");
					}else{
						if(text===0){
							text="0";
						}
						$(this).text(text||"");
					}
				})
				break;
			case "input":
				$(selector).find("input,textarea,select").each(function(){
					debugger;
					//不需要赋值的变量
					if($(this).hasClass("no-ld")){
						return true;
					}
					try{
						var text=data[$(this).attr("name").toUpperCase()]||data[$(this).attr("name")]||"";
					}catch(e){
						//console.log(e);
						return true;
					}
					if($(this).attr("type")=="radio"){
						$(selector + " input[name='"+$(this).attr("name")+"']").removeAttr("checked");
						if(text==""){
							$(selector + " input[name='"+$(this).attr("name")+"']:first").prop("checked","checked").trigger("change");
						}else{
							$(selector + " input[name='"+$(this).attr("name")+"'][value='"+text+"']").prop("checked","checked").trigger("change");
						}
					}else if($(this).is("select")){
						$(selector + " select[name='"+$(this).attr("name")+"']").removeAttr("selected");
						if(text==""){
							$(selector + " select[name='"+$(this).attr("name")+"'] option:first").prop("selected","selected");
							if($(this).hasClass("select2-offscreen")){
								if($(this).attr("multiple")){
									$(this).val(null).trigger("change");
								}else{
									$(this).select2("val", $(selector + " select[name='"+$(this).attr("name")+"'] option:first").attr("value")).trigger("change");
								}
							}
						}else{
							$(selector + " select[name='"+$(this).attr("name")+"']").find("[value='"+text+"']").prop("selected","selected");
							$(this).val(text);
							if($(this).hasClass("select2-offscreen")){
								if($(this).attr("multiple")){
									$(this).val(text.split(",")).trigger("change");
								}else{
									$(this).select2("val", text).trigger("change");
								}
							}
						}
					}else{
						if($(this).hasClass("select2-offscreen")){
							$(this).select2("val",text.split(",")).trigger("change");
						}else{
							$(this).val(text);
						}
					}
				})
				break;
		}
	};

/**
 * 点击事件 模拟表单提交 到模板页 type: view,edit 分别对应 详情页面 编辑页面 如果type类型为其他那么这边则是新增页面
 * obj{jump_operType:"",jump_dataid:""}
 * */
postJump=function(href,obj) 
{//get还要模拟form表单那就得去看大夫了(笑)
		f1=$("<form>",{action:href,method:"post"})
		for(var j in obj)
			f1=f1.append($("<input>",{name:j,value:obj[j],type:"hidden"}));
//		f1=f1.append($("<input>",{name:"jump_dataid",value:id,type:"hidden"}))
//		f1=f1.append($("<input>",{name:"jump_operType",value:type,type:"hidden"}))
		$(document.body).append(f1);
		f1.submit();
};

/**
 * @param fromselect 表单选择器
 * @param nullmod 空数据模式<br>
 * 将表单内容变为JSON对象 
 * 空模式为真 那么为空的也作为JSON对象  
 * 如果该模式为假那么什么条件有值就按照什么条件去放进对象并且返回 
 * */
getSearchItemValue=function(fromselect,nullmod) 
{
	fromArray=$(fromselect).serializeArray();
	jsonObj={};
	if(nullmod){
		for(var j in fromArray)
		{
			obj=fromArray[j];
			jsonObj[obj["name"]]=obj["value"];
		}
	}
	else
	{
		for(var j in fromArray)
		{
			obj=fromArray[j];
			if(obj["value"]==null||obj["value"]=="")
				continue;
			jsonObj[obj["name"]]=obj["value"];
		}
	}
	return jsonObj;
};

/**
 * @param fromselect 条件参数表单
 * @param refreshParam 是否刷新参数
 * <br> 注意※getSearchItemValue为本函数得前置函数
 * <br> 如果传入值为真则从分页和表单中取得当前参数(适用于查询刷新等按钮事件)
 * <br> 否则将直接使用缓存中所存储的 pageInfo参数(适用于页面加载) 
 * */
setPageInfo=function(fromselect,refreshParam)//"#searchFrom"
{
	debugger;
	if(!refreshParam){
		temp=pageInfo;
	}
	else{
		temp={
				name:location.search,
				param:getSearchItemValue(fromselect,true),
				pageNum:$("#pagination").pagination("options")["pageNumber"],
				pageSize:$("#pagination").pagination("options")["pageSize"]
		}
	}
	for(var j in temp.param)
		pagequeryConfig.param[j]=temp.param[j];
	pagequeryConfig.param["name"]=temp.name;
	//↑设置旧版查询参数
	$("#pagination").pagination({
		select:temp.pageNum,
		pageSize:temp.pageSize
	});
	return temp;
};
