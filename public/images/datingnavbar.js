//©Xara Ltd
if(typeof(loc)=="undefined"||loc==""){var loc="";if(document.body&&document.body.innerHTML){var tt=document.body.innerHTML;var ml=tt.match(/["']([^'"]*)datingnavbar.js["']/i);if(ml && ml.length > 1) loc=ml[1];}}

var bd=0
document.write("<style type=\"text/css\">");
document.write("\n<!--\n");
var tr="filter:alpha(opacity=99);-moz-opacity:0.99;";if(IE5) tr="";
document.write(".datingnavbar_menu {"+tr+"z-index:999;border-color:#ffffff;border-style:solid;border-width:"+bd+"px 0px "+bd+"px 0px;background-color:#296666;position:absolute;left:0px;top:0px;visibility:hidden;}");
document.write(".datingnavbar_plain, a.datingnavbar_plain:link, a.datingnavbar_plain:visited{text-align:left;background-color:#296666;color:#ffffff;text-decoration:none;border-color:#ffffff;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:1px 0px 1px 0px;cursor:hand;display:block;font-size:8pt;font-family:Verdana, Arial, Helvetica, sans-serif;}");
document.write("a.datingnavbar_plain:hover, a.datingnavbar_plain:active{background-color:#d02586;color:#ffffff;text-decoration:none;border-color:#ffffff;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:1px 0px 1px 0px;cursor:hand;display:block;font-size:8pt;font-family:Verdana, Arial, Helvetica, sans-serif;}");
document.write("\n-->\n");
document.write("</style>");

var fc=0xffffff;
var bc=0xd02586;
if(typeof(frames)=="undefined"){var frames=3;if(frames>0)animate();}

startMainMenu("datingnavbar_left.gif",26,26,2,0,0)
mainMenuItem("datingnavbar_b1",".gif",26,133,"http://www.events4singles.com/tips_and_links/tips_and_links.htm","","DATING ADVICE",2,2,"datingnavbar_plain");
mainMenuItem("datingnavbar_b2",".gif",26,133,"javascript:;","","DATING RESOURCES",2,2,"datingnavbar_plain");
mainMenuItem("datingnavbar_b3",".gif",26,133,"http://www.events4singles.com/tips_and_links/flirting.htm","","FLIRTING",2,2,"datingnavbar_plain");
mainMenuItem("datingnavbar_b4",".gif",26,133,"http://www.intelligentromance.com.au","","ROMANCE",2,2,"datingnavbar_plain");
mainMenuItem("datingnavbar_b5",".gif",26,133,"http://www.events4singles.com/tips_and_links/spiritual_path.htm","","SPIRITUAL PATH",2,2,"datingnavbar_plain");
endMainMenu("datingnavbar_right.gif",26,26)

startSubmenu("datingnavbar_b5","datingnavbar_menu",133);
submenuItem("Spiritual Path","http://www.events4singles.com/tips_and_links/spiritual_path.htm","","datingnavbar_plain");
endSubmenu("datingnavbar_b5");

startSubmenu("datingnavbar_b2","datingnavbar_menu",133);
submenuItem("Links","http://www.events4singles.com/tips_and_links/dating_resources_websites.htm","","datingnavbar_plain");
submenuItem("Books","http://www.events4singles.com/tips_and_links/dating_resources_books.htm","","datingnavbar_plain");
endSubmenu("datingnavbar_b2");

startSubmenu("datingnavbar_b1","datingnavbar_menu",235);
submenuItem("Body Language","http://www.events4singles.com/tips_and_links/body_language.htm","","datingnavbar_plain");
submenuItem("Dating Guide","http://www.events4singles.com/tips_and_links/Dating.htm","","datingnavbar_plain");
submenuItem("Date jokes","http://www.events4singles.com/tips_and_links/date_jokes.htm","","datingnavbar_plain");
submenuItem("Dating Safely","http://www.events4singles.com/tips_and_links/date_safely.htm","","datingnavbar_plain");
submenuItem("Dating tips for men","http://www.events4singles.com/tips_and_links/dating_tips_men.htm","","datingnavbar_plain");
submenuItem("Dealing with insecurities","http://www.events4singles.com/tips_and_links/dealing_with_insecurities.htm","","datingnavbar_plain");
submenuItem("Developing confidence","http://www.events4singles.com/tips_and_links/developing_deep_confidence.htm","","datingnavbar_plain");
submenuItem("Going out on a date","http://www.events4singles.com/tips_and_links/Going_out_on_a_date.htm","","datingnavbar_plain");
submenuItem("Love poems","http://www.events4singles.com/tips_and_links/love_poems.htm","","datingnavbar_plain");
submenuItem("Power Words","http://www.events4singles.com/tips_and_links/power_words.htm","","datingnavbar_plain");
submenuItem("What to do on a first date","http://www.events4singles.com/tips_and_links/what_to_do_on_a_first_date.htm","","datingnavbar_plain");
submenuItem("What to take on a date","http://www.events4singles.com/tips_and_links/What_to_take_on_a_date.htm","","datingnavbar_plain");
submenuItem("Dating principles (image & confidence)","http://www.events4singles.com/tips_and_links/dating_principles.htm","","datingnavbar_plain");
endSubmenu("datingnavbar_b1");

loc="";
