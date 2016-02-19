$(function() {
	/*初始化付款单grid高度*/
	$("#invoiceQuery_grid").height($(window).height()-120);
	/*付款单GRID*/
	$('#invoiceQueryView').myDatagrid({
		"title": "发票列表",
		"url": "../invoiceQuery/invoiceQueryLists.json",
		"singleSelect": false, //多选
		"method": "post", 
		"columns" : [[
		  		    {field : 'id', title : 'id', align : 'center', sortable : true,hidden:true},
		  			{field : 'invoiceId', title : '单据号', align : 'center', sortable : true},
		  			{field : 'billingDate', title : '开票日期', align : 'center', sortable : true, formatter:function(value){
		  				if(value=='' || value==null){
		  					//提醒....
		  				}else{
		  					var inputDate = new Date(value);
		  					return inputDate.getFullYear()+'-'+(inputDate.getMonth()+1)+'-'+inputDate.getDate()+' ';
		  				}
		  				return "录入时间有误";
		  			}}, 
		  			{field : 'venCode',title : '供应商编码', align : 'center', sortable : true}, 
		  			{field : 'venName',title : '供应商名称',align : 'center', sortable : true}, 
		  			{field : 'businessType',title : '业务类型',align : 'center', sortable : true,formatter:function(value){
		  				if(value=="1"){
		  					value="采购发票";
		  				}else if(value=="2"){
		  					value="委外发票";
		  				}else if(value=="3"){
		  					value="采退发票";
		  				}
		  				return value;
		  			}},
		  			{field : 'sum',title : '无税金额（自动计算）',align : 'center', sortable : true},
		  			{field : 'tax',title : '税额',align : 'center', sortable : true},
		  			{field : 'taxRate',title : '税率',align : 'center', sortable : true},
		  			{field : 'price',title : '价税合计',align : 'center', sortable : true},
		  			{field : 'inputer',title : '录入人',align : 'center', sortable : true},
		  			{field : 'createTd',title : '录入时间',align : 'center', sortable : true, formatter:function(value){
		  				if(value=='' || value==null){
		  					//提醒....
		  				}else{
		  					var inputDate = new Date(value);
		  					return inputDate.getFullYear()+'-'+(inputDate.getMonth()+1)+'-'+inputDate.getDate()+' '+
		  					inputDate.getHours()+':'+inputDate.getMinutes()+':'+inputDate.getSeconds();
		  				}
		  				return "录入时间有误";
		  			}},
		  			{field : 'modifier',title : '修改人',align : 'center', sortable : true},
		  			{field : 'updateTd',title : '修改时间',align : 'center', sortable : true, formatter:function(value){
		  				if(value=='' || value==null){
		  					//提醒....
		  				}else{
		  					var inputDate = new Date(value);
		  					return inputDate.getFullYear()+'-'+(inputDate.getMonth()+1)+'-'+inputDate.getDate()+' '+
		  					inputDate.getHours()+':'+inputDate.getMinutes()+':'+inputDate.getSeconds();
		  				}
		  				return "";
		  			}},
		  			{field : 'status',title : '状态',align : 'center', sortable : true,formatter:function(value){
		  				if(value=="1"){
		  					value="新建";
		  				}else if(value=="2"){
		  					value="提交并结算";
		  				}else if(value=="3"){
		  					value="作废";
		  				}
		  				return value;
		  			}},
		  			{field : 'rdId',title : '入库单',align : 'center', sortable : true,hidden:true}
		  		]],
		  		//点击按钮查看入库单
		  		"toolbar": [{
		  			id : 'data_form_detail',
					text : '查看入库单明细',
					iconCls : 'icon-search',
					handler : function() {
						var $tb  = $("#invoiceQueryView");
						var rows = $tb.datagrid("getSelections");
						if(!rows || rows.length<=0){
							$.messager.alert("提示", "请先选择要查看的单据。");
							return;
						} 
						if (rows.length > 1) {
							//bMany = true; // 用户选中多条数据
							multiRowMessge();
							//if (bMany) {}
						}
						var $d = $('#data_detail_dialog');
						$d.show().dialog({
							"title" : "详细信息",
							"closed" : false,
							"width": 1150,    
						    "height": 240, 
							"modal" : true,
							"buttons" : [{
								"text" : "关闭",
								"iconCls" : 'icon-cancel',
								"handler" : function() {
									//$('#pomainRecordDetailView').datagrid('loadData',{total:0,rows:[]}); 
									$d.dialog("close");
								}
							}]
						});
						var id = rows[0].id;
//						btnExt();
						/*查看明细GRID*/
						$('#invoiceQueryDetailView').myDatagrid(
								{
							"url": "../invoiceQuery/queryRdRecordLists.json",
							"queryParams": {"id":id},
//							"singleSelect": true, //多选
							"method": "post", 
							"columns":[[
					  					{field : 'id', title : 'ID', sortable : true, align : 'center' },          
										{field : 'coCode', title : '入库单号', sortable : true, align : 'center'},
										{field : 'ddate', title : '入库日期', sortable : true, align : 'center', formatter:function(value){
											var inputDate = new Date(value);
											return inputDate.getFullYear()+'-'+(inputDate.getMonth()+1)+'-'+inputDate.getDate();
				      					}},
										{field : 'whName', title : '仓库',sortable : true, align : 'center'},
										{field : 'orderCode', title : '订单号', sortable : true, align : 'center', hidden:true},
										{field : 'itemCode', title : '项目编码', sortable : true, align : 'center'},
										{field : 'sum', title : '含税总金额', sortable : true, align : 'center'},
										{field : 'price', title : '不含税总金额', sortable : true, align : 'center'},
										{field : 'busType', title : '业务类型', sortable : true, align : 'center'},
										{field : 'cptName', title : '采购类型', sortable : true,  align : 'center'},
										{field : 'venName', title : '供应商', sortable : true, align : 'center'},
//										{field : 'cBusType', title : '入库类别', sortable : true, align : 'center'},
					  				]],
						});
					},
					"permission": "mdm:invoiceQuery:detail" //查看明细权限	
				}],
		"model": "invoiceQuery"//当不指定form、dialog的ID，插件会根据该属性来自动匹配页面元素，如修改付款单窗口，将自动匹配ID：dataDictionary_edit_dialog
	});
	/*查询grid*/
	$("#search_form_submit").on("click", function(){
		$('#invoiceQueryView').datagrid("load", $("#invoiceQuery_search_form").form("formToJson"));
	});
	$("#search_form_reset").on("click", function(){
		$("#invoiceQuery_search_form").form("reset");
	});
	//用户选择多行时，默认只处理第一行
	function multiRowMessge(){
		$.messager.show({
			"title" : "温馨提示",
			"msg" : "<span style='color:red;'>*</span>由于您选择了多条数据，系统将默认对您选择的第一条数据进行操作。",
			"style" : {
				"right" : "",
				"top" : document.body.scrollTop + document.documentElement.scrollTop,
				"bottom" : ""
			},
			"timeout" : 5000
		});
	}
});








