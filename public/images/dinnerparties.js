//©Xara Ltd
if(typeof(loc)=="undefined"||loc==""){var loc="";if(document.body&&document.body.innerHTML){var tt=document.body.innerHTML;var ml=tt.match(/["']([^'"]*)dinnerparties.js["']/i);if(ml && ml.length > 1) loc=ml[1];}}

var bd=0
document.write("<style type=\"text/css\">");
document.write("\n<!--\n");
document.write(".dinnerparties_menu {z-index:999;border-color:#ffffff;border-style:solid;border-width:"+bd+"px 0px "+bd+"px 0px;background-color:#66cccc;position:absolute;left:0px;top:0px;visibility:hidden;}");
document.write(".dinnerparties_plain, a.dinnerparties_plain:link, a.dinnerparties_plain:visited{text-align:left;background-color:#66cccc;color:#cc3366;text-decoration:none;border-color:#ffffff;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:2px 0px 2px 0px;cursor:hand;display:block;font-size:8pt;font-family:Verdana, Arial, Helvetica, sans-serif;}");
document.write("a.dinnerparties_plain:hover, a.dinnerparties_plain:active{background-color:#ffccff;color:#006666;text-decoration:none;border-color:#ffffff;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:2px 0px 2px 0px;cursor:hand;display:block;font-size:8pt;font-family:Verdana, Arial, Helvetica, sans-serif;}");
document.write("\n-->\n");
document.write("</style>");

var fc=0x006666;
var bc=0xffccff;
if(typeof(frames)=="undefined"){var frames=0;}

startMainMenu("dinnerparties_left.gif",27,27,2,0,0)
mainMenuItem("dinnerparties_b1",".gif",27,88,"javascript:;","_blank"," NSW",2,2,"dinnerparties_plain");
mainMenuItem("dinnerparties_b2",".gif",27,88,"javascript:;","","VIC ",2,2,"dinnerparties_plain");
mainMenuItem("dinnerparties_b3",".gif",27,88,"javascript:;","","QLD ",2,2,"dinnerparties_plain");
mainMenuItem("dinnerparties_b4",".gif",27,88,"javascript:;","","SA",2,2,"dinnerparties_plain");
mainMenuItem("dinnerparties_b5",".gif",27,88,"javascript:;","","WA",2,2,"dinnerparties_plain");
mainMenuItem("dinnerparties_b6",".gif",27,88,"javascript:;","","TAS",2,2,"dinnerparties_plain");
mainMenuItem("dinnerparties_b7",".gif",27,88,"javascript:;","","NT",2,2,"dinnerparties_plain");
mainMenuItem("dinnerparties_b8",".gif",27,88,"javascript:;","","ACT",2,2,"dinnerparties_plain");
endMainMenu("dinnerparties_right.gif",27,27)

startSubmenu("dinnerparties_b8","dinnerparties_menu",88);
submenuItem("Canberra",loc+"../dinner_parties_canberra.htm","","dinnerparties_plain");
endSubmenu("dinnerparties_b8");

startSubmenu("dinnerparties_b7","dinnerparties_menu",88);
submenuItem("Darwin",loc+"../dinner_parties_darwin.htm","","dinnerparties_plain");
endSubmenu("dinnerparties_b7");

startSubmenu("dinnerparties_b6","dinnerparties_menu",88);
submenuItem("Hobart",loc+"../dinner_parties_hobart.htm","","dinnerparties_plain");
endSubmenu("dinnerparties_b6");

startSubmenu("dinnerparties_b5","dinnerparties_menu",88);
submenuItem("Perth",loc+"../dinner_parties_perth.htm","","dinnerparties_plain");
endSubmenu("dinnerparties_b5");

startSubmenu("dinnerparties_b4","dinnerparties_menu",88);
submenuItem("Adelaide",loc+"../dinner_parties_adelaide.htm","","dinnerparties_plain");
endSubmenu("dinnerparties_b4");

startSubmenu("dinnerparties_b3","dinnerparties_menu",88);
submenuItem("Brisbane",loc+"../dinner_parties_brisbane.htm","","dinnerparties_plain");
submenuItem("Gold Coast",loc+"../dinner_parties_goldcoast.htm","","dinnerparties_plain");
endSubmenu("dinnerparties_b3");

startSubmenu("dinnerparties_b2","dinnerparties_menu",88);
submenuItem("Melbourne",loc+"../dinner_parties_melbourne.htm","","dinnerparties_plain");
submenuItem("Geelong",loc+"../dinner_parties_geelong.htm","","dinnerparties_plain");
endSubmenu("dinnerparties_b2");

startSubmenu("dinnerparties_b1","dinnerparties_menu",93);
submenuItem("Sydney",loc+"../dinner_parties_sydney.htm","","dinnerparties_plain");
submenuItem("Central Coast",loc+"../dinner_parties_centralcoast.htm","","dinnerparties_plain");
submenuItem("Newcastle",loc+"../dinner_parties_newcastle.htm","","dinnerparties_plain");
submenuItem("Wollongong",loc+"../dinner_parties_wollongong.htm","","dinnerparties_plain");
endSubmenu("dinnerparties_b1");

loc="";
