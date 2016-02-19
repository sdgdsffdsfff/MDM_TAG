$(function() {

	
	/*初始化付款单grid高度*/
	$("#paymentSettmentQuery_grid").height($(window).height()-120);
	/*付款单GRID*/
	$('#paymentSettmentQueryView').myDatagrid({
		"title": "付款单列表",
		"url": "../paymentSettmentQuery/paymentSettmentQueryLists.json",
		"singleSelect": false, //多选
		"method": "post", 
		"columns" : [[
		    {field : 'id', title : 'id', align : 'center', sortable : true,hidden:true},
			{field : 'paymentCode', title : '单据编号', align : 'center', sortable : true},
			{field : 'venName', title : '供应商', align : 'center', sortable : true}, 
			
			{field : 'ticketDate',title : '制单时间',align : 'center', sortable : true, formatter:function(value){
					if(value=='' || value==null){
						//提醒....
					}else{
						var inputDate = new Date(value);
						return inputDate.getFullYear()+'-'+(inputDate.getMonth()+1)+'-'+inputDate.getDate()+' ';
					}
					return "制单时间有误";
				}},
			
			{field : 'clearingForm',title : '结算方式', align : 'center'}, 
			{field : 'settlementSubject',title : '结算科目',align : 'center', sortable : true}, 
			{field : 'vendorBank',title : '供应商银行',align : 'center'},
			{field : 'vendorAccount',title : '供应商账户',align : 'center', sortable : true},
			{field : 'itemCode',title : '项目大类编码',align : 'center', sortable : true},
			{field : 'oppSubject',title : '对方科目',align : 'center', sortable : true},
			{field : 'payType',title : '付款类型',align : 'center', sortable : true,formatter:function(value){
				if(value=="1"){
					value="采购";
				}else if(value=="2"){
					value="委外";
				}
				return value;
			}},
			
			{field : 'type',title : '款项类型',align : 'center', sortable : true,formatter:function(value){
				if(value=="1"){
					value="预付款";
				}else if(value=="2"){
					value="应付款";
				}
				return value;
			}},
			{field : 'sum',title : '金额',align : 'center', sortable : true},
	
			{field : 'status',title : '状态',align : 'center', sortable : true,formatter:function(value){
				if(value=="1"){
					value="新建";
				}else if(value=="2"){
					value="已提交";
				}else if(value=="3"){
					value="已审核";
				}else if(value=="4"){
					value="作废";
				}
				return value;
			}},
			{field : 'inputer',title : '录入人',align : 'center', sortable : true},
			{field : 'createTd',title : '录入时间',align : 'center', sortable : true, formatter:function(value){
  				if(value=='' || value==null){
  					//提醒....
  				}else{
  					var inputDate = new Date(value);
  					return inputDate.getFullYear()+'-'+(inputDate.getMonth()+1)+'-'+inputDate.getDate()+' '+
  					inputDate.getHours()+':'+inputDate.getMinutes()+':'+inputDate.getSeconds();
  				}
  				return "";
  			}},
			{field : 'digest',title : '摘要',align : 'center', sortable : true}
		]],
		//点击按钮查看发票
		"toolbar": [{
  			id : 'data_form_detail',
			text : '查看发票明细',
			iconCls : 'icon-search',
			handler : function() {
				var $tb  = $("#paymentSettmentQueryView");
				var rows = $tb.datagrid("getSelections");
				if(!rows || rows.length<=0){
					$.messager.alert("提示", "请先选择要查看的单据。");
					return;
				} 
				if (rows.length > 1) {
					// 用户选中多条数据
					multiRowMessge();
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
							$d.dialog("close");
						}
					}]
				});
				/*查看明细GRID*/
				$('#paymentSettmentQueryDetailView').myDatagrid(
						{
					"url": "../paymentSettmentQuery/queryInvoiceLists.json?id="+ rows[0].id,
                      //多选
					"method": "get", 
					"columns" : [[
					              {field : 'id', title : 'id', align : 'center', sortable : true,hidden:true},  
			      					{field : 'invoiceId', title : '单据号', align : 'center', sortable : true},
			      					{field : 'billingDate', title : '开票日期', align : 'center', sortable : true, formatter:function(value){
			    						if(value=='' || value==null){
			    							//提醒....
			    						}else{
			    							var inputDate = new Date(value);
			    							return inputDate.getFullYear()+'-'+(inputDate.getMonth()+1)+'-'+inputDate.getDate();
			    						}
			    						return "录入时间有误";
			    					}},		 
			      					{field : 'venCode',title : '供应商编码', align : 'center'}, 
			      					{field : 'venName',title : '供应商名称',align : 'center', sortable : true}, 
			      					{field : 'businessType',title : '业务类型',align : 'center'},
			      					{field : 'sum',title : '无税金额',align : 'center', sortable : true},
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
			      						return "录入时间有误";
			      					}},
			      					{field : 'status',title : '状态',align : 'center', sortable : true,formatter:function(value){
			      						if(value=="1"){
			      							value="新建";
			      						}else if(value=="2"){
			      							value="已提交";
			      						}else if(value=="3"){
			      							value="已审核";
			      						}else if(value=="4"){
			      							value="作废";
			      						}
			      						return value;
			      					}}
					]]
				});
			},
			"permission": "mdm:paymentSettmentQuery:invoiceDetail" //查看发票权限
		},
		{
			id : 'data_form_detail',
			text : '查看预付单明细',
			iconCls : 'icon-search',
			handler : function() {
				var $tb  = $("#paymentSettmentQueryView");
				var rows = $tb.datagrid("getSelections");
				if(!rows || rows.length<=0){
					$.messager.alert("提示", "请先选择要查看的单据。");
					return;
				} 
				if (rows.length > 1) {
					// 用户选中多条数据
					multiRowMessge();
				}
				var $d = $('#data_detail_dialog');
				$d.show().dialog({
					"title" : "预付单详细信息",
					"closed" : false,
					"width": 1150,    
				    "height": 240, 
					"modal" : true,
					"buttons" : [{
						"text" : "关闭",
						"iconCls" : 'icon-cancel',
						"handler" : function() {
							$d.dialog("close");
						}
					}]
				});
				
				var id=rows[0].id;
				/*查看明细GRID*/
				$('#paymentSettmentQueryDetailView').myDatagrid(
						{
					"url": "../paymentSettmentQuery/queryPrePaymentLists.json",
					"queryParams": {"id":id},
					"method": "get", 
					"columns" : [[
					            {field : 'id', title : 'id', align : 'center', sortable : true,hidden:true},
					  			{field : 'paymentCode', title : '单据编号', align : 'center', sortable : true},
								{field : 'venCode', title : '供应商', align : 'center', sortable : true}, 
								
								{field : 'ticketDate',title : '制单时间',align : 'center', sortable : true, formatter:function(value){
										if(value=='' || value==null){
											//提醒....
										}else{
											var inputDate = new Date(value);
											return inputDate.getFullYear()+'-'+(inputDate.getMonth()+1)+'-'+inputDate.getDate()+' '+
											inputDate.getHours()+':'+inputDate.getMinutes()+':'+inputDate.getSeconds();
										}
										return "制单时间有误";
									}},
								
								{field : 'clearingForm',title : '结算方式', align : 'center'}, 
								{field : 'settlementSubject',title : '结算科目',align : 'center', sortable : true}, 
								{field : 'vendorBank',title : '供应商银行',align : 'center'},
								{field : 'vendorAccount',title : '供应商账户',align : 'center', sortable : true},
								{field : 'itemCode',title : '项目大类编码',align : 'center', sortable : true},
								{field : 'oppSubject',title : '对方科目',align : 'center', sortable : true},
								{field : 'payType',title : '付款类型',align : 'center', sortable : true,formatter:function(value){
									if(value=="1"){
										value="采购";
									}else if(value=="2"){
										value="委外";
									}
									return value;
								}},
								
								{field : 'type',title : '款项类型',align : 'center', sortable : true,formatter:function(value){
									if(value=="1"){
										value="预付款";
									}else if(value=="2"){
										value="应付款";
									}
									return value;
								}},
								{field : 'sum',title : '金额',align : 'center', sortable : true},
						
								{field : 'status',title : '状态',align : 'center', sortable : true,formatter:function(value){
									if(value=="1"){
										value="新建";
									}else if(value=="2"){
										value="已提交";
									}else if(value=="3"){
										value="已审核";
									}else if(value=="4"){
										value="作废";
									}
									return value;
								}},
								{field : 'inputer',title : '录入人',align : 'center', sortable : true},
								{field : 'createTd',title : '录入时间',align : 'center', sortable : true, formatter:function(value){
									if(value=='' || value==null){
										//提醒....
									}else{
										var inputDate = new Date(value);
										return inputDate.getFullYear()+'-'+(inputDate.getMonth()+1)+'-'+inputDate.getDate()+' '+
										inputDate.getHours()+':'+inputDate.getMinutes()+':'+inputDate.getSeconds();
									}
									return "制单时间有误";
								}},
								{field : 'digest',title : '摘要',align : 'center', sortable : true}
					]]
				});
			},
			"permission": "mdm:paymentSettmentQuery:prePaymentDetail" //查看预付单权限
		}
		],
		"model": "paymentSettmentQuery", //当不指定form、dialog的ID，插件会根据该属性来自动匹配页面元素，如修改付款单窗口，将自动匹配ID：dataDictionary_edit_dialog
	});
	/*查询grid*/
	$("#search_form_submit").on("click", function(){
		$('#paymentSettmentQueryView').datagrid("load", $("#paymentSettmentQuery_search_form").form("formToJson"));
	});
	$("#search_form_reset").on("click", function(){
		$("#paymentSettmentQuery_search_form").form("reset");
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








