steal(
	'./resources/bootstrap/css/bootstrap.css',
	'./jspresenter.css',
	'./presentationmode.css',
	'jquery/controller/route'
	)
.then(
	'jquery/controller',
	'jquery/controller/view',
	'jquery/view/ejs')
.then(
	'./resources/markdown/Markdown.Converter.js',
	'./resources/prettify.js',
	'./resources/mousetrap.js',
	//'./resources/prompter.js',
	'./resources/keymaster.min.js'
	)
.then(function(){
	

	$.Controller('Jspresenter', {
		_mdConverter: undefined,

		init: function(){
			this._mdConverter = new Markdown.Converter();
		},

		//publics
		renderUnit: function(pageName){
			var $versionHistory;

			this.element.html(this._renderMarkdown(this.view(pageName + "_md")));

			this._addPrettify();
			prettyPrint();

			$versionHistory = this.element.find("#versionhistory");
			if($versionHistory.length > 0){
				$.ajax({
					url: "https://api.github.com/repos/juristr/juristr.github.com/commits?path=./juristr/pages/views/" + pageName + "_md.ejs&callback=?",
					dataType: "json",
					type: "GET",
					success: this.proxy(function(result){
						$versionHistory.html(this.view("versionhistory", result.data));
					})
				});
			}
		},

		// renderPagesList: function(){
		// 	$.ajax({
		// 		url: "/juristr/pages/pages.json",
		// 		dataType: "json",
		// 		type: "GET",
		// 		success: this.proxy(function(data){
		// 			this.element.html(this.view("pageslist", data));
		// 		}),
		// 		error: function(e){
		// 			alert("error");
		// 		}
		// 	});
		// },

		//privates
		_renderMarkdown: function(markdownViewContent){
			return this._mdConverter.makeHtml(markdownViewContent);
		},

        _addPrettify: function () {
			var els = document.querySelectorAll('pre');
			for (var i = 0, el; el = els[i]; i++) {
				if (!el.classList.contains('noprettyprint')) {
					el.classList.add('prettyprint');
				}
				el.classList.add('drop-shadow');
				el.classList.add('curved');
				el.classList.add('curved-hz-2');
			}
		}

	});

	$.Controller('Routing', {

		init: function(){
			// article about routing:
			// https://forum.javascriptmvc.com/#Topic/32525000000837567

			$.route.bind('change', function(ev, attr, how, newVal, oldVal){
				var registeredControllers = $('#js-content').controllers();
				for(var i=0; i<registeredControllers.length; i++){
					var cName = registeredControllers[i].Class.shortName.toLowerCase();
					if(oldVal !== newVal && newVal.indexOf(cName) === -1 && oldVal === cName){
						registeredControllers[i].destroy();
					}
				}
			});

			//this.scroller = new Scroller($("#js-content"));
		},

		'route' : function(){
			//$.route.attr("route", "dashboard");	//redirect to dashboard route
		},

		'unit/:pagename route' : function(data){
			var $jsContent = $('#js-content'),
				controller = $jsContent.controller();

			if(controller === undefined || controller.Class.shortName.toLowerCase() !== 'unit'){
				controller = new Jspresenter($jsContent);
			}

			//controller[data.pagename]();
			controller.renderUnit(data.pagename);

			//this.scroller.initialize();
		}
	});

	$.Controller('Scroller', {

		init: function(){
			
			Mousetrap.bind("down", this.proxy(this.nextSlide));
			Mousetrap.bind("up", this.proxy(this.previousSlide));

		},

		initialize: function(){
			this.element.children("*").hide();
			//$(".pages-content > *").hide(); //generalize
		},

		previousSlide: function(){
			console.log("previous slide");
			var elem = this.element.find("*:visible:not('br'):last").hide();
		},

		nextSlide: function(){
			console.log("next slide");
			this._showNext();
		},

		_showNext: function(){
			var elem = this.element.find("*:hidden:not('br'):first").show();
		    // if (! firstShown) {
		    //   firstShown = elem;
		    // }
		    
		    // showingElement = elem;

		    // var height = elem.outerHeight(true);

		    // function callback() {
		    //   if (cb) { cb(scrollingOne ? 0 : 1); }
		    // }

		    // adjustPos(height, function() {
		    //   var dur = duration();
		    //   if (! dur) {
		    //     elem.show();
		    //     callback();
		    //   } else {
		    //     elem.fadeIn(dur, callback); 
		    //   }
		    // });
		},

		_adjustPos: function (elemHeight, cb) {
		    var windowHeight = $(window).height();
		    var visibleHeight = $('#body').height() + elemHeight;
		    var top = windowHeight - visibleHeight;

		    // adjust if element is bigger that window
		    if (windowHeight < elemHeight) {
		      leftToScroll = elemHeight - windowHeight;
		      top += leftToScroll;
		      scrollingOne = true;
		    }
		    var dur = duration();
		    if (dur === 0) {
		      container.css('top', top);
		      if (cb) cb();
		    } else {
		      container.animate({top: top}, dur, 'swing', cb)
		    }
  		}

	});

	new Routing(document.body);
});