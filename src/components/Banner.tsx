import { useLanguage } from "@/contexts/LanguageContext";

export function Banner() {
  const { language } = useLanguage();

  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-md border-b border-gray-200/20 sticky top-0 z-50 py-4 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <img
          src="https://res.cloudinary.com/dkb1opktz/image/upload/v1733894400/DALL_E_2024-12-11_05.55.07_-_A_modern_and_sleek_logo_for_an_app_called__Lm9edem_._The_design_should_be_inspired_by_Morocco__documents__and_AI._Incorporate_elements_like_the_Morocc-removebg-preview_cfaqf0.png"
          alt="M9edem AI Logo"
          className="h-24 w-auto" // Doubled from h-12 to h-24
        />
      </div>
    </div>
  );
}