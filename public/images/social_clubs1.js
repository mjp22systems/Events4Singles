//©Xara Ltd
if(typeof(loc)=="undefined"||loc==""){var loc="";if(document.body&&document.body.innerHTML){var tt=document.body.innerHTML;var ml=tt.match(/["']([^'"]*)social_clubs1.js["']/i);if(ml && ml.length > 1) loc=ml[1];}}

var bd=0
document.write("<style type=\"text/css\">");
document.write("\n<!--\n");
document.write(".social_clubs1_menu {z-index:999;border-color:#ffffff;border-style:solid;border-width:"+bd+"px 0px "+bd+"px 0px;background-color:#339999;position:absolute;left:0px;top:0px;visibility:hidden;}");
document.write(".social_clubs1_plain, a.social_clubs1_plain:link, a.social_clubs1_plain:visited{text-align:left;background-color:#339999;color:#ffccff;text-decoration:none;border-color:#ffffff;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:2px 0px 2px 0px;cursor:hand;display:block;font-size:8pt;font-family:Arial, Helvetica, sans-serif;}");
document.write("a.social_clubs1_plain:hover, a.social_clubs1_plain:active{background-color:#cc3366;color:#66cccc;text-decoration:none;border-color:#ffffff;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:2px 0px 2px 0px;cursor:hand;display:block;font-size:8pt;font-family:Arial, Helvetica, sans-serif;}");
document.write("\n-->\n");
document.write("</style>");

var fc=0x66cccc;
var bc=0xcc3366;
if(typeof(frames)=="undefined"){var frames=0;}

startMainMenu("social_clubs1_left.gif",27,27,2,0,0)
mainMenuItem("social_clubs1_b1",".gif",27,88,"javascript:;","_blank"," NSW",2,2,"social_clubs1_plain");
mainMenuItem("social_clubs1_b2",".gif",27,88,"javascript:;","","VIC ",2,2,"social_clubs1_plain");
mainMenuItem("social_clubs1_b3",".gif",27,88,"javascript:;","","QLD ",2,2,"social_clubs1_plain");
mainMenuItem("social_clubs1_b4",".gif",27,88,"javascript:;","","SA",2,2,"social_clubs1_plain");
mainMenuItem("social_clubs1_b5",".gif",27,88,"javascript:;","","WA",2,2,"social_clubs1_plain");
mainMenuItem("social_clubs1_b6",".gif",27,88,"javascript:;","","TAS",2,2,"social_clubs1_plain");
mainMenuItem("social_clubs1_b7",".gif",27,88,"javascript:;","","NT",2,2,"social_clubs1_plain");
mainMenuItem("social_clubs1_b8",".gif",27,88,"javascript:;","","ACT",2,2,"social_clubs1_plain");
endMainMenu("social_clubs1_right.gif",27,27)

startSubmenu("social_clubs1_b8","social_clubs1_menu",88);
submenuItem("Canberra",loc+"social_clubs_canberra.htm","","social_clubs1_plain");
endSubmenu("social_clubs1_b8");

startSubmenu("social_clubs1_b7","social_clubs1_menu",88);
submenuItem("Darwin",loc+"social_clubs_darwin.htm","","social_clubs1_plain");
endSubmenu("social_clubs1_b7");

startSubmenu("social_clubs1_b6","social_clubs1_menu",88);
submenuItem("Hobart",loc+"social_clubs_hobart.htm","","social_clubs1_plain");
endSubmenu("social_clubs1_b6");

startSubmenu("social_clubs1_b5","social_clubs1_menu",88);
submenuItem("Perth",loc+"social_clubs_perth.htm","","social_clubs1_plain");
endSubmenu("social_clubs1_b5");

startSubmenu("social_clubs1_b4","social_clubs1_menu",88);
submenuItem("Adelaide",loc+"social_clubs_adel.htm","","social_clubs1_plain");
endSubmenu("social_clubs1_b4");

startSubmenu("social_clubs1_b3","social_clubs1_menu",88);
submenuItem("Brisbane",loc+"social_clubs_bris.htm","","social_clubs1_plain");
submenuItem("Gold Coast",loc+"social_clubs_goldcoast.htm","","social_clubs1_plain");
endSubmenu("social_clubs1_b3");

startSubmenu("social_clubs1_b2","social_clubs1_menu",88);
submenuItem("Melbourne",loc+"social_clubs_melb.htm","","social_clubs1_plain");
submenuItem("Geelong",loc+"social_clubs_geelong.htm","","social_clubs1_plain");
endSubmenu("social_clubs1_b2");

startSubmenu("social_clubs1_b1","social_clubs1_menu",88);
submenuItem("Sydney",loc+"social_clubs_syd.htm","","social_clubs1_plain");
submenuItem("Central Coast",loc+"social_clubs_centralcoast.htm","","social_clubs1_plain");
submenuItem("Newcastle",loc+"social_clubs_newcastle.htm","","social_clubs1_plain");
endSubmenu("social_clubs1_b1");

loc="";
