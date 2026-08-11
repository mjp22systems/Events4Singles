//©Xara Ltd
if(typeof(loc)=="undefined"||loc==""){var loc="";if(document.body&&document.body.innerHTML){var tt=document.body.innerHTML;var ml=tt.match(/["']([^'"]*)other.js["']/i);if(ml && ml.length > 1) loc=ml[1];}}

var bd=0
document.write("<style type=\"text/css\">");
document.write("\n<!--\n");
document.write(".other_menu {z-index:999;border-color:#ffffff;border-style:solid;border-width:"+bd+"px 0px "+bd+"px 0px;background-color:#b70000;position:absolute;left:0px;top:0px;visibility:hidden;}");
document.write(".other_plain, a.other_plain:link, a.other_plain:visited{text-align:left;background-color:#b70000;color:#ffffff;text-decoration:none;border-color:#ffffff;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:2px 0px 2px 0px;cursor:hand;display:block;font-size:8pt;font-family:Arial, Helvetica, sans-serif;}");
document.write("a.other_plain:hover, a.other_plain:active{background-color:#6c3d6c;color:#ffffff;text-decoration:none;border-color:#ffffff;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:2px 0px 2px 0px;cursor:hand;display:block;font-size:8pt;font-family:Arial, Helvetica, sans-serif;}");
document.write("\n-->\n");
document.write("</style>");

var fc=0xffffff;
var bc=0x6c3d6c;
if(typeof(frames)=="undefined"){var frames=0;}

startMainMenu("other_left.gif",29,16,2,0,0)
mainMenuItem("other_b1",".gif",29,97,"javascript:;","_blank"," NSW",2,2,"other_plain");
mainMenuItem("other_b2",".gif",29,97,"javascript:;","","VIC ",2,2,"other_plain");
mainMenuItem("other_b3",".gif",29,97,"javascript:;","","QLD ",2,2,"other_plain");
mainMenuItem("other_b4",".gif",29,97,"javascript:;","","SA",2,2,"other_plain");
mainMenuItem("other_b5",".gif",29,97,"javascript:;","","WA",2,2,"other_plain");
mainMenuItem("other_b6",".gif",29,97,"javascript:;","","Other Cities",2,2,"other_plain");
endMainMenu("other_right.gif",29,16)

startSubmenu("other_b6","other_menu",97);
submenuItem("Hobart",loc+"../social_clubs_hobart.htm","","other_plain");
submenuItem("Darwin",loc+"../social_clubs_darwin.htm","","other_plain");
submenuItem("Canberra",loc+"../social_clubs_canberra.htm","","other_plain");
endSubmenu("other_b6");

startSubmenu("other_b5","other_menu",97);
submenuItem("Perth",loc+"../social_clubs_perth.htm","","other_plain");
endSubmenu("other_b5");

startSubmenu("other_b4","other_menu",97);
submenuItem("Adelaide",loc+"../social_clubs_adel.htm","","other_plain");
endSubmenu("other_b4");

startSubmenu("other_b3","other_menu",97);
submenuItem("Brisbane",loc+"../social_clubs_bris.htm","","other_plain");
submenuItem("Gold Coast",loc+"../social_clubs_goldcoast.htm","","other_plain");
endSubmenu("other_b3");

startSubmenu("other_b2","other_menu",97);
submenuItem("Melbourne",loc+"../social_clubs_melb.htm","","other_plain");
submenuItem("Geelong",loc+"../social_clubs_geelong.htm","","other_plain");
endSubmenu("other_b2");

startSubmenu("other_b1","other_menu",97);
submenuItem("Sydney",loc+"../social_clubs_syd.htm","","other_plain");
submenuItem("Central Coast",loc+"../social_clubs_centralcoast.htm","","other_plain");
submenuItem("Newcastle ",loc+"../social_clubs_newcastle.htm","","other_plain");
endSubmenu("other_b1");

loc="";
