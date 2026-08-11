//©Xara Ltd
if(typeof(loc)=="undefined"||loc==""){var loc="";if(document.body&&document.body.innerHTML){var tt=document.body.innerHTML;var ml=tt.match(/["']([^'"]*)othernav.js["']/i);if(ml && ml.length > 1) loc=ml[1];}}

var bd=0
document.write("<style type=\"text/css\">");
document.write("\n<!--\n");
document.write(".othernav_menu {z-index:999;border-color:#ffffff;border-style:solid;border-width:"+bd+"px 0px "+bd+"px 0px;background-color:#b70000;position:absolute;left:0px;top:0px;visibility:hidden;}");
document.write(".othernav_plain, a.othernav_plain:link, a.othernav_plain:visited{text-align:left;background-color:#b70000;color:#ffffff;text-decoration:none;border-color:#ffffff;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:2px 0px 2px 0px;cursor:hand;display:block;font-size:8pt;font-family:Arial, Helvetica, sans-serif;}");
document.write("a.othernav_plain:hover, a.othernav_plain:active{background-color:#6c3d6c;color:#ffffff;text-decoration:none;border-color:#ffffff;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:2px 0px 2px 0px;cursor:hand;display:block;font-size:8pt;font-family:Arial, Helvetica, sans-serif;}");
document.write("\n-->\n");
document.write("</style>");

var fc=0xffffff;
var bc=0x6c3d6c;
if(typeof(frames)=="undefined"){var frames=0;}

startMainMenu("othernav_left.gif",29,16,2,0,0)
mainMenuItem("othernav_b1",".gif",29,97,"javascript:;","_blank"," NSW",2,2,"othernav_plain");
mainMenuItem("othernav_b2",".gif",29,97,"javascript:;","","VIC ",2,2,"othernav_plain");
mainMenuItem("othernav_b3",".gif",29,97,"javascript:;","","QLD ",2,2,"othernav_plain");
mainMenuItem("othernav_b4",".gif",29,97,"javascript:;","","SA",2,2,"othernav_plain");
mainMenuItem("othernav_b5",".gif",29,97,"javascript:;","","WA",2,2,"othernav_plain");
mainMenuItem("othernav_b6",".gif",29,97,"javascript:;","","Other Cities",2,2,"othernav_plain");
endMainMenu("othernav_right.gif",29,16)

startSubmenu("othernav_b6","othernav_menu",97);
submenuItem("Hobart",loc+"../social_clubs_hobart.htm","","othernav_plain");
submenuItem("Darwin",loc+"../social_clubs_darwin.htm","","othernav_plain");
submenuItem("Canberra",loc+"../social_clubs_canberra.htm","","othernav_plain");
endSubmenu("othernav_b6");

startSubmenu("othernav_b5","othernav_menu",97);
submenuItem("Perth",loc+"../social_clubs_perth.htm","","othernav_plain");
endSubmenu("othernav_b5");

startSubmenu("othernav_b4","othernav_menu",97);
submenuItem("Adelaide",loc+"../social_clubs_adel.htm","","othernav_plain");
endSubmenu("othernav_b4");

startSubmenu("othernav_b3","othernav_menu",97);
submenuItem("Brisbane",loc+"../social_clubs_bris.htm","","othernav_plain");
submenuItem("Gold Coast",loc+"../social_clubs_goldcoast.htm","","othernav_plain");
endSubmenu("othernav_b3");

startSubmenu("othernav_b2","othernav_menu",97);
submenuItem("Melbourne",loc+"../social_clubs_melb.htm","","othernav_plain");
submenuItem("Geelong",loc+"../social_clubs_geelong.htm","","othernav_plain");
endSubmenu("othernav_b2");

startSubmenu("othernav_b1","othernav_menu",97);
submenuItem("Sydney",loc+"../social_clubs_syd.htm","","othernav_plain");
submenuItem("Central Coast",loc+"../social_clubs_centralcoast.htm","","othernav_plain");
submenuItem("Newcastle ",loc+"../social_clubs_newcastle.htm","","othernav_plain");
endSubmenu("othernav_b1");

loc="";
