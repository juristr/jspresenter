// load('jspresenter/scripts/crawl.js')

load('steal/rhino/rhino.js')

steal('steal/html/crawl', function(){
  steal.html.crawl("jspresenter/jspresenter.html","jspresenter/out")
});
