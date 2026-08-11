//©Xara Ltd
if(typeof(loc)=="undefined"||loc==""){var loc="";if(document.body&&document.body.innerHTML){var tt=document.body.innerHTML;var ml=tt.match(/["']([^'"]*)dance_nav1a1.js["']/i);if(ml && ml.length > 1) loc=ml[1];}}

var bd=1
document.write("<style type=\"text/css\">");
document.write("\n<!--\n");
var tr="filter:alpha(opacity=99);-moz-opacity:0.99;";if(IE5) tr="";
document.write(".dance_nav1a1_menu {"+tr+"z-index:999;border-color:#ffffff;border-style:solid;border-width:"+bd+"px 0px "+bd+"px 0px;background-color:#894848;position:absolute;left:0px;top:0px;visibility:hidden;}");
document.write(".dance_nav1a1_plain, a.dance_nav1a1_plain:link, a.dance_nav1a1_plain:visited{text-align:left;background-color:#894848;color:#ffffff;text-decoration:none;border-color:#ffffff;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:4px 0px 4px 0px;cursor:hand;display:block;font-size:12pt;font-family:Trebuchet MS, Arial, sans-serif;font-style:italic;}");
document.write("a.dance_nav1a1_plain:hover, a.dance_nav1a1_plain:active{background-color:#0e0d0d;color:#ffffff;text-decoration:none;border-color:#ffffff;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:4px 0px 4px 0px;cursor:hand;display:block;font-size:12pt;font-family:Trebuchet MS, Arial, sans-serif;font-style:italic;}");
document.write("\n-->\n");
document.write("</style>");

var fc=0xffffff;
var bc=0x0e0d0d;
if(typeof(frames)=="undefined"){var frames=0;}

startMainMenu("",0,0,2,0,0)
mainMenuItem("dance_nav1a1_b1",".gif",24,109,"javascript:;","","NSW",2,2,"dance_nav1a1_plain");
mainMenuItem("dance_nav1a1_b2",".gif",24,109,"javascript:;","","VIC",2,2,"dance_nav1a1_plain");
mainMenuItem("dance_nav1a1_b3",".gif",24,109,"javascript:;","","QLD",2,2,"dance_nav1a1_plain");
mainMenuItem("dance_nav1a1_b4",".gif",24,109,"javascript:;","","SA",2,2,"dance_nav1a1_plain");
mainMenuItem("dance_nav1a1_b5",".gif",24,109,"javascript:;","","WA",2,2,"dance_nav1a1_plain");
mainMenuItem("dance_nav1a1_b6",".gif",24,109,"javascript:;","","ACT",2,2,"dance_nav1a1_plain");
mainMenuItem("dance_nav1a1_b7",".gif",24,109,loc+"../"+"dance_classes_tasmania.htm","","TAS",2,2,"dance_nav1a1_plain");
endMainMenu("",0,0);

startSubmenu("dance_nav1a1_b6","dance_nav1a1_menu",109);
submenuItem("Canberra",loc+"../"+"dance_classes_canberra.htm","","dance_nav1a1_plain");
endSubmenu("dance_nav1a1_b6");

startSubmenu("dance_nav1a1_b5","dance_nav1a1_menu",109);
submenuItem("Perth",loc+"../"+"dance_classes_perth.htm","","dance_nav1a1_plain");
endSubmenu("dance_nav1a1_b5");

startSubmenu("dance_nav1a1_b4","dance_nav1a1_menu",109);
submenuItem("Adelaide",loc+"../"+"dance_classes_sydney.htm","","dance_nav1a1_plain");
endSubmenu("dance_nav1a1_b4");

startSubmenu("dance_nav1a1_b3","dance_nav1a1_menu",127);
submenuItem("Brisbane",loc+"../"+"dance_classes_brisbane.htm","","dance_nav1a1_plain");
submenuItem("Gold Coast",loc+"../"+"dance_classes_goldcoast.htm","","dance_nav1a1_plain");
submenuItem("Sunshine Coast",loc+"../"+"dance_classes_sunshinecoast.htm","","dance_nav1a1_plain");
endSubmenu("dance_nav1a1_b3");

startSubmenu("dance_nav1a1_b2","dance_nav1a1_menu",109);
submenuItem("Melbourne",loc+"../"+"dance_classes_melbourne.htm","","dance_nav1a1_plain");
endSubmenu("dance_nav1a1_b2");

startSubmenu("dance_nav1a1_b1","dance_nav1a1_menu",118);
submenuItem("Sydney",loc+"../"+"dance_classes_sydney.htm","","dance_nav1a1_plain");
submenuItem("Central Coast",loc+"../"+"dance_classes_centralcoast.htm","","dance_nav1a1_plain");
submenuItem("Newcastle",loc+"../"+"dance_classes_newcastle.htm","","dance_nav1a1_plain");
endSubmenu("dance_nav1a1_b1");

loc="";
