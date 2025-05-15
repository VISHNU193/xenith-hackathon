
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { Bell, Calendar, ArrowRight, CheckCircle, User, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { schemeService } from "@/services/schemeService";

interface Scheme {
  _id: string;
  title: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  startDate: string;
  endDate: string | null;
  category: string;
  documentationRequired: string[];
  applicationUrl?: string;
}

const GovernmentSchemes = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const schemesList = await schemeService.getSchemes();
        setSchemes(schemesList);
      } catch (error) {
        console.error("Failed to fetch schemes:", error);
        toast({
          title: t("somethingWentWrong"),
          description: "Failed to load government schemes",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, [toast, t]);

  // Filter schemes based on active tab
  const filteredSchemes = schemes.filter(scheme => {
    if (activeTab === "all") return true;
    return scheme.category.toLowerCase() === activeTab;
  });

  const subscribeToNotifications = () => {
    toast({
      title: "Notifications Enabled",
      description: "You will now receive updates about new government schemes",
    });
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t("govtSchemes")}</h1>
          <div className="flex gap-4">
            <Button variant="outline" className="gap-2" onClick={subscribeToNotifications}>
              <Bell className="h-4 w-4" /> Subscribe
            </Button>
            <Link to="/">
              <Button variant="outline">{t("backToHome")}</Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-2">{t("recentSchemes")}</h2>
          <p className="text-gray-600 mb-6">
            Stay updated with the latest healthcare schemes and benefits offered by the government.
          </p>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="elderly">Elderly</TabsTrigger>
              <TabsTrigger value="women">Women</TabsTrigger>
              <TabsTrigger value="children">Children</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="h-8 w-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
                </div>
              ) : filteredSchemes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSchemes.map((scheme) => (
                    <Card key={scheme._id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{scheme.title}</CardTitle>
                          <Badge>{scheme.category}</Badge>
                        </div>
                        <CardDescription>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-3 w-3" />
                            Valid until: {scheme.endDate ? new Date(scheme.endDate).toLocaleDateString() : "Ongoing"}
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-4">{scheme.description}</p>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                              <User className="h-4 w-4" /> {t("eligibility")}
                            </h4>
                            <ul className="text-xs space-y-1 pl-6 list-disc">
                              {scheme.eligibility.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                              <CheckCircle className="h-4 w-4" /> {t("benefits")}
                            </h4>
                            <ul className="text-xs space-y-1 pl-6 list-disc">
                              {scheme.benefits.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        {scheme.applicationUrl ? (
                          <Button asChild className="w-full gap-2">
                            <a href={scheme.applicationUrl} target="_blank" rel="noopener noreferrer">
                              Apply Now <ArrowRight className="h-4 w-4" />
                            </a>
                          </Button>
                        ) : (
                          <Button variant="outline" asChild className="w-full">
                            <a href="#details" className="gap-2">
                              {t("learnMore")} <ArrowRight className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <Bell className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-xl text-gray-500">{t("noSchemes")}</p>
                </div>
              )}
              
              {filteredSchemes.length > 0 && (
                <div className="text-center mt-8">
                  <Button variant="outline">
                    {t("viewAllSchemes")}
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="bg-primary bg-opacity-10 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">Get Personalized Scheme Recommendations</h3>
          <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
            Complete your profile to receive personalized recommendations for government healthcare schemes that you may be eligible for.
          </p>
          <Button className="gap-2">
            <Users className="h-4 w-4" /> Complete Your Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GovernmentSchemes;
