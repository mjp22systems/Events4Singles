//©Xara Ltd
if(typeof(loc)=="undefined"||loc==""){var loc="";if(document.body&&document.body.innerHTML){var tt=document.body.innerHTML;var ml=tt.match(/["']([^'"]*)evcalendar_nav.js["']/i);if(ml && ml.length > 1) loc=ml[1];}}

var bd=0
document.write("<style type=\"text/css\">");
document.write("\n<!--\n");
document.write(".evcalendar_nav_menu {z-index:999;border-color:#ffffff;border-style:solid;border-width:"+bd+"px 0px "+bd+"px 0px;background-color:#cc0066;position:absolute;left:0px;top:0px;visibility:hidden;}");
document.write(".evcalendar_nav_plain, a.evcalendar_nav_plain:link, a.evcalendar_nav_plain:visited{text-align:left;background-color:#cc0066;color:#ffccff;text-decoration:none;border-color:#ffffff;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:2px 0px 2px 0px;cursor:hand;display:block;font-size:8pt;font-family:Arial, Helvetica, sans-serif;}");
document.write("a.evcalendar_nav_plain:hover, a.evcalendar_nav_plain:active{background-color:#cc0066;color:#ffcccc;text-decoration:none;border-color:#ffffff;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:2px 0px 2px 0px;cursor:hand;display:block;font-size:8pt;font-family:Arial, Helvetica, sans-serif;}");
document.write("\n-->\n");
document.write("</style>");

var fc=0xffcccc;
var bc=0xcc0066;
if(typeof(frames)=="undefined"){var frames=0;}

startMainMenu("evcalendar_nav_top.gif",26,159,1,0,0)
mainMenuItem("evcalendar_nav_b1",".gif",34,159,"javascript:;","_blank","NSW",1,2,"evcalendar_nav_plain");
mainMenuItem("evcalendar_nav_b2",".gif",34,159,"javascript:;","","VIC ",1,2,"evcalendar_nav_plain");
mainMenuItem("evcalendar_nav_b3",".gif",34,159,"javascript:;","","QLD ",1,2,"evcalendar_nav_plain");
mainMenuItem("evcalendar_nav_b4",".gif",34,159,"javascript:;","","SA",1,2,"evcalendar_nav_plain");
mainMenuItem("evcalendar_nav_b5",".gif",34,159,"javascript:;","","WA",1,2,"evcalendar_nav_plain");
mainMenuItem("evcalendar_nav_b6",".gif",34,159,"javascript:;","","ACT",1,2,"evcalendar_nav_plain");
mainMenuItem("evcalendar_nav_b7",".gif",34,159,"javascript:;","","Other Cities",1,2,"evcalendar_nav_plain");
endMainMenu("evcalendar_nav_bottom.gif",26,159)

startSubmenu("evcalendar_nav_b7","evcalendar_nav_menu",47);
submenuItem("Hobart","http://www.events4singles.com/events_hobart.htm","","evcalendar_nav_plain");
submenuItem("Darwin","http://www.events4singles.com/events_darwin.htm","","evcalendar_nav_plain");
endSubmenu("evcalendar_nav_b7");

startSubmenu("evcalendar_nav_b6","evcalendar_nav_menu",57);
submenuItem("Canberra","http://www.events4singles.com/event_calendar_canberra.htm","","evcalendar_nav_plain");
endSubmenu("evcalendar_nav_b6");

startSubmenu("evcalendar_nav_b5","evcalendar_nav_menu",37);
submenuItem("Perth","http://www.events4singles.com/event_calendar_perth.htm","","evcalendar_nav_plain");
endSubmenu("evcalendar_nav_b5");

startSubmenu("evcalendar_nav_b4","evcalendar_nav_menu",54);
submenuItem("Adelaide","http://www.events4singles.com/event_calendar_adelaide.htm","","evcalendar_nav_plain");
endSubmenu("evcalendar_nav_b4");

startSubmenu("evcalendar_nav_b3","evcalendar_nav_menu",65);
submenuItem("Brisbane","http://www.events4singles.com/event_calendar_brisbane.htm","","evcalendar_nav_plain");
submenuItem("Gold Coast","http://www.events4singles.com/event_calendar_goldcoast.htm","","evcalendar_nav_plain");
endSubmenu("evcalendar_nav_b3");

startSubmenu("evcalendar_nav_b2","evcalendar_nav_menu",83);
submenuItem("Melbourne","http://www.events4singles.com/event_calendar_melbourne.htm","","evcalendar_nav_plain");
submenuItem("Geelong","http://www.events4singles.com/event_calendar_geelong.htm","","evcalendar_nav_plain");
submenuItem("Country Areas","http://www.events4singles.com/event_calendar_country_vic.htm","","evcalendar_nav_plain");
endSubmenu("evcalendar_nav_b2");

startSubmenu("evcalendar_nav_b1","evcalendar_nav_menu",77);
submenuItem("Sydney","http://www.events4singles.com/event_ calendar_sydney.htm","","evcalendar_nav_plain");
submenuItem("Central Coast","http://www.events4singles.com/events_calendar_central_coast.htm","","evcalendar_nav_plain");
submenuItem("Newcastle ",loc+"www.events4singles.comevent_calendar_newcastle.htm","","evcalendar_nav_plain");
submenuItem("Wollongong",loc+"../../../../../Nikki Bentley/My Documents/My Webs/events4singles/event_ calendar_wollongong.htm","","evcalendar_nav_plain");
endSubmenu("evcalendar_nav_b1");

loc="";
