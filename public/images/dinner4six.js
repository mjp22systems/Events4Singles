//©Xara Ltd
if(typeof(loc)=="undefined"||loc==""){var loc="";if(document.body&&document.body.innerHTML){var tt=document.body.innerHTML;var ml=tt.match(/["']([^'"]*)dinner4six.js["']/i);if(ml && ml.length > 1) loc=ml[1];}}

var bd=0
document.write("<style type=\"text/css\">");
document.write("\n<!--\n");
document.write(".dinner4six_menu {z-index:999;border-color:#ffffff;border-style:solid;border-width:"+bd+"px 0px "+bd+"px 0px;background-color:#ffccff;position:absolute;left:0px;top:0px;visibility:hidden;}");
document.write(".dinner4six_plain, a.dinner4six_plain:link, a.dinner4six_plain:visited{text-align:left;background-color:#ffccff;color:#006666;text-decoration:none;border-color:#ffffff;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:2px 0px 2px 0px;cursor:hand;display:block;font-size:8pt;font-family:Arial, Helvetica, sans-serif;}");
document.write("a.dinner4six_plain:hover, a.dinner4six_plain:active{background-color:#339999;color:#ffffff;text-decoration:none;border-color:#ffffff;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:2px 0px 2px 0px;cursor:hand;display:block;font-size:8pt;font-family:Arial, Helvetica, sans-serif;}");
document.write("\n-->\n");
document.write("</style>");

var fc=0xffffff;
var bc=0x339999;
if(typeof(frames)=="undefined"){var frames=0;}

startMainMenu("dinner4six_left.gif",27,27,2,0,0)
mainMenuItem("dinner4six_b1",".gif",27,88,"javascript:;","_blank"," NSW",2,2,"dinner4six_plain");
mainMenuItem("dinner4six_b2",".gif",27,88,"javascript:;","","VIC ",2,2,"dinner4six_plain");
mainMenuItem("dinner4six_b3",".gif",27,88,"javascript:;","","QLD ",2,2,"dinner4six_plain");
mainMenuItem("dinner4six_b4",".gif",27,88,"javascript:;","","SA",2,2,"dinner4six_plain");
mainMenuItem("dinner4six_b5",".gif",27,88,"javascript:;","","WA",2,2,"dinner4six_plain");
mainMenuItem("dinner4six_b6",".gif",27,88,"javascript:;","","NT",2,2,"dinner4six_plain");
mainMenuItem("dinner4six_b7",".gif",27,88,"javascript:;","","TAS",2,2,"dinner4six_plain");
mainMenuItem("dinner4six_b8",".gif",27,88,"javascript:;","","ACT",2,2,"dinner4six_plain");
endMainMenu("dinner4six_right.gif",27,27)

startSubmenu("dinner4six_b8","dinner4six_menu",88);
submenuItem("Canberra",loc+"../dinner_for_six_canberra.htm","","dinner4six_plain");
endSubmenu("dinner4six_b8");

startSubmenu("dinner4six_b7","dinner4six_menu",88);
submenuItem("Hobart",loc+"../dinner_for_six_hobart.htm","","dinner4six_plain");
endSubmenu("dinner4six_b7");

startSubmenu("dinner4six_b6","dinner4six_menu",88);
submenuItem("Darwin",loc+"../dinner_for_six_darwin.htm","","dinner4six_plain");
endSubmenu("dinner4six_b6");

startSubmenu("dinner4six_b5","dinner4six_menu",88);
submenuItem("Perth",loc+"../dinner_for_six_perth.htm","","dinner4six_plain");
endSubmenu("dinner4six_b5");

startSubmenu("dinner4six_b4","dinner4six_menu",88);
submenuItem("Adelaide",loc+"../dinner_for_six_adelaide.htm","","dinner4six_plain");
endSubmenu("dinner4six_b4");

startSubmenu("dinner4six_b3","dinner4six_menu",88);
submenuItem("Brisbane",loc+"../dinner_for_six_brisbane.htm","","dinner4six_plain");
submenuItem("Gold Coast",loc+"../dinner_for_six_gold_coast.htm","","dinner4six_plain");
endSubmenu("dinner4six_b3");

startSubmenu("dinner4six_b2","dinner4six_menu",88);
submenuItem("Melbourne",loc+"../dinner_for_six_melbourne.htm","","dinner4six_plain");
endSubmenu("dinner4six_b2");

startSubmenu("dinner4six_b1","dinner4six_menu",88);
submenuItem("Sydney",loc+"../dinner_for_six_sydney.htm","","dinner4six_plain");
submenuItem("Central Coast",loc+"../dinner_for_six_sydney.htm","","dinner4six_plain");
submenuItem("Newcastle",loc+"../dinner_for_six_sydney.htm","","dinner4six_plain");
endSubmenu("dinner4six_b1");

loc="";
