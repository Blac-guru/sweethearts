import os

# folder with the text files
LEGAL_DIR = r"C:\Users\HomePC\Desktop\sweetheart\sweetheart.com-main\client\src\legal"
# where to output tsx pages
OUTPUT_DIR = r"C:\Users\HomePC\Desktop\sweetheart\sweetheart.com-main\client\src\pages"

# mapping between txt filenames and page names/components
PAGES = {
    "terms.txt": ("terms.tsx", "TermsAndConditionsPage", "Terms and Conditions"),
    "privacy.txt": ("privacy.tsx", "PrivacyPolicyPage", "Privacy Policy"),
    "cookies.txt": ("cookies.tsx", "CookiePolicyPage", "Cookie Policy"),
    "parental.txt": ("parental-controls.tsx", "ParentalControlsPage", "Parental Controls"),
}

TEMPLATE = """import {{ useState, useEffect }} from "react";
import {{ useLocation }} from "wouter";
import Navbar from "@/components/navbar.jsx";
import {{ Button }} from "@/components/ui/button.jsx";

export default function {component}() {{
  const [, setLocation] = useLocation();
  const [isAdult, setIsAdult] = useState(false);

  useEffect(() => {{
    const storedIsAdult = localStorage.getItem("isAdult");
    if (storedIsAdult === "true") {{
      setIsAdult(true);
    }}
  }}, []);

  const handleAgree = () => {{
    localStorage.setItem("{component}Agreed", "true");
    setLocation("/register");
  }};

  const handleDisagree = () => {{
    setLocation("/");
  }};

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-6">{title}</h1>

        <div className="space-y-6 text-foreground">
{text_content}
        </div>

        <div className="mt-8 flex gap-4">
          <Button variant="default" onClick={{handleAgree}}>
            Agree
          </Button>
          <Button variant="destructive" onClick={{handleDisagree}}>
            Disagree
          </Button>
        </div>
      </div>
    </div>
  );
}}
"""

def convert_text_to_jsx_paragraphs(text: str) -> str:
    """Convert plain text into <p> JSX blocks, preserving paragraphs."""
    paragraphs = [p.strip() for p in text.split("\n") if p.strip()]
    return "\n".join([f'          <p>{p}</p>' for p in paragraphs])


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    for txt_file, (tsx_file, component, title) in PAGES.items():
        txt_path = os.path.join(LEGAL_DIR, txt_file)
        if not os.path.exists(txt_path):
            print(f"⚠️ Skipping {txt_file}, file not found.")
            continue

        with open(txt_path, "r", encoding="utf-8") as f:
            content = f.read()

        text_content = convert_text_to_jsx_paragraphs(content)

        tsx_code = TEMPLATE.format(
            component=component, title=title, text_content=text_content
        )

        output_path = os.path.join(OUTPUT_DIR, tsx_file)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(tsx_code)

        print(f"✅ Generated {output_path}")


if __name__ == "__main__":
    main()
