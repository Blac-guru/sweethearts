import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/navbar.jsx";
import { Button } from "@/components/ui/button.jsx";

export default function CookiePolicyPage() {
  const [, setLocation] = useLocation();
  const [isAdult, setIsAdult] = useState(false);

  useEffect(() => {
    const storedIsAdult = localStorage.getItem("isAdult");
    if (storedIsAdult === "true") {
      setIsAdult(true);
    }
  }, []);

  const handleAgree = () => {
    localStorage.setItem("CookiePolicyPageAgreed", "true");
    setLocation("/register");
  };

  const handleDisagree = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-6">Cookie Policy</h1>

        <div className="space-y-6 text-foreground">
          <p>Cookie Policy</p>
          <p>My Sweetheart Next Door Cookie Policy</p>
          <p>Hammy Media Ltd is the publisher and operator (referred to as the “Company”, “we”, “our” or “us”) of the My Sweetheart Next Door website, www.hiresweetheart.co.ke, (referred to as the “Website”). In order for the Website to work properly and provide you with the best possible experience, it uses cookies or similar technologies, which will be placed on your computer, mobile, tablet or other device. Such technologies may collect information about the use of the Website, distinguish you from other users and remember your preferences.</p>
          <p>This cookie policy explains:</p>
          <p>how we use cookies and other internet tracking software; and</p>
          <p>the choices you can make about whether we can place different types of cookies on your computer, mobile device, tablet or other device.</p>
          <p>For the purposes of this cookie policy when we refer to “personal data” we mean data which identifies or may identify you as an individual, which may include online identifiers such as your IP address.</p>
          <p>1. Cookies – What are they?</p>
          <p>A “cookie” is a small text file that is stored on your computer, mobile device, tablet or other device when you visit a website or use an application. Cookies are then sent back to the Website on each subsequent visit, or to another website that recognizes that cookie, and allows the website to recognize the user’s device.</p>
          <p>Some cookies are deleted when you close the window of your browser. These are known as session cookies. Without such cookies, when you restart your browser and return to the Website, the Website will not recognize you and you will have to log in again (if login is required) or select your unique preferences/settings again. Other cookies remain on your device until they expire or you delete them from your cache. Expiration dates are set within the cookies themselves, and some may expire after a few minutes while others may expire after longer periods. These are known as persistent cookies and enable us to remember things about you as a returning visitor.</p>
          <p>Our Website uses both session and persistent cookies.</p>
          <p>2. Why we use cookies</p>
          <p>Cookies allow us to recognize users (where appropriate), tailor the content of our Website to fit the needs of our Website’s visitors and help us improve the user experience. Without certain types of cookies enabled, we cannot guarantee that the Website and your experience of it are as we intended to be.</p>
          <p>We use cookies to obtain information about your visits and about the device you use to access our Website.</p>
          <p>This includes, where available, your IP address and anonymized identifiers, your operating system and browser type, and depending on the cookie preferences, also includes statistical data about our users’ browsing actions and patterns.</p>
          <p>3. How we use cookies</p>
          <p>If you visit our Website, we will deploy cookies to provide an online service more suited to the device you connect, as well as to prevent and detect fraud and keep your connection secure. When you visit our Website from any device (mobile, tablet, PC), we collect information about your use of the Website, such as information about the device or browser you use to access the Website (including device type, operating system, screen resolution, etc.), the way you interact with this site, and the IP address your device connects from. You may not be able to initiate or complete some activities with our online services unless the cookies or similar technologies are installed.</p>
          <p>We additionally use cookies (and other similar technologies) to:</p>
          <p>provide products and services that you request and to provide a secure online environment;</p>
          <p>comply with relevant legislation, when applicable;</p>
          <p>manage our marketing relationships;</p>
          <p>give you a better online experience and track Website’s performance; and</p>
          <p>help us make our Website more relevant to you.</p>
          <p>4. Cookie Categories</p>
          <p>Based on different aspects, cookies fall into different categories. This section explains each cookie category in more detail and how you can control their use.</p>
          <p>Types of cookies based on source:</p>
          <p>First-party cookies</p>
          <p>These are cookies that are created and stored by the Website that the user is currently visiting. They are usually essential for the Website to function and remembering user preferences.</p>
          <p>Third-party cookies</p>
          <p>They are usually created and stored by third-party websites to the Website that the user is currently visiting. They are often used for advertising and analytical purposes.</p>
          <p>Types of cookies based on duration:</p>
          <p>Session cookies</p>
          <p>These are temporary cookies which only exist during the time you use the Website (or more strictly, until you close the relevant browser window). Session cookies help our Website remember what you chose on the previous page, avoiding the need to re-enter information and improving your experience whilst using the Website.</p>
          <p>Persistent cookies</p>
          <p>These are cookies which stay on your device after you have closed your browser and remain in your browser’s subfolders until they expire or you delete them. Persistent cookies help us identify you as a unique visitor.</p>
          <p>Types of cookies based on function:</p>
          <p>Essential cookies</p>
          <p>These are cookies that are essential for us to provide a service you have requested and to provide a secure online environment. Without these cookies we may be unable to provide some services that you might request. Other essential cookies keep our Website secure.</p>
          <p>These cookies are enabled by default each time you visit the Website. While you can configure your browser to block these cookies, some or all parts of our Website may not work properly.</p>
          <p>Essential cookies are used to:</p>
          <p>enable a user to log into our Website and recognize such user when navigating the Website (“authentication cookies”);</p>
          <p>maintain online security and protect against malicious activity and/or violation of our Terms & Conditions (“security cookies”)</p>
          <p>record your preference regarding our use of cookies on your device; and</p>
          <p>check if a user is allowed to access a particular service or content.</p>
          <p>The following list includes the essential cookies that are currently used on the Website. Since we periodically change our cookies to improve the functionality and user experience of the Website, the current list may not reflect exactly our currently used cookies. However, we are always striving to keep it up to date.</p>
          <p>Cookie Name	Domain	Purpose/Function	TTL</p>
          <p>_id	hiresweetheart.co.ke	Authentication session key	session</p>
          <p>av	hiresweetheart.co.ke	AV for applicable countries	365 days</p>
          <p>c-xh-env-username	hiresweetheart.co.ke	Show tooltip after failed email verification redirect	10 min</p>
          <p>c-xh-ev-username	hiresweetheart.co.ke	Hide tooltip after email verification redirect	30 days</p>
          <p>c-xh-na	hiresweetheart.co.ke	Creator's Dashboard notification	30 days</p>
          <p>c-xhl-na	hiresweetheart.co.ke	Creator's Dashboard notification	30 days</p>
          <p>cookie_accept, cookie_accept_v2	hiresweetheart.co.ke	Stores user consent to cookie categories	365 / 3 days</p>
          <p>old_browser	hiresweetheart.co.ke	Enables visiting from unsupported browsers	30 days</p>
          <p>parental-control	hiresweetheart.co.ke	Shows age assurance window (18+)	365 days</p>
          <p>settings	hiresweetheart.co.ke	Key default settings for format support	365 days</p>
          <p>thumb_less	hiresweetheart.co.ke	Adjustment for mobile version	30 days</p>
          <p>UID	hiresweetheart.co.ke	Assigns user identification number	365/1 days</p>
          <p>x_content_preference_index	hiresweetheart.co.ke	Directs to applicable version of the site	30 days</p>
          <p>x_platform_switch	hiresweetheart.co.ke	Desktop/mobile version preference	1 day</p>
          <p>login_account_type	hiresweetheart.co.ke	User account type identifier	1800 sec</p>
          <p>login_origin	hiresweetheart.co.ke	Login method identifier	1800 sec</p>
          <p>login_is_creator	hiresweetheart.co.ke	Enables login of creators	1800 sec</p>
          <p>pr-msg-closed-%d	hiresweetheart.co.ke	Disables promo banner	30 days</p>
          <p>redirect_disabled	hiresweetheart.co.ke	Redirect loop protection	1 day</p>
          <p>redirect_login_url	hiresweetheart.co.ke	Enables redirect login via Google	1800 sec</p>
          <p>refid	hiresweetheart.co.ke	Referral code identifier	7 days</p>
          <p>_cfg	hiresweetheart.co.ke	Enables user configuration settings	30 days</p>
          <p>dating_filters	hiresweetheart.co.ke	Dating page filter settings	6000000 sec</p>
          <p>h_v4_gay	hiresweetheart.co.ke	Recommendations history (gay)	30 days</p>
          <p>h_v4_trans	hiresweetheart.co.ke	Recommendations history (trans)	30 days</p>
          <p>h_v4_straight	hiresweetheart.co.ke	Recommendations history (straight)	30 days</p>
          <p>stats_src_last	hiresweetheart.co.ke	Affiliate program identifier	1 day</p>
          <p>previous_request_data	hiresweetheart.co.ke	Index function	1 day</p>
          <p>x_preroll, x_preroll_shown	hiresweetheart.co.ke	Limits preroll ads frequency	30 min</p>
          <p>pShowMob, pShowMob2	hiresweetheart.co.ke	Limits mobile ads frequency	60 min</p>
          <p>pShow, pShow2	hiresweetheart.co.ke	Limits desktop ads frequency	60 min</p>
          <p>video_view_count	hiresweetheart.co.ke	Limits postitial ads frequency	3 hour</p>
          <p>2fa_needed	hiresweetheart.co.ke	Enables two-factor authentication	60 sec</p>
          <p>ageProtectAgreement	hiresweetheart.co.ke	18+ overlay for applicable countries	365 days</p>
          <p>stats_cd	hiresweetheart.co.ke	User's clicks functionality	20 sec</p>
          <p>Functionality cookies (giving you a better online experience)</p>
          <p>These cookies remember your preferences and tailor the Website to provide enhanced features, without identifying you. Without these cookies, we cannot remember your choices or personalize your online experience. We use this type of cookies to:</p>
          <p>login faster by recognizing you if you are logged into the Website; and</p>
          <p>remember relevant information as you browse from page to page to avoid re-entering the same information repeatedly (e.g. language, volume, HD mode);</p>
          <p>remember your preferences such as your region and watch history;</p>
          <p>Retain information as you move between pages, eliminating the need to re-enter information such as video volume settings and night display mode;</p>
          <p>remember=your previous visits to our website to show you more relevant content.</p>
          <p>Performance cookies (tracking Website performance)</p>
          <p>These cookies collect aggregated information, and they are not used to identify you. We use this type of cookies to understand and analyze how visitors use and explore our Website and look for ways to improve it. We use these cookies to track our sites and plugins performance across the globe. They enable the following:</p>
          <p>count visits, identify the most and least popular pages, and offer insights into how users navigate the Website;</p>
          <p>evaluate how users respond to new advertisements, pages, or features.</p>
          <p>The following list includes the functionality/performance cookies that are currently used on the Website. Since we periodically change our cookies to improve the functionality and user experience of the Website, the current list may not reflect exactly our currently used cookies. However, we are always striving to keep it up to date. You may disable these cookies by clicking on the manage button on the upper right corner of this page.</p>
          <p>Cookie Name	Domain	Purpose / Function	Duration</p>
          <p>dyltv-shown-counter	hiresweetheart.co.ke	Enables periodically asking users if they like specific content	365 days</p>
          <p>search_last_list	hiresweetheart.co.ke	Enables last searches recommendation	30 days</p>
          <p>x_viewes	hiresweetheart.co.ke	Recommendation filter	7 days</p>
          <p>last_video_search	hiresweetheart.co.ke	Recommendation identifier	30 minutes</p>
          <p>u-c-channels	hiresweetheart.co.ke	Enables models' page history	30 days</p>
          <p>u-v-channels	hiresweetheart.co.ke	Enables video category page history	30 days</p>
          <p>u-p-channels	hiresweetheart.co.ke	Enables photo category page history	30 days</p>
          <p>dating	hiresweetheart.co.ke	Preferences / filters for dating	Session</p>
          <p>my-content-line-view	hiresweetheart.co.ke	Enables viewing page of liked content	Session</p>
          <p>last_photo_search	hiresweetheart.co.ke	Recommendation identifier	30 minutes</p>
          <p>x_redirect	hiresweetheart.co.ke	Redirect loop detection	1 min</p>
          <p>x_redirect_prv	hiresweetheart.co.ke	Redirect loop detection	1 min</p>
          <p>x_notifications:filters	hiresweetheart.co.ke	Notification page filters configuration	30 days</p>
          <p>slided	hiresweetheart.co.ke	Enables sliding function on mobile version	Session</p>
          <p>ab_log	hiresweetheart.co.ke	A/B test support	10 min</p>
          <p>ss	hiresweetheart.co.ke	Indicates user availability check for platform domains	Session</p>
          <p>vr_mode	hiresweetheart.co.ke	Enables VR mode	Session</p>
          <p>moments_offset	hiresweetheart.co.ke	Enables moments rotation	365 days</p>
          <p>sidebar_menu_ads	hiresweetheart.co.ke	Hiding ads spot in mobile version	30 days</p>
          <p>video_preview	hiresweetheart.co.ke	Enables/disables video trailers on mobile version	30 days</p>
          <p>video_titles_translation	hiresweetheart.co.ke	Disables titles auto translation	Session</p>
          <p>x_news:filters:tpl3	hiresweetheart.co.ke	News page filter configuration	30 days</p>
          <p>x_vdnkey	hiresweetheart.co.ke	Night mode preference	356 days</p>
          <p>x_vdnkey-light	hiresweetheart.co.ke	Day mode preference	356 days</p>
          <p>pr-rej-not-{month}{year}	hiresweetheart.co.ke	Rejected videos notification	30 days</p>
          <p>p-xh-pdp	hiresweetheart.co.ke	Payment details for producers	1 day</p>
          <p>c-xh-rvn-{username}	hiresweetheart.co.ke	Hide rejected video count notification	7 days</p>
          <p>a-xh-pdp	hiresweetheart.co.ke	Hide payment details update popup for creators	1 day</p>
          <p>Targeting cookies</p>
          <p>These cookies are used to deliver advertisements relevant to you and your interests. both on the Website and on other websites These cookies can track your browsing history across the Website, the pages you have visited and the links you have followed.</p>
          <p>The following list includes the targeting cookies that are currently used on the Website. Since we periodically change our cookies to improve the functionality and user experience of the Website, the current list may not reflect exactly our currently used cookies. However, we are always striving to keep it up to date. You may disable these cookies by clicking on the manage button on the upper right corner of this page.</p>
          <p>Cookie Name	Domain	Purpose / Function	Duration</p>
          <p>exoMobPop	hiresweetheart.co.ke	Disabling popunder	Session</p>
          <p>moments_ad_offset	hiresweetheart.co.ke	Enables ads in moments	365 days</p>
          <p>moments_listing_ad_offset	hiresweetheart.co.ke	Enables ads in moment listings	365 days</p>
          <p>pr-msg-%d	hiresweetheart.co.ke	Enables promo banner	30 days</p>
          <p>Analytical Cookies</p>
          <p>These cookies are typically provided by selected third parties and are used to collect statistical information about how visitors interact with the Website, such as which pages you visit frequently, how long you stay, and the links or buttons you click. By analyzing such data, we are able to understand which aspects of the Website are more effective and which can be improved.</p>
          <p>Similarly, we may also use these analytics cookies to test new advertisements, pages, or features to gauge users’ reactions. The analytics cookies we use may be our own (i.e. first-party cookies) or third party cookies and include Google Analytics.</p>
          <p>Such cookies are significant in improving the functionality of our Website and help us to provide you an optimal user experience.</p>
          <p>The selected third parties that provide such cookies on our Website include, among others, Amplitude, Google, Cloudflare, TrafficStars. We recommend that you review the privacy and cookie policies of these websites to gain a better understanding of the cookies they use and their methods of collecting personal data.</p>
          <p>Regarding Google Analytics, they collect and analyze information about how users use the Website, including by collecting website activity data through first-party cookies set by our Website, and third-party cookies set by Google. Since we activated IP anonymization for Google Analytics, Google will anonymize the last octet of a particular IP address and will not store your full IP address. Thus, Google will not be able to identify you. Google will only use the information only to provide Google Analytics services to our Website and will not use this information for other purposes.</p>
          <p>You can learn more on how Google handles your data here. You can opt-out of Google Analytics by visiting the Google Analytics opt-out page or by accepting only essential cookies or by not accepting analytical cookies.</p>
          <p>The following list includes the targeting cookies that are currently used on the Website. Since we periodically change our cookies to improve the functionality and user experience of the Website, the current list may not reflect exactly our currently used cookies. However, we are always striving to keep it up to date. You may disable these cookies by clicking on the manage button on the upper right corner of this page.</p>
          <p>Cookie Name	Domain	Purpose / Function	Duration</p>
          <p>_ga	Google Analytics	Determines unique users by assigning a randomly generated number as a client identifier	2 years</p>
          <p>_gid	Google Analytics	Determines unique users by assigning a randomly generated number as a client identifier	1 day</p>
          <p>Cloudflare	Cloudflare	Used for analytical purposes	30 seconds</p>
          <p>cookie_user_id	TrafficStars	Used for analytical purposes	180 days</p>
          <p>ts_direct_tag	TrafficStars	Used for analytical purposes	30 days</p>
          <p>ts_last_click_id	TrafficStars	Used for analytical purposes	7 days</p>
          <p>ts_uid	TrafficStars	Used for analytical purposes	180 days</p>
          <p>ts_uid_new	TrafficStars	Used for analytical purposes	180 days</p>
          <p>ts_rt_%UUID%	TrafficStars	Used for analytical purposes	365 days</p>
          <p>ccid-%DSP_rtb_client_codename%	TrafficStars	Used for analytical purposes	0 (session)</p>
          <p>x_lcs	hiresweetheart.co.ke	Language preferences statistics	1 day</p>
          <p>x_tgt	hiresweetheart.co.ke	Marketing statistics	365 days</p>
          <p>5. How do third parties use cookies on the Website?</p>
          <p>Some content or applications, including advertisements, on the Website are served by third parties, including analytics or advertising companies, ad network and servers, content providers and application providers. These third parties may use cookies alone or in conjunction with web beacons or other tracking technologies to collect information about you when you use our Website over which we have no control. These third parties, however, they may collect information, including personal data, such as internet protocol (IP) address, browser type and version, time zone setting and location, operating system and platform and other technology on the devices you use to access this Website. They may use this information to provide you with interest-based advertising or other targeted content.</p>
          <p>We recommend that you check the privacy and cookie policies of those websites for information about the cookies they may use and the collection of personal data. We cannot accept any responsibility for any content contained in these third-party websites.</p>
          <p>6. Keep in mind</p>
          <p>Cookies with more than one use</p>
          <p>Some of our cookies collect data for more than one use. We will only use these cookies for their essential purposes unless you have given your consent to any other uses they may have.</p>
          <p>Cookies that are already on your device</p>
          <p>Turning off one or more types of cookies will not delete any that have been downloaded in the past. We may still use data we collected up to that point but will stop collecting new data.</p>
          <p>Managing cookies choices in your browser</p>
          <p>You can turn off or delete cookies in your browser. If you do this, it may affect sites that use similar cookies to us.</p>
          <p>7. How to control and delete cookies</p>
          <p>Cookies help you get the most out of our Website. However, you can set up your browser to delete or refuse some or all of them, or to be notified when you are sent a cookie and therefore, choose whether or not to accept it. You may also delete or refuse, some or all of the cookies, on our Website at any time.</p>
          <p>On your first visit to the Website you will have seen a pop-up to inform you that cookies are being used when you proceed with using the Website. Although this pop-up will not usually appear on subsequent visits you may withdraw your cookie consent at any time by changing your browser or device settings. This pop-up will appear each time you visit this Cookie Policy.</p>
          <p>Please remember, if you do delete some or all your cookies, some functionality on our Website may be disabled and as a result you may be unable to access certain parts of our Website and your experience on our Website may be affected. Unless you have adjusted your browser settings so that they will delete or refuse cookies, cookies will be issued or reissued when you direct your browser to our Website. If you do decide to delete or refuse cookies but subsequently decide that you would in fact like to allow cookies, you should adjust your browser settings and continue using our Website. Cookies will then be sent to and from our Website.</p>
          <p>You may also opt out of third-party cookies by following the instructions provided by each third party in its privacy policy, if applicable.</p>
          <p>To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit www.allaboutcookies.org . Alternatively, you can search the internet for other independent information on cookies.</p>
          <p>8. Does the Website use any other personal data about me?</p>
          <p>More information regarding our use of user data can be found in our Privacy Policy.</p>
        </div>

        <div className="mt-8 flex gap-4">
          <Button variant="default" onClick={handleAgree}>
            Agree
          </Button>
          <Button variant="destructive" onClick={handleDisagree}>
            Disagree
          </Button>
        </div>
      </div>
    </div>
  );
}
