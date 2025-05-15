
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { Search, Volume, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { diseaseAnalysisService } from "@/services/diseaseAnalysisService";

interface AnalysisResult {
  condition: string;
  probability: number;
  description: string;
}

const DiseaseAnalysis = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [symptoms, setSymptoms] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult[] | null>(null);
  const [analysisText, setAnalysisText] = useState("");

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      toast({
        title: t("somethingWentWrong"),
        description: "Please enter your symptoms",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await diseaseAnalysisService.analyzeSymptoms(symptoms);
      setResults(response.results);
      setAnalysisText(response.summary);
    } catch (error) {
      toast({
        title: t("somethingWentWrong"),
        description: "Failed to analyze symptoms",
        variant: "destructive",
      });
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTextToSpeech = () => {
    // This is where we would integrate the Kannada TTS model
    // For now, let's just show a toast indicating this feature would be activated
    toast({
      title: "Text-to-Speech",
      description: "This would activate the Kannada TTS model to read the analysis",
    });
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t("diseaseAnalysis")}</h1>
          <Link to="/">
            <Button variant="outline">{t("backToHome")}</Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>{t("enterSymptoms")}</CardTitle>
              <CardDescription>
                Describe your symptoms in detail for a more accurate analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={t("symptomPlaceholder")}
                className="min-h-[200px]"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing} 
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <span className="animate-pulse mr-2">{t("analyzing")}</span>
                    <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" /> {t("analyzeSymptoms")}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <div className="space-y-6">
            {results && (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>{t("analysisResults")}</CardTitle>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleTextToSpeech}
                        className="gap-2"
                      >
                        <Volume className="h-4 w-4" />
                        {t("listenResults")}
                      </Button>
                    </div>
                    <CardDescription>
                      {t("disclaimer")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{analysisText}</p>
                    <h3 className="font-semibold mb-2">{t("possibleConditions")}</h3>
                    <ul className="space-y-3">
                      {results.map((result, index) => (
                        <li key={index} className="border-b pb-2 last:border-0">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{result.condition}</span>
                            <span className="text-sm bg-blue-100 px-2 py-1 rounded-full">
                              {Math.round(result.probability * 100)}%
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{result.description}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <p className="text-xs text-gray-500">
                      This analysis is based on the symptoms provided and should not replace professional medical advice.
                    </p>
                    <Link to="/video-consultation">
                      <Button size="sm" variant="outline" className="gap-2">
                        Consult Doctor <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </>
            )}

            {!results && !isAnalyzing && (
              <div className="h-full flex flex-col justify-center items-center text-gray-500 border border-dashed border-gray-300 rounded-lg p-8">
                <Search className="h-12 w-12 mb-2 opacity-30" />
                <p className="text-center">
                  Enter your symptoms and click analyze to get health insights
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseAnalysis;
