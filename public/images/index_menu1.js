//©Xara Ltd
if(typeof(loc)=="undefined"||loc==""){var loc="";if(document.body&&document.body.innerHTML){var tt=document.body.innerHTML;var ml=tt.match(/["']([^'"]*)index_menu1.js["']/i);if(ml && ml.length > 1) loc=ml[1];}}

var bd=0
document.write("<style type=\"text/css\">");
document.write("\n<!--\n");
var tr="filter:alpha(opacity=99);-moz-opacity:0.99;";if(IE5) tr="";
document.write(".index_menu1_menu {"+tr+"z-index:999;border-color:#000000;border-style:solid;border-width:"+bd+"px 0px "+bd+"px 0px;background-color:#cc0066;position:absolute;left:0px;top:0px;visibility:hidden;}");
document.write(".index_menu1_plain, a.index_menu1_plain:link, a.index_menu1_plain:visited{text-align:left;background-color:#cc0066;color:#ffffff;text-decoration:none;border-color:#000000;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:1px 0px 1px 0px;cursor:hand;display:block;font-size:8pt;font-family:Verdana, Arial, Helvetica, sans-serif;}");
document.write("a.index_menu1_plain:hover, a.index_menu1_plain:active{background-color:#ff99cc;color:#cc0066;text-decoration:none;border-color:#000000;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:1px 0px 1px 0px;cursor:hand;display:block;font-size:8pt;font-family:Verdana, Arial, Helvetica, sans-serif;}");
document.write("a.index_menu1_l:link, a.index_menu1_l:visited{text-align:left;background:#cc0066 url("+loc+"index_menu1_l.gif) no-repeat right;color:#ffffff;text-decoration:none;border-color:#000000;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:1px 0px 1px 0px;cursor:hand;display:block;font-size:8pt;font-family:Verdana, Arial, Helvetica, sans-serif;}");
document.write("a.index_menu1_l:hover, a.index_menu1_l:active{background:#ff99cc url("+loc+"index_menu1_l2.gif) no-repeat right;color: #cc0066;text-decoration:none;border-color:#000000;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:1px 0px 1px 0px;cursor:hand;display:block;font-size:8pt;font-family:Verdana, Arial, Helvetica, sans-serif;}");
document.write("\n-->\n");
document.write("</style>");

var fc=0xcc0066;
var bc=0xff99cc;
if(typeof(frames)=="undefined"){var frames=2;if(frames>0)animate();}

startMainMenu("index_menu1_left.gif",28,23,2,0,0)
mainMenuItem("index_menu1_b1",".gif",28,119,loc+"../index.html","","Home",2,2,"index_menu1_plain");
mainMenuItem("index_menu1_b2",".gif",28,119,"javascript:;","","Australian Cities",2,2,"index_menu1_plain");
mainMenuItem("index_menu1_b3",".gif",28,119,"javascript:;","_blank","Speciality Pages",2,2,"index_menu1_plain");
mainMenuItem("index_menu1_b4",".gif",28,119,loc+"../eventscalenderhome.html","","Events Calendar",2,2,"index_menu1_plain");
mainMenuItem("index_menu1_b5",".gif",28,119,loc+"../advertise.htm","","Advertise/Contact",2,2,"index_menu1_plain");
mainMenuItem("index_menu1_b6",".gif",28,119,loc+"../contact.htm","","Tips & Links",2,2,"index_menu1_plain");
endMainMenu("index_menu1_right.gif",28,23)

startSubmenu("index_menu1_b6_1_4","index_menu1_menu",49);
submenuItem("Books","javascript:;","","index_menu1_plain");
submenuItem("Links","javascript:;","","index_menu1_plain");
endSubmenu("index_menu1_b6_1_4");

startSubmenu("index_menu1_b6_1","index_menu1_menu",225);
submenuItem("Flirting Tips",loc+"../flirting.htm","","index_menu1_plain");
submenuItem("Dating Safely","javascript:;","","index_menu1_plain");
submenuItem("Choosing the right dating method","javascript:;","","index_menu1_plain");
mainMenuItem("index_menu1_b6_1_4","Dating Resources",0,0,"javascript:;","","",1,1,"index_menu1_l");
endSubmenu("index_menu1_b6_1");

startSubmenu("index_menu1_b6","index_menu1_menu",153);
mainMenuItem("index_menu1_b6_1","Dating Tips",0,0,"javascript:;","","",1,1,"index_menu1_l");
submenuItem("Link Back Partners",loc+"../link_backs.htm","","index_menu1_plain");
submenuItem("Site Map/Quick Links",loc+"../quicklinks_sitemap.htm","","index_menu1_plain");
endSubmenu("index_menu1_b6");

startSubmenu("index_menu1_b5","index_menu1_menu",119);
submenuItem("Advertising details",loc+"../advertise.htm","","index_menu1_plain");
submenuItem("Contact details",loc+"../contact.htm","","index_menu1_plain");
submenuItem("Banner Farm",loc+"../banner_farm.htm","","index_menu1_plain");
submenuItem("About Us",loc+"../About Us.htm","","index_menu1_plain");
endSubmenu("index_menu1_b5");

startSubmenu("index_menu1_b4_8","index_menu1_menu",54);
submenuItem("Darwin","javascript:;","","index_menu1_plain");
endSubmenu("index_menu1_b4_8");

startSubmenu("index_menu1_b4_7","index_menu1_menu",68);
submenuItem("Canberra",loc+"../canberraeventcal.htm","","index_menu1_plain");
endSubmenu("index_menu1_b4_7");

startSubmenu("index_menu1_b4_6","index_menu1_menu",44);
submenuItem("Perth",loc+"../pereventcal.htm","","index_menu1_plain");
endSubmenu("index_menu1_b4_6");

startSubmenu("index_menu1_b4_5","index_menu1_menu",52);
submenuItem("Hobart","javascript:;","","index_menu1_plain");
endSubmenu("index_menu1_b4_5");

startSubmenu("index_menu1_b4_4","index_menu1_menu",63);
submenuItem("Adelaide",loc+"../adeleventcal.htm","","index_menu1_plain");
endSubmenu("index_menu1_b4_4");

startSubmenu("index_menu1_b4_3","index_menu1_menu",77);
submenuItem("Brisbane",loc+"../briseventcal.htm","","index_menu1_plain");
submenuItem("Gold Coast",loc+"../goldcsteventcal.htm","","index_menu1_plain");
endSubmenu("index_menu1_b4_3");

startSubmenu("index_menu1_b4_2","index_menu1_menu",73);
submenuItem("Melbourne",loc+"../event_calendar_melb.htm","","index_menu1_plain");
submenuItem("Geelong",loc+"../event_calendar_geelong.htm","","index_menu1_plain");
endSubmenu("index_menu1_b4_2");

startSubmenu("index_menu1_b4_1","index_menu1_menu",93);
submenuItem("Sydney",loc+"../event_ calendar_sydney.htm","","index_menu1_plain");
submenuItem("Central Coast",loc+"../cencsteventcal.htm","","index_menu1_plain");
submenuItem("Newcastle",loc+"../event_calendar_newcastle.htm","","index_menu1_plain");
submenuItem("Wollongong",loc+"../event_calendar_wollongong.htm","","index_menu1_plain");
endSubmenu("index_menu1_b4_1");

startSubmenu("index_menu1_b4","index_menu1_menu",119);
mainMenuItem("index_menu1_b4_1","NSW",0,0,"javascript:;","","",1,1,"index_menu1_l");
mainMenuItem("index_menu1_b4_2","VIC",0,0,"javascript:;","","",1,1,"index_menu1_l");
mainMenuItem("index_menu1_b4_3","QLD",0,0,"javascript:;","","",1,1,"index_menu1_l");
mainMenuItem("index_menu1_b4_4","SA",0,0,"javascript:;","","",1,1,"index_menu1_l");
mainMenuItem("index_menu1_b4_5","TAS",0,0,"javascript:;","","",1,1,"index_menu1_l");
mainMenuItem("index_menu1_b4_6","WA",0,0,"javascript:;","","",1,1,"index_menu1_l");
mainMenuItem("index_menu1_b4_7","ACT",0,0,"javascript:;","","",1,1,"index_menu1_l");
mainMenuItem("index_menu1_b4_8","NT",0,0,"javascript:;","","",1,1,"index_menu1_l");
endSubmenu("index_menu1_b4");

startSubmenu("index_menu1_b3_27","index_menu1_menu",87);
submenuItem("Sydney",loc+"../tours4singles.htm","","index_menu1_plain");
submenuItem("Melbourne",loc+"../tours4singles.htm","","index_menu1_plain");
submenuItem("Adelaide",loc+"../tours4singles.htm","","index_menu1_plain");
submenuItem("Perth",loc+"../tours4singles.htm","","index_menu1_plain");
submenuItem("International",loc+"../tours4singles.htm","","index_menu1_plain");
endSubmenu("index_menu1_b3_27");

startSubmenu("index_menu1_b3_23_8","index_menu1_menu",68);
submenuItem("Canberra","javascript:;","","index_menu1_plain");
endSubmenu("index_menu1_b3_23_8");

startSubmenu("index_menu1_b3_23_7","index_menu1_menu",52);
submenuItem("Hobart",loc+"../social_clubs_hobart.htm","","index_menu1_plain");
endSubmenu("index_menu1_b3_23_7");

startSubmenu("index_menu1_b3_23_6","index_menu1_menu",54);
submenuItem("Darwin",loc+"../social_clubs_darwin.htm","","index_menu1_plain");
endSubmenu("index_menu1_b3_23_6");

startSubmenu("index_menu1_b3_23_5","index_menu1_menu",63);
submenuItem("Adelaide",loc+"../social_clubs_adel.htm","","index_menu1_plain");
endSubmenu("index_menu1_b3_23_5");

startSubmenu("index_menu1_b3_23_4","index_menu1_menu",44);
submenuItem("Perth",loc+"../social_clubs_perth.htm","","index_menu1_plain");
endSubmenu("index_menu1_b3_23_4");

startSubmenu("index_menu1_b3_23_3","index_menu1_menu",77);
submenuItem("Brisbane",loc+"../social_clubs_bris.htm","","index_menu1_plain");
submenuItem("Gold Coast",loc+"../social_clubs_goldcoast.htm","","index_menu1_plain");
endSubmenu("index_menu1_b3_23_3");

startSubmenu("index_menu1_b3_23_2","index_menu1_menu",73);
submenuItem("Melbourne",loc+"../social_clubs_melb.htm","","index_menu1_plain");
submenuItem("Geelong",loc+"../social_clubs_geelong.htm","","index_menu1_plain");
endSubmenu("index_menu1_b3_23_2");

startSubmenu("index_menu1_b3_23_1","index_menu1_menu",93);
submenuItem("Sydney",loc+"../social_clubs_syd.htm","","index_menu1_plain");
submenuItem("Central Coast",loc+"../social_clubs_centralcoast.htm","","index_menu1_plain");
submenuItem("Newcastle",loc+"../social_clubs_newcastle.htm","","index_menu1_plain");
endSubmenu("index_menu1_b3_23_1");

startSubmenu("index_menu1_b3_23","index_menu1_menu",61);
mainMenuItem("index_menu1_b3_23_1","NSW",0,0,"javascript:;","","",1,1,"index_menu1_l");
mainMenuItem("index_menu1_b3_23_2","VIC",0,0,"javascript:;","","",1,1,"index_menu1_l");
mainMenuItem("index_menu1_b3_23_3","QLD",0,0,"javascript:;","","",1,1,"index_menu1_l");
mainMenuItem("index_menu1_b3_23_4","WA",0,0,"javascript:;","","",1,1,"index_menu1_l");
mainMenuItem("index_menu1_b3_23_5","SA",0,0,"javascript:;","","",1,1,"index_menu1_l");
mainMenuItem("index_menu1_b3_23_6","NT",0,0,"javascript:;","","",1,1,"index_menu1_l");
mainMenuItem("index_menu1_b3_23_7","TAS",0,0,"javascript:;","","",1,1,"index_menu1_l");
mainMenuItem("index_menu1_b3_23_8","ACT",0,0,loc+"../social_clubs_canberra.htm","","",1,1,"index_menu1_l");
endSubmenu("index_menu1_b3_23");

startSubmenu("index_menu1_b3_19","index_menu1_menu",87);
submenuItem("Australia",loc+"../online_dating.htm","","index_menu1_plain");
submenuItem("International",loc+"../online_dating_int.htm","","index_menu1_plain");
endSubmenu("index_menu1_b3_19");

startSubmenu("index_menu1_b3_9","index_menu1_menu",73);
submenuItem("Melbourne",loc+"../jazz_melbourne.htm","","index_menu1_plain");
endSubmenu("index_menu1_b3_9");

startSubmenu("index_menu1_b3_7_8","index_menu1_menu",52);
submenuItem("Hobart",loc+"../dinner_for_six_hobart.htm","","index_menu1_plain");
endSubmenu("index_menu1_b3_7_8");

startSubmenu("index_menu1_b3_7_7","index_menu1_menu",54);
submenuItem("Darwin",loc+"../dinner_parties_darwin.htm","","index_menu1_plain");
endSubmenu("index_menu1_b3_7_7");

startSubmenu("index_menu1_b3_7_6","index_menu1_menu",68);
submenuItem("Canberra",loc+"../dinner_parties_canberra.htm","","index_menu1_plain");
endSubmenu("index_menu1_b3_7_6");

startSubmenu("index_menu1_b3_7_5","index_menu1_menu",63);
submenuItem("Adelaide",loc+"../dinner_parties_adelaide.htm","","index_menu1_plain");
endSubmenu("index_menu1_b3_7_5");

startSubmenu("index_menu1_b3_7_4","index_menu1_menu",44);
submenuItem("Perth",loc+"../dinner_parties_perth.htm","","index_menu1_plain");
endSubmenu("index_menu1_b3_7_4");

startSubmenu("index_menu1_b3_7_3","index_menu1_menu",77);
submenuItem("Brisbane",loc+"../dinner_parties_brisbane.htm","","index_menu1_plain");
submenuItem("Gold Coast",loc+"../dinner_parties_brisbane.htm","","index_menu1_plain");
endSubmenu("index_menu1_b3_7_3");

startSubmenu("index_menu1_b3_7_2","index_menu1_menu",73);
submenuItem("Melbourne",loc+"../dinner_parties_melbourne.htm","","index_menu1_plain");
submenuItem("Geelong",loc+"../dinner_parties_geelong.htm","","index_menu1_plain");
endSubmenu("index_menu1_b3_7_2");

startSubmenu("index_menu1_b3_7_1","index_menu1_menu",93);
submenuItem("Sydney",loc+"../dinner_parties_sydney.htm","","index_menu1_plain");
submenuItem("Central Coast",loc+"../dinner_parties_centralcoast.htm","","index_menu1_plain");
submenuItem("Wollongong",loc+"../dinner_parties_wollongong.htm","","index_menu1_plain");
submenuItem("Newcastle",loc+"../dinner_parties_newcastle.htm","","index_menu1_plain");
endSubmenu("index_menu1_b3_7_1");

startSubmenu("index_menu1_b3_7","index_menu1_menu",61);
mainMenuItem("index_menu1_b3_7_1","NSW",0,0,"javascript:;","","",1,1,"index_menu1_l");
mainMenuItem("index_menu1_b3_7_2","VIC",0,0,"javascript:;","","",1,1,"index_menu1_l");
mainMenuItem("index_menu1_b3_7_3","QLD",0,0,"javascript:;","","",1,1,"index_menu1_l");
mainMenuItem("index_menu1_b3_7_4","WA",0,0,"javascript:;","","",1,1,"index_menu1_l");
mainMenuItem("index_menu1_b3_7_5","SA",0,0,"javascript:;","","",1,1,"index_menu1_l");
mainMenuItem("index_menu1_b3_7_6","ACT",0,0,"javascript:;","","",1,1,"index_menu1_l");
mainMenuItem("index_menu1_b3_7_7","NT",0,0,"javascript:;","","",1,1,"index_menu1_l");
mainMenuItem("index_menu1_b3_7_8","TAS",0,0,"javascript:;","","",1,1,"index_menu1_l");
endSubmenu("index_menu1_b3_7");

startSubmenu("index_menu1_b3","index_menu1_menu",172);
submenuItem("Beauty4singles",loc+"../beauty_for_singles.htm","","index_menu1_plain");
submenuItem("Cruises4singles",loc+"../cruises4singles.htm","","index_menu1_plain");
submenuItem("Dance Classes",loc+"../dance_classes.htm","","index_menu1_plain");
submenuItem("Dance Teachers",loc+"../dance_teachers.htm","","index_menu1_plain");
submenuItem("Dinner4six",loc+"../dinner_for_six.htm","","index_menu1_plain");
submenuItem("Dance Party Clubs",loc+"../dance_party_clubs.htm","","index_menu1_plain");
mainMenuItem("index_menu1_b3_7","Dinner Parties",0,0,loc+"../dinner_parties.htm","","",1,1,"index_menu1_l");
submenuItem("Fitness4singles",loc+"../fitness4singles.htm","","index_menu1_plain");
mainMenuItem("index_menu1_b3_9","Jazz4singles",0,0,loc+"../jazz4singles.htm","","",1,1,"index_menu1_l");
submenuItem("Health4singles",loc+"../singles_health.htm","","index_menu1_plain");
submenuItem("House Parties",loc+"../houseparties.htm","","index_menu1_plain");
submenuItem("Home Business",loc+"../home_business.htm","","index_menu1_plain");
submenuItem("Image and Photography",loc+"../image_and_photography.htm","","index_menu1_plain");
submenuItem("Introduction Agencies",loc+"../intro_agencies.htm","","index_menu1_plain");
submenuItem("Life Coaching",loc+"../life_coaches.htm","","index_menu1_plain");
submenuItem("Love Life Coaches",loc+"../love_life_coaches.htm","","index_menu1_plain");
submenuItem("Lotto4singles",loc+"../lotto4singles.htm","","index_menu1_plain");
submenuItem("Nightclubs",loc+"../nightclubs.htm","","index_menu1_plain");
mainMenuItem("index_menu1_b3_19","Online Dating",0,0,"javascript:;","","",1,1,"index_menu1_l");
submenuItem("Psychics4singles",loc+"../psychics4singles.htm","","index_menu1_plain");
submenuItem("Restaurants and Cafes",loc+"../restaurants_cafes.htm","","index_menu1_plain");
submenuItem("Retreats4singles",loc+"../retreats_for_singles.htm","","index_menu1_plain");
mainMenuItem("index_menu1_b3_23","Social Clubs",0,0,loc+"../social_clubs.htm","","",1,1,"index_menu1_l");
submenuItem("Sports and Adventure",loc+"../sport_adventure.htm","","index_menu1_plain");
submenuItem("Seminar4singles",loc+"../seminars.htm","","index_menu1_plain");
submenuItem("Speed Dating",loc+"../speed_dating.htm","","index_menu1_plain");
mainMenuItem("index_menu1_b3_27","Tours4singles",0,0,loc+"../tours4singles.htm","","",1,1,"index_menu1_l");
submenuItem("Wineries4singles",loc+"../wineries4singles.htm","","index_menu1_plain");
endSubmenu("index_menu1_b3");

startSubmenu("index_menu1_b2_14","index_menu1_menu",53);
submenuItem("Page 1",loc+"../events_sydney.htm","","index_menu1_plain");
submenuItem("Page 2",loc+"../events_sydney2.htm","","index_menu1_plain");
endSubmenu("index_menu1_b2_14");

startSubmenu("index_menu1_b2","index_menu1_menu",123);
submenuItem("Adelaide",loc+"../events_adelaide.htm","","index_menu1_plain");
submenuItem("Brisbane",loc+"../events_brisbane.htm","","index_menu1_plain");
submenuItem("Canberra",loc+"../events_canberra.htm","","index_menu1_plain");
submenuItem("Cairns",loc+"../events_cairns.htm","","index_menu1_plain");
submenuItem("Central Coast",loc+"../events_central_coast.htm","","index_menu1_plain");
submenuItem("Darwin",loc+"../events_darwin.htm","","index_menu1_plain");
submenuItem("Geelong",loc+"../events_geelong.htm","","index_menu1_plain");
submenuItem("Gold Coast",loc+"../events_gold_coast.htm","","index_menu1_plain");
submenuItem("Hobart",loc+"../events_hobart.htm","","index_menu1_plain");
submenuItem("Melbourne",loc+"../events_melbourne.htm","","index_menu1_plain");
submenuItem("Newcastle",loc+"../events_newcastle.htm","","index_menu1_plain");
submenuItem("Perth",loc+"../events_perth.htm","","index_menu1_plain");
submenuItem("Sunshine Coast",loc+"../events_sunshine_coast.htm","","index_menu1_plain");
mainMenuItem("index_menu1_b2_14","Sydney",0,0,"javascript:;","","",1,1,"index_menu1_l");
submenuItem("Wollongong",loc+"../events_wollongong.htm","","index_menu1_plain");
endSubmenu("index_menu1_b2");

loc="";
