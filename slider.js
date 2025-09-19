(function($){
	$.fn.simpleSlider = function(opts){
		var settings = $.extend({
			itemsPerPage: 4,
			step: 1, // null = по странице, 1 = по одному слайду
			margin: 5,
			speed: 500,
			loop: false,
			viewport: 500, // ширина, при которой устройства считается мобильным
			showButtons: true,
			showPagination: true,
			swipeThreshold: 40
		}, opts);
		if(settings.step===null) settings.step = settings.itemsPerPage;

		return this.each(function(){
			var $root = $(this),
				$slides = $root.children().addClass('sl-slide'),
				total = $slides.length;

			$slides.wrapAll('<div class="sl-track"></div>');
			var $track = $root.find('.sl-track');
			$track.wrap('<div class="sl-viewport"></div>');
			var $viewport = $root.find('.sl-viewport');

			if($root.width() <= settings.viewport){
				settings.itemsPerPage = 1;
				settings.margin = 0;
				settings.showButtons = false;
			}

			if(settings.showButtons) $root.append('<span class="sl-btn prevsl">&lt;</span><span class="sl-btn nextsl">&gt;</span>');
			if(settings.showPagination) $root.append('<div class="sl-dots"></div>');
			var $dots = $root.find('.sl-dots'), currentPage=0;

			function updateSizes(){
				var viewportWidth = $viewport.width();
				var slideWidth = (viewportWidth - settings.margin*2*settings.itemsPerPage) / settings.itemsPerPage;
				$slides.css({
					width: slideWidth + 'px',
					marginLeft: settings.margin + 'px',
					marginRight: settings.margin + 'px'
				});
				return slideWidth;
			}

			function pagesCount(){
				return Math.ceil((total - settings.itemsPerPage) / settings.step) + 1;
			}

			function renderDots(){
				if(!settings.showPagination) return;
				$dots.empty();
				for(var i=0;i<pagesCount();i++)
					$dots.append('<div class="sl-dot'+(i===currentPage?' active':'')+'" data-index="'+i+'"></div>');
			}

			function render(){
				var slideWidth = updateSizes();
				var startIdx = currentPage * settings.step;
				if(startIdx + settings.itemsPerPage > total) startIdx = total - settings.itemsPerPage;
				if(startIdx < 0) startIdx = 0;

				var tx = -startIdx * (slideWidth + settings.margin*2);
				$track.css('transform', 'translateX('+tx+'px)');

				$slides.removeClass('active');
				for(var i=0;i<settings.itemsPerPage;i++){
					var idx = startIdx + i;
					if(idx<total) $slides.eq(idx).addClass('active');
				}

				$dots.find('.sl-dot').removeClass('active').eq(currentPage).addClass('active');
				renderDots();
			}

			function goTo(page){
				if(page<0) page = settings.loop ? pagesCount()-1 : 0;
				if(page>=pagesCount()) page = settings.loop ? 0 : pagesCount()-1;
				currentPage = page;
				render();
			}

			$root.on('click','.sl-btn.prevsl',()=>goTo(currentPage-1));
			$root.on('click','.sl-btn.nextsl',()=>goTo(currentPage+1));
			$root.on('click','.sl-dot',function(){ goTo(+$(this).data('index')); });

			var isDragging=false,startX=0,offsetX=0,moved=false;
			function getX(e){ return e.type.startsWith('touch') ? e.touches[0]?.clientX || e.changedTouches[0]?.clientX : e.clientX; }
			$viewport.on('mousedown touchstart', function(e){
				isDragging=true;
				moved=false;
				startX=getX(e);
				$track.css('transition','none');
				var style = window.getComputedStyle($track[0]), m = new WebKitCSSMatrix(style.transform);
				offsetX = m.m41 || 0;
				$root.addClass('dragging');
				$root.width() > settings.viewport && e.preventDefault();
			});
			$(document).on('mousemove touchmove', function(e){
				if(!isDragging) return;
				var dx=getX(e)-startX;
				if(Math.abs(dx)>5) moved=true;
				$track.css('transform','translateX('+(offsetX+dx)+'px)');
			});
			$(document).on('mouseup touchend touchcancel', function(e){
				if(!isDragging) return;
				isDragging=false;
				$root.removeClass('dragging');
				$track[0].offsetHeight; // перерисовка
				$track.css('transition','transform '+settings.speed+'ms ease');
				var dx=getX(e)-startX;
				if(Math.abs(dx)>settings.swipeThreshold){
					goTo(dx<0 ? currentPage+1 : currentPage-1);
				} else render();
			});
			// блокировка click на ссылках при drag
			$root.on('click','a',function(e){
				if(moved){
					e.preventDefault();
					e.stopImmediatePropagation();
					moved=false;
				}
			});		
			$(window).on('resize', render());
			render();
		});
	}
})(jQuery);
$('.slider').simpleSlider();