//©Xara Ltd
if(typeof(loc)=="undefined"||loc==""){var loc="";if(document.body&&document.body.innerHTML){var tt=document.body.innerHTML;var ml=tt.match(/["']([^'"]*)indexmenu_top.js["']/i);if(ml && ml.length > 1) loc=ml[1];}}

var bd=0
document.write("<style type=\"text/css\">");
document.write("\n<!--\n");
var tr="filter:alpha(opacity=99);-moz-opacity:0.99;";if(IE5) tr="";
document.write(".indexmenu_top_menu {"+tr+"z-index:999;border-color:#000000;border-style:solid;border-width:"+bd+"px 0px "+bd+"px 0px;background-color:#cc0066;position:absolute;left:0px;top:0px;visibility:hidden;}");
document.write(".indexmenu_top_plain, a.indexmenu_top_plain:link, a.indexmenu_top_plain:visited{text-align:left;background-color:#cc0066;color:#ffffff;text-decoration:none;border-color:#000000;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:1px 0px 1px 0px;cursor:hand;display:block;font-size:8pt;font-family:Verdana, Arial, Helvetica, sans-serif;}");
document.write("a.indexmenu_top_plain:hover, a.indexmenu_top_plain:active{background-color:#ff99cc;color:#cc0066;text-decoration:none;border-color:#000000;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:1px 0px 1px 0px;cursor:hand;display:block;font-size:8pt;font-family:Verdana, Arial, Helvetica, sans-serif;}");
document.write("a.indexmenu_top_l:link, a.indexmenu_top_l:visited{text-align:left;background:#cc0066 url("+loc+"indexmenu_top_l.gif) no-repeat right;color:#ffffff;text-decoration:none;border-color:#000000;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:1px 0px 1px 0px;cursor:hand;display:block;font-size:8pt;font-family:Verdana, Arial, Helvetica, sans-serif;}");
document.write("a.indexmenu_top_l:hover, a.indexmenu_top_l:active{background:#ff99cc url("+loc+"indexmenu_top_l2.gif) no-repeat right;color: #cc0066;text-decoration:none;border-color:#000000;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:1px 0px 1px 0px;cursor:hand;display:block;font-size:8pt;font-family:Verdana, Arial, Helvetica, sans-serif;}");
document.write("\n-->\n");
document.write("</style>");

var fc=0xcc0066;
var bc=0xff99cc;
if(typeof(frames)=="undefined"){var frames=3;if(frames>0)animate();}

startMainMenu("indexmenu_top_left.gif",28,23,2,0,0)
mainMenuItem("indexmenu_top_b1",".gif",28,119,loc+"../index.html","","Home",2,2,"indexmenu_top_plain");
mainMenuItem("indexmenu_top_b2",".gif",28,119,"javascript:;","","Australian Cities",2,2,"indexmenu_top_plain");
mainMenuItem("indexmenu_top_b3",".gif",28,119,"javascript:;","_blank","Speciality Pages",2,2,"indexmenu_top_plain");
mainMenuItem("indexmenu_top_b4",".gif",28,119,loc+"../eventscalenderhome.html","","Events Calendar",2,2,"indexmenu_top_plain");
mainMenuItem("indexmenu_top_b5",".gif",28,119,loc+"../advertise.htm","","Advertise/Contact",2,2,"indexmenu_top_plain");
mainMenuItem("indexmenu_top_b6",".gif",28,119,"javascript:;","","Tips & Links",2,2,"indexmenu_top_plain");
endMainMenu("indexmenu_top_right.gif",28,23)

startSubmenu("indexmenu_top_b6_1_1_6","indexmenu_top_menu",49);
submenuItem("Books","javascript:;","","indexmenu_top_plain");
submenuItem("Links","javascript:;","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b6_1_1_6");

startSubmenu("indexmenu_top_b6_1_1","indexmenu_top_menu",225);
submenuItem("Choosing the right dating method","javascript:;","","indexmenu_top_plain");
submenuItem("Going out on a date",loc+"../Going_out_on_a_date.htm","","indexmenu_top_plain");
submenuItem("What to take on a date",loc+"../What_to_take_on_a_date.htm","","indexmenu_top_plain");
submenuItem("Dating Safely","javascript:;","","indexmenu_top_plain");
submenuItem("Date jokes",loc+"../date_jokes.htm","","indexmenu_top_plain");
mainMenuItem("indexmenu_top_b6_1_1_6","Dating Resources",0,0,"javascript:;","","",1,1,"indexmenu_top_l");
endSubmenu("indexmenu_top_b6_1_1");

startSubmenu("indexmenu_top_b6_1","indexmenu_top_menu",122);
mainMenuItem("indexmenu_top_b6_1_1","Dating",0,0,loc+"../Dating.htm","","",1,1,"indexmenu_top_l");
submenuItem("Flirting",loc+"../flirting.htm","","indexmenu_top_plain");
submenuItem("Romance","http://www.intelligentromance.com.au","","indexmenu_top_plain");
submenuItem("Body Language",loc+"../body_language.htm","","indexmenu_top_plain");
submenuItem("Spiritual Path",loc+"../spiritual_path.htm","","indexmenu_top_plain");
submenuItem("Love poems",loc+"../love_poems.htm","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b6_1");

startSubmenu("indexmenu_top_b6","indexmenu_top_menu",153);
mainMenuItem("indexmenu_top_b6_1","Dating Advice",0,0,"javascript:;","","",1,1,"indexmenu_top_l");
submenuItem("Link Back Partners",loc+"../link_backs.htm","","indexmenu_top_plain");
submenuItem("Site Map/Quick Links",loc+"../quicklinks_sitemap.htm","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b6");

startSubmenu("indexmenu_top_b5","indexmenu_top_menu",119);
submenuItem("Advertising details",loc+"../advertise.htm","","indexmenu_top_plain");
submenuItem("Contact details",loc+"../contact.htm","","indexmenu_top_plain");
submenuItem("Banner Farm",loc+"../banner_farm.htm","","indexmenu_top_plain");
submenuItem("About Us",loc+"../About Us.htm","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b5");

startSubmenu("indexmenu_top_b4_8","indexmenu_top_menu",54);
submenuItem("Darwin","javascript:;","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b4_8");

startSubmenu("indexmenu_top_b4_7","indexmenu_top_menu",68);
submenuItem("Canberra",loc+"../canberraeventcal.htm","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b4_7");

startSubmenu("indexmenu_top_b4_6","indexmenu_top_menu",44);
submenuItem("Perth",loc+"../pereventcal.htm","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b4_6");

startSubmenu("indexmenu_top_b4_5","indexmenu_top_menu",52);
submenuItem("Hobart","javascript:;","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b4_5");

startSubmenu("indexmenu_top_b4_4","indexmenu_top_menu",63);
submenuItem("Adelaide",loc+"../adeleventcal.htm","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b4_4");

startSubmenu("indexmenu_top_b4_3","indexmenu_top_menu",77);
submenuItem("Brisbane",loc+"../event_calendar_brisbane.htm","","indexmenu_top_plain");
submenuItem("Gold Coast",loc+"../goldcsteventcal.htm","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b4_3");

startSubmenu("indexmenu_top_b4_2","indexmenu_top_menu",73);
submenuItem("Melbourne",loc+"../event_calendar_melbourne.htm","","indexmenu_top_plain");
submenuItem("Geelong",loc+"../event_calendar_geelong.htm","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b4_2");

startSubmenu("indexmenu_top_b4_1","indexmenu_top_menu",93);
submenuItem("Sydney",loc+"../event_ calendar_sydney.htm","","indexmenu_top_plain");
submenuItem("Central Coast",loc+"../events_calendar_central_coast.htm","","indexmenu_top_plain");
submenuItem("Newcastle",loc+"../event_calendar_newcastle.htm","","indexmenu_top_plain");
submenuItem("Wollongong",loc+"../event_calendar_wollongong.htm","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b4_1");

startSubmenu("indexmenu_top_b4","indexmenu_top_menu",119);
mainMenuItem("indexmenu_top_b4_1","NSW",0,0,"javascript:;","","",1,1,"indexmenu_top_l");
mainMenuItem("indexmenu_top_b4_2","VIC",0,0,"javascript:;","","",1,1,"indexmenu_top_l");
mainMenuItem("indexmenu_top_b4_3","QLD",0,0,"javascript:;","","",1,1,"indexmenu_top_l");
mainMenuItem("indexmenu_top_b4_4","SA",0,0,"javascript:;","","",1,1,"indexmenu_top_l");
mainMenuItem("indexmenu_top_b4_5","TAS",0,0,"javascript:;","","",1,1,"indexmenu_top_l");
mainMenuItem("indexmenu_top_b4_6","WA",0,0,"javascript:;","","",1,1,"indexmenu_top_l");
mainMenuItem("indexmenu_top_b4_7","ACT",0,0,"javascript:;","","",1,1,"indexmenu_top_l");
mainMenuItem("indexmenu_top_b4_8","NT",0,0,"javascript:;","","",1,1,"indexmenu_top_l");
endSubmenu("indexmenu_top_b4");

startSubmenu("indexmenu_top_b3_27","indexmenu_top_menu",87);
submenuItem("Sydney",loc+"../tours4singles.htm","","indexmenu_top_plain");
submenuItem("Melbourne",loc+"../tours4singles.htm","","indexmenu_top_plain");
submenuItem("Adelaide",loc+"../tours4singles.htm","","indexmenu_top_plain");
submenuItem("Perth",loc+"../tours4singles.htm","","indexmenu_top_plain");
submenuItem("International",loc+"../tours4singles.htm","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b3_27");

startSubmenu("indexmenu_top_b3_23_8","indexmenu_top_menu",68);
submenuItem("Canberra","javascript:;","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b3_23_8");

startSubmenu("indexmenu_top_b3_23_7","indexmenu_top_menu",52);
submenuItem("Hobart",loc+"../social_clubs_hobart.htm","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b3_23_7");

startSubmenu("indexmenu_top_b3_23_6","indexmenu_top_menu",54);
submenuItem("Darwin",loc+"../social_clubs_darwin.htm","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b3_23_6");

startSubmenu("indexmenu_top_b3_23_5","indexmenu_top_menu",63);
submenuItem("Adelaide",loc+"../social_clubs_adel.htm","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b3_23_5");

startSubmenu("indexmenu_top_b3_23_4","indexmenu_top_menu",44);
submenuItem("Perth",loc+"../social_clubs_perth.htm","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b3_23_4");

startSubmenu("indexmenu_top_b3_23_3","indexmenu_top_menu",77);
submenuItem("Brisbane",loc+"../social_clubs_bris.htm","","indexmenu_top_plain");
submenuItem("Gold Coast",loc+"../social_clubs_goldcoast.htm","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b3_23_3");

startSubmenu("indexmenu_top_b3_23_2","indexmenu_top_menu",73);
submenuItem("Melbourne",loc+"../social_clubs_melb.htm","","indexmenu_top_plain");
submenuItem("Geelong",loc+"../social_clubs_geelong.htm","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b3_23_2");

startSubmenu("indexmenu_top_b3_23_1","indexmenu_top_menu",93);
submenuItem("Sydney",loc+"../social_clubs_syd.htm","","indexmenu_top_plain");
submenuItem("Central Coast",loc+"../social_clubs_centralcoast.htm","","indexmenu_top_plain");
submenuItem("Newcastle",loc+"../social_clubs_newcastle.htm","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b3_23_1");

startSubmenu("indexmenu_top_b3_23","indexmenu_top_menu",61);
mainMenuItem("indexmenu_top_b3_23_1","NSW",0,0,"javascript:;","","",1,1,"indexmenu_top_l");
mainMenuItem("indexmenu_top_b3_23_2","VIC",0,0,"javascript:;","","",1,1,"indexmenu_top_l");
mainMenuItem("indexmenu_top_b3_23_3","QLD",0,0,"javascript:;","","",1,1,"indexmenu_top_l");
mainMenuItem("indexmenu_top_b3_23_4","WA",0,0,"javascript:;","","",1,1,"indexmenu_top_l");
mainMenuItem("indexmenu_top_b3_23_5","SA",0,0,"javascript:;","","",1,1,"indexmenu_top_l");
mainMenuItem("indexmenu_top_b3_23_6","NT",0,0,"javascript:;","","",1,1,"indexmenu_top_l");
mainMenuItem("indexmenu_top_b3_23_7","TAS",0,0,"javascript:;","","",1,1,"indexmenu_top_l");
mainMenuItem("indexmenu_top_b3_23_8","ACT",0,0,loc+"../social_clubs_canberra.htm","","",1,1,"indexmenu_top_l");
endSubmenu("indexmenu_top_b3_23");

startSubmenu("indexmenu_top_b3_19","indexmenu_top_menu",87);
submenuItem("Australia",loc+"../online_dating.htm","","indexmenu_top_plain");
submenuItem("International",loc+"../online_dating_int.htm","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b3_19");

startSubmenu("indexmenu_top_b3_9","indexmenu_top_menu",73);
submenuItem("Melbourne",loc+"../jazz_melbourne.htm","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b3_9");

startSubmenu("indexmenu_top_b3_7_8","indexmenu_top_menu",52);
submenuItem("Hobart",loc+"../dinner_for_six_hobart.htm","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b3_7_8");

startSubmenu("indexmenu_top_b3_7_7","indexmenu_top_menu",54);
submenuItem("Darwin",loc+"../dinner_parties_darwin.htm","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b3_7_7");

startSubmenu("indexmenu_top_b3_7_6","indexmenu_top_menu",68);
submenuItem("Canberra",loc+"../dinner_parties_canberra.htm","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b3_7_6");

startSubmenu("indexmenu_top_b3_7_5","indexmenu_top_menu",63);
submenuItem("Adelaide",loc+"../dinner_parties_adelaide.htm","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b3_7_5");

startSubmenu("indexmenu_top_b3_7_4","indexmenu_top_menu",44);
submenuItem("Perth",loc+"../dinner_parties_perth.htm","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b3_7_4");

startSubmenu("indexmenu_top_b3_7_3","indexmenu_top_menu",77);
submenuItem("Brisbane",loc+"../dinner_parties_brisbane.htm","","indexmenu_top_plain");
submenuItem("Gold Coast",loc+"../dinner_parties_brisbane.htm","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b3_7_3");

startSubmenu("indexmenu_top_b3_7_2","indexmenu_top_menu",73);
submenuItem("Melbourne",loc+"../dinner_parties_melbourne.htm","","indexmenu_top_plain");
submenuItem("Geelong",loc+"../dinner_parties_geelong.htm","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b3_7_2");

startSubmenu("indexmenu_top_b3_7_1","indexmenu_top_menu",93);
submenuItem("Sydney",loc+"../dinner_parties_sydney.htm","","indexmenu_top_plain");
submenuItem("Central Coast",loc+"../dinner_parties_centralcoast.htm","","indexmenu_top_plain");
submenuItem("Wollongong",loc+"../dinner_parties_wollongong.htm","","indexmenu_top_plain");
submenuItem("Newcastle",loc+"../dinner_parties_newcastle.htm","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b3_7_1");

startSubmenu("indexmenu_top_b3_7","indexmenu_top_menu",61);
mainMenuItem("indexmenu_top_b3_7_1","NSW",0,0,"javascript:;","","",1,1,"indexmenu_top_l");
mainMenuItem("indexmenu_top_b3_7_2","VIC",0,0,"javascript:;","","",1,1,"indexmenu_top_l");
mainMenuItem("indexmenu_top_b3_7_3","QLD",0,0,"javascript:;","","",1,1,"indexmenu_top_l");
mainMenuItem("indexmenu_top_b3_7_4","WA",0,0,"javascript:;","","",1,1,"indexmenu_top_l");
mainMenuItem("indexmenu_top_b3_7_5","SA",0,0,"javascript:;","","",1,1,"indexmenu_top_l");
mainMenuItem("indexmenu_top_b3_7_6","ACT",0,0,"javascript:;","","",1,1,"indexmenu_top_l");
mainMenuItem("indexmenu_top_b3_7_7","NT",0,0,"javascript:;","","",1,1,"indexmenu_top_l");
mainMenuItem("indexmenu_top_b3_7_8","TAS",0,0,"javascript:;","","",1,1,"indexmenu_top_l");
endSubmenu("indexmenu_top_b3_7");

startSubmenu("indexmenu_top_b3","indexmenu_top_menu",172);
submenuItem("Beauty4singles",loc+"../beauty_for_singles.htm","","indexmenu_top_plain");
submenuItem("Cruises4singles",loc+"../cruises4singles.htm","","indexmenu_top_plain");
submenuItem("Dance Classes",loc+"../dance_classes.htm","","indexmenu_top_plain");
submenuItem("Dance Teachers",loc+"../dance_teachers.htm","","indexmenu_top_plain");
submenuItem("Dinner4six",loc+"../dinner_for_six.htm","","indexmenu_top_plain");
submenuItem("Dance Party Clubs",loc+"../dance_party_clubs.htm","","indexmenu_top_plain");
mainMenuItem("indexmenu_top_b3_7","Dinner Parties",0,0,loc+"../dinner_parties.htm","","",1,1,"indexmenu_top_l");
submenuItem("Fitness4singles",loc+"../fitness4singles.htm","","indexmenu_top_plain");
mainMenuItem("indexmenu_top_b3_9","Jazz4singles",0,0,loc+"../jazz4singles.htm","","",1,1,"indexmenu_top_l");
submenuItem("Health4singles",loc+"../singles_health.htm","","indexmenu_top_plain");
submenuItem("House Parties",loc+"../houseparties.htm","","indexmenu_top_plain");
submenuItem("Home Business",loc+"../home_business.htm","","indexmenu_top_plain");
submenuItem("Image and Photography",loc+"../image_and_photography.htm","","indexmenu_top_plain");
submenuItem("Introduction Agencies",loc+"../intro_agencies.htm","","indexmenu_top_plain");
submenuItem("Life Coaching",loc+"../life_coaches.htm","","indexmenu_top_plain");
submenuItem("Love Life Coaches",loc+"../love_life_coaches.htm","","indexmenu_top_plain");
submenuItem("Lotto4singles",loc+"../lotto4singles.htm","","indexmenu_top_plain");
submenuItem("Nightclubs",loc+"../nightclubs.htm","","indexmenu_top_plain");
mainMenuItem("indexmenu_top_b3_19","Online Dating",0,0,"javascript:;","","",1,1,"indexmenu_top_l");
submenuItem("Psychics4singles",loc+"../psychics4singles.htm","","indexmenu_top_plain");
submenuItem("Restaurants and Cafes",loc+"../restaurants_cafes.htm","","indexmenu_top_plain");
submenuItem("Retreats4singles",loc+"../retreats_for_singles.htm","","indexmenu_top_plain");
mainMenuItem("indexmenu_top_b3_23","Social Clubs",0,0,loc+"../social_clubs.htm","","",1,1,"indexmenu_top_l");
submenuItem("Sports and Adventure",loc+"../sport_adventure.htm","","indexmenu_top_plain");
submenuItem("Seminar4singles",loc+"../seminars.htm","","indexmenu_top_plain");
submenuItem("Speed Dating",loc+"../speed_dating.htm","","indexmenu_top_plain");
mainMenuItem("indexmenu_top_b3_27","Tours4singles",0,0,loc+"../tours4singles.htm","","",1,1,"indexmenu_top_l");
submenuItem("Wineries4singles",loc+"../wineries4singles.htm","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b3");

startSubmenu("indexmenu_top_b2_14","indexmenu_top_menu",53);
submenuItem("Page 1",loc+"../events_sydney.htm","","indexmenu_top_plain");
submenuItem("Page 2",loc+"../events_sydney2.htm","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b2_14");

startSubmenu("indexmenu_top_b2","indexmenu_top_menu",123);
submenuItem("Adelaide",loc+"../events_adelaide.htm","","indexmenu_top_plain");
submenuItem("Brisbane",loc+"../events_brisbane.htm","","indexmenu_top_plain");
submenuItem("Canberra",loc+"../events_canberra.htm","","indexmenu_top_plain");
submenuItem("Cairns",loc+"../events_cairns.htm","","indexmenu_top_plain");
submenuItem("Central Coast",loc+"../events_central_coast.htm","","indexmenu_top_plain");
submenuItem("Darwin",loc+"../events_darwin.htm","","indexmenu_top_plain");
submenuItem("Geelong",loc+"../events_geelong.htm","","indexmenu_top_plain");
submenuItem("Gold Coast",loc+"../events_gold_coast.htm","","indexmenu_top_plain");
submenuItem("Hobart",loc+"../events_hobart.htm","","indexmenu_top_plain");
submenuItem("Melbourne",loc+"../events_melbourne.htm","","indexmenu_top_plain");
submenuItem("Newcastle",loc+"../events_newcastle.htm","","indexmenu_top_plain");
submenuItem("Perth",loc+"../events_perth.htm","","indexmenu_top_plain");
submenuItem("Sunshine Coast",loc+"../events_sunshine_coast.htm","","indexmenu_top_plain");
mainMenuItem("indexmenu_top_b2_14","Sydney",0,0,"javascript:;","","",1,1,"indexmenu_top_l");
submenuItem("Wollongong",loc+"../events_wollongong.htm","","indexmenu_top_plain");
endSubmenu("indexmenu_top_b2");

loc="";
