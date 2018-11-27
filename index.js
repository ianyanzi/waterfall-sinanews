

var curPage = 1

var perPageCount = 10

var colSumHeight = []

var nodeWidth = $('.item').outerWidth(true)

var colNum = Math.floor($('#pic-ct').width() / nodeWidth)

for(var i = 0 ; i < colNum ; i++){
  colSumHeight[i] = 0
}

var isDateArrive = true

start()

function start(){

	getData(function(newsList){
		console.log(newsList)
		isDataArrive = true
		$.each(newsList, function(idx, news){
			var $node = getNode(news)
			$node.find('img').load(function(){
				$('#pic-ct').append($node)
				console.log($node, 'loaded...')
				waterFallPlace($node)
			})
		})
	})
	isDataArrive = false	
}




$(window).on('scroll',function(){
  if(!isDateArrive) return
  if(isVisible($('.load'))){
    start()
  }
})



function isVisible($el){
  
  var windowH = $(window).height()
  var windowScrollH = $(window).scrollTop()
  var elTop = $el.offset().top
  
  if( (windowH + windowScrollH) > elTop){
    return true
  }else{
    return false
  }
}



function getData(callback){
		$.ajax({
			url: 'http://platform.sina.com.cn/slide/album_tech',
			dataType: 'jsonp',   
			jsonp:"jsoncallback",
			data: {
				app_key: '1271687855',
				num: perPageCount,
				page: curPage
			}
		}).done(function(ret){
			if(ret && ret.status && ret.status.code === "0"){
				callback(ret.data);
				curPage++
			}else{
				console.log('获取数据失败');
			}
		});
}




function getNode(item){
  
  var tpl = ''
      tpl += '<li class="item">'
      tpl += ' <a href="'+ item.url +'" class="link"><img src="' + item.img_url + '" alt=""></a>';
      tpl += ' <h4 class="header">'+ item.short_name +'</h4>';
      tpl += '<p class="desp">'+item.short_intro+'</p>';
      tpl += '</li>';
  
  return $(tpl)
}




function waterFallPlace($node){
  
  var idx = 0
  
  var minSumHeight = colSumHeight[0]
  for(var i = 0 ; i < colNum ; i++){
    if(colSumHeight[i] < minSumHeight){
      minSumHeight = colSumHeight[i]
      idx = i
    }
  }
  
  $node.css({
    left:nodeWidth * idx,
    top:minSumHeight,
    opacity:1
  })
  
  colSumHeight[idx] = $node.outerHeight(true) + colSumHeight[idx]
		$('#pic-ct').height(Math.max.apply(null,colSumHeight))
}