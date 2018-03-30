//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////渲染解析实现方法////////////////////////////////////////////////
////////////////////////////////////配合buildCellByAjax方法 类似java临时匿名内部类使用///////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * banner解析构成模板 
 * <br/>参数ajax的结果集
 * <br/>返回值 模板数组
 * */
parseDataToBanner=function(ret)
{
	menuObjs=[];
	for(var j in ret)
		menuObjs.push(buildTemplate("a").setParam("href",ret[j]).setParam("innerText",j));
	bannerJsonTemplate= 
			[ 
			buildTemplate("img","max-responsive",[],"banner-img").setParam("src","images/homepage/group.jpg"),
			 {
				 tagName:"div",param:{class:"bg-green"},
					childs:[{tagName:"div",param:{class:"headerNav"},
 						childs:[{tagName:"div",param:{class:"container"},
							childs:[{tagName:"div",param:{id:"navList",class:"navList"},
								childs:menuObjs
							}]
						}]
					}]
			}
		];
	   return bannerJsonTemplate;
}

parseDataToBannerNoHeaderNav=function(ret)
{
	menuObjs=[];
	for(var j in ret)
		menuObjs.push(buildTemplate("a").setParam("href",ret[j]).setParam("innerText",j));
	bannerJsonTemplate= 
			[ 
			buildTemplate("img","max-responsive",[],"banner-img").setParam("src","images/homepage/group.jpg")
//			,
//			 {
//				 tagName:"div",param:{class:"bg-green"},
//					childs:[{tagName:"div",param:{class:"headerNav"},
// 						childs:[{tagName:"div",param:{class:"container"},
//							childs:[{tagName:"div",param:{id:"navList",class:"navList"},
//								childs:menuObjs
//							}]
//						}]
//					}]
//			}
		];
	   return bannerJsonTemplate;
}


/**
 * 从后台查询出公告的解析模板(首页用)
 * */
parseDataToAffichesMainPage=function(ret)
{
	affiches=[];
	for(var j in ret)
		affiches.push(
				buildAffiche(ret[j].text, ret[j].status, ret[j].href)
		);
	return affiches;
}

/**
 * 从后台查询出公告的解析模板(普通用)
 * */
parseDataToAffiches=function(ret)
{
	console.log(ret);
	partAffiches=[];
	for(var j in ret)
	{
		r=ret[j]
		partAffiches.push(
				buildPartAffiche(r["TITLE"],r["STATUS"],
						function(){
							postJump("c.menu?path=affiche.afficheEdit.jsp",{jump_dataid:r["ID"],jump_operType:"view"})
						}
						,r["DT_CREATE"],r["ID"])
		);
	}
	return partAffiches;
}

changeTabBody=function(){ // all post!
	debugger;                              
	$(this).addClass('active').siblings('.active').removeClass('active');
	console.log("tar"+$(this).attr("tar"));
	console.log($(this).parent(".tablist").next());
	
	buildCellByAjax($(this).attr("tar"), $(this).parent(".tablist").next().children("ul"),parseDataToAffichesMainPage,{},
			function(){
				maxHeight("#row3_0 .bodyPanel","#FileManager .bodyPanel");
			}
	);
};



/**
 * parseDataToFileManager 
 * praram : [{innerText:href},{innerText:href}...]
 * 
 * */
parseDataToFileManager=function(ret)
{
	tablistsSimple=[];
	var index =0;
	for(var j in ret)
	{
		temp=buildTemplate("a").setParam("click",changeTabBody).
		setParam("innerText",j).setParam("tar",ret[j]);
		if(index==0){
			temp=temp.setParam("class","active");
			
		}
		tablistsSimple.push(temp);
		index++;
	}
	return [
	        buildTemplate("div","tabList").addItems(tablistsSimple),
	        buildTemplate("div","tabBody").addItem(buildTemplate("ul","newsList"))
	];
}




//affiches=[//AJAX getdata  foreach
//			buildAffiche("关于2016年精神卫生工作有关的数据说明",1,"www.baidu.com"),
//			buildAffiche("关于2016年精神卫生工作有关的数据说明",2),
//			buildAffiche("关于2016年精神卫生工作有关的数据说明"),
//			buildAffiche("关于2016年精神卫生工作有关的数据说明"),
//			buildAffiche("关于2016年精神卫生工作有关的数据说明")
//];