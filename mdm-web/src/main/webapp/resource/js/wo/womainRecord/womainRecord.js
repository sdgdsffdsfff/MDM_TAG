$(function() {
	var param_id = 0; //定义全局变量param_id
	/*初始化系统参数grid高度*/
	$("#pomainRecord_grid").height($(window).height()-120);
	//加载审核状态下拉框
	$("#auditStatus").combobox({ 
		url:"../womainRecord/getAuditStatusList.json",
		valueField:'statusCode',
		textField:'statusDesc',
		method:'post',
		editable:false,
		value:''  //默认选中value指定的选项
	});
	//加载供应商下拉框
	$("#venCode").combobox({ 
		url:"../womainRecord/getVendorList.json",
		valueField:'venCode',
		textField:'venName',
		method:'post',
		//editable:false,
		value:''  //默认选中value指定的选项
	});
	/*系统参数GRID*/
	$('#pomainRecordView').myDatagrid(
			{
		"title": "入库单信息列表",
		"url": "../womainRecord/getPOMainRecords.json",
		"system": "mdm",
		"singleSelect": false, //多选
		"method": "post", 
		"model": "womainRecord",
		"fitColumns":true,
		
		"columns" : [[
            {field : 'id', title : 'ID',            align : 'center', sortable : false, hidden:true},
            {field : 'coCode', title : '入库单号', 	  align : 'center'},          
			{field : 'orderDate', title : '入库日期',width : 25, 	formatter : function(val, rec){
				var d = new Date(val);
				return UI.Date.dateStr(d, "yyyy-mm-dd");
			}, align : 'center' },
			{field : 'whName', title : '仓库', 	       align : 'center' },
			{field : 'citemCode', title : '订单号', 	width : 30,  align : 'center'},
			{field : 'busType', title : '业务类型', 	  align : 'center'},
			{field : 'venName', title : '委外商', width : 40,	  align : 'center'},
			{field : 'isCreateAcc', title : '是否已生成凭证', 	  align : 'center'}
//			{field : 'statusDesc', title : '审核状态',  formatter: function(value,row,index){
//				  if (value == null ){
//					return '待品类审核';
//				  }else{
//					return value;
//				  }
//				},align : 'center'},
//			{field : 'auditStatus', title : '审核状态代码',   align : 'center', hidden:true}
		]],
		/*入库单审核按钮*/
		"toolbar": [{
			id : 'data_form_detail',
			text : '查看明细',
			iconCls : 'icon-search',
			handler : function() {
				var $tb  = $("#pomainRecordView");
				var rows = $tb.datagrid("getSelections");
				if(!rows || rows.length<=0){
					$.messager.alert("提示", "请先选择要查看的单据。");
					return;
				} 
				if (rows.length > 1) {
					multiRowMessge();
				}
				var $d = $('#data_detail_dialog');
				$d.show().dialog({
					"title" : "详细信息",
					"closed" : false,
					"width": 1150,    
				    "height": 400, 
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
				btnExt();
				/*查看明细GRID*/
				$('#pomainRecordDetailView').myDatagrid(
						{
					"url": "../womainRecord/getPOMainRecordsDetail.json?id="+ rows[0].id,
					"singleSelect": true, //多选
					"method": "get", 
					
					"columns" : [[
						{field : 'invCode', title : '存货编码', 	 width : 30, align : 'center' },          
						{field : 'invName', title : '存货名称', 	 width : 60, align : 'center'},
						/*
						{field : 'taxRate', title : '税率', 	     width : 15, align : 'center'},
						{field : 'taxCost', title : '含税单价', 	 width : 20, align : 'center'},
						{field : 'taxPrice', title : '税额', 	     width : 20, align : 'center'},
						{field : 'sum', title : '价税合计', 	     width : 20, align : 'center'},
						*/
						{field : 'quantity', title : '主计量数量', 	 width : 30, align : 'center'},
						{field : 'unitCost', title : '无税单价', 	 width : 25, align : 'center'},
						{field : 'price', title : '无税金额', 	     width : 25, align : 'center'},
						{field : 'batch', title : '批号', 	     width : 30, align : 'center'},
						{field : 'itemCode', title : '项目编码', 	 width : 20, align : 'center'},
						{field : 'itemName', title : '项目名称', 	     width : 30, align : 'center'},
						{field : 'itemClass', title : '项目大类编码', 	 width : 30, align : 'center'},
						{field : 'className', title : '项目大类名称', 	 width : 30, align : 'center'},
						{field : 'free', title : '克重', 	      width : 20, align : 'center'},
						{field : 'processFee', title : '加工费', 	      width : 20, align : 'center'}
					]]
					
				});
				
			},
			"permission": "mdm:womainRecord:poDetail" //查看明细
		
		}],
		
		//"model": "womainRecord", //当不指定form、dialog的ID，插件会根据该属性来自动匹配页面元素，如修改系统参数窗口，将自动匹配ID：sysParam_edit_dialog
		"dblClickHandler": "detailHandler" //双击行时进行的操作(当定义了onDblClickRow时，此参数将失效)
		
	});
	
	/*查询grid*/
	//$("#sysParam_search_form").find("#account")[0].disabled = false;
	$("#search_form_submit").on("click", function(){
		$('#pomainRecordView').datagrid("load", $("#pomainRecord_form").form("formToJson"));
	});
	$("#search_form_reset").on("click", function(){
		$("#pomainRecord_form").form("reset");
	});
	
	/**
	 * 审核提交
	 */
	function updateRecordStatus(coCode,auditStatus,role,id){
		$.ajax({
			url: "../womainRecord/updateRecordStatus.json",
			data: {"coCode":coCode,"auditStatus":auditStatus,"role":role,"id":id},
			dataType: "json",
			type: "post",
			cache: false,
			error:function(data){
				
			},
			success: function(result){
				 // 返回需要修改的数据信息
				if(result && (result.state == true || result.state == "true")){
					$.messager.show({
						"title" : "操作成功",
						"msg" : result.msg
					});
					$('#pomainRecordView').datagrid("load", $("#pomainRecord_form").form("formToJson"));// 重绘表格
					
				} else {
					$.messager.alert("操作失败", result.msg);
				}
			
			}
		});
		
	}
	
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
