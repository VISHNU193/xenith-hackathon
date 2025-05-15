import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { Search, Volume, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { diseaseAnalysisService } from "@/services/diseaseAnalysisService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AnalysisResult {
  condition: string;
  probability: number;
  description: string;
}

interface MedicalTermExplanation {
  term: string;
  explanation: string;
}

const DiseaseAnalysis = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [symptoms, setSymptoms] = useState("");
  const [lastAnalyzedSymptoms, setLastAnalyzedSymptoms] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSimplifying, setIsSimplifying] = useState(false);
  const [results, setResults] = useState<AnalysisResult[] | null>(null);
  const [analysisText, setAnalysisText] = useState("");
  const [language, setLanguage] = useState("kn"); // Default to Kannada
  const [simplifiedText, setSimplifiedText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [medicalExplanations, setMedicalExplanations] = useState<MedicalTermExplanation[]>([]);
  const [audioFilename, setAudioFilename] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      toast({
        title: t("somethingWentWrong"),
        description: "Please enter your symptoms",
        variant: "destructive",
      });
      return;
    }

    // Check if symptoms are the same as last time
    const isSameSymptoms = symptoms.trim() === lastAnalyzedSymptoms.trim();
    
    setIsAnalyzing(true);

    try {
      // Only call the API if symptoms have changed
      if (!isSameSymptoms) {
        const response = await diseaseAnalysisService.analyzeSymptoms(symptoms);
        setResults(response.results);
        setAnalysisText(response.summary);
        setLastAnalyzedSymptoms(symptoms.trim());
        
        // After analysis, automatically simplify the text
        await handleSimplifyText(response.summary);
      } else {
        // If symptoms haven't changed, just show a message
        toast({
          title: "Using Cached Results",
          description: "Showing previous results since symptoms haven't changed.",
        });
      }
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

  const handleSimplifyText = async (textToSimplify: string) => {
    setIsSimplifying(true);
    
    // Show immediate feedback that processing has started
    toast({
      title: "Processing Started",
      description: "Simplifying medical text and generating audio. This may take a minute...",
    });
    
    try {
      // Set a timeout to show a progress update if it's taking too long
      const timeoutId = setTimeout(() => {
        toast({
          title: "Still Processing",
          description: "The TTS service is still working. This might take a bit longer...",
        });
      }, 10000); // Show after 10 seconds
      
      const result = await diseaseAnalysisService.simplifyAndSpeech(textToSimplify, language);
      
      // Clear the timeout as we got the result
      clearTimeout(timeoutId);
      
      setSimplifiedText(result.simplified_text);
      setTranslatedText(result.translated_text || "");
      setMedicalExplanations(result.explanations);
      setAudioFilename(result.audio_filename || "");
      
      toast({
        title: "Text Processed",
        description: "Medical text has been simplified and translated",
      });
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: "Could not simplify or translate the text",
        variant: "destructive",
      });
      console.error("Simplification failed:", error);
    } finally {
      setIsSimplifying(false);
    }
  };

  const handleClearCache = () => {
    diseaseAnalysisService.clearTTSCache();
    toast({
      title: "Cache Cleared",
      description: "TTS cache has been cleared. Next request will process from scratch.",
    });
  };

  const handleTextToSpeech = () => {
    if (audioFilename && audioRef.current) {
      audioRef.current.src = diseaseAnalysisService.getAudioUrl(audioFilename);
      audioRef.current.play().catch(error => {
        console.error("Audio playback failed:", error);
        toast({
          title: "Playback Failed",
          description: "Could not play the audio",
          variant: "destructive",
        });
      });
    } else {
      toast({
        title: "Audio Not Available",
        description: "No audio is available for this text",
        variant: "destructive",
      });
    }
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
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Language for Text-to-Speech
                </label>
                <Select
                  value={language}
                  onValueChange={(value) => setLanguage(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kn">Kannada</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                    <Loader2 className="h-4 w-4 animate-spin" />
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
            {/* Hidden audio element for playback */}
            <audio ref={audioRef} className="hidden" controls />

            {results && (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>{t("analysisResults")}</CardTitle>
                      <div className="flex gap-2">
                        {isSimplifying ? (
                          <Button variant="outline" size="sm" disabled>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Processing...
                          </Button>
                        ) : (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={handleTextToSpeech}
                              className="gap-2"
                              disabled={!audioFilename}
                            >
                              <Volume className="h-4 w-4" />
                              {t("listenResults")}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={handleClearCache}
                              className="gap-2"
                            >
                              <ArrowRight className="h-4 w-4" />
                              Force Refresh
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    <CardDescription>
                      {t("disclaimer")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Show simplified text if available */}
                    {simplifiedText ? (
                      <div className="mb-4">
                        <h3 className="font-semibold mb-2">Simplified Explanation:</h3>
                        <p className="text-gray-700">{simplifiedText}</p>
                      </div>
                    ) : (
                      <p className="text-gray-700 mb-4">{analysisText}</p>
                    )}

                    {/* Show translated text if available and not English */}
                    {translatedText && language !== 'en' && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-md">
                        <h3 className="font-semibold mb-2">Translated Text:</h3>
                        <p className="text-gray-700">{translatedText}</p>
                      </div>
                    )}

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

                {/* Medical Terms Card */}
                {medicalExplanations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Medical Terms Explained
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {medicalExplanations.map((item, index) => (
                          <li key={index} className="border-b pb-2 last:border-0">
                            <span className="font-medium text-blue-600">{item.term}</span>
                            <p className="text-sm text-gray-600 mt-1">{item.explanation}</p>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
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
