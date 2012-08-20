//steal/js jspresenter/scripts/compress.js

load("steal/rhino/rhino.js");
steal('steal/clean',function(){
	steal.clean('jspresenter/jspresenter.html',{indent_size: 1, indent_char: '\t'});
});
