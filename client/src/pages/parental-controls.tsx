import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/navbar.jsx";
import { Button } from "@/components/ui/button.jsx";

export default function ParentalControlsPage() {
  const [, setLocation] = useLocation();
  const [isAdult, setIsAdult] = useState(false);

  useEffect(() => {
    const storedIsAdult = localStorage.getItem("isAdult");
    if (storedIsAdult === "true") {
      setIsAdult(true);
    }
  }, []);

  const handleAgree = () => {
    localStorage.setItem("ParentalControlsPageAgreed", "true");
    setLocation("/register");
  };

  const handleDisagree = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-6">Parental Controls</h1>

        <div className="space-y-6 text-foreground">
          <p>Parental Controls</p>
          <p>Parental Controls</p>
          <p>My Sweetheart Next Door is an adults-only website.</p>
          <p>As is clearly outlined in our Terms of Service, access to our website is strictly limited to those of legal age only. In order to use our website or access any services provided by the Company, a User must have attained the age of majority in a User’s jurisdiction. We also specifically disclaim any responsibility or liability for any misrepresentations regarding a User’s age.</p>
          <p>Users should also implement parental control protections (PC hardware, software, or filtering services), to help limit minors’ access to harmful material.</p>
          <p>We have a zero tolerance policy for pornographic material involving minors and regarding pedophiles or any pedophilic activity.</p>
          <p>We collaborate with:</p>
          <p>ASACP - a non-profit organization dedicated to online child protection, battling child exploitation through its CE Reporting Tipline and helps parents prevent children from viewing age-restricted material online with the Restricted To Adults - RTA Website Label.</p>
          <p>Revenge Porn Helpline - a UK service supporting adults (aged 18+) who are experiencing intimate image abuse, also known as, revenge porn.</p>
          <p>As a parent, you are the most effective gatekeeper in preventing age-restricted content from being displayed to your children or wards. We recommend that you implement parental control protections, such as computer hardware, software, or filtering services, to help you to protect your children from accessing age-restricted content on this site and others.</p>
          <p>In order to assist in restricting access to minors, we have ensured that My Sweetheart Next Door is, and remains, fully RTA [Restricted to Adults] compliant, and allows every page to be blocked by simple parental control tools.</p>
          <p>Important Tools to Protect Children from Adult Content</p>
          <p>1. Safe Search mode in Search engines Blocks Adult Content in Search Results</p>
          <p>Google Safe Search can be turned on for: personal accounts or browsers, children’s supervised devices and accounts using the Family Link app, workplace or school devices and networks. We recommend you activate SafeSearch on the devices of all minors in your care.</p>
          <p>Yahoo SafeSearch will help block explicit content in Yahoo Search results.</p>
          <p>Microsoft SafeSearch will do the same for those search results in Bing.</p>
          <p>Yandex Family Search will exclude unwanted content from search results in Yandex.</p>
          <p>We also recommend installing, defaulting to, or mandating age-specific search engines on your kids devices. They are specially designed to help vet web content such as words, images and videos. In addition, they are very user-friendly and much more visual. These differences help kids find what they’re looking for without landing on any pages that may be inappropriate: Kiddle, KidRex, WackySafe, Kido'z.</p>
          <p>2. Activating Built-in parental controls on Operating Systems</p>
          <p>Every major operating system -- Microsoft's Windows, Apple's Mac OS, Android and Amazon platform -- offers settings to keep kids from accessing stuff you don't want them to see.</p>
          <p>Apple (iOS)</p>
          <p>iPhone, iPad, Mac, Apple Watch, and Apple TV Apple devices have similar parental controls which can be enabled by following the instructions on Apple’s dedicated Families site You can set up your kids’ devices to limit adult content or open only websites that you select. You can also install special web browsers that are designed to display kid-friendly content and nothing else.</p>
          <p>Use parental controls on your child's iPhone, iPad, and iPod touch</p>
          <p>Learn more about parental controls on macOS</p>
          <p>Android</p>
          <p>Android products such as smartphones and tablets contain similar protections, allowing parents to choose what their children can see and do on their personal devices. The Google Safety Centre will walk you through the setup process.</p>
          <p>Microsoft</p>
          <p>Windows 10, by default, offers options for families and parents to ensure children are protected when they are online. To turn on parental controls for your child, go to the Windows search bar, and type ‘family options’ and choose options under settings. Create an account for your child, and enable parental controls. More information here .</p>
          <p>Amazon Kids+ (formerly FreeTime Unlimited)</p>
          <p>Parents receive access to easy-to-use parental controls that allow them to find the right balance between education and entertainment. Parents can personalize screen time limits, set educational goals, filter age-appropriate content, and also manage web browsing and content usage based on their preferences.</p>
          <p>3. Dedicated Parental Control Software</p>
          <p>Parental control software can effectively block most adult content, especially sites like My Sweetheart Next Door that register with RTA. Different software offers different solutions, but some of the most popular options are listed below.</p>
          <p>Qustodio</p>
          <p>Net Nanny</p>
          <p>Norton Family</p>
          <p>Mobicip</p>
          <p>SentryPC</p>
          <p>Bark</p>
          <p>4. More Information on Digital Parenting</p>
          <p>The more informed you are about the dangers of the internet, the better you can share with your kids the importance of internet safety. If you want to find more information on protecting your children online, learn how to talk to them and how to set and agree limits, there are several resources available.</p>
          <p>https://www.fosi.org/</p>
          <p>https://digitalparenting.com/</p>
          <p>https://www.connectsafely.org/</p>
          <p>https://www.betterinternetforkids.eu/</p>
          <p>https://www.internetmatters.org/</p>
          <p>https://icac.scag.gov/digital-parenting/</p>
          <p>https://www.saferinternet.org.uk/</p>
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
