//©Xara Ltd
if(typeof(loc)=="undefined"||loc==""){var loc="";if(document.body&&document.body.innerHTML){var tt=document.body.innerHTML;var ml=tt.match(/["']([^'"]*)index_menutop.js["']/i);if(ml && ml.length > 1) loc=ml[1];}}

var bd=0
document.write("<style type=\"text/css\">");
document.write("\n<!--\n");
var tr="filter:alpha(opacity=99);-moz-opacity:0.99;";if(IE5) tr="";
document.write(".index_menutop_menu {"+tr+"z-index:999;border-color:#000000;border-style:solid;border-width:"+bd+"px 0px "+bd+"px 0px;background-color:#cc0066;position:absolute;left:0px;top:0px;visibility:hidden;}");
document.write(".index_menutop_plain, a.index_menutop_plain:link, a.index_menutop_plain:visited{text-align:left;background-color:#cc0066;color:#ffffff;text-decoration:none;border-color:#000000;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:1px 0px 1px 0px;cursor:hand;display:block;font-size:8pt;font-family:Verdana, Arial, Helvetica, sans-serif;}");
document.write("a.index_menutop_plain:hover, a.index_menutop_plain:active{background-color:#ff99cc;color:#cc0066;text-decoration:none;border-color:#000000;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:1px 0px 1px 0px;cursor:hand;display:block;font-size:8pt;font-family:Verdana, Arial, Helvetica, sans-serif;}");
document.write("a.index_menutop_l:link, a.index_menutop_l:visited{text-align:left;background:#cc0066 url("+loc+"index_menutop_l.gif) no-repeat right;color:#ffffff;text-decoration:none;border-color:#000000;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:1px 0px 1px 0px;cursor:hand;display:block;font-size:8pt;font-family:Verdana, Arial, Helvetica, sans-serif;}");
document.write("a.index_menutop_l:hover, a.index_menutop_l:active{background:#ff99cc url("+loc+"index_menutop_l2.gif) no-repeat right;color: #cc0066;text-decoration:none;border-color:#000000;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:1px 0px 1px 0px;cursor:hand;display:block;font-size:8pt;font-family:Verdana, Arial, Helvetica, sans-serif;}");
document.write("\n-->\n");
document.write("</style>");

var fc=0xcc0066;
var bc=0xff99cc;
if(typeof(frames)=="undefined"){var frames=3;if(frames>0)animate();}

startMainMenu("index_menutop_left.gif",33,27,2,0,0)
mainMenuItem("index_menutop_b1",".gif",33,65,loc+"../index.html","","Home     ",2,2,"index_menutop_plain");
mainMenuItem("index_menutop_b2",".gif",33,70,"javascript:;","","Cities     ",2,2,"index_menutop_plain");
mainMenuItem("index_menutop_b3",".gif",33,70,loc+"../quicklinks_sitemap.htm","","Services",2,2,"index_menutop_plain");
mainMenuItem("index_menutop_b4",".gif",33,51,loc+"../quicklinks_sitemap.htm","_blank","(A-K)  ",2,2,"index_menutop_plain");
mainMenuItem("index_menutop_b5",".gif",33,58,loc+"../quicklinks_sitemap.htm","","(L-Z)    ",2,2,"index_menutop_plain");
mainMenuItem("index_menutop_b6",".gif",33,141,loc+"../eventscalenderhome.html","","Events Calendar    ",2,2,"index_menutop_plain");
mainMenuItem("index_menutop_b7",".gif",33,155,loc+"../advertise.htm","","Advertise/Contact    ",2,2,"index_menutop_plain");
mainMenuItem("index_menutop_b8",".gif",33,98,loc+"../quicklinks_sitemap.htm",""," Tips & Links",2,2,"index_menutop_plain");
endMainMenu("index_menutop_right.gif",33,27)

startSubmenu("index_menutop_b8_1_1_6","index_menutop_menu",49);
submenuItem("Books",loc+"../dating_resources_books.htm","","index_menutop_plain");
submenuItem("Links",loc+"../dating_resources_websites.htm","","index_menutop_plain");
endSubmenu("index_menutop_b8_1_1_6");

startSubmenu("index_menutop_b8_1_1","index_menutop_menu",225);
submenuItem("Choosing the right dating method","javascript:;","","index_menutop_plain");
submenuItem("Going out on a date",loc+"../Going_out_on_a_date.htm","","index_menutop_plain");
submenuItem("What to take on a date",loc+"../What_to_take_on_a_date.htm","","index_menutop_plain");
submenuItem("Dating Safely",loc+"../date_safely.htm","","index_menutop_plain");
submenuItem("Date jokes",loc+"../date_jokes.htm","","index_menutop_plain");
mainMenuItem("index_menutop_b8_1_1_6","Dating Resources",0,0,"javascript:;","","",1,1,"index_menutop_l");
endSubmenu("index_menutop_b8_1_1");

startSubmenu("index_menutop_b8_1","index_menutop_menu",122);
mainMenuItem("index_menutop_b8_1_1","Dating",0,0,loc+"../Dating.htm","","",1,1,"index_menutop_l");
submenuItem("Flirting",loc+"../flirting.htm","","index_menutop_plain");
submenuItem("Romance","http://www.intelligentromance.com.au","","index_menutop_plain");
submenuItem("Body Language",loc+"../body_language.htm","","index_menutop_plain");
submenuItem("Spiritual Path",loc+"../spiritual_path.htm","","index_menutop_plain");
submenuItem("Love poems",loc+"../love_poems.htm","","index_menutop_plain");
endSubmenu("index_menutop_b8_1");

startSubmenu("index_menutop_b8","index_menutop_menu",153);
mainMenuItem("index_menutop_b8_1","Dating Advice",0,0,loc+"../tips_and_links.htm","","",1,1,"index_menutop_l");
submenuItem("Link Back Partners",loc+"../link_backs.htm","","index_menutop_plain");
submenuItem("Site Map/Quick Links",loc+"../quicklinks_sitemap.htm","","index_menutop_plain");
endSubmenu("index_menutop_b8");

startSubmenu("index_menutop_b7","index_menutop_menu",155);
submenuItem("Advertising details",loc+"../advertise.htm","","index_menutop_plain");
submenuItem("Contact details",loc+"../contact.htm","","index_menutop_plain");
submenuItem("Banner Farm",loc+"../banner_farm.htm","","index_menutop_plain");
submenuItem("About Us",loc+"../About Us.htm","","index_menutop_plain");
endSubmenu("index_menutop_b7");

startSubmenu("index_menutop_b6_8","index_menutop_menu",54);
submenuItem("Darwin","javascript:;","","index_menutop_plain");
endSubmenu("index_menutop_b6_8");

startSubmenu("index_menutop_b6_7","index_menutop_menu",68);
submenuItem("Canberra",loc+"../event_calendar_canberra.htm","","index_menutop_plain");
endSubmenu("index_menutop_b6_7");

startSubmenu("index_menutop_b6_6","index_menutop_menu",44);
submenuItem("Perth",loc+"../event_calendar_perth.htm","","index_menutop_plain");
endSubmenu("index_menutop_b6_6");

startSubmenu("index_menutop_b6_5","index_menutop_menu",52);
submenuItem("Hobart","javascript:;","","index_menutop_plain");
endSubmenu("index_menutop_b6_5");

startSubmenu("index_menutop_b6_4","index_menutop_menu",63);
submenuItem("Adelaide",loc+"../event_calendar_adelaide.htm","","index_menutop_plain");
endSubmenu("index_menutop_b6_4");

startSubmenu("index_menutop_b6_3","index_menutop_menu",77);
submenuItem("Brisbane",loc+"../event_calendar_brisbane.htm","","index_menutop_plain");
submenuItem("Gold Coast",loc+"../event_calendar_goldcoast.htm","","index_menutop_plain");
endSubmenu("index_menutop_b6_3");

startSubmenu("index_menutop_b6_2","index_menutop_menu",73);
submenuItem("Melbourne",loc+"../event_calendar_melbourne.htm","","index_menutop_plain");
submenuItem("Geelong",loc+"../event_calendar_geelong.htm","","index_menutop_plain");
endSubmenu("index_menutop_b6_2");

startSubmenu("index_menutop_b6_1","index_menutop_menu",93);
submenuItem("Sydney",loc+"../event_ calendar_sydney.htm","","index_menutop_plain");
submenuItem("Central Coast",loc+"../events_calendar_central_coast.htm","","index_menutop_plain");
submenuItem("Newcastle",loc+"../event_calendar_newcastle.htm","","index_menutop_plain");
submenuItem("Wollongong",loc+"../event_calendar_wollongong.htm","","index_menutop_plain");
endSubmenu("index_menutop_b6_1");

startSubmenu("index_menutop_b6","index_menutop_menu",141);
mainMenuItem("index_menutop_b6_1","NSW",0,0,"javascript:;","","",1,1,"index_menutop_l");
mainMenuItem("index_menutop_b6_2","VIC",0,0,"javascript:;","","",1,1,"index_menutop_l");
mainMenuItem("index_menutop_b6_3","QLD",0,0,"javascript:;","","",1,1,"index_menutop_l");
mainMenuItem("index_menutop_b6_4","SA",0,0,"javascript:;","","",1,1,"index_menutop_l");
mainMenuItem("index_menutop_b6_5","TAS",0,0,"javascript:;","","",1,1,"index_menutop_l");
mainMenuItem("index_menutop_b6_6","WA",0,0,"javascript:;","","",1,1,"index_menutop_l");
mainMenuItem("index_menutop_b6_7","ACT",0,0,"javascript:;","","",1,1,"index_menutop_l");
mainMenuItem("index_menutop_b6_8","NT",0,0,"javascript:;","","",1,1,"index_menutop_l");
endSubmenu("index_menutop_b6");

startSubmenu("index_menutop_b5_13","index_menutop_menu",87);
submenuItem("Sydney",loc+"../tours4singles.htm","","index_menutop_plain");
submenuItem("Melbourne",loc+"../tours4singles.htm","","index_menutop_plain");
submenuItem("Adelaide",loc+"../tours4singles.htm","","index_menutop_plain");
submenuItem("Perth",loc+"../tours4singles.htm","","index_menutop_plain");
submenuItem("International",loc+"../tours4singles.htm","","index_menutop_plain");
endSubmenu("index_menutop_b5_13");

startSubmenu("index_menutop_b5_9_8","index_menutop_menu",68);
submenuItem("Canberra","javascript:;","","index_menutop_plain");
endSubmenu("index_menutop_b5_9_8");

startSubmenu("index_menutop_b5_9_7","index_menutop_menu",52);
submenuItem("Hobart",loc+"../social_clubs_hobart.htm","","index_menutop_plain");
endSubmenu("index_menutop_b5_9_7");

startSubmenu("index_menutop_b5_9_6","index_menutop_menu",54);
submenuItem("Darwin",loc+"../social_clubs_darwin.htm","","index_menutop_plain");
endSubmenu("index_menutop_b5_9_6");

startSubmenu("index_menutop_b5_9_5","index_menutop_menu",63);
submenuItem("Adelaide",loc+"../social_clubs_adel.htm","","index_menutop_plain");
endSubmenu("index_menutop_b5_9_5");

startSubmenu("index_menutop_b5_9_4","index_menutop_menu",44);
submenuItem("Perth",loc+"../social_clubs_perth.htm","","index_menutop_plain");
endSubmenu("index_menutop_b5_9_4");

startSubmenu("index_menutop_b5_9_3","index_menutop_menu",77);
submenuItem("Brisbane",loc+"../social_clubs_bris.htm","","index_menutop_plain");
submenuItem("Gold Coast",loc+"../social_clubs_goldcoast.htm","","index_menutop_plain");
endSubmenu("index_menutop_b5_9_3");

startSubmenu("index_menutop_b5_9_2","index_menutop_menu",73);
submenuItem("Melbourne",loc+"../social_clubs_melb.htm","","index_menutop_plain");
submenuItem("Geelong",loc+"../social_clubs_geelong.htm","","index_menutop_plain");
endSubmenu("index_menutop_b5_9_2");

startSubmenu("index_menutop_b5_9_1","index_menutop_menu",93);
submenuItem("Sydney",loc+"../social_clubs_syd.htm","","index_menutop_plain");
submenuItem("Central Coast",loc+"../social_clubs_centralcoast.htm","","index_menutop_plain");
submenuItem("Newcastle",loc+"../social_clubs_newcastle.htm","","index_menutop_plain");
endSubmenu("index_menutop_b5_9_1");

startSubmenu("index_menutop_b5_9","index_menutop_menu",61);
mainMenuItem("index_menutop_b5_9_1","NSW",0,0,"javascript:;","","",1,1,"index_menutop_l");
mainMenuItem("index_menutop_b5_9_2","VIC",0,0,"javascript:;","","",1,1,"index_menutop_l");
mainMenuItem("index_menutop_b5_9_3","QLD",0,0,"javascript:;","","",1,1,"index_menutop_l");
mainMenuItem("index_menutop_b5_9_4","WA",0,0,"javascript:;","","",1,1,"index_menutop_l");
mainMenuItem("index_menutop_b5_9_5","SA",0,0,"javascript:;","","",1,1,"index_menutop_l");
mainMenuItem("index_menutop_b5_9_6","NT",0,0,"javascript:;","","",1,1,"index_menutop_l");
mainMenuItem("index_menutop_b5_9_7","TAS",0,0,"javascript:;","","",1,1,"index_menutop_l");
mainMenuItem("index_menutop_b5_9_8","ACT",0,0,loc+"../social_clubs_canberra.htm","","",1,1,"index_menutop_l");
endSubmenu("index_menutop_b5_9");

startSubmenu("index_menutop_b5_6","index_menutop_menu",87);
submenuItem("Australia",loc+"../online_dating.htm","","index_menutop_plain");
submenuItem("International",loc+"../online_dating_int.htm","","index_menutop_plain");
endSubmenu("index_menutop_b5_6");

startSubmenu("index_menutop_b5","index_menutop_menu",164);
submenuItem("Life Coaching",loc+"../life_coaches.htm","","index_menutop_plain");
submenuItem("Love Life Coaches",loc+"../love_life_coaches.htm","","index_menutop_plain");
submenuItem("Lotto4singles",loc+"../lotto4singles.htm","","index_menutop_plain");
submenuItem("Nightclubs",loc+"../nightclubs.htm","","index_menutop_plain");
submenuItem("Psychics4singles",loc+"../psychics4singles.htm","","index_menutop_plain");
mainMenuItem("index_menutop_b5_6","Online Dating",0,0,"javascript:;","","",1,1,"index_menutop_l");
submenuItem("Restaurants and Cafes",loc+"../restaurants_cafes.htm","","index_menutop_plain");
submenuItem("Retreats4singles",loc+"../retreats_for_singles.htm","","index_menutop_plain");
mainMenuItem("index_menutop_b5_9","Social Clubs",0,0,loc+"../social_clubs.htm","","",1,1,"index_menutop_l");
submenuItem("Sports and Adventure",loc+"../sport_adventure.htm","","index_menutop_plain");
submenuItem("Seminar4singles",loc+"../seminars.htm","","index_menutop_plain");
submenuItem("Speed Dating",loc+"../speed_dating.htm","","index_menutop_plain");
mainMenuItem("index_menutop_b5_13","Tours4singles",0,0,loc+"../tours4singles.htm","","",1,1,"index_menutop_l");
submenuItem("Wineries4singles",loc+"../wineries4singles.htm","","index_menutop_plain");
endSubmenu("index_menutop_b5");

startSubmenu("index_menutop_b4_9","index_menutop_menu",73);
submenuItem("Melbourne",loc+"../jazz_melbourne.htm","","index_menutop_plain");
endSubmenu("index_menutop_b4_9");

startSubmenu("index_menutop_b4_7_8","index_menutop_menu",52);
submenuItem("Hobart",loc+"../dinner_for_six_hobart.htm","","index_menutop_plain");
endSubmenu("index_menutop_b4_7_8");

startSubmenu("index_menutop_b4_7_7","index_menutop_menu",54);
submenuItem("Darwin",loc+"../dinner_parties_darwin.htm","","index_menutop_plain");
endSubmenu("index_menutop_b4_7_7");

startSubmenu("index_menutop_b4_7_6","index_menutop_menu",68);
submenuItem("Canberra",loc+"../dinner_parties_canberra.htm","","index_menutop_plain");
endSubmenu("index_menutop_b4_7_6");

startSubmenu("index_menutop_b4_7_5","index_menutop_menu",63);
submenuItem("Adelaide",loc+"../dinner_parties_adelaide.htm","","index_menutop_plain");
endSubmenu("index_menutop_b4_7_5");

startSubmenu("index_menutop_b4_7_4","index_menutop_menu",44);
submenuItem("Perth",loc+"../dinner_parties_perth.htm","","index_menutop_plain");
endSubmenu("index_menutop_b4_7_4");

startSubmenu("index_menutop_b4_7_3","index_menutop_menu",77);
submenuItem("Brisbane",loc+"../dinner_parties_brisbane.htm","","index_menutop_plain");
submenuItem("Gold Coast",loc+"../dinner_parties_brisbane.htm","","index_menutop_plain");
endSubmenu("index_menutop_b4_7_3");

startSubmenu("index_menutop_b4_7_2","index_menutop_menu",73);
submenuItem("Melbourne",loc+"../dinner_parties_melbourne.htm","","index_menutop_plain");
submenuItem("Geelong",loc+"../dinner_parties_geelong.htm","","index_menutop_plain");
endSubmenu("index_menutop_b4_7_2");

startSubmenu("index_menutop_b4_7_1","index_menutop_menu",93);
submenuItem("Sydney",loc+"../dinner_parties_sydney.htm","","index_menutop_plain");
submenuItem("Central Coast",loc+"../dinner_parties_centralcoast.htm","","index_menutop_plain");
submenuItem("Wollongong",loc+"../dinner_parties_wollongong.htm","","index_menutop_plain");
submenuItem("Newcastle",loc+"../dinner_parties_newcastle.htm","","index_menutop_plain");
endSubmenu("index_menutop_b4_7_1");

startSubmenu("index_menutop_b4_7","index_menutop_menu",61);
mainMenuItem("index_menutop_b4_7_1","NSW",0,0,"javascript:;","","",1,1,"index_menutop_l");
mainMenuItem("index_menutop_b4_7_2","VIC",0,0,"javascript:;","","",1,1,"index_menutop_l");
mainMenuItem("index_menutop_b4_7_3","QLD",0,0,"javascript:;","","",1,1,"index_menutop_l");
mainMenuItem("index_menutop_b4_7_4","WA",0,0,"javascript:;","","",1,1,"index_menutop_l");
mainMenuItem("index_menutop_b4_7_5","SA",0,0,"javascript:;","","",1,1,"index_menutop_l");
mainMenuItem("index_menutop_b4_7_6","ACT",0,0,"javascript:;","","",1,1,"index_menutop_l");
mainMenuItem("index_menutop_b4_7_7","NT",0,0,"javascript:;","","",1,1,"index_menutop_l");
mainMenuItem("index_menutop_b4_7_8","TAS",0,0,"javascript:;","","",1,1,"index_menutop_l");
endSubmenu("index_menutop_b4_7");

startSubmenu("index_menutop_b4","index_menutop_menu",172);
submenuItem("Beauty4singles",loc+"../beauty_for_singles.htm","","index_menutop_plain");
submenuItem("Cruises4singles",loc+"../cruises4singles.htm","","index_menutop_plain");
submenuItem("Dance Classes",loc+"../dance_classes.htm","","index_menutop_plain");
submenuItem("Dance Teachers",loc+"../dance_teachers.htm","","index_menutop_plain");
submenuItem("Dinner4six",loc+"../dinner_for_six.htm","","index_menutop_plain");
submenuItem("Dance Party Clubs",loc+"../dance_party_clubs.htm","","index_menutop_plain");
mainMenuItem("index_menutop_b4_7","Dinner Parties",0,0,loc+"../dinner_parties.htm","","",1,1,"index_menutop_l");
submenuItem("Fitness4singles",loc+"../fitness4singles.htm","","index_menutop_plain");
mainMenuItem("index_menutop_b4_9","Jazz4singles",0,0,loc+"../jazz4singles.htm","","",1,1,"index_menutop_l");
submenuItem("Health4singles",loc+"../singles_health.htm","","index_menutop_plain");
submenuItem("House Parties",loc+"../houseparties.htm","","index_menutop_plain");
submenuItem("Home Business",loc+"../home_business.htm","","index_menutop_plain");
submenuItem("Image and Photography",loc+"../image_and_photography.htm","","index_menutop_plain");
submenuItem("Introduction Agencies",loc+"../intro_agencies.htm","","index_menutop_plain");
endSubmenu("index_menutop_b4");

startSubmenu("index_menutop_b2_14","index_menutop_menu",53);
submenuItem("Page 1",loc+"../events_sydney.htm","","index_menutop_plain");
submenuItem("Page 2",loc+"../events_sydney2.htm","","index_menutop_plain");
endSubmenu("index_menutop_b2_14");

startSubmenu("index_menutop_b2","index_menutop_menu",123);
submenuItem("Adelaide",loc+"../events_adelaide.htm","","index_menutop_plain");
submenuItem("Brisbane",loc+"../events_brisbane.htm","","index_menutop_plain");
submenuItem("Canberra",loc+"../events_canberra.htm","","index_menutop_plain");
submenuItem("Cairns",loc+"../events_cairns.htm","","index_menutop_plain");
submenuItem("Central Coast",loc+"../events_central_coast.htm","","index_menutop_plain");
submenuItem("Darwin",loc+"../events_darwin.htm","","index_menutop_plain");
submenuItem("Geelong",loc+"../events_geelong.htm","","index_menutop_plain");
submenuItem("Gold Coast",loc+"../events_gold_coast.htm","","index_menutop_plain");
submenuItem("Hobart",loc+"../events_hobart.htm","","index_menutop_plain");
submenuItem("Melbourne",loc+"../events_melbourne.htm","","index_menutop_plain");
submenuItem("Newcastle",loc+"../events_newcastle.htm","","index_menutop_plain");
submenuItem("Perth",loc+"../events_perth.htm","","index_menutop_plain");
submenuItem("Sunshine Coast",loc+"../events_sunshine_coast.htm","","index_menutop_plain");
mainMenuItem("index_menutop_b2_14","Sydney",0,0,"javascript:;","","",1,1,"index_menutop_l");
submenuItem("Wollongong",loc+"../events_wollongong.htm","","index_menutop_plain");
endSubmenu("index_menutop_b2");

loc="";
