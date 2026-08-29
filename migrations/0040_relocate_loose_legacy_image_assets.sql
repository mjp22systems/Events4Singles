-- Move loose root image references to the organised public image tree.
-- This mirrors the physical asset move from public/images into site/, businesses/, and junk/.

UPDATE categories
SET hero_image_url = CASE
  WHEN hero_image_url LIKE '/images/category-hero-%' THEN '/images/site/category-heroes/' || substr(hero_image_url, 9)
  WHEN hero_image_url LIKE '/images/location-photo-%' THEN '/images/site/location-photos/' || substr(hero_image_url, 9)
  WHEN hero_image_url LIKE '/images/location-hero-%' THEN '/images/site/location-heroes/' || substr(hero_image_url, 9)
  WHEN hero_image_url LIKE '/images/home-blog-%' THEN '/images/site/home/resource-cards/' || substr(hero_image_url, 9)
  WHEN hero_image_url LIKE '/images/home-exp-%' THEN '/images/site/home/experience-cards/' || substr(hero_image_url, 9)
  WHEN hero_image_url LIKE '/images/home-cat-%' THEN '/images/site/home/category-cards/' || substr(hero_image_url, 9)
  WHEN hero_image_url LIKE '/images/advertise-here-%' THEN '/images/site/placeholders/' || substr(hero_image_url, 9)
  WHEN hero_image_url LIKE '/images/E4S%' OR hero_image_url LIKE '/images/e4s_%' OR hero_image_url LIKE '/images/e4spersonals%' THEN '/images/junk/e4s-old-site-assets/' || substr(hero_image_url, 9)
  WHEN hero_image_url LIKE '/images/icon_%' THEN '/images/junk/legacy-icons-and-nav/' || substr(hero_image_url, 9)
  WHEN hero_image_url LIKE '/images/img_%' OR hero_image_url LIKE '/images/joincollage.%' OR hero_image_url LIKE '/images/join_banner_%' THEN '/images/junk/legacy-page-art/' || substr(hero_image_url, 9)
  WHEN hero_image_url LIKE '/images/logo-%' THEN '/images/junk/legacy-numbered-logos/' || substr(hero_image_url, 9)
  WHEN hero_image_url LIKE '/images/kokoloco_tropicana_%' OR hero_image_url LIKE '/images/kokoloco_bootcmp_%' THEN '/images/businesses/legacy-promotional-banners/' || substr(hero_image_url, 9)
  ELSE hero_image_url
END
WHERE hero_image_url LIKE '/images/%';

UPDATE listings
SET image_url = CASE
  WHEN image_url LIKE '/images/category-hero-%' THEN '/images/site/category-heroes/' || substr(image_url, 9)
  WHEN image_url LIKE '/images/location-photo-%' THEN '/images/site/location-photos/' || substr(image_url, 9)
  WHEN image_url LIKE '/images/location-hero-%' THEN '/images/site/location-heroes/' || substr(image_url, 9)
  WHEN image_url LIKE '/images/home-blog-%' THEN '/images/site/home/resource-cards/' || substr(image_url, 9)
  WHEN image_url LIKE '/images/home-exp-%' THEN '/images/site/home/experience-cards/' || substr(image_url, 9)
  WHEN image_url LIKE '/images/home-cat-%' THEN '/images/site/home/category-cards/' || substr(image_url, 9)
  WHEN image_url LIKE '/images/advertise-here-%' THEN '/images/site/placeholders/' || substr(image_url, 9)
  WHEN image_url LIKE '/images/E4S%' OR image_url LIKE '/images/e4s_%' OR image_url LIKE '/images/e4spersonals%' THEN '/images/junk/e4s-old-site-assets/' || substr(image_url, 9)
  WHEN image_url LIKE '/images/icon_%' THEN '/images/junk/legacy-icons-and-nav/' || substr(image_url, 9)
  WHEN image_url LIKE '/images/img_%' OR image_url LIKE '/images/joincollage.%' OR image_url LIKE '/images/join_banner_%' THEN '/images/junk/legacy-page-art/' || substr(image_url, 9)
  WHEN image_url LIKE '/images/logo-%' THEN '/images/junk/legacy-numbered-logos/' || substr(image_url, 9)
  WHEN image_url LIKE '/images/kokoloco_tropicana_%' OR image_url LIKE '/images/kokoloco_bootcmp_%' THEN '/images/businesses/legacy-promotional-banners/' || substr(image_url, 9)
  ELSE image_url
END
WHERE image_url LIKE '/images/%';

UPDATE businesses
SET logo_url = CASE
  WHEN logo_url LIKE '/images/category-hero-%' THEN '/images/site/category-heroes/' || substr(logo_url, 9)
  WHEN logo_url LIKE '/images/location-photo-%' THEN '/images/site/location-photos/' || substr(logo_url, 9)
  WHEN logo_url LIKE '/images/location-hero-%' THEN '/images/site/location-heroes/' || substr(logo_url, 9)
  WHEN logo_url LIKE '/images/home-blog-%' THEN '/images/site/home/resource-cards/' || substr(logo_url, 9)
  WHEN logo_url LIKE '/images/home-exp-%' THEN '/images/site/home/experience-cards/' || substr(logo_url, 9)
  WHEN logo_url LIKE '/images/home-cat-%' THEN '/images/site/home/category-cards/' || substr(logo_url, 9)
  WHEN logo_url LIKE '/images/advertise-here-%' THEN '/images/site/placeholders/' || substr(logo_url, 9)
  WHEN logo_url LIKE '/images/E4S%' OR logo_url LIKE '/images/e4s_%' OR logo_url LIKE '/images/e4spersonals%' THEN '/images/junk/e4s-old-site-assets/' || substr(logo_url, 9)
  WHEN logo_url LIKE '/images/icon_%' THEN '/images/junk/legacy-icons-and-nav/' || substr(logo_url, 9)
  WHEN logo_url LIKE '/images/img_%' OR logo_url LIKE '/images/joincollage.%' OR logo_url LIKE '/images/join_banner_%' THEN '/images/junk/legacy-page-art/' || substr(logo_url, 9)
  WHEN logo_url LIKE '/images/logo-%' THEN '/images/junk/legacy-numbered-logos/' || substr(logo_url, 9)
  WHEN logo_url LIKE '/images/kokoloco_tropicana_%' OR logo_url LIKE '/images/kokoloco_bootcmp_%' THEN '/images/businesses/legacy-promotional-banners/' || substr(logo_url, 9)
  ELSE logo_url
END
WHERE logo_url LIKE '/images/%';

UPDATE listing_images
SET url = CASE
  WHEN url LIKE '/images/category-hero-%' THEN '/images/site/category-heroes/' || substr(url, 9)
  WHEN url LIKE '/images/location-photo-%' THEN '/images/site/location-photos/' || substr(url, 9)
  WHEN url LIKE '/images/location-hero-%' THEN '/images/site/location-heroes/' || substr(url, 9)
  WHEN url LIKE '/images/home-blog-%' THEN '/images/site/home/resource-cards/' || substr(url, 9)
  WHEN url LIKE '/images/home-exp-%' THEN '/images/site/home/experience-cards/' || substr(url, 9)
  WHEN url LIKE '/images/home-cat-%' THEN '/images/site/home/category-cards/' || substr(url, 9)
  WHEN url LIKE '/images/advertise-here-%' THEN '/images/site/placeholders/' || substr(url, 9)
  WHEN url LIKE '/images/E4S%' OR url LIKE '/images/e4s_%' OR url LIKE '/images/e4spersonals%' THEN '/images/junk/e4s-old-site-assets/' || substr(url, 9)
  WHEN url LIKE '/images/icon_%' THEN '/images/junk/legacy-icons-and-nav/' || substr(url, 9)
  WHEN url LIKE '/images/img_%' OR url LIKE '/images/joincollage.%' OR url LIKE '/images/join_banner_%' THEN '/images/junk/legacy-page-art/' || substr(url, 9)
  WHEN url LIKE '/images/logo-%' THEN '/images/junk/legacy-numbered-logos/' || substr(url, 9)
  WHEN url LIKE '/images/kokoloco_tropicana_%' OR url LIKE '/images/kokoloco_bootcmp_%' THEN '/images/businesses/legacy-promotional-banners/' || substr(url, 9)
  ELSE url
END
WHERE url LIKE '/images/%';

UPDATE banners
SET image_url = CASE
  WHEN image_url LIKE '/images/category-hero-%' THEN '/images/site/category-heroes/' || substr(image_url, 9)
  WHEN image_url LIKE '/images/location-photo-%' THEN '/images/site/location-photos/' || substr(image_url, 9)
  WHEN image_url LIKE '/images/location-hero-%' THEN '/images/site/location-heroes/' || substr(image_url, 9)
  WHEN image_url LIKE '/images/home-blog-%' THEN '/images/site/home/resource-cards/' || substr(image_url, 9)
  WHEN image_url LIKE '/images/home-exp-%' THEN '/images/site/home/experience-cards/' || substr(image_url, 9)
  WHEN image_url LIKE '/images/home-cat-%' THEN '/images/site/home/category-cards/' || substr(image_url, 9)
  WHEN image_url LIKE '/images/advertise-here-%' THEN '/images/site/placeholders/' || substr(image_url, 9)
  WHEN image_url LIKE '/images/E4S%' OR image_url LIKE '/images/e4s_%' OR image_url LIKE '/images/e4spersonals%' THEN '/images/junk/e4s-old-site-assets/' || substr(image_url, 9)
  WHEN image_url LIKE '/images/icon_%' THEN '/images/junk/legacy-icons-and-nav/' || substr(image_url, 9)
  WHEN image_url LIKE '/images/img_%' OR image_url LIKE '/images/joincollage.%' OR image_url LIKE '/images/join_banner_%' THEN '/images/junk/legacy-page-art/' || substr(image_url, 9)
  WHEN image_url LIKE '/images/logo-%' THEN '/images/junk/legacy-numbered-logos/' || substr(image_url, 9)
  WHEN image_url LIKE '/images/kokoloco_tropicana_%' OR image_url LIKE '/images/kokoloco_bootcmp_%' THEN '/images/businesses/legacy-promotional-banners/' || substr(image_url, 9)
  ELSE image_url
END
WHERE image_url LIKE '/images/%';

UPDATE events
SET image_url = CASE
  WHEN image_url LIKE '/images/category-hero-%' THEN '/images/site/category-heroes/' || substr(image_url, 9)
  WHEN image_url LIKE '/images/location-photo-%' THEN '/images/site/location-photos/' || substr(image_url, 9)
  WHEN image_url LIKE '/images/location-hero-%' THEN '/images/site/location-heroes/' || substr(image_url, 9)
  WHEN image_url LIKE '/images/home-blog-%' THEN '/images/site/home/resource-cards/' || substr(image_url, 9)
  WHEN image_url LIKE '/images/home-exp-%' THEN '/images/site/home/experience-cards/' || substr(image_url, 9)
  WHEN image_url LIKE '/images/home-cat-%' THEN '/images/site/home/category-cards/' || substr(image_url, 9)
  WHEN image_url LIKE '/images/advertise-here-%' THEN '/images/site/placeholders/' || substr(image_url, 9)
  WHEN image_url LIKE '/images/E4S%' OR image_url LIKE '/images/e4s_%' OR image_url LIKE '/images/e4spersonals%' THEN '/images/junk/e4s-old-site-assets/' || substr(image_url, 9)
  WHEN image_url LIKE '/images/icon_%' THEN '/images/junk/legacy-icons-and-nav/' || substr(image_url, 9)
  WHEN image_url LIKE '/images/img_%' OR image_url LIKE '/images/joincollage.%' OR image_url LIKE '/images/join_banner_%' THEN '/images/junk/legacy-page-art/' || substr(image_url, 9)
  WHEN image_url LIKE '/images/logo-%' THEN '/images/junk/legacy-numbered-logos/' || substr(image_url, 9)
  WHEN image_url LIKE '/images/kokoloco_tropicana_%' OR image_url LIKE '/images/kokoloco_bootcmp_%' THEN '/images/businesses/legacy-promotional-banners/' || substr(image_url, 9)
  ELSE image_url
END
WHERE image_url LIKE '/images/%';


-- Exact mappings for visually classified loose banner/header/page-art assets.

UPDATE categories
SET hero_image_url = CASE hero_image_url
  WHEN '/images/468x60_kiss_goodbye.gif' THEN '/images/businesses/legacy-promotional-banners/468x60_kiss_goodbye.gif'
  WHEN '/images/468x60_whereisthelove.gif' THEN '/images/businesses/legacy-promotional-banners/468x60_whereisthelove.gif'
  WHEN '/images/8ball-banner_120x80.gif' THEN '/images/businesses/legacy-promotional-banners/8ball-banner_120x80.gif'
  WHEN '/images/8ball-dating_banner_ani_123.gif' THEN '/images/businesses/legacy-promotional-banners/8ball-dating_banner_ani_123.gif'
  WHEN '/images/adpromo1.gif' THEN '/images/businesses/legacy-promotional-banners/adpromo1.gif'
  WHEN '/images/amoureux_banner110x118.jpg' THEN '/images/businesses/legacy-promotional-banners/amoureux_banner110x118.jpg'
  WHEN '/images/atable4six-new_430x179.jpg' THEN '/images/businesses/legacy-promotional-banners/atable4six-new_430x179.jpg'
  WHEN '/images/banner_120x80_ani.gif' THEN '/images/businesses/legacy-promotional-banners/banner_120x80_ani.gif'
  WHEN '/images/banner_e4ddancing6.gif' THEN '/images/businesses/legacy-promotional-banners/banner_e4ddancing6.gif'
  WHEN '/images/banner_e4ddancing9.gif' THEN '/images/businesses/legacy-promotional-banners/banner_e4ddancing9.gif'
  WHEN '/images/banner_joine4s.jpg' THEN '/images/businesses/legacy-promotional-banners/banner_joine4s.jpg'
  WHEN '/images/blink_600x100.gif' THEN '/images/businesses/legacy-promotional-banners/blink_600x100.gif'
  WHEN '/images/blink_banner_449x79.jpg' THEN '/images/businesses/legacy-promotional-banners/blink_banner_449x79.jpg'
  WHEN '/images/blink_banner_sml.gif' THEN '/images/businesses/legacy-promotional-banners/blink_banner_sml.gif'
  WHEN '/images/CheapEatsBanner_120x80.gif' THEN '/images/businesses/legacy-promotional-banners/CheapEatsBanner_120x80.gif'
  WHEN '/images/dancebanner_ani_120x80.gif' THEN '/images/businesses/legacy-promotional-banners/dancebanner_ani_120x80.gif'
  WHEN '/images/dancepromo7.gif' THEN '/images/businesses/legacy-promotional-banners/dancepromo7.gif'
  WHEN '/images/Dancexpo_banner_links.gif' THEN '/images/businesses/legacy-promotional-banners/Dancexpo_banner_links.gif'
  WHEN '/images/e4s-icon.png' THEN '/images/site/brand/e4s-icon.png'
  WHEN '/images/e4s-logo_new.png' THEN '/images/site/brand/e4s-logo_new.png'
  WHEN '/images/e4s-network.gif' THEN '/images/junk/e4s-old-site-assets/e4s-network.gif'
  WHEN '/images/emag_header07.gif' THEN '/images/junk/legacy-page-art/emag_header07.gif'
  WHEN '/images/emag_headerb07.gif' THEN '/images/junk/legacy-page-art/emag_headerb07.gif'
  WHEN '/images/events4singles-72x468x60.gif' THEN '/images/businesses/legacy-promotional-banners/events4singles-72x468x60.gif'
  WHEN '/images/Flash Title with photo2.jpg' THEN '/images/junk/legacy-page-art/Flash Title with photo2.jpg'
  WHEN '/images/flashbacks-tile.gif' THEN '/images/junk/legacy-page-art/flashbacks-tile.gif'
  WHEN '/images/funnightout_468x55.gif' THEN '/images/businesses/legacy-promotional-banners/funnightout_468x55.gif'
  WHEN '/images/header_img_1.jpg' THEN '/images/junk/legacy-page-art/header_img_1.jpg'
  WHEN '/images/header_logo.gif' THEN '/images/junk/legacy-page-art/header_logo.gif'
  WHEN '/images/header2_newletter_imageconf.gif' THEN '/images/junk/legacy-page-art/header2_newletter_imageconf.gif'
  WHEN '/images/header3_newletter_jinglebel.gif' THEN '/images/junk/legacy-page-art/header3_newletter_jinglebel.gif'
  WHEN '/images/header4_newletter_apr07.jpg' THEN '/images/junk/legacy-page-art/header4_newletter_apr07.jpg'
  WHEN '/images/header4_newletter_isfearkee.gif' THEN '/images/junk/legacy-page-art/header4_newletter_isfearkee.gif'
  WHEN '/images/header4_newletter_love_look.gif' THEN '/images/junk/legacy-page-art/header4_newletter_love_look.gif'
  WHEN '/images/horoscope-72x468x40.gif' THEN '/images/businesses/legacy-promotional-banners/horoscope-72x468x40.gif'
  WHEN '/images/horoscopeALL-72x468x60.gif' THEN '/images/businesses/legacy-promotional-banners/horoscopeALL-72x468x60.gif'
  WHEN '/images/indepthgirlsdemo.gif' THEN '/images/junk/legacy-page-art/indepthgirlsdemo.gif'
  WHEN '/images/inspiringindv_468x58.gif' THEN '/images/businesses/legacy-promotional-banners/inspiringindv_468x58.gif'
  WHEN '/images/inviteonly_760x80.gif' THEN '/images/businesses/legacy-promotional-banners/inviteonly_760x80.gif'
  WHEN '/images/juice banner 150x85.gif' THEN '/images/businesses/legacy-promotional-banners/juice banner 150x85.gif'
  WHEN '/images/lgo_jsi-banner_120X80.jpg' THEN '/images/businesses/legacy-promotional-banners/lgo_jsi-banner_120X80.jpg'
  WHEN '/images/linkbanner2.gif' THEN '/images/businesses/legacy-promotional-banners/linkbanner2.gif'
  WHEN '/images/logo_e4s_white.jpg' THEN '/images/junk/e4s-old-site-assets/logo_e4s_white.jpg'
  WHEN '/images/logo1a_e4s_us.gif' THEN '/images/junk/e4s-old-site-assets/logo1a_e4s_us.gif'
  WHEN '/images/lms_ban1.gif' THEN '/images/junk/legacy-page-art/lms_ban1.gif'
  WHEN '/images/lms-btn-01.gif' THEN '/images/junk/legacy-page-art/lms-btn-01.gif'
  WHEN '/images/lmscollage.gif' THEN '/images/junk/legacy-page-art/lmscollage.gif'
  WHEN '/images/lmsp01.gif' THEN '/images/junk/legacy-page-art/lmsp01.gif'
  WHEN '/images/lovecology_web_banner_260x80.png' THEN '/images/businesses/legacy-promotional-banners/lovecology_web_banner_260x80.png'
  WHEN '/images/main_banner.gif' THEN '/images/businesses/legacy-promotional-banners/main_banner.gif'
  WHEN '/images/Masters-Banner.jpg' THEN '/images/businesses/legacy-promotional-banners/Masters-Banner.jpg'
  WHEN '/images/may-ball-web-header-flat.gif' THEN '/images/junk/legacy-page-art/may-ball-web-header-flat.gif'
  WHEN '/images/menasanimals_145x85.gif' THEN '/images/junk/legacy-page-art/menasanimals_145x85.gif'
  WHEN '/images/menasanimals_170x100.jpg' THEN '/images/junk/legacy-page-art/menasanimals_170x100.jpg'
  WHEN '/images/MRTV_header_big.jpg' THEN '/images/junk/legacy-page-art/MRTV_header_big.jpg'
  WHEN '/images/MRTV_header.jpg' THEN '/images/junk/legacy-page-art/MRTV_header.jpg'
  WHEN '/images/ozeworldbanner.gif' THEN '/images/businesses/legacy-promotional-banners/ozeworldbanner.gif'
  WHEN '/images/personalse4s_img1.jpg' THEN '/images/junk/e4s-old-site-assets/personalse4s_img1.jpg'
  WHEN '/images/personalse4s_img2.gif' THEN '/images/junk/e4s-old-site-assets/personalse4s_img2.gif'
  WHEN '/images/phoenixbanner.jpg' THEN '/images/businesses/legacy-promotional-banners/phoenixbanner.jpg'
  WHEN '/images/Red-Ball-Banner-ani.gif' THEN '/images/businesses/legacy-promotional-banners/Red-Ball-Banner-ani.gif'
  WHEN '/images/RedBaloon468x60.gif' THEN '/images/businesses/legacy-promotional-banners/RedBaloon468x60.gif'
  WHEN '/images/romance4milliionare_bannera.gif' THEN '/images/businesses/legacy-promotional-banners/romance4milliionare_bannera.gif'
  WHEN '/images/sandpiper468x60.gif' THEN '/images/businesses/legacy-promotional-banners/sandpiper468x60.gif'
  WHEN '/images/shoppingbanner.gif' THEN '/images/businesses/legacy-promotional-banners/shoppingbanner.gif'
  WHEN '/images/simplydrinks_760x80_penult.gif' THEN '/images/businesses/legacy-promotional-banners/simplydrinks_760x80_penult.gif'
  WHEN '/images/simplydrinks_ani_760x80_pen.gif' THEN '/images/businesses/legacy-promotional-banners/simplydrinks_ani_760x80_pen.gif'
  WHEN '/images/Simplysolo_banner1.gif' THEN '/images/businesses/legacy-promotional-banners/Simplysolo_banner1.gif'
  WHEN '/images/speed-date-banner_2.gif' THEN '/images/businesses/legacy-promotional-banners/speed-date-banner_2.gif'
  WHEN '/images/speed-date-banner-add-_468x.gif' THEN '/images/businesses/legacy-promotional-banners/speed-date-banner-add-_468x.gif'
  WHEN '/images/ssbanner2.gif' THEN '/images/businesses/legacy-promotional-banners/ssbanner2.gif'
  WHEN '/images/stayinbedbanner_468x60.jpg' THEN '/images/businesses/legacy-promotional-banners/stayinbedbanner_468x60.jpg'
  WHEN '/images/thingstodobanner.gif' THEN '/images/businesses/legacy-promotional-banners/thingstodobanner.gif'
  WHEN '/images/tsc_banner_ani80x430.gif' THEN '/images/businesses/legacy-promotional-banners/tsc_banner_ani80x430.gif'
  WHEN '/images/vivacity_600x151.gif' THEN '/images/businesses/legacy-promotional-banners/vivacity_600x151.gif'
  WHEN '/images/vmsd-longbanner.jpg' THEN '/images/businesses/legacy-promotional-banners/vmsd-longbanner.jpg'
  WHEN '/images/vmsd-longbanner2.jpg' THEN '/images/businesses/legacy-promotional-banners/vmsd-longbanner2.jpg'
  WHEN '/images/Web_banner_fhmx.gif' THEN '/images/businesses/legacy-promotional-banners/Web_banner_fhmx.gif'
  WHEN '/images/Web_banner_fhmx.jpg' THEN '/images/businesses/legacy-promotional-banners/Web_banner_fhmx.jpg'
  WHEN '/images/webbanner_singlelife.jpg' THEN '/images/businesses/legacy-promotional-banners/webbanner_singlelife.jpg'
  WHEN '/images/woolwichwalks_top_frame.jpg' THEN '/images/businesses/legacy-promotional-banners/woolwichwalks_top_frame.jpg'
  WHEN '/images/worlddate_760x130.jpg' THEN '/images/businesses/legacy-promotional-banners/worlddate_760x130.jpg'
  WHEN '/images/youand1_760x80.gif' THEN '/images/businesses/legacy-promotional-banners/youand1_760x80.gif'
  WHEN '/images/youandi_760x80.gif' THEN '/images/businesses/legacy-promotional-banners/youandi_760x80.gif'
  ELSE hero_image_url
END
WHERE hero_image_url IN ('/images/468x60_kiss_goodbye.gif', '/images/468x60_whereisthelove.gif', '/images/8ball-banner_120x80.gif', '/images/8ball-dating_banner_ani_123.gif', '/images/adpromo1.gif', '/images/amoureux_banner110x118.jpg', '/images/atable4six-new_430x179.jpg', '/images/banner_120x80_ani.gif', '/images/banner_e4ddancing6.gif', '/images/banner_e4ddancing9.gif', '/images/banner_joine4s.jpg', '/images/blink_600x100.gif', '/images/blink_banner_449x79.jpg', '/images/blink_banner_sml.gif', '/images/CheapEatsBanner_120x80.gif', '/images/dancebanner_ani_120x80.gif', '/images/dancepromo7.gif', '/images/Dancexpo_banner_links.gif', '/images/e4s-icon.png', '/images/e4s-logo_new.png', '/images/e4s-network.gif', '/images/emag_header07.gif', '/images/emag_headerb07.gif', '/images/events4singles-72x468x60.gif', '/images/Flash Title with photo2.jpg', '/images/flashbacks-tile.gif', '/images/funnightout_468x55.gif', '/images/header_img_1.jpg', '/images/header_logo.gif', '/images/header2_newletter_imageconf.gif', '/images/header3_newletter_jinglebel.gif', '/images/header4_newletter_apr07.jpg', '/images/header4_newletter_isfearkee.gif', '/images/header4_newletter_love_look.gif', '/images/horoscope-72x468x40.gif', '/images/horoscopeALL-72x468x60.gif', '/images/indepthgirlsdemo.gif', '/images/inspiringindv_468x58.gif', '/images/inviteonly_760x80.gif', '/images/juice banner 150x85.gif', '/images/lgo_jsi-banner_120X80.jpg', '/images/linkbanner2.gif', '/images/logo_e4s_white.jpg', '/images/logo1a_e4s_us.gif', '/images/lms_ban1.gif', '/images/lms-btn-01.gif', '/images/lmscollage.gif', '/images/lmsp01.gif', '/images/lovecology_web_banner_260x80.png', '/images/main_banner.gif', '/images/Masters-Banner.jpg', '/images/may-ball-web-header-flat.gif', '/images/menasanimals_145x85.gif', '/images/menasanimals_170x100.jpg', '/images/MRTV_header_big.jpg', '/images/MRTV_header.jpg', '/images/ozeworldbanner.gif', '/images/personalse4s_img1.jpg', '/images/personalse4s_img2.gif', '/images/phoenixbanner.jpg', '/images/Red-Ball-Banner-ani.gif', '/images/RedBaloon468x60.gif', '/images/romance4milliionare_bannera.gif', '/images/sandpiper468x60.gif', '/images/shoppingbanner.gif', '/images/simplydrinks_760x80_penult.gif', '/images/simplydrinks_ani_760x80_pen.gif', '/images/Simplysolo_banner1.gif', '/images/speed-date-banner_2.gif', '/images/speed-date-banner-add-_468x.gif', '/images/ssbanner2.gif', '/images/stayinbedbanner_468x60.jpg', '/images/thingstodobanner.gif', '/images/tsc_banner_ani80x430.gif', '/images/vivacity_600x151.gif', '/images/vmsd-longbanner.jpg', '/images/vmsd-longbanner2.jpg', '/images/Web_banner_fhmx.gif', '/images/Web_banner_fhmx.jpg', '/images/webbanner_singlelife.jpg', '/images/woolwichwalks_top_frame.jpg', '/images/worlddate_760x130.jpg', '/images/youand1_760x80.gif', '/images/youandi_760x80.gif');

UPDATE listings
SET image_url = CASE image_url
  WHEN '/images/468x60_kiss_goodbye.gif' THEN '/images/businesses/legacy-promotional-banners/468x60_kiss_goodbye.gif'
  WHEN '/images/468x60_whereisthelove.gif' THEN '/images/businesses/legacy-promotional-banners/468x60_whereisthelove.gif'
  WHEN '/images/8ball-banner_120x80.gif' THEN '/images/businesses/legacy-promotional-banners/8ball-banner_120x80.gif'
  WHEN '/images/8ball-dating_banner_ani_123.gif' THEN '/images/businesses/legacy-promotional-banners/8ball-dating_banner_ani_123.gif'
  WHEN '/images/adpromo1.gif' THEN '/images/businesses/legacy-promotional-banners/adpromo1.gif'
  WHEN '/images/amoureux_banner110x118.jpg' THEN '/images/businesses/legacy-promotional-banners/amoureux_banner110x118.jpg'
  WHEN '/images/atable4six-new_430x179.jpg' THEN '/images/businesses/legacy-promotional-banners/atable4six-new_430x179.jpg'
  WHEN '/images/banner_120x80_ani.gif' THEN '/images/businesses/legacy-promotional-banners/banner_120x80_ani.gif'
  WHEN '/images/banner_e4ddancing6.gif' THEN '/images/businesses/legacy-promotional-banners/banner_e4ddancing6.gif'
  WHEN '/images/banner_e4ddancing9.gif' THEN '/images/businesses/legacy-promotional-banners/banner_e4ddancing9.gif'
  WHEN '/images/banner_joine4s.jpg' THEN '/images/businesses/legacy-promotional-banners/banner_joine4s.jpg'
  WHEN '/images/blink_600x100.gif' THEN '/images/businesses/legacy-promotional-banners/blink_600x100.gif'
  WHEN '/images/blink_banner_449x79.jpg' THEN '/images/businesses/legacy-promotional-banners/blink_banner_449x79.jpg'
  WHEN '/images/blink_banner_sml.gif' THEN '/images/businesses/legacy-promotional-banners/blink_banner_sml.gif'
  WHEN '/images/CheapEatsBanner_120x80.gif' THEN '/images/businesses/legacy-promotional-banners/CheapEatsBanner_120x80.gif'
  WHEN '/images/dancebanner_ani_120x80.gif' THEN '/images/businesses/legacy-promotional-banners/dancebanner_ani_120x80.gif'
  WHEN '/images/dancepromo7.gif' THEN '/images/businesses/legacy-promotional-banners/dancepromo7.gif'
  WHEN '/images/Dancexpo_banner_links.gif' THEN '/images/businesses/legacy-promotional-banners/Dancexpo_banner_links.gif'
  WHEN '/images/e4s-icon.png' THEN '/images/site/brand/e4s-icon.png'
  WHEN '/images/e4s-logo_new.png' THEN '/images/site/brand/e4s-logo_new.png'
  WHEN '/images/e4s-network.gif' THEN '/images/junk/e4s-old-site-assets/e4s-network.gif'
  WHEN '/images/emag_header07.gif' THEN '/images/junk/legacy-page-art/emag_header07.gif'
  WHEN '/images/emag_headerb07.gif' THEN '/images/junk/legacy-page-art/emag_headerb07.gif'
  WHEN '/images/events4singles-72x468x60.gif' THEN '/images/businesses/legacy-promotional-banners/events4singles-72x468x60.gif'
  WHEN '/images/Flash Title with photo2.jpg' THEN '/images/junk/legacy-page-art/Flash Title with photo2.jpg'
  WHEN '/images/flashbacks-tile.gif' THEN '/images/junk/legacy-page-art/flashbacks-tile.gif'
  WHEN '/images/funnightout_468x55.gif' THEN '/images/businesses/legacy-promotional-banners/funnightout_468x55.gif'
  WHEN '/images/header_img_1.jpg' THEN '/images/junk/legacy-page-art/header_img_1.jpg'
  WHEN '/images/header_logo.gif' THEN '/images/junk/legacy-page-art/header_logo.gif'
  WHEN '/images/header2_newletter_imageconf.gif' THEN '/images/junk/legacy-page-art/header2_newletter_imageconf.gif'
  WHEN '/images/header3_newletter_jinglebel.gif' THEN '/images/junk/legacy-page-art/header3_newletter_jinglebel.gif'
  WHEN '/images/header4_newletter_apr07.jpg' THEN '/images/junk/legacy-page-art/header4_newletter_apr07.jpg'
  WHEN '/images/header4_newletter_isfearkee.gif' THEN '/images/junk/legacy-page-art/header4_newletter_isfearkee.gif'
  WHEN '/images/header4_newletter_love_look.gif' THEN '/images/junk/legacy-page-art/header4_newletter_love_look.gif'
  WHEN '/images/horoscope-72x468x40.gif' THEN '/images/businesses/legacy-promotional-banners/horoscope-72x468x40.gif'
  WHEN '/images/horoscopeALL-72x468x60.gif' THEN '/images/businesses/legacy-promotional-banners/horoscopeALL-72x468x60.gif'
  WHEN '/images/indepthgirlsdemo.gif' THEN '/images/junk/legacy-page-art/indepthgirlsdemo.gif'
  WHEN '/images/inspiringindv_468x58.gif' THEN '/images/businesses/legacy-promotional-banners/inspiringindv_468x58.gif'
  WHEN '/images/inviteonly_760x80.gif' THEN '/images/businesses/legacy-promotional-banners/inviteonly_760x80.gif'
  WHEN '/images/juice banner 150x85.gif' THEN '/images/businesses/legacy-promotional-banners/juice banner 150x85.gif'
  WHEN '/images/lgo_jsi-banner_120X80.jpg' THEN '/images/businesses/legacy-promotional-banners/lgo_jsi-banner_120X80.jpg'
  WHEN '/images/linkbanner2.gif' THEN '/images/businesses/legacy-promotional-banners/linkbanner2.gif'
  WHEN '/images/logo_e4s_white.jpg' THEN '/images/junk/e4s-old-site-assets/logo_e4s_white.jpg'
  WHEN '/images/logo1a_e4s_us.gif' THEN '/images/junk/e4s-old-site-assets/logo1a_e4s_us.gif'
  WHEN '/images/lms_ban1.gif' THEN '/images/junk/legacy-page-art/lms_ban1.gif'
  WHEN '/images/lms-btn-01.gif' THEN '/images/junk/legacy-page-art/lms-btn-01.gif'
  WHEN '/images/lmscollage.gif' THEN '/images/junk/legacy-page-art/lmscollage.gif'
  WHEN '/images/lmsp01.gif' THEN '/images/junk/legacy-page-art/lmsp01.gif'
  WHEN '/images/lovecology_web_banner_260x80.png' THEN '/images/businesses/legacy-promotional-banners/lovecology_web_banner_260x80.png'
  WHEN '/images/main_banner.gif' THEN '/images/businesses/legacy-promotional-banners/main_banner.gif'
  WHEN '/images/Masters-Banner.jpg' THEN '/images/businesses/legacy-promotional-banners/Masters-Banner.jpg'
  WHEN '/images/may-ball-web-header-flat.gif' THEN '/images/junk/legacy-page-art/may-ball-web-header-flat.gif'
  WHEN '/images/menasanimals_145x85.gif' THEN '/images/junk/legacy-page-art/menasanimals_145x85.gif'
  WHEN '/images/menasanimals_170x100.jpg' THEN '/images/junk/legacy-page-art/menasanimals_170x100.jpg'
  WHEN '/images/MRTV_header_big.jpg' THEN '/images/junk/legacy-page-art/MRTV_header_big.jpg'
  WHEN '/images/MRTV_header.jpg' THEN '/images/junk/legacy-page-art/MRTV_header.jpg'
  WHEN '/images/ozeworldbanner.gif' THEN '/images/businesses/legacy-promotional-banners/ozeworldbanner.gif'
  WHEN '/images/personalse4s_img1.jpg' THEN '/images/junk/e4s-old-site-assets/personalse4s_img1.jpg'
  WHEN '/images/personalse4s_img2.gif' THEN '/images/junk/e4s-old-site-assets/personalse4s_img2.gif'
  WHEN '/images/phoenixbanner.jpg' THEN '/images/businesses/legacy-promotional-banners/phoenixbanner.jpg'
  WHEN '/images/Red-Ball-Banner-ani.gif' THEN '/images/businesses/legacy-promotional-banners/Red-Ball-Banner-ani.gif'
  WHEN '/images/RedBaloon468x60.gif' THEN '/images/businesses/legacy-promotional-banners/RedBaloon468x60.gif'
  WHEN '/images/romance4milliionare_bannera.gif' THEN '/images/businesses/legacy-promotional-banners/romance4milliionare_bannera.gif'
  WHEN '/images/sandpiper468x60.gif' THEN '/images/businesses/legacy-promotional-banners/sandpiper468x60.gif'
  WHEN '/images/shoppingbanner.gif' THEN '/images/businesses/legacy-promotional-banners/shoppingbanner.gif'
  WHEN '/images/simplydrinks_760x80_penult.gif' THEN '/images/businesses/legacy-promotional-banners/simplydrinks_760x80_penult.gif'
  WHEN '/images/simplydrinks_ani_760x80_pen.gif' THEN '/images/businesses/legacy-promotional-banners/simplydrinks_ani_760x80_pen.gif'
  WHEN '/images/Simplysolo_banner1.gif' THEN '/images/businesses/legacy-promotional-banners/Simplysolo_banner1.gif'
  WHEN '/images/speed-date-banner_2.gif' THEN '/images/businesses/legacy-promotional-banners/speed-date-banner_2.gif'
  WHEN '/images/speed-date-banner-add-_468x.gif' THEN '/images/businesses/legacy-promotional-banners/speed-date-banner-add-_468x.gif'
  WHEN '/images/ssbanner2.gif' THEN '/images/businesses/legacy-promotional-banners/ssbanner2.gif'
  WHEN '/images/stayinbedbanner_468x60.jpg' THEN '/images/businesses/legacy-promotional-banners/stayinbedbanner_468x60.jpg'
  WHEN '/images/thingstodobanner.gif' THEN '/images/businesses/legacy-promotional-banners/thingstodobanner.gif'
  WHEN '/images/tsc_banner_ani80x430.gif' THEN '/images/businesses/legacy-promotional-banners/tsc_banner_ani80x430.gif'
  WHEN '/images/vivacity_600x151.gif' THEN '/images/businesses/legacy-promotional-banners/vivacity_600x151.gif'
  WHEN '/images/vmsd-longbanner.jpg' THEN '/images/businesses/legacy-promotional-banners/vmsd-longbanner.jpg'
  WHEN '/images/vmsd-longbanner2.jpg' THEN '/images/businesses/legacy-promotional-banners/vmsd-longbanner2.jpg'
  WHEN '/images/Web_banner_fhmx.gif' THEN '/images/businesses/legacy-promotional-banners/Web_banner_fhmx.gif'
  WHEN '/images/Web_banner_fhmx.jpg' THEN '/images/businesses/legacy-promotional-banners/Web_banner_fhmx.jpg'
  WHEN '/images/webbanner_singlelife.jpg' THEN '/images/businesses/legacy-promotional-banners/webbanner_singlelife.jpg'
  WHEN '/images/woolwichwalks_top_frame.jpg' THEN '/images/businesses/legacy-promotional-banners/woolwichwalks_top_frame.jpg'
  WHEN '/images/worlddate_760x130.jpg' THEN '/images/businesses/legacy-promotional-banners/worlddate_760x130.jpg'
  WHEN '/images/youand1_760x80.gif' THEN '/images/businesses/legacy-promotional-banners/youand1_760x80.gif'
  WHEN '/images/youandi_760x80.gif' THEN '/images/businesses/legacy-promotional-banners/youandi_760x80.gif'
  ELSE image_url
END
WHERE image_url IN ('/images/468x60_kiss_goodbye.gif', '/images/468x60_whereisthelove.gif', '/images/8ball-banner_120x80.gif', '/images/8ball-dating_banner_ani_123.gif', '/images/adpromo1.gif', '/images/amoureux_banner110x118.jpg', '/images/atable4six-new_430x179.jpg', '/images/banner_120x80_ani.gif', '/images/banner_e4ddancing6.gif', '/images/banner_e4ddancing9.gif', '/images/banner_joine4s.jpg', '/images/blink_600x100.gif', '/images/blink_banner_449x79.jpg', '/images/blink_banner_sml.gif', '/images/CheapEatsBanner_120x80.gif', '/images/dancebanner_ani_120x80.gif', '/images/dancepromo7.gif', '/images/Dancexpo_banner_links.gif', '/images/e4s-icon.png', '/images/e4s-logo_new.png', '/images/e4s-network.gif', '/images/emag_header07.gif', '/images/emag_headerb07.gif', '/images/events4singles-72x468x60.gif', '/images/Flash Title with photo2.jpg', '/images/flashbacks-tile.gif', '/images/funnightout_468x55.gif', '/images/header_img_1.jpg', '/images/header_logo.gif', '/images/header2_newletter_imageconf.gif', '/images/header3_newletter_jinglebel.gif', '/images/header4_newletter_apr07.jpg', '/images/header4_newletter_isfearkee.gif', '/images/header4_newletter_love_look.gif', '/images/horoscope-72x468x40.gif', '/images/horoscopeALL-72x468x60.gif', '/images/indepthgirlsdemo.gif', '/images/inspiringindv_468x58.gif', '/images/inviteonly_760x80.gif', '/images/juice banner 150x85.gif', '/images/lgo_jsi-banner_120X80.jpg', '/images/linkbanner2.gif', '/images/logo_e4s_white.jpg', '/images/logo1a_e4s_us.gif', '/images/lms_ban1.gif', '/images/lms-btn-01.gif', '/images/lmscollage.gif', '/images/lmsp01.gif', '/images/lovecology_web_banner_260x80.png', '/images/main_banner.gif', '/images/Masters-Banner.jpg', '/images/may-ball-web-header-flat.gif', '/images/menasanimals_145x85.gif', '/images/menasanimals_170x100.jpg', '/images/MRTV_header_big.jpg', '/images/MRTV_header.jpg', '/images/ozeworldbanner.gif', '/images/personalse4s_img1.jpg', '/images/personalse4s_img2.gif', '/images/phoenixbanner.jpg', '/images/Red-Ball-Banner-ani.gif', '/images/RedBaloon468x60.gif', '/images/romance4milliionare_bannera.gif', '/images/sandpiper468x60.gif', '/images/shoppingbanner.gif', '/images/simplydrinks_760x80_penult.gif', '/images/simplydrinks_ani_760x80_pen.gif', '/images/Simplysolo_banner1.gif', '/images/speed-date-banner_2.gif', '/images/speed-date-banner-add-_468x.gif', '/images/ssbanner2.gif', '/images/stayinbedbanner_468x60.jpg', '/images/thingstodobanner.gif', '/images/tsc_banner_ani80x430.gif', '/images/vivacity_600x151.gif', '/images/vmsd-longbanner.jpg', '/images/vmsd-longbanner2.jpg', '/images/Web_banner_fhmx.gif', '/images/Web_banner_fhmx.jpg', '/images/webbanner_singlelife.jpg', '/images/woolwichwalks_top_frame.jpg', '/images/worlddate_760x130.jpg', '/images/youand1_760x80.gif', '/images/youandi_760x80.gif');

UPDATE businesses
SET logo_url = CASE logo_url
  WHEN '/images/468x60_kiss_goodbye.gif' THEN '/images/businesses/legacy-promotional-banners/468x60_kiss_goodbye.gif'
  WHEN '/images/468x60_whereisthelove.gif' THEN '/images/businesses/legacy-promotional-banners/468x60_whereisthelove.gif'
  WHEN '/images/8ball-banner_120x80.gif' THEN '/images/businesses/legacy-promotional-banners/8ball-banner_120x80.gif'
  WHEN '/images/8ball-dating_banner_ani_123.gif' THEN '/images/businesses/legacy-promotional-banners/8ball-dating_banner_ani_123.gif'
  WHEN '/images/adpromo1.gif' THEN '/images/businesses/legacy-promotional-banners/adpromo1.gif'
  WHEN '/images/amoureux_banner110x118.jpg' THEN '/images/businesses/legacy-promotional-banners/amoureux_banner110x118.jpg'
  WHEN '/images/atable4six-new_430x179.jpg' THEN '/images/businesses/legacy-promotional-banners/atable4six-new_430x179.jpg'
  WHEN '/images/banner_120x80_ani.gif' THEN '/images/businesses/legacy-promotional-banners/banner_120x80_ani.gif'
  WHEN '/images/banner_e4ddancing6.gif' THEN '/images/businesses/legacy-promotional-banners/banner_e4ddancing6.gif'
  WHEN '/images/banner_e4ddancing9.gif' THEN '/images/businesses/legacy-promotional-banners/banner_e4ddancing9.gif'
  WHEN '/images/banner_joine4s.jpg' THEN '/images/businesses/legacy-promotional-banners/banner_joine4s.jpg'
  WHEN '/images/blink_600x100.gif' THEN '/images/businesses/legacy-promotional-banners/blink_600x100.gif'
  WHEN '/images/blink_banner_449x79.jpg' THEN '/images/businesses/legacy-promotional-banners/blink_banner_449x79.jpg'
  WHEN '/images/blink_banner_sml.gif' THEN '/images/businesses/legacy-promotional-banners/blink_banner_sml.gif'
  WHEN '/images/CheapEatsBanner_120x80.gif' THEN '/images/businesses/legacy-promotional-banners/CheapEatsBanner_120x80.gif'
  WHEN '/images/dancebanner_ani_120x80.gif' THEN '/images/businesses/legacy-promotional-banners/dancebanner_ani_120x80.gif'
  WHEN '/images/dancepromo7.gif' THEN '/images/businesses/legacy-promotional-banners/dancepromo7.gif'
  WHEN '/images/Dancexpo_banner_links.gif' THEN '/images/businesses/legacy-promotional-banners/Dancexpo_banner_links.gif'
  WHEN '/images/e4s-icon.png' THEN '/images/site/brand/e4s-icon.png'
  WHEN '/images/e4s-logo_new.png' THEN '/images/site/brand/e4s-logo_new.png'
  WHEN '/images/e4s-network.gif' THEN '/images/junk/e4s-old-site-assets/e4s-network.gif'
  WHEN '/images/emag_header07.gif' THEN '/images/junk/legacy-page-art/emag_header07.gif'
  WHEN '/images/emag_headerb07.gif' THEN '/images/junk/legacy-page-art/emag_headerb07.gif'
  WHEN '/images/events4singles-72x468x60.gif' THEN '/images/businesses/legacy-promotional-banners/events4singles-72x468x60.gif'
  WHEN '/images/Flash Title with photo2.jpg' THEN '/images/junk/legacy-page-art/Flash Title with photo2.jpg'
  WHEN '/images/flashbacks-tile.gif' THEN '/images/junk/legacy-page-art/flashbacks-tile.gif'
  WHEN '/images/funnightout_468x55.gif' THEN '/images/businesses/legacy-promotional-banners/funnightout_468x55.gif'
  WHEN '/images/header_img_1.jpg' THEN '/images/junk/legacy-page-art/header_img_1.jpg'
  WHEN '/images/header_logo.gif' THEN '/images/junk/legacy-page-art/header_logo.gif'
  WHEN '/images/header2_newletter_imageconf.gif' THEN '/images/junk/legacy-page-art/header2_newletter_imageconf.gif'
  WHEN '/images/header3_newletter_jinglebel.gif' THEN '/images/junk/legacy-page-art/header3_newletter_jinglebel.gif'
  WHEN '/images/header4_newletter_apr07.jpg' THEN '/images/junk/legacy-page-art/header4_newletter_apr07.jpg'
  WHEN '/images/header4_newletter_isfearkee.gif' THEN '/images/junk/legacy-page-art/header4_newletter_isfearkee.gif'
  WHEN '/images/header4_newletter_love_look.gif' THEN '/images/junk/legacy-page-art/header4_newletter_love_look.gif'
  WHEN '/images/horoscope-72x468x40.gif' THEN '/images/businesses/legacy-promotional-banners/horoscope-72x468x40.gif'
  WHEN '/images/horoscopeALL-72x468x60.gif' THEN '/images/businesses/legacy-promotional-banners/horoscopeALL-72x468x60.gif'
  WHEN '/images/indepthgirlsdemo.gif' THEN '/images/junk/legacy-page-art/indepthgirlsdemo.gif'
  WHEN '/images/inspiringindv_468x58.gif' THEN '/images/businesses/legacy-promotional-banners/inspiringindv_468x58.gif'
  WHEN '/images/inviteonly_760x80.gif' THEN '/images/businesses/legacy-promotional-banners/inviteonly_760x80.gif'
  WHEN '/images/juice banner 150x85.gif' THEN '/images/businesses/legacy-promotional-banners/juice banner 150x85.gif'
  WHEN '/images/lgo_jsi-banner_120X80.jpg' THEN '/images/businesses/legacy-promotional-banners/lgo_jsi-banner_120X80.jpg'
  WHEN '/images/linkbanner2.gif' THEN '/images/businesses/legacy-promotional-banners/linkbanner2.gif'
  WHEN '/images/logo_e4s_white.jpg' THEN '/images/junk/e4s-old-site-assets/logo_e4s_white.jpg'
  WHEN '/images/logo1a_e4s_us.gif' THEN '/images/junk/e4s-old-site-assets/logo1a_e4s_us.gif'
  WHEN '/images/lms_ban1.gif' THEN '/images/junk/legacy-page-art/lms_ban1.gif'
  WHEN '/images/lms-btn-01.gif' THEN '/images/junk/legacy-page-art/lms-btn-01.gif'
  WHEN '/images/lmscollage.gif' THEN '/images/junk/legacy-page-art/lmscollage.gif'
  WHEN '/images/lmsp01.gif' THEN '/images/junk/legacy-page-art/lmsp01.gif'
  WHEN '/images/lovecology_web_banner_260x80.png' THEN '/images/businesses/legacy-promotional-banners/lovecology_web_banner_260x80.png'
  WHEN '/images/main_banner.gif' THEN '/images/businesses/legacy-promotional-banners/main_banner.gif'
  WHEN '/images/Masters-Banner.jpg' THEN '/images/businesses/legacy-promotional-banners/Masters-Banner.jpg'
  WHEN '/images/may-ball-web-header-flat.gif' THEN '/images/junk/legacy-page-art/may-ball-web-header-flat.gif'
  WHEN '/images/menasanimals_145x85.gif' THEN '/images/junk/legacy-page-art/menasanimals_145x85.gif'
  WHEN '/images/menasanimals_170x100.jpg' THEN '/images/junk/legacy-page-art/menasanimals_170x100.jpg'
  WHEN '/images/MRTV_header_big.jpg' THEN '/images/junk/legacy-page-art/MRTV_header_big.jpg'
  WHEN '/images/MRTV_header.jpg' THEN '/images/junk/legacy-page-art/MRTV_header.jpg'
  WHEN '/images/ozeworldbanner.gif' THEN '/images/businesses/legacy-promotional-banners/ozeworldbanner.gif'
  WHEN '/images/personalse4s_img1.jpg' THEN '/images/junk/e4s-old-site-assets/personalse4s_img1.jpg'
  WHEN '/images/personalse4s_img2.gif' THEN '/images/junk/e4s-old-site-assets/personalse4s_img2.gif'
  WHEN '/images/phoenixbanner.jpg' THEN '/images/businesses/legacy-promotional-banners/phoenixbanner.jpg'
  WHEN '/images/Red-Ball-Banner-ani.gif' THEN '/images/businesses/legacy-promotional-banners/Red-Ball-Banner-ani.gif'
  WHEN '/images/RedBaloon468x60.gif' THEN '/images/businesses/legacy-promotional-banners/RedBaloon468x60.gif'
  WHEN '/images/romance4milliionare_bannera.gif' THEN '/images/businesses/legacy-promotional-banners/romance4milliionare_bannera.gif'
  WHEN '/images/sandpiper468x60.gif' THEN '/images/businesses/legacy-promotional-banners/sandpiper468x60.gif'
  WHEN '/images/shoppingbanner.gif' THEN '/images/businesses/legacy-promotional-banners/shoppingbanner.gif'
  WHEN '/images/simplydrinks_760x80_penult.gif' THEN '/images/businesses/legacy-promotional-banners/simplydrinks_760x80_penult.gif'
  WHEN '/images/simplydrinks_ani_760x80_pen.gif' THEN '/images/businesses/legacy-promotional-banners/simplydrinks_ani_760x80_pen.gif'
  WHEN '/images/Simplysolo_banner1.gif' THEN '/images/businesses/legacy-promotional-banners/Simplysolo_banner1.gif'
  WHEN '/images/speed-date-banner_2.gif' THEN '/images/businesses/legacy-promotional-banners/speed-date-banner_2.gif'
  WHEN '/images/speed-date-banner-add-_468x.gif' THEN '/images/businesses/legacy-promotional-banners/speed-date-banner-add-_468x.gif'
  WHEN '/images/ssbanner2.gif' THEN '/images/businesses/legacy-promotional-banners/ssbanner2.gif'
  WHEN '/images/stayinbedbanner_468x60.jpg' THEN '/images/businesses/legacy-promotional-banners/stayinbedbanner_468x60.jpg'
  WHEN '/images/thingstodobanner.gif' THEN '/images/businesses/legacy-promotional-banners/thingstodobanner.gif'
  WHEN '/images/tsc_banner_ani80x430.gif' THEN '/images/businesses/legacy-promotional-banners/tsc_banner_ani80x430.gif'
  WHEN '/images/vivacity_600x151.gif' THEN '/images/businesses/legacy-promotional-banners/vivacity_600x151.gif'
  WHEN '/images/vmsd-longbanner.jpg' THEN '/images/businesses/legacy-promotional-banners/vmsd-longbanner.jpg'
  WHEN '/images/vmsd-longbanner2.jpg' THEN '/images/businesses/legacy-promotional-banners/vmsd-longbanner2.jpg'
  WHEN '/images/Web_banner_fhmx.gif' THEN '/images/businesses/legacy-promotional-banners/Web_banner_fhmx.gif'
  WHEN '/images/Web_banner_fhmx.jpg' THEN '/images/businesses/legacy-promotional-banners/Web_banner_fhmx.jpg'
  WHEN '/images/webbanner_singlelife.jpg' THEN '/images/businesses/legacy-promotional-banners/webbanner_singlelife.jpg'
  WHEN '/images/woolwichwalks_top_frame.jpg' THEN '/images/businesses/legacy-promotional-banners/woolwichwalks_top_frame.jpg'
  WHEN '/images/worlddate_760x130.jpg' THEN '/images/businesses/legacy-promotional-banners/worlddate_760x130.jpg'
  WHEN '/images/youand1_760x80.gif' THEN '/images/businesses/legacy-promotional-banners/youand1_760x80.gif'
  WHEN '/images/youandi_760x80.gif' THEN '/images/businesses/legacy-promotional-banners/youandi_760x80.gif'
  ELSE logo_url
END
WHERE logo_url IN ('/images/468x60_kiss_goodbye.gif', '/images/468x60_whereisthelove.gif', '/images/8ball-banner_120x80.gif', '/images/8ball-dating_banner_ani_123.gif', '/images/adpromo1.gif', '/images/amoureux_banner110x118.jpg', '/images/atable4six-new_430x179.jpg', '/images/banner_120x80_ani.gif', '/images/banner_e4ddancing6.gif', '/images/banner_e4ddancing9.gif', '/images/banner_joine4s.jpg', '/images/blink_600x100.gif', '/images/blink_banner_449x79.jpg', '/images/blink_banner_sml.gif', '/images/CheapEatsBanner_120x80.gif', '/images/dancebanner_ani_120x80.gif', '/images/dancepromo7.gif', '/images/Dancexpo_banner_links.gif', '/images/e4s-icon.png', '/images/e4s-logo_new.png', '/images/e4s-network.gif', '/images/emag_header07.gif', '/images/emag_headerb07.gif', '/images/events4singles-72x468x60.gif', '/images/Flash Title with photo2.jpg', '/images/flashbacks-tile.gif', '/images/funnightout_468x55.gif', '/images/header_img_1.jpg', '/images/header_logo.gif', '/images/header2_newletter_imageconf.gif', '/images/header3_newletter_jinglebel.gif', '/images/header4_newletter_apr07.jpg', '/images/header4_newletter_isfearkee.gif', '/images/header4_newletter_love_look.gif', '/images/horoscope-72x468x40.gif', '/images/horoscopeALL-72x468x60.gif', '/images/indepthgirlsdemo.gif', '/images/inspiringindv_468x58.gif', '/images/inviteonly_760x80.gif', '/images/juice banner 150x85.gif', '/images/lgo_jsi-banner_120X80.jpg', '/images/linkbanner2.gif', '/images/logo_e4s_white.jpg', '/images/logo1a_e4s_us.gif', '/images/lms_ban1.gif', '/images/lms-btn-01.gif', '/images/lmscollage.gif', '/images/lmsp01.gif', '/images/lovecology_web_banner_260x80.png', '/images/main_banner.gif', '/images/Masters-Banner.jpg', '/images/may-ball-web-header-flat.gif', '/images/menasanimals_145x85.gif', '/images/menasanimals_170x100.jpg', '/images/MRTV_header_big.jpg', '/images/MRTV_header.jpg', '/images/ozeworldbanner.gif', '/images/personalse4s_img1.jpg', '/images/personalse4s_img2.gif', '/images/phoenixbanner.jpg', '/images/Red-Ball-Banner-ani.gif', '/images/RedBaloon468x60.gif', '/images/romance4milliionare_bannera.gif', '/images/sandpiper468x60.gif', '/images/shoppingbanner.gif', '/images/simplydrinks_760x80_penult.gif', '/images/simplydrinks_ani_760x80_pen.gif', '/images/Simplysolo_banner1.gif', '/images/speed-date-banner_2.gif', '/images/speed-date-banner-add-_468x.gif', '/images/ssbanner2.gif', '/images/stayinbedbanner_468x60.jpg', '/images/thingstodobanner.gif', '/images/tsc_banner_ani80x430.gif', '/images/vivacity_600x151.gif', '/images/vmsd-longbanner.jpg', '/images/vmsd-longbanner2.jpg', '/images/Web_banner_fhmx.gif', '/images/Web_banner_fhmx.jpg', '/images/webbanner_singlelife.jpg', '/images/woolwichwalks_top_frame.jpg', '/images/worlddate_760x130.jpg', '/images/youand1_760x80.gif', '/images/youandi_760x80.gif');

UPDATE listing_images
SET url = CASE url
  WHEN '/images/468x60_kiss_goodbye.gif' THEN '/images/businesses/legacy-promotional-banners/468x60_kiss_goodbye.gif'
  WHEN '/images/468x60_whereisthelove.gif' THEN '/images/businesses/legacy-promotional-banners/468x60_whereisthelove.gif'
  WHEN '/images/8ball-banner_120x80.gif' THEN '/images/businesses/legacy-promotional-banners/8ball-banner_120x80.gif'
  WHEN '/images/8ball-dating_banner_ani_123.gif' THEN '/images/businesses/legacy-promotional-banners/8ball-dating_banner_ani_123.gif'
  WHEN '/images/adpromo1.gif' THEN '/images/businesses/legacy-promotional-banners/adpromo1.gif'
  WHEN '/images/amoureux_banner110x118.jpg' THEN '/images/businesses/legacy-promotional-banners/amoureux_banner110x118.jpg'
  WHEN '/images/atable4six-new_430x179.jpg' THEN '/images/businesses/legacy-promotional-banners/atable4six-new_430x179.jpg'
  WHEN '/images/banner_120x80_ani.gif' THEN '/images/businesses/legacy-promotional-banners/banner_120x80_ani.gif'
  WHEN '/images/banner_e4ddancing6.gif' THEN '/images/businesses/legacy-promotional-banners/banner_e4ddancing6.gif'
  WHEN '/images/banner_e4ddancing9.gif' THEN '/images/businesses/legacy-promotional-banners/banner_e4ddancing9.gif'
  WHEN '/images/banner_joine4s.jpg' THEN '/images/businesses/legacy-promotional-banners/banner_joine4s.jpg'
  WHEN '/images/blink_600x100.gif' THEN '/images/businesses/legacy-promotional-banners/blink_600x100.gif'
  WHEN '/images/blink_banner_449x79.jpg' THEN '/images/businesses/legacy-promotional-banners/blink_banner_449x79.jpg'
  WHEN '/images/blink_banner_sml.gif' THEN '/images/businesses/legacy-promotional-banners/blink_banner_sml.gif'
  WHEN '/images/CheapEatsBanner_120x80.gif' THEN '/images/businesses/legacy-promotional-banners/CheapEatsBanner_120x80.gif'
  WHEN '/images/dancebanner_ani_120x80.gif' THEN '/images/businesses/legacy-promotional-banners/dancebanner_ani_120x80.gif'
  WHEN '/images/dancepromo7.gif' THEN '/images/businesses/legacy-promotional-banners/dancepromo7.gif'
  WHEN '/images/Dancexpo_banner_links.gif' THEN '/images/businesses/legacy-promotional-banners/Dancexpo_banner_links.gif'
  WHEN '/images/e4s-icon.png' THEN '/images/site/brand/e4s-icon.png'
  WHEN '/images/e4s-logo_new.png' THEN '/images/site/brand/e4s-logo_new.png'
  WHEN '/images/e4s-network.gif' THEN '/images/junk/e4s-old-site-assets/e4s-network.gif'
  WHEN '/images/emag_header07.gif' THEN '/images/junk/legacy-page-art/emag_header07.gif'
  WHEN '/images/emag_headerb07.gif' THEN '/images/junk/legacy-page-art/emag_headerb07.gif'
  WHEN '/images/events4singles-72x468x60.gif' THEN '/images/businesses/legacy-promotional-banners/events4singles-72x468x60.gif'
  WHEN '/images/Flash Title with photo2.jpg' THEN '/images/junk/legacy-page-art/Flash Title with photo2.jpg'
  WHEN '/images/flashbacks-tile.gif' THEN '/images/junk/legacy-page-art/flashbacks-tile.gif'
  WHEN '/images/funnightout_468x55.gif' THEN '/images/businesses/legacy-promotional-banners/funnightout_468x55.gif'
  WHEN '/images/header_img_1.jpg' THEN '/images/junk/legacy-page-art/header_img_1.jpg'
  WHEN '/images/header_logo.gif' THEN '/images/junk/legacy-page-art/header_logo.gif'
  WHEN '/images/header2_newletter_imageconf.gif' THEN '/images/junk/legacy-page-art/header2_newletter_imageconf.gif'
  WHEN '/images/header3_newletter_jinglebel.gif' THEN '/images/junk/legacy-page-art/header3_newletter_jinglebel.gif'
  WHEN '/images/header4_newletter_apr07.jpg' THEN '/images/junk/legacy-page-art/header4_newletter_apr07.jpg'
  WHEN '/images/header4_newletter_isfearkee.gif' THEN '/images/junk/legacy-page-art/header4_newletter_isfearkee.gif'
  WHEN '/images/header4_newletter_love_look.gif' THEN '/images/junk/legacy-page-art/header4_newletter_love_look.gif'
  WHEN '/images/horoscope-72x468x40.gif' THEN '/images/businesses/legacy-promotional-banners/horoscope-72x468x40.gif'
  WHEN '/images/horoscopeALL-72x468x60.gif' THEN '/images/businesses/legacy-promotional-banners/horoscopeALL-72x468x60.gif'
  WHEN '/images/indepthgirlsdemo.gif' THEN '/images/junk/legacy-page-art/indepthgirlsdemo.gif'
  WHEN '/images/inspiringindv_468x58.gif' THEN '/images/businesses/legacy-promotional-banners/inspiringindv_468x58.gif'
  WHEN '/images/inviteonly_760x80.gif' THEN '/images/businesses/legacy-promotional-banners/inviteonly_760x80.gif'
  WHEN '/images/juice banner 150x85.gif' THEN '/images/businesses/legacy-promotional-banners/juice banner 150x85.gif'
  WHEN '/images/lgo_jsi-banner_120X80.jpg' THEN '/images/businesses/legacy-promotional-banners/lgo_jsi-banner_120X80.jpg'
  WHEN '/images/linkbanner2.gif' THEN '/images/businesses/legacy-promotional-banners/linkbanner2.gif'
  WHEN '/images/logo_e4s_white.jpg' THEN '/images/junk/e4s-old-site-assets/logo_e4s_white.jpg'
  WHEN '/images/logo1a_e4s_us.gif' THEN '/images/junk/e4s-old-site-assets/logo1a_e4s_us.gif'
  WHEN '/images/lms_ban1.gif' THEN '/images/junk/legacy-page-art/lms_ban1.gif'
  WHEN '/images/lms-btn-01.gif' THEN '/images/junk/legacy-page-art/lms-btn-01.gif'
  WHEN '/images/lmscollage.gif' THEN '/images/junk/legacy-page-art/lmscollage.gif'
  WHEN '/images/lmsp01.gif' THEN '/images/junk/legacy-page-art/lmsp01.gif'
  WHEN '/images/lovecology_web_banner_260x80.png' THEN '/images/businesses/legacy-promotional-banners/lovecology_web_banner_260x80.png'
  WHEN '/images/main_banner.gif' THEN '/images/businesses/legacy-promotional-banners/main_banner.gif'
  WHEN '/images/Masters-Banner.jpg' THEN '/images/businesses/legacy-promotional-banners/Masters-Banner.jpg'
  WHEN '/images/may-ball-web-header-flat.gif' THEN '/images/junk/legacy-page-art/may-ball-web-header-flat.gif'
  WHEN '/images/menasanimals_145x85.gif' THEN '/images/junk/legacy-page-art/menasanimals_145x85.gif'
  WHEN '/images/menasanimals_170x100.jpg' THEN '/images/junk/legacy-page-art/menasanimals_170x100.jpg'
  WHEN '/images/MRTV_header_big.jpg' THEN '/images/junk/legacy-page-art/MRTV_header_big.jpg'
  WHEN '/images/MRTV_header.jpg' THEN '/images/junk/legacy-page-art/MRTV_header.jpg'
  WHEN '/images/ozeworldbanner.gif' THEN '/images/businesses/legacy-promotional-banners/ozeworldbanner.gif'
  WHEN '/images/personalse4s_img1.jpg' THEN '/images/junk/e4s-old-site-assets/personalse4s_img1.jpg'
  WHEN '/images/personalse4s_img2.gif' THEN '/images/junk/e4s-old-site-assets/personalse4s_img2.gif'
  WHEN '/images/phoenixbanner.jpg' THEN '/images/businesses/legacy-promotional-banners/phoenixbanner.jpg'
  WHEN '/images/Red-Ball-Banner-ani.gif' THEN '/images/businesses/legacy-promotional-banners/Red-Ball-Banner-ani.gif'
  WHEN '/images/RedBaloon468x60.gif' THEN '/images/businesses/legacy-promotional-banners/RedBaloon468x60.gif'
  WHEN '/images/romance4milliionare_bannera.gif' THEN '/images/businesses/legacy-promotional-banners/romance4milliionare_bannera.gif'
  WHEN '/images/sandpiper468x60.gif' THEN '/images/businesses/legacy-promotional-banners/sandpiper468x60.gif'
  WHEN '/images/shoppingbanner.gif' THEN '/images/businesses/legacy-promotional-banners/shoppingbanner.gif'
  WHEN '/images/simplydrinks_760x80_penult.gif' THEN '/images/businesses/legacy-promotional-banners/simplydrinks_760x80_penult.gif'
  WHEN '/images/simplydrinks_ani_760x80_pen.gif' THEN '/images/businesses/legacy-promotional-banners/simplydrinks_ani_760x80_pen.gif'
  WHEN '/images/Simplysolo_banner1.gif' THEN '/images/businesses/legacy-promotional-banners/Simplysolo_banner1.gif'
  WHEN '/images/speed-date-banner_2.gif' THEN '/images/businesses/legacy-promotional-banners/speed-date-banner_2.gif'
  WHEN '/images/speed-date-banner-add-_468x.gif' THEN '/images/businesses/legacy-promotional-banners/speed-date-banner-add-_468x.gif'
  WHEN '/images/ssbanner2.gif' THEN '/images/businesses/legacy-promotional-banners/ssbanner2.gif'
  WHEN '/images/stayinbedbanner_468x60.jpg' THEN '/images/businesses/legacy-promotional-banners/stayinbedbanner_468x60.jpg'
  WHEN '/images/thingstodobanner.gif' THEN '/images/businesses/legacy-promotional-banners/thingstodobanner.gif'
  WHEN '/images/tsc_banner_ani80x430.gif' THEN '/images/businesses/legacy-promotional-banners/tsc_banner_ani80x430.gif'
  WHEN '/images/vivacity_600x151.gif' THEN '/images/businesses/legacy-promotional-banners/vivacity_600x151.gif'
  WHEN '/images/vmsd-longbanner.jpg' THEN '/images/businesses/legacy-promotional-banners/vmsd-longbanner.jpg'
  WHEN '/images/vmsd-longbanner2.jpg' THEN '/images/businesses/legacy-promotional-banners/vmsd-longbanner2.jpg'
  WHEN '/images/Web_banner_fhmx.gif' THEN '/images/businesses/legacy-promotional-banners/Web_banner_fhmx.gif'
  WHEN '/images/Web_banner_fhmx.jpg' THEN '/images/businesses/legacy-promotional-banners/Web_banner_fhmx.jpg'
  WHEN '/images/webbanner_singlelife.jpg' THEN '/images/businesses/legacy-promotional-banners/webbanner_singlelife.jpg'
  WHEN '/images/woolwichwalks_top_frame.jpg' THEN '/images/businesses/legacy-promotional-banners/woolwichwalks_top_frame.jpg'
  WHEN '/images/worlddate_760x130.jpg' THEN '/images/businesses/legacy-promotional-banners/worlddate_760x130.jpg'
  WHEN '/images/youand1_760x80.gif' THEN '/images/businesses/legacy-promotional-banners/youand1_760x80.gif'
  WHEN '/images/youandi_760x80.gif' THEN '/images/businesses/legacy-promotional-banners/youandi_760x80.gif'
  ELSE url
END
WHERE url IN ('/images/468x60_kiss_goodbye.gif', '/images/468x60_whereisthelove.gif', '/images/8ball-banner_120x80.gif', '/images/8ball-dating_banner_ani_123.gif', '/images/adpromo1.gif', '/images/amoureux_banner110x118.jpg', '/images/atable4six-new_430x179.jpg', '/images/banner_120x80_ani.gif', '/images/banner_e4ddancing6.gif', '/images/banner_e4ddancing9.gif', '/images/banner_joine4s.jpg', '/images/blink_600x100.gif', '/images/blink_banner_449x79.jpg', '/images/blink_banner_sml.gif', '/images/CheapEatsBanner_120x80.gif', '/images/dancebanner_ani_120x80.gif', '/images/dancepromo7.gif', '/images/Dancexpo_banner_links.gif', '/images/e4s-icon.png', '/images/e4s-logo_new.png', '/images/e4s-network.gif', '/images/emag_header07.gif', '/images/emag_headerb07.gif', '/images/events4singles-72x468x60.gif', '/images/Flash Title with photo2.jpg', '/images/flashbacks-tile.gif', '/images/funnightout_468x55.gif', '/images/header_img_1.jpg', '/images/header_logo.gif', '/images/header2_newletter_imageconf.gif', '/images/header3_newletter_jinglebel.gif', '/images/header4_newletter_apr07.jpg', '/images/header4_newletter_isfearkee.gif', '/images/header4_newletter_love_look.gif', '/images/horoscope-72x468x40.gif', '/images/horoscopeALL-72x468x60.gif', '/images/indepthgirlsdemo.gif', '/images/inspiringindv_468x58.gif', '/images/inviteonly_760x80.gif', '/images/juice banner 150x85.gif', '/images/lgo_jsi-banner_120X80.jpg', '/images/linkbanner2.gif', '/images/logo_e4s_white.jpg', '/images/logo1a_e4s_us.gif', '/images/lms_ban1.gif', '/images/lms-btn-01.gif', '/images/lmscollage.gif', '/images/lmsp01.gif', '/images/lovecology_web_banner_260x80.png', '/images/main_banner.gif', '/images/Masters-Banner.jpg', '/images/may-ball-web-header-flat.gif', '/images/menasanimals_145x85.gif', '/images/menasanimals_170x100.jpg', '/images/MRTV_header_big.jpg', '/images/MRTV_header.jpg', '/images/ozeworldbanner.gif', '/images/personalse4s_img1.jpg', '/images/personalse4s_img2.gif', '/images/phoenixbanner.jpg', '/images/Red-Ball-Banner-ani.gif', '/images/RedBaloon468x60.gif', '/images/romance4milliionare_bannera.gif', '/images/sandpiper468x60.gif', '/images/shoppingbanner.gif', '/images/simplydrinks_760x80_penult.gif', '/images/simplydrinks_ani_760x80_pen.gif', '/images/Simplysolo_banner1.gif', '/images/speed-date-banner_2.gif', '/images/speed-date-banner-add-_468x.gif', '/images/ssbanner2.gif', '/images/stayinbedbanner_468x60.jpg', '/images/thingstodobanner.gif', '/images/tsc_banner_ani80x430.gif', '/images/vivacity_600x151.gif', '/images/vmsd-longbanner.jpg', '/images/vmsd-longbanner2.jpg', '/images/Web_banner_fhmx.gif', '/images/Web_banner_fhmx.jpg', '/images/webbanner_singlelife.jpg', '/images/woolwichwalks_top_frame.jpg', '/images/worlddate_760x130.jpg', '/images/youand1_760x80.gif', '/images/youandi_760x80.gif');

UPDATE banners
SET image_url = CASE image_url
  WHEN '/images/468x60_kiss_goodbye.gif' THEN '/images/businesses/legacy-promotional-banners/468x60_kiss_goodbye.gif'
  WHEN '/images/468x60_whereisthelove.gif' THEN '/images/businesses/legacy-promotional-banners/468x60_whereisthelove.gif'
  WHEN '/images/8ball-banner_120x80.gif' THEN '/images/businesses/legacy-promotional-banners/8ball-banner_120x80.gif'
  WHEN '/images/8ball-dating_banner_ani_123.gif' THEN '/images/businesses/legacy-promotional-banners/8ball-dating_banner_ani_123.gif'
  WHEN '/images/adpromo1.gif' THEN '/images/businesses/legacy-promotional-banners/adpromo1.gif'
  WHEN '/images/amoureux_banner110x118.jpg' THEN '/images/businesses/legacy-promotional-banners/amoureux_banner110x118.jpg'
  WHEN '/images/atable4six-new_430x179.jpg' THEN '/images/businesses/legacy-promotional-banners/atable4six-new_430x179.jpg'
  WHEN '/images/banner_120x80_ani.gif' THEN '/images/businesses/legacy-promotional-banners/banner_120x80_ani.gif'
  WHEN '/images/banner_e4ddancing6.gif' THEN '/images/businesses/legacy-promotional-banners/banner_e4ddancing6.gif'
  WHEN '/images/banner_e4ddancing9.gif' THEN '/images/businesses/legacy-promotional-banners/banner_e4ddancing9.gif'
  WHEN '/images/banner_joine4s.jpg' THEN '/images/businesses/legacy-promotional-banners/banner_joine4s.jpg'
  WHEN '/images/blink_600x100.gif' THEN '/images/businesses/legacy-promotional-banners/blink_600x100.gif'
  WHEN '/images/blink_banner_449x79.jpg' THEN '/images/businesses/legacy-promotional-banners/blink_banner_449x79.jpg'
  WHEN '/images/blink_banner_sml.gif' THEN '/images/businesses/legacy-promotional-banners/blink_banner_sml.gif'
  WHEN '/images/CheapEatsBanner_120x80.gif' THEN '/images/businesses/legacy-promotional-banners/CheapEatsBanner_120x80.gif'
  WHEN '/images/dancebanner_ani_120x80.gif' THEN '/images/businesses/legacy-promotional-banners/dancebanner_ani_120x80.gif'
  WHEN '/images/dancepromo7.gif' THEN '/images/businesses/legacy-promotional-banners/dancepromo7.gif'
  WHEN '/images/Dancexpo_banner_links.gif' THEN '/images/businesses/legacy-promotional-banners/Dancexpo_banner_links.gif'
  WHEN '/images/e4s-icon.png' THEN '/images/site/brand/e4s-icon.png'
  WHEN '/images/e4s-logo_new.png' THEN '/images/site/brand/e4s-logo_new.png'
  WHEN '/images/e4s-network.gif' THEN '/images/junk/e4s-old-site-assets/e4s-network.gif'
  WHEN '/images/emag_header07.gif' THEN '/images/junk/legacy-page-art/emag_header07.gif'
  WHEN '/images/emag_headerb07.gif' THEN '/images/junk/legacy-page-art/emag_headerb07.gif'
  WHEN '/images/events4singles-72x468x60.gif' THEN '/images/businesses/legacy-promotional-banners/events4singles-72x468x60.gif'
  WHEN '/images/Flash Title with photo2.jpg' THEN '/images/junk/legacy-page-art/Flash Title with photo2.jpg'
  WHEN '/images/flashbacks-tile.gif' THEN '/images/junk/legacy-page-art/flashbacks-tile.gif'
  WHEN '/images/funnightout_468x55.gif' THEN '/images/businesses/legacy-promotional-banners/funnightout_468x55.gif'
  WHEN '/images/header_img_1.jpg' THEN '/images/junk/legacy-page-art/header_img_1.jpg'
  WHEN '/images/header_logo.gif' THEN '/images/junk/legacy-page-art/header_logo.gif'
  WHEN '/images/header2_newletter_imageconf.gif' THEN '/images/junk/legacy-page-art/header2_newletter_imageconf.gif'
  WHEN '/images/header3_newletter_jinglebel.gif' THEN '/images/junk/legacy-page-art/header3_newletter_jinglebel.gif'
  WHEN '/images/header4_newletter_apr07.jpg' THEN '/images/junk/legacy-page-art/header4_newletter_apr07.jpg'
  WHEN '/images/header4_newletter_isfearkee.gif' THEN '/images/junk/legacy-page-art/header4_newletter_isfearkee.gif'
  WHEN '/images/header4_newletter_love_look.gif' THEN '/images/junk/legacy-page-art/header4_newletter_love_look.gif'
  WHEN '/images/horoscope-72x468x40.gif' THEN '/images/businesses/legacy-promotional-banners/horoscope-72x468x40.gif'
  WHEN '/images/horoscopeALL-72x468x60.gif' THEN '/images/businesses/legacy-promotional-banners/horoscopeALL-72x468x60.gif'
  WHEN '/images/indepthgirlsdemo.gif' THEN '/images/junk/legacy-page-art/indepthgirlsdemo.gif'
  WHEN '/images/inspiringindv_468x58.gif' THEN '/images/businesses/legacy-promotional-banners/inspiringindv_468x58.gif'
  WHEN '/images/inviteonly_760x80.gif' THEN '/images/businesses/legacy-promotional-banners/inviteonly_760x80.gif'
  WHEN '/images/juice banner 150x85.gif' THEN '/images/businesses/legacy-promotional-banners/juice banner 150x85.gif'
  WHEN '/images/lgo_jsi-banner_120X80.jpg' THEN '/images/businesses/legacy-promotional-banners/lgo_jsi-banner_120X80.jpg'
  WHEN '/images/linkbanner2.gif' THEN '/images/businesses/legacy-promotional-banners/linkbanner2.gif'
  WHEN '/images/logo_e4s_white.jpg' THEN '/images/junk/e4s-old-site-assets/logo_e4s_white.jpg'
  WHEN '/images/logo1a_e4s_us.gif' THEN '/images/junk/e4s-old-site-assets/logo1a_e4s_us.gif'
  WHEN '/images/lms_ban1.gif' THEN '/images/junk/legacy-page-art/lms_ban1.gif'
  WHEN '/images/lms-btn-01.gif' THEN '/images/junk/legacy-page-art/lms-btn-01.gif'
  WHEN '/images/lmscollage.gif' THEN '/images/junk/legacy-page-art/lmscollage.gif'
  WHEN '/images/lmsp01.gif' THEN '/images/junk/legacy-page-art/lmsp01.gif'
  WHEN '/images/lovecology_web_banner_260x80.png' THEN '/images/businesses/legacy-promotional-banners/lovecology_web_banner_260x80.png'
  WHEN '/images/main_banner.gif' THEN '/images/businesses/legacy-promotional-banners/main_banner.gif'
  WHEN '/images/Masters-Banner.jpg' THEN '/images/businesses/legacy-promotional-banners/Masters-Banner.jpg'
  WHEN '/images/may-ball-web-header-flat.gif' THEN '/images/junk/legacy-page-art/may-ball-web-header-flat.gif'
  WHEN '/images/menasanimals_145x85.gif' THEN '/images/junk/legacy-page-art/menasanimals_145x85.gif'
  WHEN '/images/menasanimals_170x100.jpg' THEN '/images/junk/legacy-page-art/menasanimals_170x100.jpg'
  WHEN '/images/MRTV_header_big.jpg' THEN '/images/junk/legacy-page-art/MRTV_header_big.jpg'
  WHEN '/images/MRTV_header.jpg' THEN '/images/junk/legacy-page-art/MRTV_header.jpg'
  WHEN '/images/ozeworldbanner.gif' THEN '/images/businesses/legacy-promotional-banners/ozeworldbanner.gif'
  WHEN '/images/personalse4s_img1.jpg' THEN '/images/junk/e4s-old-site-assets/personalse4s_img1.jpg'
  WHEN '/images/personalse4s_img2.gif' THEN '/images/junk/e4s-old-site-assets/personalse4s_img2.gif'
  WHEN '/images/phoenixbanner.jpg' THEN '/images/businesses/legacy-promotional-banners/phoenixbanner.jpg'
  WHEN '/images/Red-Ball-Banner-ani.gif' THEN '/images/businesses/legacy-promotional-banners/Red-Ball-Banner-ani.gif'
  WHEN '/images/RedBaloon468x60.gif' THEN '/images/businesses/legacy-promotional-banners/RedBaloon468x60.gif'
  WHEN '/images/romance4milliionare_bannera.gif' THEN '/images/businesses/legacy-promotional-banners/romance4milliionare_bannera.gif'
  WHEN '/images/sandpiper468x60.gif' THEN '/images/businesses/legacy-promotional-banners/sandpiper468x60.gif'
  WHEN '/images/shoppingbanner.gif' THEN '/images/businesses/legacy-promotional-banners/shoppingbanner.gif'
  WHEN '/images/simplydrinks_760x80_penult.gif' THEN '/images/businesses/legacy-promotional-banners/simplydrinks_760x80_penult.gif'
  WHEN '/images/simplydrinks_ani_760x80_pen.gif' THEN '/images/businesses/legacy-promotional-banners/simplydrinks_ani_760x80_pen.gif'
  WHEN '/images/Simplysolo_banner1.gif' THEN '/images/businesses/legacy-promotional-banners/Simplysolo_banner1.gif'
  WHEN '/images/speed-date-banner_2.gif' THEN '/images/businesses/legacy-promotional-banners/speed-date-banner_2.gif'
  WHEN '/images/speed-date-banner-add-_468x.gif' THEN '/images/businesses/legacy-promotional-banners/speed-date-banner-add-_468x.gif'
  WHEN '/images/ssbanner2.gif' THEN '/images/businesses/legacy-promotional-banners/ssbanner2.gif'
  WHEN '/images/stayinbedbanner_468x60.jpg' THEN '/images/businesses/legacy-promotional-banners/stayinbedbanner_468x60.jpg'
  WHEN '/images/thingstodobanner.gif' THEN '/images/businesses/legacy-promotional-banners/thingstodobanner.gif'
  WHEN '/images/tsc_banner_ani80x430.gif' THEN '/images/businesses/legacy-promotional-banners/tsc_banner_ani80x430.gif'
  WHEN '/images/vivacity_600x151.gif' THEN '/images/businesses/legacy-promotional-banners/vivacity_600x151.gif'
  WHEN '/images/vmsd-longbanner.jpg' THEN '/images/businesses/legacy-promotional-banners/vmsd-longbanner.jpg'
  WHEN '/images/vmsd-longbanner2.jpg' THEN '/images/businesses/legacy-promotional-banners/vmsd-longbanner2.jpg'
  WHEN '/images/Web_banner_fhmx.gif' THEN '/images/businesses/legacy-promotional-banners/Web_banner_fhmx.gif'
  WHEN '/images/Web_banner_fhmx.jpg' THEN '/images/businesses/legacy-promotional-banners/Web_banner_fhmx.jpg'
  WHEN '/images/webbanner_singlelife.jpg' THEN '/images/businesses/legacy-promotional-banners/webbanner_singlelife.jpg'
  WHEN '/images/woolwichwalks_top_frame.jpg' THEN '/images/businesses/legacy-promotional-banners/woolwichwalks_top_frame.jpg'
  WHEN '/images/worlddate_760x130.jpg' THEN '/images/businesses/legacy-promotional-banners/worlddate_760x130.jpg'
  WHEN '/images/youand1_760x80.gif' THEN '/images/businesses/legacy-promotional-banners/youand1_760x80.gif'
  WHEN '/images/youandi_760x80.gif' THEN '/images/businesses/legacy-promotional-banners/youandi_760x80.gif'
  ELSE image_url
END
WHERE image_url IN ('/images/468x60_kiss_goodbye.gif', '/images/468x60_whereisthelove.gif', '/images/8ball-banner_120x80.gif', '/images/8ball-dating_banner_ani_123.gif', '/images/adpromo1.gif', '/images/amoureux_banner110x118.jpg', '/images/atable4six-new_430x179.jpg', '/images/banner_120x80_ani.gif', '/images/banner_e4ddancing6.gif', '/images/banner_e4ddancing9.gif', '/images/banner_joine4s.jpg', '/images/blink_600x100.gif', '/images/blink_banner_449x79.jpg', '/images/blink_banner_sml.gif', '/images/CheapEatsBanner_120x80.gif', '/images/dancebanner_ani_120x80.gif', '/images/dancepromo7.gif', '/images/Dancexpo_banner_links.gif', '/images/e4s-icon.png', '/images/e4s-logo_new.png', '/images/e4s-network.gif', '/images/emag_header07.gif', '/images/emag_headerb07.gif', '/images/events4singles-72x468x60.gif', '/images/Flash Title with photo2.jpg', '/images/flashbacks-tile.gif', '/images/funnightout_468x55.gif', '/images/header_img_1.jpg', '/images/header_logo.gif', '/images/header2_newletter_imageconf.gif', '/images/header3_newletter_jinglebel.gif', '/images/header4_newletter_apr07.jpg', '/images/header4_newletter_isfearkee.gif', '/images/header4_newletter_love_look.gif', '/images/horoscope-72x468x40.gif', '/images/horoscopeALL-72x468x60.gif', '/images/indepthgirlsdemo.gif', '/images/inspiringindv_468x58.gif', '/images/inviteonly_760x80.gif', '/images/juice banner 150x85.gif', '/images/lgo_jsi-banner_120X80.jpg', '/images/linkbanner2.gif', '/images/logo_e4s_white.jpg', '/images/logo1a_e4s_us.gif', '/images/lms_ban1.gif', '/images/lms-btn-01.gif', '/images/lmscollage.gif', '/images/lmsp01.gif', '/images/lovecology_web_banner_260x80.png', '/images/main_banner.gif', '/images/Masters-Banner.jpg', '/images/may-ball-web-header-flat.gif', '/images/menasanimals_145x85.gif', '/images/menasanimals_170x100.jpg', '/images/MRTV_header_big.jpg', '/images/MRTV_header.jpg', '/images/ozeworldbanner.gif', '/images/personalse4s_img1.jpg', '/images/personalse4s_img2.gif', '/images/phoenixbanner.jpg', '/images/Red-Ball-Banner-ani.gif', '/images/RedBaloon468x60.gif', '/images/romance4milliionare_bannera.gif', '/images/sandpiper468x60.gif', '/images/shoppingbanner.gif', '/images/simplydrinks_760x80_penult.gif', '/images/simplydrinks_ani_760x80_pen.gif', '/images/Simplysolo_banner1.gif', '/images/speed-date-banner_2.gif', '/images/speed-date-banner-add-_468x.gif', '/images/ssbanner2.gif', '/images/stayinbedbanner_468x60.jpg', '/images/thingstodobanner.gif', '/images/tsc_banner_ani80x430.gif', '/images/vivacity_600x151.gif', '/images/vmsd-longbanner.jpg', '/images/vmsd-longbanner2.jpg', '/images/Web_banner_fhmx.gif', '/images/Web_banner_fhmx.jpg', '/images/webbanner_singlelife.jpg', '/images/woolwichwalks_top_frame.jpg', '/images/worlddate_760x130.jpg', '/images/youand1_760x80.gif', '/images/youandi_760x80.gif');

UPDATE events
SET image_url = CASE image_url
  WHEN '/images/468x60_kiss_goodbye.gif' THEN '/images/businesses/legacy-promotional-banners/468x60_kiss_goodbye.gif'
  WHEN '/images/468x60_whereisthelove.gif' THEN '/images/businesses/legacy-promotional-banners/468x60_whereisthelove.gif'
  WHEN '/images/8ball-banner_120x80.gif' THEN '/images/businesses/legacy-promotional-banners/8ball-banner_120x80.gif'
  WHEN '/images/8ball-dating_banner_ani_123.gif' THEN '/images/businesses/legacy-promotional-banners/8ball-dating_banner_ani_123.gif'
  WHEN '/images/adpromo1.gif' THEN '/images/businesses/legacy-promotional-banners/adpromo1.gif'
  WHEN '/images/amoureux_banner110x118.jpg' THEN '/images/businesses/legacy-promotional-banners/amoureux_banner110x118.jpg'
  WHEN '/images/atable4six-new_430x179.jpg' THEN '/images/businesses/legacy-promotional-banners/atable4six-new_430x179.jpg'
  WHEN '/images/banner_120x80_ani.gif' THEN '/images/businesses/legacy-promotional-banners/banner_120x80_ani.gif'
  WHEN '/images/banner_e4ddancing6.gif' THEN '/images/businesses/legacy-promotional-banners/banner_e4ddancing6.gif'
  WHEN '/images/banner_e4ddancing9.gif' THEN '/images/businesses/legacy-promotional-banners/banner_e4ddancing9.gif'
  WHEN '/images/banner_joine4s.jpg' THEN '/images/businesses/legacy-promotional-banners/banner_joine4s.jpg'
  WHEN '/images/blink_600x100.gif' THEN '/images/businesses/legacy-promotional-banners/blink_600x100.gif'
  WHEN '/images/blink_banner_449x79.jpg' THEN '/images/businesses/legacy-promotional-banners/blink_banner_449x79.jpg'
  WHEN '/images/blink_banner_sml.gif' THEN '/images/businesses/legacy-promotional-banners/blink_banner_sml.gif'
  WHEN '/images/CheapEatsBanner_120x80.gif' THEN '/images/businesses/legacy-promotional-banners/CheapEatsBanner_120x80.gif'
  WHEN '/images/dancebanner_ani_120x80.gif' THEN '/images/businesses/legacy-promotional-banners/dancebanner_ani_120x80.gif'
  WHEN '/images/dancepromo7.gif' THEN '/images/businesses/legacy-promotional-banners/dancepromo7.gif'
  WHEN '/images/Dancexpo_banner_links.gif' THEN '/images/businesses/legacy-promotional-banners/Dancexpo_banner_links.gif'
  WHEN '/images/e4s-icon.png' THEN '/images/site/brand/e4s-icon.png'
  WHEN '/images/e4s-logo_new.png' THEN '/images/site/brand/e4s-logo_new.png'
  WHEN '/images/e4s-network.gif' THEN '/images/junk/e4s-old-site-assets/e4s-network.gif'
  WHEN '/images/emag_header07.gif' THEN '/images/junk/legacy-page-art/emag_header07.gif'
  WHEN '/images/emag_headerb07.gif' THEN '/images/junk/legacy-page-art/emag_headerb07.gif'
  WHEN '/images/events4singles-72x468x60.gif' THEN '/images/businesses/legacy-promotional-banners/events4singles-72x468x60.gif'
  WHEN '/images/Flash Title with photo2.jpg' THEN '/images/junk/legacy-page-art/Flash Title with photo2.jpg'
  WHEN '/images/flashbacks-tile.gif' THEN '/images/junk/legacy-page-art/flashbacks-tile.gif'
  WHEN '/images/funnightout_468x55.gif' THEN '/images/businesses/legacy-promotional-banners/funnightout_468x55.gif'
  WHEN '/images/header_img_1.jpg' THEN '/images/junk/legacy-page-art/header_img_1.jpg'
  WHEN '/images/header_logo.gif' THEN '/images/junk/legacy-page-art/header_logo.gif'
  WHEN '/images/header2_newletter_imageconf.gif' THEN '/images/junk/legacy-page-art/header2_newletter_imageconf.gif'
  WHEN '/images/header3_newletter_jinglebel.gif' THEN '/images/junk/legacy-page-art/header3_newletter_jinglebel.gif'
  WHEN '/images/header4_newletter_apr07.jpg' THEN '/images/junk/legacy-page-art/header4_newletter_apr07.jpg'
  WHEN '/images/header4_newletter_isfearkee.gif' THEN '/images/junk/legacy-page-art/header4_newletter_isfearkee.gif'
  WHEN '/images/header4_newletter_love_look.gif' THEN '/images/junk/legacy-page-art/header4_newletter_love_look.gif'
  WHEN '/images/horoscope-72x468x40.gif' THEN '/images/businesses/legacy-promotional-banners/horoscope-72x468x40.gif'
  WHEN '/images/horoscopeALL-72x468x60.gif' THEN '/images/businesses/legacy-promotional-banners/horoscopeALL-72x468x60.gif'
  WHEN '/images/indepthgirlsdemo.gif' THEN '/images/junk/legacy-page-art/indepthgirlsdemo.gif'
  WHEN '/images/inspiringindv_468x58.gif' THEN '/images/businesses/legacy-promotional-banners/inspiringindv_468x58.gif'
  WHEN '/images/inviteonly_760x80.gif' THEN '/images/businesses/legacy-promotional-banners/inviteonly_760x80.gif'
  WHEN '/images/juice banner 150x85.gif' THEN '/images/businesses/legacy-promotional-banners/juice banner 150x85.gif'
  WHEN '/images/lgo_jsi-banner_120X80.jpg' THEN '/images/businesses/legacy-promotional-banners/lgo_jsi-banner_120X80.jpg'
  WHEN '/images/linkbanner2.gif' THEN '/images/businesses/legacy-promotional-banners/linkbanner2.gif'
  WHEN '/images/logo_e4s_white.jpg' THEN '/images/junk/e4s-old-site-assets/logo_e4s_white.jpg'
  WHEN '/images/logo1a_e4s_us.gif' THEN '/images/junk/e4s-old-site-assets/logo1a_e4s_us.gif'
  WHEN '/images/lms_ban1.gif' THEN '/images/junk/legacy-page-art/lms_ban1.gif'
  WHEN '/images/lms-btn-01.gif' THEN '/images/junk/legacy-page-art/lms-btn-01.gif'
  WHEN '/images/lmscollage.gif' THEN '/images/junk/legacy-page-art/lmscollage.gif'
  WHEN '/images/lmsp01.gif' THEN '/images/junk/legacy-page-art/lmsp01.gif'
  WHEN '/images/lovecology_web_banner_260x80.png' THEN '/images/businesses/legacy-promotional-banners/lovecology_web_banner_260x80.png'
  WHEN '/images/main_banner.gif' THEN '/images/businesses/legacy-promotional-banners/main_banner.gif'
  WHEN '/images/Masters-Banner.jpg' THEN '/images/businesses/legacy-promotional-banners/Masters-Banner.jpg'
  WHEN '/images/may-ball-web-header-flat.gif' THEN '/images/junk/legacy-page-art/may-ball-web-header-flat.gif'
  WHEN '/images/menasanimals_145x85.gif' THEN '/images/junk/legacy-page-art/menasanimals_145x85.gif'
  WHEN '/images/menasanimals_170x100.jpg' THEN '/images/junk/legacy-page-art/menasanimals_170x100.jpg'
  WHEN '/images/MRTV_header_big.jpg' THEN '/images/junk/legacy-page-art/MRTV_header_big.jpg'
  WHEN '/images/MRTV_header.jpg' THEN '/images/junk/legacy-page-art/MRTV_header.jpg'
  WHEN '/images/ozeworldbanner.gif' THEN '/images/businesses/legacy-promotional-banners/ozeworldbanner.gif'
  WHEN '/images/personalse4s_img1.jpg' THEN '/images/junk/e4s-old-site-assets/personalse4s_img1.jpg'
  WHEN '/images/personalse4s_img2.gif' THEN '/images/junk/e4s-old-site-assets/personalse4s_img2.gif'
  WHEN '/images/phoenixbanner.jpg' THEN '/images/businesses/legacy-promotional-banners/phoenixbanner.jpg'
  WHEN '/images/Red-Ball-Banner-ani.gif' THEN '/images/businesses/legacy-promotional-banners/Red-Ball-Banner-ani.gif'
  WHEN '/images/RedBaloon468x60.gif' THEN '/images/businesses/legacy-promotional-banners/RedBaloon468x60.gif'
  WHEN '/images/romance4milliionare_bannera.gif' THEN '/images/businesses/legacy-promotional-banners/romance4milliionare_bannera.gif'
  WHEN '/images/sandpiper468x60.gif' THEN '/images/businesses/legacy-promotional-banners/sandpiper468x60.gif'
  WHEN '/images/shoppingbanner.gif' THEN '/images/businesses/legacy-promotional-banners/shoppingbanner.gif'
  WHEN '/images/simplydrinks_760x80_penult.gif' THEN '/images/businesses/legacy-promotional-banners/simplydrinks_760x80_penult.gif'
  WHEN '/images/simplydrinks_ani_760x80_pen.gif' THEN '/images/businesses/legacy-promotional-banners/simplydrinks_ani_760x80_pen.gif'
  WHEN '/images/Simplysolo_banner1.gif' THEN '/images/businesses/legacy-promotional-banners/Simplysolo_banner1.gif'
  WHEN '/images/speed-date-banner_2.gif' THEN '/images/businesses/legacy-promotional-banners/speed-date-banner_2.gif'
  WHEN '/images/speed-date-banner-add-_468x.gif' THEN '/images/businesses/legacy-promotional-banners/speed-date-banner-add-_468x.gif'
  WHEN '/images/ssbanner2.gif' THEN '/images/businesses/legacy-promotional-banners/ssbanner2.gif'
  WHEN '/images/stayinbedbanner_468x60.jpg' THEN '/images/businesses/legacy-promotional-banners/stayinbedbanner_468x60.jpg'
  WHEN '/images/thingstodobanner.gif' THEN '/images/businesses/legacy-promotional-banners/thingstodobanner.gif'
  WHEN '/images/tsc_banner_ani80x430.gif' THEN '/images/businesses/legacy-promotional-banners/tsc_banner_ani80x430.gif'
  WHEN '/images/vivacity_600x151.gif' THEN '/images/businesses/legacy-promotional-banners/vivacity_600x151.gif'
  WHEN '/images/vmsd-longbanner.jpg' THEN '/images/businesses/legacy-promotional-banners/vmsd-longbanner.jpg'
  WHEN '/images/vmsd-longbanner2.jpg' THEN '/images/businesses/legacy-promotional-banners/vmsd-longbanner2.jpg'
  WHEN '/images/Web_banner_fhmx.gif' THEN '/images/businesses/legacy-promotional-banners/Web_banner_fhmx.gif'
  WHEN '/images/Web_banner_fhmx.jpg' THEN '/images/businesses/legacy-promotional-banners/Web_banner_fhmx.jpg'
  WHEN '/images/webbanner_singlelife.jpg' THEN '/images/businesses/legacy-promotional-banners/webbanner_singlelife.jpg'
  WHEN '/images/woolwichwalks_top_frame.jpg' THEN '/images/businesses/legacy-promotional-banners/woolwichwalks_top_frame.jpg'
  WHEN '/images/worlddate_760x130.jpg' THEN '/images/businesses/legacy-promotional-banners/worlddate_760x130.jpg'
  WHEN '/images/youand1_760x80.gif' THEN '/images/businesses/legacy-promotional-banners/youand1_760x80.gif'
  WHEN '/images/youandi_760x80.gif' THEN '/images/businesses/legacy-promotional-banners/youandi_760x80.gif'
  ELSE image_url
END
WHERE image_url IN ('/images/468x60_kiss_goodbye.gif', '/images/468x60_whereisthelove.gif', '/images/8ball-banner_120x80.gif', '/images/8ball-dating_banner_ani_123.gif', '/images/adpromo1.gif', '/images/amoureux_banner110x118.jpg', '/images/atable4six-new_430x179.jpg', '/images/banner_120x80_ani.gif', '/images/banner_e4ddancing6.gif', '/images/banner_e4ddancing9.gif', '/images/banner_joine4s.jpg', '/images/blink_600x100.gif', '/images/blink_banner_449x79.jpg', '/images/blink_banner_sml.gif', '/images/CheapEatsBanner_120x80.gif', '/images/dancebanner_ani_120x80.gif', '/images/dancepromo7.gif', '/images/Dancexpo_banner_links.gif', '/images/e4s-icon.png', '/images/e4s-logo_new.png', '/images/e4s-network.gif', '/images/emag_header07.gif', '/images/emag_headerb07.gif', '/images/events4singles-72x468x60.gif', '/images/Flash Title with photo2.jpg', '/images/flashbacks-tile.gif', '/images/funnightout_468x55.gif', '/images/header_img_1.jpg', '/images/header_logo.gif', '/images/header2_newletter_imageconf.gif', '/images/header3_newletter_jinglebel.gif', '/images/header4_newletter_apr07.jpg', '/images/header4_newletter_isfearkee.gif', '/images/header4_newletter_love_look.gif', '/images/horoscope-72x468x40.gif', '/images/horoscopeALL-72x468x60.gif', '/images/indepthgirlsdemo.gif', '/images/inspiringindv_468x58.gif', '/images/inviteonly_760x80.gif', '/images/juice banner 150x85.gif', '/images/lgo_jsi-banner_120X80.jpg', '/images/linkbanner2.gif', '/images/logo_e4s_white.jpg', '/images/logo1a_e4s_us.gif', '/images/lms_ban1.gif', '/images/lms-btn-01.gif', '/images/lmscollage.gif', '/images/lmsp01.gif', '/images/lovecology_web_banner_260x80.png', '/images/main_banner.gif', '/images/Masters-Banner.jpg', '/images/may-ball-web-header-flat.gif', '/images/menasanimals_145x85.gif', '/images/menasanimals_170x100.jpg', '/images/MRTV_header_big.jpg', '/images/MRTV_header.jpg', '/images/ozeworldbanner.gif', '/images/personalse4s_img1.jpg', '/images/personalse4s_img2.gif', '/images/phoenixbanner.jpg', '/images/Red-Ball-Banner-ani.gif', '/images/RedBaloon468x60.gif', '/images/romance4milliionare_bannera.gif', '/images/sandpiper468x60.gif', '/images/shoppingbanner.gif', '/images/simplydrinks_760x80_penult.gif', '/images/simplydrinks_ani_760x80_pen.gif', '/images/Simplysolo_banner1.gif', '/images/speed-date-banner_2.gif', '/images/speed-date-banner-add-_468x.gif', '/images/ssbanner2.gif', '/images/stayinbedbanner_468x60.jpg', '/images/thingstodobanner.gif', '/images/tsc_banner_ani80x430.gif', '/images/vivacity_600x151.gif', '/images/vmsd-longbanner.jpg', '/images/vmsd-longbanner2.jpg', '/images/Web_banner_fhmx.gif', '/images/Web_banner_fhmx.jpg', '/images/webbanner_singlelife.jpg', '/images/woolwichwalks_top_frame.jpg', '/images/worlddate_760x130.jpg', '/images/youand1_760x80.gif', '/images/youandi_760x80.gif');
