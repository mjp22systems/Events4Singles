//©Xara Ltd
if(typeof(loc)=="undefined"||loc==""){var loc="";if(document.body&&document.body.innerHTML){var tt=document.body.innerHTML;var ml=tt.match(/["']([^'"]*)evcalendar.js["']/i);if(ml && ml.length > 1) loc=ml[1];}}

var bd=0
document.write("<style type=\"text/css\">");
document.write("\n<!--\n");
document.write(".evcalendar_menu {z-index:999;border-color:#ffffff;border-style:solid;border-width:"+bd+"px 0px "+bd+"px 0px;background-color:#cc0066;position:absolute;left:0px;top:0px;visibility:hidden;}");
document.write(".evcalendar_plain, a.evcalendar_plain:link, a.evcalendar_plain:visited{text-align:left;background-color:#cc0066;color:#ffccff;text-decoration:none;border-color:#ffffff;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:2px 0px 2px 0px;cursor:hand;display:block;font-size:8pt;font-family:Arial, Helvetica, sans-serif;}");
document.write("a.evcalendar_plain:hover, a.evcalendar_plain:active{background-color:#cc0066;color:#ffcccc;text-decoration:none;border-color:#ffffff;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:2px 0px 2px 0px;cursor:hand;display:block;font-size:8pt;font-family:Arial, Helvetica, sans-serif;}");
document.write("\n-->\n");
document.write("</style>");

var fc=0xffcccc;
var bc=0xcc0066;
if(typeof(frames)=="undefined"){var frames=0;}

startMainMenu("evcalendar_top.gif",26,151,1,0,0)
mainMenuItem("evcalendar_b1",".gif",34,151,"javascript:;","_blank"," NSW",1,2,"evcalendar_plain");
mainMenuItem("evcalendar_b2",".gif",34,151,"javascript:;","","VIC ",1,2,"evcalendar_plain");
mainMenuItem("evcalendar_b3",".gif",34,151,"javascript:;","","QLD ",1,2,"evcalendar_plain");
mainMenuItem("evcalendar_b4",".gif",34,151,"javascript:;","","SA",1,2,"evcalendar_plain");
mainMenuItem("evcalendar_b5",".gif",34,151,"javascript:;","","WA",1,2,"evcalendar_plain");
mainMenuItem("evcalendar_b6",".gif",34,151,"javascript:;","","ACT",1,2,"evcalendar_plain");
mainMenuItem("evcalendar_b7",".gif",34,151,"javascript:;","","Other Cities",1,2,"evcalendar_plain");
endMainMenu("evcalendar_bottom.gif",26,151)

startSubmenu("evcalendar_b7","evcalendar_menu",47);
submenuItem("Hobart",loc+"../events_hobart.htm","","evcalendar_plain");
submenuItem("Darwin",loc+"../events_darwin.htm","","evcalendar_plain");
endSubmenu("evcalendar_b7");

startSubmenu("evcalendar_b6","evcalendar_menu",57);
submenuItem("Canberra",loc+"../event_calendar_canberra.htm","","evcalendar_plain");
endSubmenu("evcalendar_b6");

startSubmenu("evcalendar_b5","evcalendar_menu",37);
submenuItem("Perth",loc+"../event_calendar_perth.htm","","evcalendar_plain");
endSubmenu("evcalendar_b5");

startSubmenu("evcalendar_b4","evcalendar_menu",54);
submenuItem("Adelaide",loc+"../event_calendar_adelaide.htm","","evcalendar_plain");
endSubmenu("evcalendar_b4");

startSubmenu("evcalendar_b3","evcalendar_menu",65);
submenuItem("Brisbane",loc+"../event_calendar_brisbane.htm","","evcalendar_plain");
submenuItem("Gold Coast",loc+"../event_calendar_goldcoast.htm","","evcalendar_plain");
endSubmenu("evcalendar_b3");

startSubmenu("evcalendar_b2","evcalendar_menu",62);
submenuItem("Melbourne",loc+"../event_calendar_melbourne.htm","","evcalendar_plain");
submenuItem("Geelong",loc+"../event_calendar_geelong.htm","","evcalendar_plain");
endSubmenu("evcalendar_b2");

startSubmenu("evcalendar_b1","evcalendar_menu",77);
submenuItem("Sydney",loc+"../event_ calendar_sydney.htm","","evcalendar_plain");
submenuItem("Central Coast",loc+"../events_calendar_central_coast.htm","","evcalendar_plain");
submenuItem("Newcastle ",loc+"../event_calendar_newcastle.htm","","evcalendar_plain");
submenuItem("Wollongong",loc+"../event_calendar_wollongong.htm","","evcalendar_plain");
endSubmenu("evcalendar_b1");

loc="";
