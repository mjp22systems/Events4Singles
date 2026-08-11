//©Xara Ltd
if(typeof(loc)=="undefined"||loc==""){var loc="";if(document.body&&document.body.innerHTML){var tt=document.body.innerHTML;var ml=tt.match(/["']([^'"]*)index_topmenu.js["']/i);if(ml && ml.length > 1) loc=ml[1];}}

var bd=0
document.write("<style type=\"text/css\">");
document.write("\n<!--\n");
var tr="filter:alpha(opacity=99);-moz-opacity:0.99;";if(IE5) tr="";
document.write(".index_topmenu_menu {"+tr+"z-index:999;border-color:#000000;border-style:solid;border-width:"+bd+"px 0px "+bd+"px 0px;background-color:#cc0066;position:absolute;left:0px;top:0px;visibility:hidden;}");
document.write(".index_topmenu_plain, a.index_topmenu_plain:link, a.index_topmenu_plain:visited{text-align:left;background-color:#cc0066;color:#ffffff;text-decoration:none;border-color:#000000;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:1px 0px 1px 0px;cursor:hand;display:block;font-size:8pt;font-family:Verdana, Arial, Helvetica, sans-serif;}");
document.write("a.index_topmenu_plain:hover, a.index_topmenu_plain:active{background-color:#ff99cc;color:#336666;text-decoration:none;border-color:#000000;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:1px 0px 1px 0px;cursor:hand;display:block;font-size:8pt;font-family:Verdana, Arial, Helvetica, sans-serif;}");
document.write("a.index_topmenu_l:link, a.index_topmenu_l:visited{text-align:left;background:#cc0066 url("+loc+"index_topmenu_l.gif) no-repeat right;color:#ffffff;text-decoration:none;border-color:#000000;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:1px 0px 1px 0px;cursor:hand;display:block;font-size:8pt;font-family:Verdana, Arial, Helvetica, sans-serif;}");
document.write("a.index_topmenu_l:hover, a.index_topmenu_l:active{background:#ff99cc url("+loc+"index_topmenu_l2.gif) no-repeat right;color: #336666;text-decoration:none;border-color:#000000;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:1px 0px 1px 0px;cursor:hand;display:block;font-size:8pt;font-family:Verdana, Arial, Helvetica, sans-serif;}");
document.write("\n-->\n");
document.write("</style>");

var fc=0x336666;
var bc=0xff99cc;
if(typeof(frames)=="undefined"){var frames=3;if(frames>0)animate();}

startMainMenu("index_topmenu_left.gif",29,23,2,0,0)
mainMenuItem("index_topmenu_b1",".gif",29,72,"http://www.events4singles.com/index.html","","HOME     ",2,2,"index_topmenu_plain");
mainMenuItem("index_topmenu_b2",".gif",29,66,"javascript:;","","CITIES     ",2,2,"index_topmenu_plain");
mainMenuItem("index_topmenu_b3",".gif",29,70,"http://www.events4singles.com/quicklinks_sitemap.htm","","SERVICES",2,2,"index_topmenu_plain");
mainMenuItem("index_topmenu_b4",".gif",29,49,"http://www.events4singles.com/quicklinks_sitemap.htm","_blank","(A-K)  ",2,2,"index_topmenu_plain");
mainMenuItem("index_topmenu_b5",".gif",29,52,"http://www.events4singles.com/quicklinks_sitemap.htm","","(L-Z)    ",2,2,"index_topmenu_plain");
mainMenuItem("index_topmenu_b6",".gif",29,149,"http://www.events4singles.com/eventscalenderhome.html","","EVENTS CALENDAR    ",2,2,"index_topmenu_plain");
mainMenuItem("index_topmenu_b7",".gif",29,166,"http://www.events4singles.com/advertise.htm","","ADVERTISE/CONTACT    ",2,2,"index_topmenu_plain");
mainMenuItem("index_topmenu_b8",".gif",29,90,"http://www.events4singles.com/tips_and_links/tips_and_links.htm",""," TIPS & LINKS",2,2,"index_topmenu_plain");
endMainMenu("index_topmenu_right.gif",29,23)

startSubmenu("index_topmenu_b8_2","index_topmenu_menu",49);
submenuItem("Books","http://www.events4singles.com/tips_and_links/dating_resources_books.htm","","index_topmenu_plain");
submenuItem("Links","http://www.events4singles.com/tips_and_links/dating_resources_websites.htm","","index_topmenu_plain");
endSubmenu("index_topmenu_b8_2");

startSubmenu("index_topmenu_b8_1","index_topmenu_menu",235);
submenuItem("Body Language","http://www.events4singles.com/tips_and_links/body_language.htm","","index_topmenu_plain");
submenuItem("Dating Guide","http://www.events4singles.com/tips_and_links/Dating.htm","","index_topmenu_plain");
submenuItem("Date jokes","http://www.events4singles.com/tips_and_links/date_jokes.htm","","index_topmenu_plain");
submenuItem("Dating Safely","http://www.events4singles.com/tips_and_links/date_safely.htm","","index_topmenu_plain");
submenuItem("Dating tips for men","http://www.events4singles.com/tips_and_links/dating_tips_men.htm","","index_topmenu_plain");
submenuItem("Dealing with insecurities","http://www.events4singles.com/tips_and_links/dealing_with_insecurities.htm","","index_topmenu_plain");
submenuItem("Developing confidence","http://www.events4singles.com/tips_and_links/developing_deep_confidence.htm","","index_topmenu_plain");
submenuItem("Going out on a date","http://www.events4singles.com/tips_and_links/Going_out_on_a_date.htm","","index_topmenu_plain");
submenuItem("Love poems","http://www.events4singles.com/tips_and_links/love_poems.htm","","index_topmenu_plain");
submenuItem("Power Words","http://www.events4singles.com/tips_and_links/power_words.htm","","index_topmenu_plain");
submenuItem("What to do on a first date","http://www.events4singles.com/tips_and_links/what_to_do_on_a_first_date.htm","","index_topmenu_plain");
submenuItem("What to take on a date","http://www.events4singles.com/tips_and_links/What_to_take_on_a_date.htm","","index_topmenu_plain");
submenuItem("Dating principles (image & confidence)","http://www.events4singles.com/tips_and_links/dating_principles.htm","","index_topmenu_plain");
endSubmenu("index_topmenu_b8_1");

startSubmenu("index_topmenu_b8","index_topmenu_menu",153);
mainMenuItem("index_topmenu_b8_1","Dating Advice",0,0,"http://www.events4singles.com/tips_and_links.htm","","",1,1,"index_topmenu_l");
mainMenuItem("index_topmenu_b8_2","Dating Resources",0,0,"javascript:;","","",1,1,"index_topmenu_l");
submenuItem("Flirting","http://www.events4singles.com/tips_and_links/flirting.htm","","index_topmenu_plain");
submenuItem("Romance","http://www.intelligentromance.com.au","","index_topmenu_plain");
submenuItem("Spiritual Path","http://www.events4singles.com/tips_and_links/spiritual_path.htm","","index_topmenu_plain");
submenuItem("Link Back Partners","http://www.events4singles.com/link_backs.htm","","index_topmenu_plain");
submenuItem("Reciprocal Links","http://www.events4singles.com/links/links.php","","index_topmenu_plain");
submenuItem("Site Map/Quick Links","http://www.events4singles.com/quicklinks_sitemap.htm","","index_topmenu_plain");
endSubmenu("index_topmenu_b8");

startSubmenu("index_topmenu_b7","index_topmenu_menu",166);
submenuItem("Advertising details","http://www.events4singles.com/advertise.htm","","index_topmenu_plain");
submenuItem("Contact details","http://www.events4singles.com/contact.htm","","index_topmenu_plain");
submenuItem("Banner Farm","http://www.events4singles.com/banner_farm.htm","","index_topmenu_plain");
submenuItem("About Us","http://www.events4singles.com/About Us.htm","","index_topmenu_plain");
endSubmenu("index_topmenu_b7");

startSubmenu("index_topmenu_b6_6","index_topmenu_menu",68);
submenuItem("Canberra","http://www.events4singles.com/event_calendar_canberra.htm","","index_topmenu_plain");
endSubmenu("index_topmenu_b6_6");

startSubmenu("index_topmenu_b6_5","index_topmenu_menu",44);
submenuItem("Perth","http://www.events4singles.com/event_calendar_perth.htm","","index_topmenu_plain");
endSubmenu("index_topmenu_b6_5");

startSubmenu("index_topmenu_b6_4","index_topmenu_menu",63);
submenuItem("Adelaide","http://www.events4singles.com/event_calendar_adelaide.htm","","index_topmenu_plain");
endSubmenu("index_topmenu_b6_4");

startSubmenu("index_topmenu_b6_3","index_topmenu_menu",77);
submenuItem("Brisbane","http://www.events4singles.com/event_calendar_brisbane.htm","","index_topmenu_plain");
submenuItem("Gold Coast","http://www.events4singles.com/event_calendar_goldcoast.htm","","index_topmenu_plain");
endSubmenu("index_topmenu_b6_3");

startSubmenu("index_topmenu_b6_2","index_topmenu_menu",97);
submenuItem("Melbourne","http://www.events4singles.com/event_calendar_melbourne.htm","","index_topmenu_plain");
submenuItem("Geelong","http://www.events4singles.com/event_calendar_geelong.htm","","index_topmenu_plain");
submenuItem("Country Areas","http://www.events4singles.com/event_calendar_country_vic.htm","","index_topmenu_plain");
endSubmenu("index_topmenu_b6_2");

startSubmenu("index_topmenu_b6_1","index_topmenu_menu",93);
submenuItem("Sydney","http://www.events4singles.com/event_ calendar_sydney.htm","","index_topmenu_plain");
submenuItem("Central Coast","http://www.events4singles.com/events_calendar_central_coast.htm","","index_topmenu_plain");
submenuItem("Newcastle","http://www.events4singles.com/event_calendar_newcastle.htm","","index_topmenu_plain");
submenuItem("Wollongong","http://www.events4singles.com/event_calendar_wollongong.htm","","index_topmenu_plain");
endSubmenu("index_topmenu_b6_1");

startSubmenu("index_topmenu_b6","index_topmenu_menu",149);
mainMenuItem("index_topmenu_b6_1","NSW",0,0,"javascript:;","","",1,1,"index_topmenu_l");
mainMenuItem("index_topmenu_b6_2","VIC",0,0,"javascript:;","","",1,1,"index_topmenu_l");
mainMenuItem("index_topmenu_b6_3","QLD",0,0,"javascript:;","","",1,1,"index_topmenu_l");
mainMenuItem("index_topmenu_b6_4","SA",0,0,"javascript:;","","",1,1,"index_topmenu_l");
mainMenuItem("index_topmenu_b6_5","WA",0,0,"javascript:;","","",1,1,"index_topmenu_l");
mainMenuItem("index_topmenu_b6_6","ACT",0,0,"javascript:;","","",1,1,"index_topmenu_l");
endSubmenu("index_topmenu_b6");

startSubmenu("index_topmenu_b5_6","index_topmenu_menu",87);
submenuItem("Australia",loc+"www.events4singles.comonline_dating.htm","","index_topmenu_plain");
submenuItem("International","http://www.events4singles.com/online_dating_int.htm","","index_topmenu_plain");
endSubmenu("index_topmenu_b5_6");

startSubmenu("index_topmenu_b5","index_topmenu_menu",164);
submenuItem("Life Coaching","http://www.events4singles.com/life_coaches.htm","","index_topmenu_plain");
submenuItem("Love Life Coaches","http://www.events4singles.com/love_life_coaches.htm","","index_topmenu_plain");
submenuItem("Lotto4singles","http://www.events4singles.com/lotto4singles.htm","","index_topmenu_plain");
submenuItem("Nightclubs","http://www.events4singles.com/nightclubs.htm","","index_topmenu_plain");
submenuItem("Psychics4singles","http://www.events4singles.com/psychics4singles.htm","","index_topmenu_plain");
mainMenuItem("index_topmenu_b5_6","Online Dating",0,0,"javascript:;","","",1,1,"index_topmenu_l");
submenuItem("Restaurants and Cafes","http://www.events4singles.com/restaurants_cafes.htm","","index_topmenu_plain");
submenuItem("Retreats4singles","http://www.events4singles.com/retreats_for_singles.htm","","index_topmenu_plain");
submenuItem("Social Clubs","http://www.events4singles.com/social_clubs.htm","","index_topmenu_plain");
submenuItem("Sports and Adventure","http://www.events4singles.com/sport_adventure.htm","","index_topmenu_plain");
submenuItem("Seminars","http://www.events4singles.com/seminars.htm","","index_topmenu_plain");
submenuItem("Speed Dating","http://www.events4singles.com/speed_dating.htm","","index_topmenu_plain");
submenuItem("Tours for singles","http://www.events4singles.com/tours4singles.htm","","index_topmenu_plain");
submenuItem("Travel for singles","http://www.events4singles.com/travel_for_singles.htm","","index_topmenu_plain");
submenuItem("Wineries for singles","http://www.events4singles.com/wineries4singles.htm","","index_topmenu_plain");
submenuItem("Yoga Classes","http://www.events4singles.com/yoga_classes.htm","","index_topmenu_plain");
endSubmenu("index_topmenu_b5");

startSubmenu("index_topmenu_b4_7_8","index_topmenu_menu",52);
submenuItem("Hobart","http://www.events4singles.com/dinner_for_six_hobart.htm","","index_topmenu_plain");
endSubmenu("index_topmenu_b4_7_8");

startSubmenu("index_topmenu_b4_7_7","index_topmenu_menu",54);
submenuItem("Darwin","http://www.events4singles.com/dinner_parties_darwin.htm","","index_topmenu_plain");
endSubmenu("index_topmenu_b4_7_7");

startSubmenu("index_topmenu_b4_7_6","index_topmenu_menu",68);
submenuItem("Canberra","http://www.events4singles.coms/dinner_parties_canberra.htm","","index_topmenu_plain");
endSubmenu("index_topmenu_b4_7_6");

startSubmenu("index_topmenu_b4_7_5","index_topmenu_menu",63);
submenuItem("Adelaide","http://www.events4singles.com/dinner_parties_adelaide.htm","","index_topmenu_plain");
endSubmenu("index_topmenu_b4_7_5");

startSubmenu("index_topmenu_b4_7_4","index_topmenu_menu",44);
submenuItem("Perth","http://www.events4singles.com/dinner_parties_perth.htm","","index_topmenu_plain");
endSubmenu("index_topmenu_b4_7_4");

startSubmenu("index_topmenu_b4_7_3","index_topmenu_menu",77);
submenuItem("Brisbane","http://www.events4singles.com/dinner_parties_brisbane.htm","","index_topmenu_plain");
submenuItem("Gold Coast","http://www.events4singles.com/dinner_parties_brisbane.htm","","index_topmenu_plain");
endSubmenu("index_topmenu_b4_7_3");

startSubmenu("index_topmenu_b4_7_2","index_topmenu_menu",73);
submenuItem("Melbourne","http://www.events4singles.com/dinner_parties_melbourne.htm","","index_topmenu_plain");
submenuItem("Geelong","http://www.events4singles.com/dinner_parties_geelong.htm","","index_topmenu_plain");
endSubmenu("index_topmenu_b4_7_2");

startSubmenu("index_topmenu_b4_7_1","index_topmenu_menu",93);
submenuItem("Sydney","http://www.events4singles.com/dinner_parties_sydney.htm","","index_topmenu_plain");
submenuItem("Central Coast","http://www.events4singles.com/dinner_parties_centralcoast.htm","","index_topmenu_plain");
submenuItem("Wollongong","http://www.events4singles.com/dinner_parties_wollongong.htm","","index_topmenu_plain");
submenuItem("Newcastle","http://www.events4singles.com/dinner_parties_newcastle.htm","","index_topmenu_plain");
endSubmenu("index_topmenu_b4_7_1");

startSubmenu("index_topmenu_b4_7","index_topmenu_menu",61);
mainMenuItem("index_topmenu_b4_7_1","NSW",0,0,"javascript:;","","",1,1,"index_topmenu_l");
mainMenuItem("index_topmenu_b4_7_2","VIC",0,0,"javascript:;","","",1,1,"index_topmenu_l");
mainMenuItem("index_topmenu_b4_7_3","QLD",0,0,"javascript:;","","",1,1,"index_topmenu_l");
mainMenuItem("index_topmenu_b4_7_4","WA",0,0,"javascript:;","","",1,1,"index_topmenu_l");
mainMenuItem("index_topmenu_b4_7_5","SA",0,0,"javascript:;","","",1,1,"index_topmenu_l");
mainMenuItem("index_topmenu_b4_7_6","ACT",0,0,"javascript:;","","",1,1,"index_topmenu_l");
mainMenuItem("index_topmenu_b4_7_7","NT",0,0,"javascript:;","","",1,1,"index_topmenu_l");
mainMenuItem("index_topmenu_b4_7_8","TAS",0,0,"javascript:;","","",1,1,"index_topmenu_l");
endSubmenu("index_topmenu_b4_7");

startSubmenu("index_topmenu_b4","index_topmenu_menu",172);
submenuItem("Beauty4singles","http://www.events4singles.com/beauty_for_singles.htm","","index_topmenu_plain");
submenuItem("Cruises4singles","http://www.events4singles.com/cruises4singles.htm","","index_topmenu_plain");
submenuItem("Dance Classes","http://www.events4singles.com/dance_classes.htm","","index_topmenu_plain");
submenuItem("Dance Teachers","http://www.events4singles.com/dance_teachers.htm","","index_topmenu_plain");
submenuItem("Dinner4six","http://www.events4singles.com/dinner_for_six.htm","","index_topmenu_plain");
submenuItem("Dance Party Clubs","http://www.events4singles.com/dance_party_clubs.htm","","index_topmenu_plain");
mainMenuItem("index_topmenu_b4_7","Dinner Parties",0,0,"http://www.events4singles.com/dinner_parties.htm","","",1,1,"index_topmenu_l");
submenuItem("Fitness4singles","http://www.events4singles.com/fitness4singles.htm","","index_topmenu_plain");
submenuItem("Jazz Scene","http://www.events4singles.com/jazz_in_australia.htm","","index_topmenu_plain");
submenuItem("Healing and Happiness","http://www.events4singles.com/healing_and_happiness.htm","","index_topmenu_plain");
submenuItem("Health4singles","http://www.events4singles.com/singles_health.htm","","index_topmenu_plain");
submenuItem("Holidays","http://www.events4singles.com/travel_for_singles.htm","","index_topmenu_plain");
submenuItem("Home Business","http://www.events4singles.com/home_business.htm","","index_topmenu_plain");
submenuItem("House Parties","http://www.events4singles.com/houseparties.htm","","index_topmenu_plain");
submenuItem("Image and Photography","http://www.events4singles.com/image_and_photography.htm","","index_topmenu_plain");
submenuItem("Introduction Agencies","http://www.events4singles.com/intro_agencies.htm","","index_topmenu_plain");
endSubmenu("index_topmenu_b4");

startSubmenu("index_topmenu_b2_15","index_topmenu_menu",53);
submenuItem("Page 1","http://www.events4singles.com/events_sydney.htm","","index_topmenu_plain");
submenuItem("Page 2","http://www.events4singles.com/events_sydney2.htm","","index_topmenu_plain");
endSubmenu("index_topmenu_b2_15");

startSubmenu("index_topmenu_b2","index_topmenu_menu",130);
submenuItem("Adelaide","http://www.events4singles.com/events_adelaide.htm","","index_topmenu_plain");
submenuItem("Brisbane","http://www.events4singles.com/events_brisbane.htm","","index_topmenu_plain");
submenuItem("Canberra","http://www.events4singles.com/events_canberra.htm","","index_topmenu_plain");
submenuItem("Cairns","http://www.events4singles.com/events_cairns.htm","","index_topmenu_plain");
submenuItem("Central Coast","http://www.events4singles.com/events_central_coast.htm","","index_topmenu_plain");
submenuItem("Darwin","http://www.events4singles.com/events_darwin.htm","","index_topmenu_plain");
submenuItem("Geelong","http://www.events4singles.com/events_geelong.htm","","index_topmenu_plain");
submenuItem("Gold Coast","http://www.events4singles.com/events_gold_coast.htm","","index_topmenu_plain");
submenuItem("Hobart","http://www.events4singles.com/events_hobart.htm","","index_topmenu_plain");
submenuItem("Melbourne","http://www.events4singles.com/events_melbourne.htm","","index_topmenu_plain");
submenuItem("Newcastle","http://www.events4singles.coms/events_newcastle.htm","","index_topmenu_plain");
submenuItem("Perth","http://www.events4singles.com/events_perth.htm","","index_topmenu_plain");
submenuItem("Sunshine Coast","http://www.events4singles.com/events_sunshine_coast.htm","","index_topmenu_plain");
submenuItem("Sutherland Shire","http://www.events4singles.com/events_sutherland_shire.htm","","index_topmenu_plain");
mainMenuItem("index_topmenu_b2_15","Sydney",0,0,"javascript:;","","",1,1,"index_topmenu_l");
submenuItem("Toowoomba","http://www.events4singles.com/events_toowoomba.htm","","index_topmenu_plain");
submenuItem("Wollongong","http://www.events4singles.com/events_wollongong.htm","","index_topmenu_plain");
endSubmenu("index_topmenu_b2");

loc="";
