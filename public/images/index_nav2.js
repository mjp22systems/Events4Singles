//©Xara Ltd
if(typeof(loc)=="undefined"||loc==""){var loc="";if(document.body&&document.body.innerHTML){var tt=document.body.innerHTML;var ml=tt.match(/["']([^'"]*)index_nav2.js["']/i);if(ml && ml.length > 1) loc=ml[1];}}

var bd=0
document.write("<style type=\"text/css\">");
document.write("\n<!--\n");
var tr="filter:alpha(opacity=99);-moz-opacity:0.99;";if(IE5) tr="";
document.write(".index_nav2_menu {"+tr+"z-index:999;border-color:#000000;border-style:solid;border-width:"+bd+"px 0px "+bd+"px 0px;background-color:#cc0066;position:absolute;left:0px;top:0px;visibility:hidden;}");
document.write(".index_nav2_plain, a.index_nav2_plain:link, a.index_nav2_plain:visited{text-align:left;background-color:#cc0066;color:#ffffff;text-decoration:none;border-color:#000000;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:1px 0px 1px 0px;cursor:hand;display:block;font-size:8pt;font-family:Verdana, Arial, Helvetica, sans-serif;}");
document.write("a.index_nav2_plain:hover, a.index_nav2_plain:active{background-color:#ff99cc;color:#cc0066;text-decoration:none;border-color:#000000;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:1px 0px 1px 0px;cursor:hand;display:block;font-size:8pt;font-family:Verdana, Arial, Helvetica, sans-serif;}");
document.write("a.index_nav2_l:link, a.index_nav2_l:visited{text-align:left;background:#cc0066 url("+loc+"index_nav2_l.gif) no-repeat right;color:#ffffff;text-decoration:none;border-color:#000000;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:1px 0px 1px 0px;cursor:hand;display:block;font-size:8pt;font-family:Verdana, Arial, Helvetica, sans-serif;}");
document.write("a.index_nav2_l:hover, a.index_nav2_l:active{background:#ff99cc url("+loc+"index_nav2_l2.gif) no-repeat right;color: #cc0066;text-decoration:none;border-color:#000000;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:1px 0px 1px 0px;cursor:hand;display:block;font-size:8pt;font-family:Verdana, Arial, Helvetica, sans-serif;}");
document.write("\n-->\n");
document.write("</style>");

var fc=0xcc0066;
var bc=0xff99cc;
if(typeof(frames)=="undefined"){var frames=2;if(frames>0)animate();}

startMainMenu("index_nav2_left.gif",33,27,2,0,0)
mainMenuItem("index_nav2_b1",".gif",33,141,"javascript:;","","Home",2,2,"index_nav2_plain");
mainMenuItem("index_nav2_b2",".gif",33,141,"javascript:;","_blank","Speciality Pages",2,2,"index_nav2_plain");
mainMenuItem("index_nav2_b3",".gif",33,141,loc+"../eventscalenderhome.html","","Events Calender",2,2,"index_nav2_plain");
mainMenuItem("index_nav2_b4",".gif",33,141,loc+"../advertise.htm","","Advertise Here",2,2,"index_nav2_plain");
mainMenuItem("index_nav2_b5",".gif",33,141,loc+"../contact.htm","","Contact Us",2,2,"index_nav2_plain");
endMainMenu("index_nav2_right.gif",33,27)

startSubmenu("index_nav2_b5","index_nav2_menu",141);
submenuItem("Contact details",loc+"../contact.htm","","index_nav2_plain");
submenuItem("About Us","javascript:;","","index_nav2_plain");
submenuItem("Link Back Partners",loc+"../link_backs.htm","","index_nav2_plain");
submenuItem("Banner Farm",loc+"../banner_farm.htm","","index_nav2_plain");
endSubmenu("index_nav2_b5");

startSubmenu("index_nav2_b4","index_nav2_menu",141);
submenuItem("Advertising details",loc+"../advertise.htm","","index_nav2_plain");
endSubmenu("index_nav2_b4");

startSubmenu("index_nav2_b3_7","index_nav2_menu",54);
submenuItem("Darwin","javascript:;","","index_nav2_plain");
endSubmenu("index_nav2_b3_7");

startSubmenu("index_nav2_b3_6","index_nav2_menu",68);
submenuItem("Canberra",loc+"../canberraeventcal.htm","","index_nav2_plain");
endSubmenu("index_nav2_b3_6");

startSubmenu("index_nav2_b3_5","index_nav2_menu",44);
submenuItem("Perth",loc+"../pereventcal.htm","","index_nav2_plain");
endSubmenu("index_nav2_b3_5");

startSubmenu("index_nav2_b3_4","index_nav2_menu",52);
submenuItem("Hobart","javascript:;","","index_nav2_plain");
endSubmenu("index_nav2_b3_4");

startSubmenu("index_nav2_b3_3","index_nav2_menu",77);
submenuItem("Brisbane",loc+"../briseventcal.htm","","index_nav2_plain");
submenuItem("Gold Coast",loc+"../goldcsteventcal.htm","","index_nav2_plain");
endSubmenu("index_nav2_b3_3");

startSubmenu("index_nav2_b3_2","index_nav2_menu",73);
submenuItem("Melbourne",loc+"../event_calendar_melb.htm","","index_nav2_plain");
endSubmenu("index_nav2_b3_2");

startSubmenu("index_nav2_b3_1","index_nav2_menu",93);
submenuItem("Sydney",loc+"../event_ calendar_sydney.htm","","index_nav2_plain");
submenuItem("Central Coast",loc+"../cencsteventcal.htm","","index_nav2_plain");
endSubmenu("index_nav2_b3_1");

startSubmenu("index_nav2_b3","index_nav2_menu",141);
mainMenuItem("index_nav2_b3_1","NSW",0,0,"javascript:;","","",1,1,"index_nav2_l");
mainMenuItem("index_nav2_b3_2","VIC",0,0,"javascript:;","","",1,1,"index_nav2_l");
mainMenuItem("index_nav2_b3_3","QLD",0,0,"javascript:;","","",1,1,"index_nav2_l");
mainMenuItem("index_nav2_b3_4","TAS",0,0,"javascript:;","","",1,1,"index_nav2_l");
mainMenuItem("index_nav2_b3_5","WA",0,0,"javascript:;","","",1,1,"index_nav2_l");
mainMenuItem("index_nav2_b3_6","ACT",0,0,"javascript:;","","",1,1,"index_nav2_l");
mainMenuItem("index_nav2_b3_7","NT",0,0,"javascript:;","","",1,1,"index_nav2_l");
endSubmenu("index_nav2_b3");

startSubmenu("index_nav2_b2_23_8","index_nav2_menu",68);
submenuItem("Canberra","javascript:;","","index_nav2_plain");
endSubmenu("index_nav2_b2_23_8");

startSubmenu("index_nav2_b2_23_7","index_nav2_menu",52);
submenuItem("Hobart",loc+"../social_clubs_hobart.htm","","index_nav2_plain");
endSubmenu("index_nav2_b2_23_7");

startSubmenu("index_nav2_b2_23_6","index_nav2_menu",54);
submenuItem("Darwin",loc+"../social_clubs_darwin.htm","","index_nav2_plain");
endSubmenu("index_nav2_b2_23_6");

startSubmenu("index_nav2_b2_23_5","index_nav2_menu",63);
submenuItem("Adelaide",loc+"../social_clubs_adel.htm","","index_nav2_plain");
endSubmenu("index_nav2_b2_23_5");

startSubmenu("index_nav2_b2_23_4","index_nav2_menu",44);
submenuItem("Perth",loc+"../social_clubs_perth.htm","","index_nav2_plain");
endSubmenu("index_nav2_b2_23_4");

startSubmenu("index_nav2_b2_23_3","index_nav2_menu",77);
submenuItem("Brisbane",loc+"../social_clubs_bris.htm","","index_nav2_plain");
submenuItem("Gold Coast",loc+"../social_clubs_goldcoast.htm","","index_nav2_plain");
endSubmenu("index_nav2_b2_23_3");

startSubmenu("index_nav2_b2_23_2","index_nav2_menu",73);
submenuItem("Melbourne",loc+"../social_clubs_melb.htm","","index_nav2_plain");
submenuItem("Geelong",loc+"../social_clubs_geelong.htm","","index_nav2_plain");
endSubmenu("index_nav2_b2_23_2");

startSubmenu("index_nav2_b2_23_1","index_nav2_menu",93);
submenuItem("Sydney",loc+"../social_clubs_syd.htm","","index_nav2_plain");
submenuItem("Central Coast",loc+"../social_clubs_centralcoast.htm","","index_nav2_plain");
submenuItem("Newcastle",loc+"../social_clubs_newcastle.htm","","index_nav2_plain");
endSubmenu("index_nav2_b2_23_1");

startSubmenu("index_nav2_b2_23","index_nav2_menu",61);
mainMenuItem("index_nav2_b2_23_1","NSW",0,0,"javascript:;","","",1,1,"index_nav2_l");
mainMenuItem("index_nav2_b2_23_2","VIC",0,0,"javascript:;","","",1,1,"index_nav2_l");
mainMenuItem("index_nav2_b2_23_3","QLD",0,0,"javascript:;","","",1,1,"index_nav2_l");
mainMenuItem("index_nav2_b2_23_4","WA",0,0,"javascript:;","","",1,1,"index_nav2_l");
mainMenuItem("index_nav2_b2_23_5","SA",0,0,"javascript:;","","",1,1,"index_nav2_l");
mainMenuItem("index_nav2_b2_23_6","NT",0,0,"javascript:;","","",1,1,"index_nav2_l");
mainMenuItem("index_nav2_b2_23_7","TAS",0,0,"javascript:;","","",1,1,"index_nav2_l");
mainMenuItem("index_nav2_b2_23_8","ACT",0,0,loc+"../social_clubs_canberra.htm","","",1,1,"index_nav2_l");
endSubmenu("index_nav2_b2_23");

startSubmenu("index_nav2_b2_18","index_nav2_menu",87);
submenuItem("Australia",loc+"../online_dating.htm","","index_nav2_plain");
submenuItem("International",loc+"../online_dating_int.htm","","index_nav2_plain");
endSubmenu("index_nav2_b2_18");

startSubmenu("index_nav2_b2_7_8","index_nav2_menu",52);
submenuItem("Hobart",loc+"../dinner_for_six_hobart.htm","","index_nav2_plain");
endSubmenu("index_nav2_b2_7_8");

startSubmenu("index_nav2_b2_7_7","index_nav2_menu",54);
submenuItem("Darwin",loc+"../dinner_parties_darwin.htm","","index_nav2_plain");
endSubmenu("index_nav2_b2_7_7");

startSubmenu("index_nav2_b2_7_6","index_nav2_menu",68);
submenuItem("Canberra",loc+"../dinner_parties_canberra.htm","","index_nav2_plain");
endSubmenu("index_nav2_b2_7_6");

startSubmenu("index_nav2_b2_7_5","index_nav2_menu",63);
submenuItem("Adelaide",loc+"../dinner_parties_adelaide.htm","","index_nav2_plain");
endSubmenu("index_nav2_b2_7_5");

startSubmenu("index_nav2_b2_7_4","index_nav2_menu",44);
submenuItem("Perth",loc+"../dinner_parties_perth.htm","","index_nav2_plain");
endSubmenu("index_nav2_b2_7_4");

startSubmenu("index_nav2_b2_7_3","index_nav2_menu",77);
submenuItem("Brisbane",loc+"../dinner_parties_brisbane.htm","","index_nav2_plain");
submenuItem("Gold Coast",loc+"../dinner_parties_brisbane.htm","","index_nav2_plain");
endSubmenu("index_nav2_b2_7_3");

startSubmenu("index_nav2_b2_7_2","index_nav2_menu",73);
submenuItem("Melbourne",loc+"../dinner_parties_melbourne.htm","","index_nav2_plain");
submenuItem("Geelong",loc+"../dinner_parties_geelong.htm","","index_nav2_plain");
endSubmenu("index_nav2_b2_7_2");

startSubmenu("index_nav2_b2_7_1","index_nav2_menu",93);
submenuItem("Sydney",loc+"../dinner_parties_sydney.htm","","index_nav2_plain");
submenuItem("Central Coast",loc+"../dinner_parties_centralcoast.htm","","index_nav2_plain");
endSubmenu("index_nav2_b2_7_1");

startSubmenu("index_nav2_b2_7","index_nav2_menu",61);
mainMenuItem("index_nav2_b2_7_1","NSW",0,0,"javascript:;","","",1,1,"index_nav2_l");
mainMenuItem("index_nav2_b2_7_2","VIC",0,0,"javascript:;","","",1,1,"index_nav2_l");
mainMenuItem("index_nav2_b2_7_3","QLD",0,0,"javascript:;","","",1,1,"index_nav2_l");
mainMenuItem("index_nav2_b2_7_4","WA",0,0,"javascript:;","","",1,1,"index_nav2_l");
mainMenuItem("index_nav2_b2_7_5","SA",0,0,"javascript:;","","",1,1,"index_nav2_l");
mainMenuItem("index_nav2_b2_7_6","ACT",0,0,"javascript:;","","",1,1,"index_nav2_l");
mainMenuItem("index_nav2_b2_7_7","NT",0,0,"javascript:;","","",1,1,"index_nav2_l");
mainMenuItem("index_nav2_b2_7_8","TAS",0,0,"javascript:;","","",1,1,"index_nav2_l");
endSubmenu("index_nav2_b2_7");

startSubmenu("index_nav2_b2_5_7","index_nav2_menu",68);
submenuItem("Canberra",loc+"../dinner_for_six_canberra.htm","","index_nav2_plain");
endSubmenu("index_nav2_b2_5_7");

startSubmenu("index_nav2_b2_5_6","index_nav2_menu",54);
submenuItem("Darwin",loc+"../dinner_for_six_darwin.htm","","index_nav2_plain");
endSubmenu("index_nav2_b2_5_6");

startSubmenu("index_nav2_b2_5_5","index_nav2_menu",63);
submenuItem("Adelaide",loc+"../dinner_for_six_adelaide.htm","","index_nav2_plain");
endSubmenu("index_nav2_b2_5_5");

startSubmenu("index_nav2_b2_5_4","index_nav2_menu",44);
submenuItem("Perth",loc+"../dinner_for_six_perth.htm","","index_nav2_plain");
endSubmenu("index_nav2_b2_5_4");

startSubmenu("index_nav2_b2_5_3","index_nav2_menu",77);
submenuItem("Brisbane",loc+"../dinner_for_six_brisbane.htm","","index_nav2_plain");
submenuItem("Gold Coast",loc+"../dinner_for_six_gold_coast.htm","","index_nav2_plain");
endSubmenu("index_nav2_b2_5_3");

startSubmenu("index_nav2_b2_5_2","index_nav2_menu",73);
submenuItem("Melbourne",loc+"../dinner_for_six_melbourne.htm","","index_nav2_plain");
submenuItem("Geelong","javascript:;","","index_nav2_plain");
endSubmenu("index_nav2_b2_5_2");

startSubmenu("index_nav2_b2_5_1","index_nav2_menu",93);
submenuItem("Sydney",loc+"../dinner_for_six_sydney.htm","","index_nav2_plain");
submenuItem("Central Coast","javascript:;","","index_nav2_plain");
submenuItem("Newcastle","javascript:;","","index_nav2_plain");
endSubmenu("index_nav2_b2_5_1");

startSubmenu("index_nav2_b2_5","index_nav2_menu",61);
mainMenuItem("index_nav2_b2_5_1","NSW",0,0,"javascript:;","","",1,1,"index_nav2_l");
mainMenuItem("index_nav2_b2_5_2","VIC",0,0,"javascript:;","","",1,1,"index_nav2_l");
mainMenuItem("index_nav2_b2_5_3","QLD",0,0,"javascript:;","","",1,1,"index_nav2_l");
mainMenuItem("index_nav2_b2_5_4","WA",0,0,"javascript:;","","",1,1,"index_nav2_l");
mainMenuItem("index_nav2_b2_5_5","SA",0,0,"javascript:;","","",1,1,"index_nav2_l");
mainMenuItem("index_nav2_b2_5_6","NT",0,0,"javascript:;","","",1,1,"index_nav2_l");
mainMenuItem("index_nav2_b2_5_7","ACT",0,0,"javascript:;","","",1,1,"index_nav2_l");
endSubmenu("index_nav2_b2_5");

startSubmenu("index_nav2_b2_3_8","index_nav2_menu",68);
submenuItem("Canberra","javascript:;","","index_nav2_plain");
endSubmenu("index_nav2_b2_3_8");

startSubmenu("index_nav2_b2_3_7","index_nav2_menu",54);
submenuItem("Darwin","javascript:;","","index_nav2_plain");
endSubmenu("index_nav2_b2_3_7");

startSubmenu("index_nav2_b2_3_6","index_nav2_menu",52);
submenuItem("Hobart","javascript:;","","index_nav2_plain");
endSubmenu("index_nav2_b2_3_6");

startSubmenu("index_nav2_b2_3_5","index_nav2_menu",63);
submenuItem("Adelaide","javascript:;","","index_nav2_plain");
endSubmenu("index_nav2_b2_3_5");

startSubmenu("index_nav2_b2_3_4","index_nav2_menu",44);
submenuItem("Perth","javascript:;","","index_nav2_plain");
endSubmenu("index_nav2_b2_3_4");

startSubmenu("index_nav2_b2_3_3","index_nav2_menu",77);
submenuItem("Brisbane","javascript:;","","index_nav2_plain");
submenuItem("Gold Coast","javascript:;","","index_nav2_plain");
endSubmenu("index_nav2_b2_3_3");

startSubmenu("index_nav2_b2_3_2","index_nav2_menu",73);
submenuItem("Melbourne","javascript:;","","index_nav2_plain");
submenuItem("Geelong","javascript:;","","index_nav2_plain");
endSubmenu("index_nav2_b2_3_2");

startSubmenu("index_nav2_b2_3_1","index_nav2_menu",93);
submenuItem("Sydney","javascript:;","","index_nav2_plain");
submenuItem("Central Coast","javascript:;","","index_nav2_plain");
submenuItem("Newcastle","javascript:;","","index_nav2_plain");
endSubmenu("index_nav2_b2_3_1");

startSubmenu("index_nav2_b2_3","index_nav2_menu",61);
mainMenuItem("index_nav2_b2_3_1","NSW",0,0,"javascript:;","","",1,1,"index_nav2_l");
mainMenuItem("index_nav2_b2_3_2","VIC",0,0,"javascript:;","","",1,1,"index_nav2_l");
mainMenuItem("index_nav2_b2_3_3","QLD",0,0,"javascript:;","","",1,1,"index_nav2_l");
mainMenuItem("index_nav2_b2_3_4","WA",0,0,"javascript:;","","",1,1,"index_nav2_l");
mainMenuItem("index_nav2_b2_3_5","SA",0,0,"javascript:;","","",1,1,"index_nav2_l");
mainMenuItem("index_nav2_b2_3_6","TAS",0,0,"javascript:;","","",1,1,"index_nav2_l");
mainMenuItem("index_nav2_b2_3_7","NT",0,0,"javascript:;","","",1,1,"index_nav2_l");
mainMenuItem("index_nav2_b2_3_8","ACT",0,0,"javascript:;","","",1,1,"index_nav2_l");
endSubmenu("index_nav2_b2_3");

startSubmenu("index_nav2_b2","index_nav2_menu",164);
submenuItem("Beauty4singles",loc+"../beauty_for_singles.htm","","index_nav2_plain");
submenuItem("Cruises4singles",loc+"../cruises4singles.htm","","index_nav2_plain");
mainMenuItem("index_nav2_b2_3","Dance Classes",0,0,loc+"../dance_classes_sydney.htm","","",1,1,"index_nav2_l");
submenuItem("Dance Teachers",loc+"../dance_teachers.htm","","index_nav2_plain");
mainMenuItem("index_nav2_b2_5","Dinner4six",0,0,loc+"../dinner_for_six.htm","","",1,1,"index_nav2_l");
submenuItem("Dance Party Clubs",loc+"../dance_party_clubs.htm","","index_nav2_plain");
mainMenuItem("index_nav2_b2_7","Dinner Parties",0,0,loc+"../dinner_parties.htm","","",1,1,"index_nav2_l");
submenuItem("Entertainment",loc+"../Entertainment.htm","","index_nav2_plain");
submenuItem("Fitness4singles",loc+"../fitness4singles.htm","","index_nav2_plain");
submenuItem("Function Centres",loc+"../function_centres.htm","","index_nav2_plain");
submenuItem("Health4singles",loc+"../singles_health.htm","","index_nav2_plain");
submenuItem("House Parties",loc+"../houseparties.htm","","index_nav2_plain");
submenuItem("Home Business",loc+"../home_business.htm","","index_nav2_plain");
submenuItem("Introduction Agencies",loc+"../intro_agencies.htm","","index_nav2_plain");
submenuItem("Jazz4singles",loc+"../jazz4singles.htm","","index_nav2_plain");
submenuItem("Love Life Coaches",loc+"../love_life_coaches.htm","","index_nav2_plain");
submenuItem("Lotto4singles",loc+"../lotto4singles.htm","","index_nav2_plain");
mainMenuItem("index_nav2_b2_18","Online Dating",0,0,"javascript:;","","",1,1,"index_nav2_l");
submenuItem("Photography4singles","javascript:;","","index_nav2_plain");
submenuItem("Psychics4singles",loc+"../psychics4singles.htm","","index_nav2_plain");
submenuItem("Restaurants and Cafes",loc+"../restaurants_cafes.htm","","index_nav2_plain");
submenuItem("Retreats4singles",loc+"../retreats_for_singles.htm","","index_nav2_plain");
mainMenuItem("index_nav2_b2_23","Social Clubs",0,0,loc+"../social_clubs.htm","","",1,1,"index_nav2_l");
submenuItem("Sports and Adventure",loc+"../sport_adventure.htm","","index_nav2_plain");
submenuItem("Seminar4singles",loc+"../seminars.htm","","index_nav2_plain");
submenuItem("Speed Dating",loc+"../speed_dating.htm","","index_nav2_plain");
submenuItem("Toastmasters",loc+"../toastmasters.htm","","index_nav2_plain");
submenuItem("Tours4singles",loc+"../tours4singles.htm","","index_nav2_plain");
submenuItem("Wineries4singles",loc+"../wineries4singles.htm","","index_nav2_plain");
endSubmenu("index_nav2_b2");

loc="";
