
// This service handles disease analysis operations

interface AnalysisResult {
  condition: string;
  probability: number;
  description: string;
}

interface AnalysisResponse {
  results: AnalysisResult[];
  summary: string;
}

class DiseaseAnalysisService {
  // Simulate analyzing symptoms
  async analyzeSymptoms(symptoms: string): Promise<AnalysisResponse> {
    try {
      console.log("Analyzing symptoms:", symptoms);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real application, this would call an AI-powered backend API
      // For demo purposes, we'll return mock results based on keywords in the symptoms
      const lowerCaseSymptoms = symptoms.toLowerCase();
      
      let results: AnalysisResult[] = [];
      let summary = "Based on the symptoms provided, here are some potential conditions. Please consult with a healthcare professional for proper diagnosis.";
      
      // Check for common symptom patterns and provide appropriate responses
      if (lowerCaseSymptoms.includes("headache") || lowerCaseSymptoms.includes("head pain")) {
        results.push({
          condition: "Tension Headache",
          probability: 0.75,
          description: "A tension headache is generally a diffuse, mild to moderate pain that's often described as feeling like a tight band around your head."
        });
        
        results.push({
          condition: "Migraine",
          probability: 0.45,
          description: "Migraine headaches are often characterized by throbbing pain, sensitivity to light and sound, and sometimes nausea."
        });
        
        if (lowerCaseSymptoms.includes("fever")) {
          results.push({
            condition: "Viral Infection",
            probability: 0.65,
            description: "Headache with fever could indicate a viral infection like the flu or common cold."
          });
        }
      }
      
      if (lowerCaseSymptoms.includes("cough")) {
        results.push({
          condition: "Common Cold",
          probability: 0.7,
          description: "A common cold is a viral infection of your upper respiratory tract — your nose and throat."
        });
        
        if (lowerCaseSymptoms.includes("fever") || lowerCaseSymptoms.includes("temperature")) {
          results.push({
            condition: "Influenza",
            probability: 0.6,
            description: "Influenza is a viral infection that attacks your respiratory system — your nose, throat and lungs."
          });
        }
        
        if (lowerCaseSymptoms.includes("chest pain") || lowerCaseSymptoms.includes("breath")) {
          results.push({
            condition: "Bronchitis",
            probability: 0.5,
            description: "Bronchitis is an inflammation of the lining of your bronchial tubes, which carry air to and from your lungs."
          });
        }
      }
      
      if (lowerCaseSymptoms.includes("stomach") && (
          lowerCaseSymptoms.includes("pain") || 
          lowerCaseSymptoms.includes("ache") || 
          lowerCaseSymptoms.includes("cramp")
      )) {
        results.push({
          condition: "Gastritis",
          probability: 0.65,
          description: "Gastritis is an inflammation of the lining of the stomach."
        });
        
        if (lowerCaseSymptoms.includes("diarrhea") || lowerCaseSymptoms.includes("loose")) {
          results.push({
            condition: "Gastroenteritis",
            probability: 0.7,
            description: "Gastroenteritis is an inflammation of the gastrointestinal tract involving the stomach and small intestine."
          });
        }
        
        if (lowerCaseSymptoms.includes("nausea") || lowerCaseSymptoms.includes("vomit")) {
          results.push({
            condition: "Food Poisoning",
            probability: 0.55,
            description: "Food poisoning is an illness caused by eating contaminated food."
          });
        }
      }
      
      // Default results if nothing specific matches
      if (results.length === 0) {
        results = [
          {
            condition: "General Malaise",
            probability: 0.4,
            description: "A general feeling of discomfort, illness, or uneasiness whose exact cause is difficult to identify."
          },
          {
            condition: "Stress-Related Condition",
            probability: 0.35,
            description: "Many physical symptoms can be caused or exacerbated by psychological stress."
          },
          {
            condition: "Seasonal Allergies",
            probability: 0.3,
            description: "Allergic reactions to seasonal triggers like pollen, dust, or mold."
          }
        ];
      }
      
      // Sort by probability
      results.sort((a, b) => b.probability - a.probability);
      
      return {
        results,
        summary
      };
      
    } catch (error) {
      console.error("Analysis error:", error);
      throw new Error("Failed to analyze symptoms");
    }
  }
}

// Create and export a singleton instance
export const diseaseAnalysisService = new DiseaseAnalysisService();
