//引用基类 定义基础元素生成的JS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////通用AJAX渲染///////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * 封装postajax 根据传入ajax地址参数 和 目标box 以及 自定义数据解析函数调用build渲染页面
 * <br/>相关参数说明 
 * <br/>getdatahref ajax地址 
 * <br/>box 容器或者框体的jQuery对象(最好是自己渲染完的 页面这里涉及到逐层渲染 详细的请研究加载顺序 在此不做赘述)
 * <br/>parseDatafunction 类似java中的接口 只要传入对应实现就好 
 * 		<br/>实现约定 anyfunction(ret) ret是从该ajax地址post获取到的数据
 * 		<br/>该方法返回对象应该是template数组
 * <br/> after success渲染之后调用 可以用来调整渲染之后的样式等问题
 * */
buildCellByAjax=function(getdatahref,box,parseDatafunction,param,after)
{
	$.ajax({
		url:getdatahref,
		type:"POST",
		dataType:"json",
		data:param,
//		async:false,
		success:function(ret)
		{
			temp=updateCell(parseDatafunction(ret),box);
			if(!(after===undefined))
				{
					console.log("after");
					after(ret);
				}
		}
	});
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////根据前端提供静态页面整合模板 创建框体panel////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * 创建页面小单元
 * */
myPanel=function(colAndClass,celltitle,cellbody,hasmore,morehref)
{
	temp=buildTemplate("div","myPanel")
	headPanel=buildTemplate("div","headPanel").addItem(buildTemplate("div","title").setParam("innerText",celltitle));
	if(hasmore)
		headPanel=headPanel.addItem(buildTemplate("a").setParam("innerText","更多>>").setParam("href",morehref));
	bodyPanel=buildTemplate("div","bodyPanel").addItems(cellbody);
	temp=temp.addItems([headPanel,bodyPanel]);
	temp=buildTemplate("div",colAndClass).addItem(temp);
	return temp;
};

/**
 * 创建大号单元(一个页面只能放一个)
 * */
myPartPanel=function(title,cellbody,morename,moreHref,moreFunction)
{
	partTitle=buildTemplate("div","partTitle").addItem(
				 buildTemplate("div","currentPro").setParam("innerText",title)
	);
	if(!(morename===undefined)){
		more=buildTemplate("a").setParam("innerText",morename).setParam("href",moreHref);
		more=more.setParam("click",moreFunction);
		partTitle=partTitle.addItem(
			buildTemplate("div","currentPosi").setParam("innerText","更多: ").addItem(more)
		);
	}
	mainDiv=buildTemplate("div","mainDiv").addItems(cellbody);
	partTitleBox=buildTemplate("div","col-xs-12",[partTitle]);
	queryBox=buildTemplate("div","col-xs-12",[],"qrybox");
	mainDivBox=buildTemplate("div","col-xs-12",[mainDiv]);
	temp=[
	      	partTitleBox,//.addItem(partTitle),
	      	queryBox,
	      	mainDivBox//.addItem(mainDiv)
	      ];
	return temp;
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////创建框体内单元元素/////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * 创建系统跳转按钮
 * */ 
buildSysJumpButton=function(text,href,imgSrc){
	temp=buildTemplate("a","link-block").setParam("href",href).addItems(
   		 [
		  buildTemplate("img","img-responsive").setParam("src",imgSrc),
		  buildTemplate("div","text-center").setParam("innerText",text)
		  ]
	);
	return temp; 	             
};

/**
 * 创建小单元公告元素 
 * */
buildAffiche=function(innerText,status,href)
{
	if(status===undefined)
		status=3;
	temp=buildTemplate("li").
	addItem(
			buildTemplate("a",afficheClass[status]["class"])
			.setParam("innerText",afficheClass[status]["beginWith"]+innerText)
			.setParam("href",href)
	);
	return temp; 
};

/**
 * 创建小单元内消息按钮
 * */
buildMsg=function(colAndClass,text,href,imgSrc,onclick)
{
	temp=buildTemplate("a","link-block")
	.setParam("href",href).addItems(
	[
	 buildTemplate("img","img-responsive").setParam("src",imgSrc),
	 buildTemplate("span").setParam("innerText",text)                                          
	]);
	if(!(onclick===undefined))
	{
//		console.log("click"+onclick)
		temp=temp.setParam("click",onclick)
	}
	return buildTemplate("div", colAndClass).addItem(temp);
};

/**
 *  大号单元的公告元素创建
 * */
buildPartAffiche=function(innerText,status,afunc,date,dataid)
{
	if(status===undefined)
		status=3;
	temp=buildTemplate("li").
	addItems(
			[
				buildTemplate("a",afficheClass[status]["class"])
					.setParam("innerText",afficheClass[status]["beginWith"]+innerText)
					.setParam("href","#").setParam("click",afunc).setParam("dataid",dataid),
				buildTemplate("span","lineBlockRight").setParam("innerText",date)
			]
	);
	return temp; 
};

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////buildform↓///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
/**
 * 创建单元级别的表单
 * 
 * <br>单元信息调用buildFormUnit(body,title) 可以做选择框或者单选之类的 
		<br>通过级联事件控制下面达到类似子表单的效果 
	<br>////////////////////////////////////////////////////////////////////////
   <fieldset>
		<legend>
			这行就是title
			<select><option>ryu</option><option>xing</option></select>
		</legend>
	<br>下面是body<br>
    *表单项1：<input type="text" /> <b>提示信息</b> <br>
    //↑表单行 使用buildFormRow(title,body,ismust,message)方法创建一行表单<br>
    表单项2：<input type="text" />
    ←其中的输入项使用buildFormItem(tag,type,funcs)方法创建 
    </fieldset>
    
    <br>参数body 主体 类型为模板
    <br>参数title 该单元的标题 类型为模板 
    <br> 当然最后生成结果是模板
 * */
buildFormUnit=function(body,title)
{
	//fieldset 
	legend = buildTemplate("legend","",title);
	body.unshift(legend);
	fieldset = buildTemplate("fieldset","",body);
	return fieldset;
	//	return template; to updateCell
};


/**
 * 创建一行row或者trtd 内容分别有 标题说明,待填项 验证方式 
 * <br>title 标题说明
 * <br>titlesize 标题BS尺寸
 * <br>body 主题内容待填项等
 * <br>bodysize 主题内容BS尺寸
 * <br>ismust 是否必填(对应标题会带红星)
 * <br>message 提示信息 比如提示示例这边需要填写什么样的内容
 * <br>效果预览<br>
 * title：<input type="text" value="这是body的一个元素" />  <b>提示信息</b><br>
 * 其中body为模板数组,建议使用buildFormItem(tag,type,funcs)函数创建 也可以使用buildbase中的函数创建
 * <br>但是切记要放在数组中
 * <br>其中所有的label默认class为 flabel 输入标识为fmust 可以在这里增加样式图片等
 * <br>所有的body默认class为 fbody
 * <br>所有的提示消息默认class为 fmsg
 * 
 * */
buildFormRow=function(title,titlesize,body,bodysize,ismust,message)
{
	temp=buildTemplate("div", "form-group");
	flabel=[];
	if(ismust)
		flabel.push(buildTemplate("span", "fmust").setParam("innerText","*"));//增加label
	flabel.push(buildTemplate("span").setParam("innerText",title));//增加label
	label=buildTemplate("label","col-xs-"+titlesize+"  control-label").addItems(flabel);
	fbody=body;
	fmsg=buildTemplate("div", "form-group").addItem(
			buildTemplate("div", "col-xs-"+(bodysize)+"  col-xs-offset-"+titlesize)
			.addItem(buildTemplate("span", "red").setParam("innerText",message))
	);
	temp.addItems([
                   label,
                   buildTemplate("div", "col-xs-"+(bodysize) ).addItems(fbody)
                   ]);
	if(!(message===undefined))
	{
		return [temp,fmsg]
	}else{
		console.log("message===undefined");
		return [temp];
	}
	
};

/**
 * 创建单独的一个表单项  
 * <br>tag 标签类型
 * <br>type 标签类别适用于index类型标签
 * <br>params 属性以及方法 示例:  遵循jquery配置约定map [click:function(){}] 点击时执行自定义方法 以及其他 blur时等等   
 * */
buildFormItem=function(tag,clazz,id,type,params)
{
	temp=buildTemplate(tag,clazz,[],id);
	if(!(type===undefined))
	{
		temp=temp.setParam("type",type);
	}
	temp=temp.setParams(params);
	return temp;
};
//注意 以上内容为页面元素布局影响 如果存在easyUI等也可能影响布局的请调整顺序在这边渲染完成后引入文件

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////分页查询相关↓///////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * 创建表格 根据配置和 数据
 * */
buildTableGrid=function(config,data)
{
	table=buildTemplate("table","table table-bordered table-hover table-striped");//创建table 
	cols=buildTemplate("thead");
	colstr=buildTemplate("tr");
	datas=buildTemplate("tbody","noticeList").setParam("id","noticeList");
	if(config.rowNum)
	{
		colstr.addItem(buildTemplate("th"));
	}
	for(var j in config.colModel)
	{
		tempObj=config.colModel[j];
		colstr.addItem(
				buildTemplate("th").setParams({
					"innerText":tempObj["colName"]
				})
		);
	}//cols thead
	colstr.addItem(
			buildTemplate("th").setParams({
				"innerText":"操作"
			})
	);
	cols.addItem(colstr);
	var index=0;
	for(var d in data)
	{//datas tbody
		index++;
		row=data[d];
		datasRow=buildTemplate("tr");
		if(config.rowNum)
		{
			datasRow.addItem(buildTemplate("td").setParam("innertext",index));
		}
		for(var j in config.colModel)
		{
			tempObj=config.colModel[j];
			value=row[tempObj["colIndex"]];
			if(tempObj.formatter!=undefined)
				value=tempObj.formatter(row[tempObj["colIndex"]]);
			datasRow.addItem(buildTemplate("td").setParams({"innerText":value}));
		}
		temptd=buildTemplate("td");
		if(config.operTemplates!=undefined)
		{
			t1=config.operTemplates(row);
			temptd=temptd.addItems(t1);
		}
			
		datasRow.addItem(temptd);
		datas.addItem(datasRow);
	}
	
	table.addItems([cols,datas]);
	console.log("tabletabletabletabletabletabletabletabletabletabletabletable");
	console.log(table);
	return table;
	
	
};

buildListGrid=function(config,data)
{//这边只是预留方法 后期这个方法将会增加配置项完善 目前先暂且使用Affiches公告的列表
	return parseDataToAffiches(data);
};
/**
 * 返回带分页以及行数的固定list(浏览)或者table(管理)
 * url: ctx + '', 请求地址 
		param:param
		pagenum:"",
		pagesize:"",
		buildModel:list/table(list就是看大概 可以引入format或者我这边定死,table就是带操作列表查询有format)
		listModel:{formatter:function(ret){return [template] } }//ul,li
	 	colModel:[{colName:"",colIndex:"",width:"",formatter:function(colvalue){ return str;}}],
		rowNum:true/false,
		operTemplates:function(row){ return [buildTemplate];},
		(easyUI pageManager & functions pageList)
 * */
buildDataGrid=function(config,box,pagerSelect) 
{
	debugger;
	config.param.page=$("#pagination").pagination("options")["pageNumber"];
	config.param.rows=$("#pagination").pagination("options")["pageSize"];
	param=config.param;
		if(config.buildModel=="list")
		{
			buildCellByAjax(config.url, box, function(ret){
				pageInfo=setPageInfo("#searchFrom",true);
				
				$(pagerSelect).pagination({//分页赋值
					total:(ret["data"]["total"]),
					onSelectPage:
			 			function(pageNumber, pageSize){
						
							buildDataGrid(config,box,pagerSelect);//赋予方法给分页组件重新渲染部分属性
						},
					onRefresh:
						function(pageNumber, pageSize){
						
							buildDataGrid(config,box,pagerSelect);//赋予方法给分页组件重新渲染部分属性
						},
				});
				return buildListGrid(config,ret.data.rows);;
			},param);
		}
		else if(config.buildModel=="table")
		{
			buildCellByAjax(config.url, box, function(ret){
					pageInfo=setPageInfo("#searchFrom",true);
					temp=buildTableGrid(config,ret.data.rows);
					$(pagerSelect).pagination({
						total:(ret["data"]["total"]),
						onSelectPage:
				 			function(pageNumber, pageSize){
								buildDataGrid(config,box,pagerSelect);//赋予方法给分页组件重新渲染部分属性
							},
						onRefresh:
							function(pageNumber, pageSize){
								buildDataGrid(config,box,pagerSelect);//赋予方法给分页组件重新渲染部分属性
							},
					});
					return [temp];
				},param);
		}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////分页查询框体工具栏(初版)///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * 页面创建工具条 以后可能的话会悬浮 (会强行创建出 ID为toolbar的工具条 内部元素自己填充 类型为模板数组)
 * */
buildToolBar=function(templates) 
{
	toolbar=buildTemplate("div","toolbar",templates,"toolbar");
	buildHtml([toolbar],$("#pCenter"));
};
/**
 * 创建查询表单条 以后可能的话会悬浮 (要求页面要固定写死包含一个 qrybox id 的from作为容器)
 * */
buildQueryTerms=function(templates){ 
	//qrybox
	searchButton=buildTemplate("div","afficheSearchButton col-xs-1") 
			.addItem(
					buildTemplate("input","btn btn-default btn-sm").
						setParams({type:"button",value:"查询",click:function(){
							pageInfo=setPageInfo("#searchFrom",true);
							buildDataGrid(pagequeryConfig, $(".mainDiv"),"#pagination");
							}
						})
			);
	div=buildTemplate("form","afficheSearchButton col-xs-10",templates,"searchFrom");
	updateCell([searchButton,div],$("#qrybox"));
};




