//steal/js jspresenter/scripts/compress.js

load("steal/rhino/rhino.js");
steal('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('jspresenter/scripts/build.html',{to: 'jspresenter'});
});
