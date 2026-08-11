//©Xara Ltd
if(typeof(loc)=="undefined"||loc==""){var loc="";if(document.body&&document.body.innerHTML){var tt=document.body.innerHTML;var ml=tt.match(/["']([^'"]*)dance_classes.js["']/i);if(ml && ml.length > 1) loc=ml[1];}}

var bd=1
document.write("<style type=\"text/css\">");
document.write("\n<!--\n");
var tr="filter:alpha(opacity=99);-moz-opacity:0.99;";if(IE5) tr="";
document.write(".dance_classes_menu {"+tr+"z-index:999;border-color:#ffffff;border-style:solid;border-width:"+bd+"px 0px "+bd+"px 0px;background-color:#669999;position:absolute;left:0px;top:0px;visibility:hidden;}");
document.write(".dance_classes_plain, a.dance_classes_plain:link, a.dance_classes_plain:visited{text-align:left;background-color:#669999;color:#ffffff;text-decoration:none;border-color:#ffffff;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:2px 0px 2px 0px;cursor:hand;display:block;font-size:12pt;font-family:Arial, Helvetica, sans-serif;}");
document.write("a.dance_classes_plain:hover, a.dance_classes_plain:active{background-color:#ffccff;color:#cc3366;text-decoration:none;border-color:#ffffff;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:2px 0px 2px 0px;cursor:hand;display:block;font-size:12pt;font-family:Arial, Helvetica, sans-serif;}");
document.write("\n-->\n");
document.write("</style>");

var fc=0xcc3366;
var bc=0xffccff;
if(typeof(frames)=="undefined"){var frames=0;}

startMainMenu("dance_classes_left.gif",67,36,2,0,0)
mainMenuItem("dance_classes_b1",".gif",36,127,"javascript:;","_blank"," NSW",2,2,"dance_classes_plain");
mainMenuItem("dance_classes_b2",".gif",36,127,"javascript:;","","VIC ",2,2,"dance_classes_plain");
mainMenuItem("dance_classes_b3",".gif",36,127,"javascript:;","","QLD ",2,2,"dance_classes_plain");
mainMenuItem("dance_classes_b4",".gif",36,127,"javascript:;","","SA",2,2,"dance_classes_plain");
mainMenuItem("dance_classes_b5",".gif",36,127,"javascript:;","","WA",2,2,"dance_classes_plain");
mainMenuItem("dance_classes_b6",".gif",36,127,loc+"../dance_classes_tasmania.htm","","TAS",2,2,"dance_classes_plain");
endMainMenu("dance_classes_right.gif",67,36)

startSubmenu("dance_classes_b5","dance_classes_menu",127);
submenuItem("Perth",loc+"../dance_classes_perth.htm","","dance_classes_plain");
endSubmenu("dance_classes_b5");

startSubmenu("dance_classes_b4","dance_classes_menu",127);
submenuItem("Adelaide",loc+"../dance_classes_adelaide.htm","","dance_classes_plain");
endSubmenu("dance_classes_b4");

startSubmenu("dance_classes_b3","dance_classes_menu",127);
submenuItem("Brisbane",loc+"../dance_classes_brisbane.htm","","dance_classes_plain");
submenuItem("Gold Coast",loc+"../dance_classes_goldcoast.htm","","dance_classes_plain");
submenuItem("Sunshine Coast",loc+"../dance_classes_sunshinecoast.htm","","dance_classes_plain");
endSubmenu("dance_classes_b3");

startSubmenu("dance_classes_b2","dance_classes_menu",127);
submenuItem("Melbourne",loc+"../dance_classes_melbourne.htm","","dance_classes_plain");
endSubmenu("dance_classes_b2");

startSubmenu("dance_classes_b1","dance_classes_menu",127);
submenuItem("Sydney",loc+"../dance_classes_sydney.htm","","dance_classes_plain");
submenuItem("Newcastle",loc+"../dance_classes_newcastle.htm","","dance_classes_plain");
endSubmenu("dance_classes_b1");

loc="";
