//©Xara Ltd
if(typeof(loc)=="undefined"||loc==""){var loc="";if(document.body&&document.body.innerHTML){var tt=document.body.innerHTML;var ml=tt.match(/["']([^'"]*)dance_nav3.js["']/i);if(ml && ml.length > 1) loc=ml[1];}}

var bd=1
document.write("<style type=\"text/css\">");
document.write("\n<!--\n");
var tr="filter:alpha(opacity=98);-moz-opacity:0.98;";if(IE5) tr="";
document.write(".dance_nav3_menu {"+tr+"z-index:999;border-color:#000000;border-style:solid;border-width:"+bd+"px 0px "+bd+"px 0px;background-color:#aa5959;position:absolute;left:0px;top:0px;visibility:hidden;}");
document.write(".dance_nav3_plain, a.dance_nav3_plain:link, a.dance_nav3_plain:visited{text-align:left;background-color:#aa5959;color:#ffffff;text-decoration:none;border-color:#000000;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:5px 0px 5px 0px;cursor:hand;display:block;font-size:8pt;font-family:Tahoma, Verdana, Arial, sans-serif;}");
document.write("a.dance_nav3_plain:hover, a.dance_nav3_plain:active{background-color:#1a1d1e;color:#eee8e8;text-decoration:none;border-color:#000000;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:5px 0px 5px 0px;cursor:hand;display:block;font-size:8pt;font-family:Tahoma, Verdana, Arial, sans-serif;}");
document.write("\n-->\n");
document.write("</style>");

var fc=0xeee8e8;
var bc=0x1a1d1e;
if(typeof(frames)=="undefined"){var frames=0;}

startMainMenu("dance_nav3_top.gif",65,146,1,0,2)
mainMenuItem("dance_nav3_b1",".gif",23,146,loc+"../dance_classes.htm","","Dance Home",2,2,"dance_nav3_plain");
mainMenuItem("dance_nav3_b2",".gif",23,146,"javascript:;","","Dance Styles",1,2,"dance_nav3_plain");
mainMenuItem("dance_nav3_b3",".gif",23,146,loc+"../dance_fitness_and_health.htm","","Dance Fitness",2,2,"dance_nav3_plain");
mainMenuItem("dance_nav3_b4",".gif",23,146,loc+"../dance_classes_ceroc.htm","","Ceroc",2,2,"dance_nav3_plain");
mainMenuItem("dance_nav3_b5",".gif",23,146,loc+"../dance_classes_salsa.htm","","Salsa",2,2,"dance_nav3_plain");
mainMenuItem("dance_nav3_b6",".gif",23,146,loc+"../dance_classes_swing.htm","","Swing",2,2,"dance_nav3_plain");
mainMenuItem("dance_nav3_b7",".gif",23,146,loc+"../dance_classes_tango.htm","","Tango",2,2,"dance_nav3_plain");
endMainMenu("dance_nav3_bottom.gif",65,146)

startSubmenu("dance_nav3_b2","dance_nav3_menu",83);
submenuItem("Ballroom",loc+"../dance_ballroom_style.htm","","dance_nav3_plain");
submenuItem("Latin",loc+"../dance_latin_style.htm","","dance_nav3_plain");
submenuItem("Contemporary",loc+"../dance_contemporary_style.htm","","dance_nav3_plain");
submenuItem("Modern",loc+"../dance_modern_style.htm","","dance_nav3_plain");
submenuItem("Cultural",loc+"../dance_cultural_style.htm","","dance_nav3_plain");
endSubmenu("dance_nav3_b2");

loc="";
