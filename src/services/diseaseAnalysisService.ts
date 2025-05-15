interface AnalysisResult {
  condition: string;
  probability: number;
  description: string;
}

interface AnalysisResponse {
  results: AnalysisResult[];
  summary: string;
}

interface MedicalTermExplanation {
  term: string;
  explanation: string;
}

interface SimplifiedTextResponse {
  simplified_text: string;
  translated_text?: string;
  explanations: MedicalTermExplanation[];
  audio_filename?: string;
}

class DiseaseAnalysisService {
  private apiBaseUrl = ''; // Using relative URLs with Vite proxy
  
  // Cache for TTS results to avoid repeated processing
  private ttsCache: Record<string, SimplifiedTextResponse> = {}

  // Analyze symptoms (existing functionality)
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
      
      // RESPIRATORY CONDITIONS
      if (lowerCaseSymptoms.includes("cough")) {
        // Common Cold
        if (lowerCaseSymptoms.includes("runny nose") || lowerCaseSymptoms.includes("congestion") || lowerCaseSymptoms.includes("sneezing")) {
          results.push({
            condition: "Common Cold",
            probability: 0.85,
            description: "A common cold is a viral infection of your upper respiratory tract. Symptoms typically include runny nose, congestion, cough, and sore throat."
          });
        } else {
          results.push({
            condition: "Common Cold",
            probability: 0.7,
            description: "A common cold is a viral infection of your upper respiratory tract — your nose and throat."
          });
        }
        
        // Influenza (Flu)
        if (lowerCaseSymptoms.includes("fever") || lowerCaseSymptoms.includes("temperature") || lowerCaseSymptoms.includes("chills")) {
          if (lowerCaseSymptoms.includes("body ache") || lowerCaseSymptoms.includes("muscle") || lowerCaseSymptoms.includes("fatigue")) {
            results.push({
              condition: "Influenza (Flu)",
              probability: 0.8,
              description: "Influenza is a viral infection that attacks your respiratory system with symptoms including fever, body aches, fatigue, and cough."
            });
          } else {
            results.push({
              condition: "Influenza (Flu)",
              probability: 0.6,
              description: "Influenza is a viral infection that attacks your respiratory system — your nose, throat and lungs."
            });
          }
        }
        
        // Bronchitis
        if (lowerCaseSymptoms.includes("chest pain") || lowerCaseSymptoms.includes("chest tightness") || lowerCaseSymptoms.includes("breath") || lowerCaseSymptoms.includes("breathing")) {
          if (lowerCaseSymptoms.includes("mucus") || lowerCaseSymptoms.includes("phlegm") || lowerCaseSymptoms.includes("productive")) {
            results.push({
              condition: "Bronchitis",
              probability: 0.75,
              description: "Bronchitis is an inflammation of the bronchial tubes that carry air to your lungs, characterized by coughing with mucus, chest discomfort, and fatigue."
            });
          } else {
            results.push({
              condition: "Bronchitis",
              probability: 0.5,
              description: "Bronchitis is an inflammation of the lining of your bronchial tubes, which carry air to and from your lungs."
            });
          }
        }
        
        // Pneumonia
        if ((lowerCaseSymptoms.includes("fever") || lowerCaseSymptoms.includes("high temperature")) && 
            (lowerCaseSymptoms.includes("breath") || lowerCaseSymptoms.includes("breathing") || lowerCaseSymptoms.includes("short of breath"))) {
          if (lowerCaseSymptoms.includes("chest pain") || lowerCaseSymptoms.includes("rapid breathing")) {
            results.push({
              condition: "Pneumonia",
              probability: 0.7,
              description: "Pneumonia is an infection that inflames the air sacs in one or both lungs, causing fever, chest pain, difficulty breathing, and cough with phlegm."
            });
          } else {
            results.push({
              condition: "Pneumonia",
              probability: 0.4,
              description: "Pneumonia is an infection that inflames the air sacs in one or both lungs."
            });
          }
        }
        
        // COVID-19
        if ((lowerCaseSymptoms.includes("fever") || lowerCaseSymptoms.includes("temperature")) && 
            (lowerCaseSymptoms.includes("breath") || lowerCaseSymptoms.includes("breathing") || lowerCaseSymptoms.includes("taste") || lowerCaseSymptoms.includes("smell"))) {
          results.push({
            condition: "COVID-19",
            probability: 0.65,
            description: "COVID-19 is a respiratory illness caused by the SARS-CoV-2 virus. Symptoms may include fever, cough, shortness of breath, fatigue, and loss of taste or smell."
          });
        }
      }
      
      // HEADACHE CONDITIONS
      if (lowerCaseSymptoms.includes("headache") || lowerCaseSymptoms.includes("head pain") || lowerCaseSymptoms.includes("head ache")) {
        // Tension Headache
        if (lowerCaseSymptoms.includes("stress") || lowerCaseSymptoms.includes("pressure") || lowerCaseSymptoms.includes("tight")) {
          results.push({
            condition: "Tension Headache",
            probability: 0.8,
            description: "A tension headache is generally a diffuse, mild to moderate pain often described as feeling like a tight band around your head, typically triggered by stress."
          });
        } else {
          results.push({
            condition: "Tension Headache",
            probability: 0.65,
            description: "A tension headache is generally a diffuse, mild to moderate pain that's often described as feeling like a tight band around your head."
          });
        }
        
        // Migraine
        if (lowerCaseSymptoms.includes("light") || lowerCaseSymptoms.includes("sound") || lowerCaseSymptoms.includes("nausea") || lowerCaseSymptoms.includes("vomit") || lowerCaseSymptoms.includes("aura")) {
          results.push({
            condition: "Migraine",
            probability: 0.75,
            description: "Migraine is a neurological condition characterized by intense, debilitating headaches with symptoms like throbbing pain, sensitivity to light and sound, and sometimes nausea or vomiting."
          });
        } else {
          results.push({
            condition: "Migraine",
            probability: 0.45,
            description: "Migraine headaches are often characterized by throbbing pain, sensitivity to light and sound, and sometimes nausea."
          });
        }
        
        // Sinus Headache
        if (lowerCaseSymptoms.includes("sinus") || lowerCaseSymptoms.includes("congestion") || lowerCaseSymptoms.includes("nasal") || lowerCaseSymptoms.includes("face pain")) {
          results.push({
            condition: "Sinusitis",
            probability: 0.7,
            description: "Sinusitis is inflammation of the sinuses, often causing headaches, facial pain, nasal congestion, and sometimes fever."
          });
        }
        
        // Cluster Headache
        if (lowerCaseSymptoms.includes("severe") && (lowerCaseSymptoms.includes("one side") || lowerCaseSymptoms.includes("eye pain") || lowerCaseSymptoms.includes("around eye"))) {
          results.push({
            condition: "Cluster Headache",
            probability: 0.6,
            description: "Cluster headaches are extremely painful headaches occurring in clusters or cyclical patterns, often around one eye or on one side of the head."
          });
        }
        
        // Meningitis (serious condition)
        if ((lowerCaseSymptoms.includes("fever") || lowerCaseSymptoms.includes("temperature")) && 
            (lowerCaseSymptoms.includes("stiff neck") || lowerCaseSymptoms.includes("neck pain") || lowerCaseSymptoms.includes("light sensitivity"))) {
          results.push({
            condition: "Meningitis",
            probability: 0.4,
            description: "Meningitis is inflammation of the membranes surrounding your brain and spinal cord. Seek immediate medical attention if you have severe headache with fever and stiff neck."
          });
        }
      }
      
      // GASTROINTESTINAL CONDITIONS
      if (lowerCaseSymptoms.includes("stomach") || lowerCaseSymptoms.includes("abdominal") || lowerCaseSymptoms.includes("belly") || 
          lowerCaseSymptoms.includes("nausea") || lowerCaseSymptoms.includes("vomit") || lowerCaseSymptoms.includes("diarrhea")) {
        
        // Gastritis
        if ((lowerCaseSymptoms.includes("stomach") || lowerCaseSymptoms.includes("abdominal")) && 
            (lowerCaseSymptoms.includes("pain") || lowerCaseSymptoms.includes("ache") || lowerCaseSymptoms.includes("burning"))) {
          results.push({
            condition: "Gastritis",
            probability: 0.7,
            description: "Gastritis is inflammation of the stomach lining, causing abdominal pain, nausea, vomiting, and a feeling of fullness."
          });
        }
        
        // Gastroenteritis (Stomach Flu)
        if ((lowerCaseSymptoms.includes("diarrhea") || lowerCaseSymptoms.includes("loose stool")) && 
            (lowerCaseSymptoms.includes("nausea") || lowerCaseSymptoms.includes("vomit"))) {
          results.push({
            condition: "Gastroenteritis (Stomach Flu)",
            probability: 0.8,
            description: "Gastroenteritis is inflammation of the digestive tract, causing diarrhea, nausea, vomiting, and abdominal cramps, often due to a virus."
          });
        }
        
        // Food Poisoning
        if ((lowerCaseSymptoms.includes("nausea") || lowerCaseSymptoms.includes("vomit")) && 
            (lowerCaseSymptoms.includes("diarrhea") || lowerCaseSymptoms.includes("cramp"))) {
          if (lowerCaseSymptoms.includes("food") || lowerCaseSymptoms.includes("ate") || lowerCaseSymptoms.includes("meal")) {
            results.push({
              condition: "Food Poisoning",
              probability: 0.75,
              description: "Food poisoning is an illness caused by eating contaminated food, resulting in nausea, vomiting, diarrhea, and abdominal cramps."
            });
          } else {
            results.push({
              condition: "Food Poisoning",
              probability: 0.55,
              description: "Food poisoning is an illness caused by eating contaminated food."
            });
          }
        }
        
        // Irritable Bowel Syndrome (IBS)
        if ((lowerCaseSymptoms.includes("abdominal") || lowerCaseSymptoms.includes("stomach")) && 
            (lowerCaseSymptoms.includes("pain") || lowerCaseSymptoms.includes("cramp")) && 
            (lowerCaseSymptoms.includes("diarrhea") || lowerCaseSymptoms.includes("constipation") || lowerCaseSymptoms.includes("bloating"))) {
          results.push({
            condition: "Irritable Bowel Syndrome (IBS)",
            probability: 0.65,
            description: "IBS is a common disorder affecting the large intestine, causing abdominal pain, cramping, bloating, gas, diarrhea or constipation."
          });
        }
        
        // Appendicitis (serious condition)
        if (lowerCaseSymptoms.includes("right") && 
            (lowerCaseSymptoms.includes("lower") || lowerCaseSymptoms.includes("side")) && 
            lowerCaseSymptoms.includes("pain") && 
            (lowerCaseSymptoms.includes("severe") || lowerCaseSymptoms.includes("intense"))) {
          results.push({
            condition: "Appendicitis",
            probability: 0.5,
            description: "Appendicitis is inflammation of the appendix causing severe pain that begins around the navel and shifts to the lower right abdomen. Seek immediate medical attention."
          });
        }
      }
      
      // FEVER CONDITIONS
      if (lowerCaseSymptoms.includes("fever") || lowerCaseSymptoms.includes("temperature") || lowerCaseSymptoms.includes("hot") || lowerCaseSymptoms.includes("chills")) {
        // General Viral Infection
        results.push({
          condition: "Viral Infection",
          probability: 0.7,
          description: "Fever is often a sign that your body is fighting a viral infection. Common viral infections include the common cold, flu, and COVID-19."
        });
        
        // Urinary Tract Infection (UTI)
        if (lowerCaseSymptoms.includes("urinate") || lowerCaseSymptoms.includes("pee") || lowerCaseSymptoms.includes("urination") || 
            lowerCaseSymptoms.includes("burning") || lowerCaseSymptoms.includes("bladder") || lowerCaseSymptoms.includes("urine")) {
          results.push({
            condition: "Urinary Tract Infection (UTI)",
            probability: 0.75,
            description: "A UTI is an infection in any part of your urinary system, causing symptoms like burning during urination, frequent urination, cloudy urine, and sometimes fever."
          });
        }
        
        // Strep Throat
        if (lowerCaseSymptoms.includes("throat") || lowerCaseSymptoms.includes("swallow")) {
          if (lowerCaseSymptoms.includes("sore") || lowerCaseSymptoms.includes("pain")) {
            results.push({
              condition: "Strep Throat",
              probability: 0.6,
              description: "Strep throat is a bacterial infection causing a sore, scratchy throat, fever, and swollen lymph nodes in the neck."
            });
          }
        }
        
        // Malaria (in endemic areas)
        if (lowerCaseSymptoms.includes("chills") && lowerCaseSymptoms.includes("sweat") && 
            (lowerCaseSymptoms.includes("travel") || lowerCaseSymptoms.includes("tropical") || lowerCaseSymptoms.includes("africa") || lowerCaseSymptoms.includes("asia"))) {
          results.push({
            condition: "Malaria",
            probability: 0.5,
            description: "Malaria is a serious disease caused by parasites transmitted through mosquito bites, causing cycles of fever, chills, and sweating."
          });
        }
      }
      
      // SKIN CONDITIONS
      if (lowerCaseSymptoms.includes("rash") || lowerCaseSymptoms.includes("skin") || lowerCaseSymptoms.includes("itch") || lowerCaseSymptoms.includes("hives")) {
        // Allergic Reaction
        results.push({
          condition: "Allergic Reaction",
          probability: 0.7,
          description: "An allergic reaction can cause symptoms like rash, hives, itching, and sometimes swelling, often in response to food, medication, or environmental triggers."
        });
        
        // Eczema
        if (lowerCaseSymptoms.includes("dry") || lowerCaseSymptoms.includes("patch") || lowerCaseSymptoms.includes("itch")) {
          results.push({
            condition: "Eczema",
            probability: 0.65,
            description: "Eczema (atopic dermatitis) is a condition that makes your skin red, itchy, and sometimes scaly or cracked."
          });
        }
        
        // Psoriasis
        if (lowerCaseSymptoms.includes("scale") || lowerCaseSymptoms.includes("silver") || lowerCaseSymptoms.includes("thick") || lowerCaseSymptoms.includes("red patch")) {
          results.push({
            condition: "Psoriasis",
            probability: 0.6,
            description: "Psoriasis is a skin disease that causes red, itchy, scaly patches, most commonly on the knees, elbows, trunk and scalp."
          });
        }
      }
      
      // JOINT/MUSCLE PAIN
      if (lowerCaseSymptoms.includes("joint") || lowerCaseSymptoms.includes("muscle") || lowerCaseSymptoms.includes("arthritis") || 
          lowerCaseSymptoms.includes("pain") || lowerCaseSymptoms.includes("ache") || lowerCaseSymptoms.includes("sore")) {
        
        // Arthritis
        if (lowerCaseSymptoms.includes("joint") && (lowerCaseSymptoms.includes("pain") || lowerCaseSymptoms.includes("swell") || lowerCaseSymptoms.includes("stiff"))) {
          results.push({
            condition: "Arthritis",
            probability: 0.7,
            description: "Arthritis involves inflammation of one or more joints, causing pain, stiffness, and sometimes swelling that worsens with age."
          });
        }
        
        // Fibromyalgia
        if ((lowerCaseSymptoms.includes("muscle") || lowerCaseSymptoms.includes("body")) && 
            (lowerCaseSymptoms.includes("pain") || lowerCaseSymptoms.includes("ache")) && 
            (lowerCaseSymptoms.includes("fatigue") || lowerCaseSymptoms.includes("tired") || lowerCaseSymptoms.includes("sleep"))) {
          results.push({
            condition: "Fibromyalgia",
            probability: 0.6,
            description: "Fibromyalgia is a disorder characterized by widespread musculoskeletal pain accompanied by fatigue, sleep, memory and mood issues."
          });
        }
        
        // Muscle Strain
        if (lowerCaseSymptoms.includes("muscle") && 
            (lowerCaseSymptoms.includes("strain") || lowerCaseSymptoms.includes("pull") || lowerCaseSymptoms.includes("injury") || lowerCaseSymptoms.includes("exercise"))) {
          results.push({
            condition: "Muscle Strain",
            probability: 0.8,
            description: "A muscle strain occurs when a muscle is overstretched or torn, causing pain, swelling, and limited movement in the affected area."
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
      
      // Limit to top 5 results for better UX
      if (results.length > 5) {
        // Sort by probability first
        results.sort((a, b) => b.probability - a.probability);
        // Then take only top 5
        results = results.slice(0, 5);
      } else {
        // Sort by probability
        results.sort((a, b) => b.probability - a.probability);
      }
      
      // Generate a more detailed summary based on top conditions
      if (results.length > 0) {
        const topCondition = results[0];
        summary = `Based on your symptoms, the most likely condition is ${topCondition.condition} (${Math.round(topCondition.probability * 100)}% probability). ${topCondition.description} Please consult with a healthcare professional for proper diagnosis and treatment.`;
      }
      
      return {
        results,
        summary
      };
      
    } catch (error) {
      console.error("Analysis error:", error);
      throw new Error("Failed to analyze symptoms");
    }
  }

  // New method: Simplify medical text and convert to speech
  async simplifyAndSpeech(text: string, language: string = 'kn'): Promise<SimplifiedTextResponse> {
    // Create a cache key based on the text and language
    const cacheKey = `${text}_${language}`;
    
    // Check if we have a cached result
    if (this.ttsCache[cacheKey]) {
      console.log('Using cached TTS result');
      return this.ttsCache[cacheKey];
    }
    
    try {
      // Create an AbortController to handle timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout
      
      const response = await fetch(`${this.apiBaseUrl}/api/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          language
        }),
        signal: controller.signal
      });
      
      // Clear the timeout
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Store the result in the cache
      this.ttsCache[cacheKey] = data;
      
      return data;
    } catch (error) {
      console.error('Error simplifying text:', error);
      
      // Provide more specific error messages
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. The text-to-speech service is taking too long to respond.');
      } else if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and make sure the backend server is running.');
      } else {
        throw new Error('Failed to simplify and convert text to speech: ' + (error.message || 'Unknown error'));
      }
    }
  }

  // Get audio URL for the TTS result
  getAudioUrl(filename: string): string {
    return `${this.apiBaseUrl}/audio/${filename}`;
  }
  
  // Clear the TTS cache
  clearTTSCache(): void {
    this.ttsCache = {};
    console.log('TTS cache cleared');
  }
}

// Create and export a singleton instance
export const diseaseAnalysisService = new DiseaseAnalysisService();
