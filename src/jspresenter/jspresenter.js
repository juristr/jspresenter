steal(
	'./jspresenter.css',
	'jquery/controller/route'
	)
.then(
	'jquery/controller',
	'jquery/controller/view',
	'jquery/view/ejs',
	'./resources/markdown/Markdown.Converter.js',
	'./resources/prettify.js'
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
			return "<section class='span8 pages-content'>" + this._mdConverter.makeHtml(markdownViewContent); + "</section>";
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

	$.Controller('Juristr.Routing', {

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
		}
	});

	new Juristr.Routing(document.body);
});