import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Calendar, Search, FileText, Video, Languages } from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import { useTranslation } from "@/hooks/useTranslation";

const Index = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: t("medicalRecords"),
      description: t("medicalRecordsDesc"),
      link: "/medical-records"
    },
    {
      icon: <Search className="h-8 w-8 text-primary" />,
      title: t("diseaseAnalysis"),
      description: t("diseaseAnalysisDesc"),
      link: "/disease-analysis"
    },
    {
      icon: <Video className="h-8 w-8 text-primary" />,
      title: t("videoConsultation"),
      description: t("videoConsultationDesc"),
      link: "/video-consultation"
    },
    {
      icon: <Bell className="h-8 w-8 text-primary" />,
      title: t("govtSchemes"),
      description: t("govtSchemesDesc"),
      link: "/govt-schemes"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-2xl font-bold text-primary">{t("healthcarePortal")}</h1>
          </div>
          
          <div className="md:hidden">
            {/* Mobile menu button */}
            <Button variant="ghost" size="sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
          
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/medical-records" className="text-gray-600 hover:text-primary">{t("medicalRecords")}</Link>
            <Link to="/disease-analysis" className="text-gray-600 hover:text-primary">{t("diseaseAnalysis")}</Link>
            <Link to="/video-consultation" className="text-gray-600 hover:text-primary">{t("videoConsultation")}</Link>
            <Link to="/govt-schemes" className="text-gray-600 hover:text-primary">{t("govtSchemes")}</Link>
            <div className="ml-4 flex items-center space-x-2">
              <LanguageSelector />
              <Link to="/login">
                <Button variant="outline" size="sm">{t("login")}</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">{t("signup")}</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <section 
          className="py-16 text-center overflow-hidden relative w-full" 
          style={{
            backgroundImage: "url('https://www.bolton.ac.uk//assets/Uploads/What-is-Medical-Biology-University-of-Bolton.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "500px",
            width: "100%"
          }}
        >
          <div className="relative py-12 px-4">
            <h2 className="text-4xl font-bold text-white mb-4" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.7)" }}>{t("heroTitle")}</h2>
            <p className="text-xl text-white max-w-2xl mx-auto mb-8" style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.7)" }}>{t("heroSubtitle")}</p>
            <div className="flex justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="gap-2 bg-white hover:bg-white-700 text-black font-bold shadow-lg">
                  {t("getStarted")}
                </Button>
              </Link>
              <Link to="/disease-analysis">
                <Button variant="outline" size="lg" className=" gap-2 border-white text-black font-bold shadow-lg">
                  {t("checkSymptoms")}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-8">{t("ourServices")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-2">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">{feature.description}</CardDescription>
                </CardContent>
                <CardFooter className="justify-center">
                  <Link to={feature.link}>
                    <Button variant="outline" size="sm">{t("learnMore")}</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section className="py-12 bg-blue-50 rounded-lg p-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">{t("needHelp")}</h2>
            <p className="text-lg text-gray-600 mb-6">{t("connectWithDoctors")}</p>
            <Link to="/video-consultation">
              <Button size="lg" className="gap-2">
                <Video className="h-5 w-5" />
                {t("startConsultation")}
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">{t("healthcarePortal")}</h3>
              <p className="text-gray-300">{t("footerDescription")}</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">{t("quickLinks")}</h3>
              <ul className="space-y-2">
                <li><Link to="/medical-records" className="text-gray-300 hover:text-white">{t("medicalRecords")}</Link></li>
                <li><Link to="/disease-analysis" className="text-gray-300 hover:text-white">{t("diseaseAnalysis")}</Link></li>
                <li><Link to="/video-consultation" className="text-gray-300 hover:text-white">{t("videoConsultation")}</Link></li>
                <li><Link to="/govt-schemes" className="text-gray-300 hover:text-white">{t("govtSchemes")}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">{t("contact")}</h3>
              <address className="not-italic text-gray-300">
                <p>123 Healthcare Ave</p>
                <p>Bangalore, Karnataka</p>
                <p>India</p>
                <p className="mt-2">contact@healthcareportal.com</p>
              </address>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-300">
            <p>&copy; {new Date().getFullYear()} Healthcare Portal. {t("allRightsReserved")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
