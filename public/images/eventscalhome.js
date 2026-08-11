//©Xara Ltd
if(typeof(loc)=="undefined"||loc==""){var loc="";if(document.body&&document.body.innerHTML){var tt=document.body.innerHTML;var ml=tt.match(/["']([^'"]*)eventscalhome.js["']/i);if(ml && ml.length > 1) loc=ml[1];}}

var bd=0
document.write("<style type=\"text/css\">");
document.write("\n<!--\n");
document.write(".eventscalhome_menu {z-index:999;border-color:#000000;border-style:solid;border-width:"+bd+"px 0px "+bd+"px 0px;background-color:#339999;position:absolute;left:0px;top:0px;visibility:hidden;}");
document.write(".eventscalhome_plain, a.eventscalhome_plain:link, a.eventscalhome_plain:visited{text-align:left;background-color:#339999;color:#ffffff;text-decoration:none;border-color:#000000;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:2px 0px 2px 0px;cursor:hand;display:block;font-size:8pt;font-family:Verdana, Arial, Helvetica, sans-serif;}");
document.write("a.eventscalhome_plain:hover, a.eventscalhome_plain:active{background-color:#33cccc;color:#000000;text-decoration:none;border-color:#000000;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:2px 0px 2px 0px;cursor:hand;display:block;font-size:8pt;font-family:Verdana, Arial, Helvetica, sans-serif;}");
document.write("\n-->\n");
document.write("</style>");

var fc=0x000000;
var bc=0x33cccc;
if(typeof(frames)=="undefined"){var frames=0;}

startMainMenu("eventscalhome_left.jpg",44,44,2,0,0)
mainMenuItem("eventscalhome_b1",".jpg",44,123,loc+"calendar1.htm","_mainFrame","Sydney",2,2,"eventscalhome_plain");
mainMenuItem("eventscalhome_b2",".jpg",44,123,loc+"calendar2.htm","_mainFrame","Melbourne",2,2,"eventscalhome_plain");
mainMenuItem("eventscalhome_b3",".jpg",44,123,loc+"calendar3.htm","_mainFrame","Brisbane",2,2,"eventscalhome_plain");
mainMenuItem("eventscalhome_b4",".jpg",44,123,"javascript:;","_mainFrame","Perth",2,2,"eventscalhome_plain");
mainMenuItem("eventscalhome_b5",".jpg",44,123,"javascript:;","_mainFrame","Adelaide",2,2,"eventscalhome_plain");
mainMenuItem("eventscalhome_b6",".jpg",44,123,"javascript:;","_mainFrame","Other Cities",2,2,"eventscalhome_plain");
endMainMenu("eventscalhome_right.jpg",44,44)

startSubmenu("eventscalhome_b5","eventscalhome_menu",123);
submenuItem("Adelaide Events","javascript:;","","eventscalhome_plain");
endSubmenu("eventscalhome_b5");

startSubmenu("eventscalhome_b4","eventscalhome_menu",123);
submenuItem("Perth Events","javascript:;","","eventscalhome_plain");
endSubmenu("eventscalhome_b4");

startSubmenu("eventscalhome_b3","eventscalhome_menu",123);
submenuItem("Brisbane Events","javascript:;","","eventscalhome_plain");
endSubmenu("eventscalhome_b3");

startSubmenu("eventscalhome_b2","eventscalhome_menu",123);
submenuItem("Melbourne Events","javascript:;","_mainFrame","eventscalhome_plain");
endSubmenu("eventscalhome_b2");

startSubmenu("eventscalhome_b1","eventscalhome_menu",123);
submenuItem("Sydney Events","javascript:;","","eventscalhome_plain");
endSubmenu("eventscalhome_b1");

loc="";
