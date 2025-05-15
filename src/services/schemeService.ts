
// This service handles government scheme-related operations

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

class SchemeService {
  async getSchemes(): Promise<Scheme[]> {
    try {
      console.log("Fetching government schemes");
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would fetch from MongoDB
      // For demo purposes, we'll return mock data
      const mockSchemes: Scheme[] = [
        {
          _id: "scheme_1",
          title: "Ayushman Bharat",
          description: "Healthcare scheme providing financial protection to vulnerable families against hospitalization expenses.",
          eligibility: [
            "Below poverty line families",
            "Economically weaker sections",
            "Registered in SECC database"
          ],
          benefits: [
            "Coverage up to ₹5,00,000 per family per year",
            "Cashless treatment at empanelled hospitals",
            "No cap on family size or age"
          ],
          startDate: "2018-09-23T00:00:00.000Z",
          endDate: null,
          category: "General",
          documentationRequired: [
            "Aadhaar Card",
            "Ration Card",
            "Income Certificate"
          ],
          applicationUrl: "https://pmjay.gov.in/apply"
        },
        {
          _id: "scheme_2",
          title: "Pradhan Mantri Surakshit Matritva Abhiyan",
          description: "Scheme to provide free healthcare services to pregnant women during pregnancy.",
          eligibility: [
            "Pregnant women",
            "Must be in 2nd or 3rd trimester"
          ],
          benefits: [
            "Free antenatal check-ups",
            "Free medication and supplements",
            "Free diagnostics and testing"
          ],
          startDate: "2016-06-09T00:00:00.000Z",
          endDate: null,
          category: "Women",
          documentationRequired: [
            "Aadhaar Card",
            "MCP Card"
          ]
        },
        {
          _id: "scheme_3",
          title: "National Programme for Health Care of the Elderly",
          description: "Dedicated healthcare facilities for elderly population providing specialized care.",
          eligibility: [
            "Age 60 years and above",
            "Indian citizens"
          ],
          benefits: [
            "Free specialized geriatric care",
            "Free medicines for age-related ailments",
            "Home-based care services"
          ],
          startDate: "2010-01-01T00:00:00.000Z",
          endDate: null,
          category: "Elderly",
          documentationRequired: [
            "Age proof",
            "Aadhaar Card",
            "Address proof"
          ]
        },
        {
          _id: "scheme_4",
          title: "Rashtriya Bal Swasthya Karyakram",
          description: "Child health screening and early intervention services providing comprehensive care.",
          eligibility: [
            "Children aged 0-18 years",
            "School-going and non-school going children"
          ],
          benefits: [
            "Free screening for defects at birth",
            "Free treatment for identified diseases",
            "Early intervention services"
          ],
          startDate: "2013-02-06T00:00:00.000Z",
          endDate: null,
          category: "Children",
          documentationRequired: [
            "Birth certificate",
            "School ID (if applicable)",
            "Parent's ID proof"
          ]
        },
        {
          _id: "scheme_5",
          title: "Karnataka Arogya Bhagya Scheme",
          description: "State-specific healthcare scheme providing medical assistance to residents of Karnataka.",
          eligibility: [
            "Karnataka state residents",
            "Below annual income of ₹1,50,000"
          ],
          benefits: [
            "Coverage for critical illnesses",
            "Subsidized medicine rates",
            "Coverage for hospitalization"
          ],
          startDate: "2017-03-02T00:00:00.000Z",
          endDate: "2024-12-31T00:00:00.000Z",
          category: "General",
          documentationRequired: [
            "Karnataka state ID",
            "Income certificate",
            "Aadhaar Card"
          ],
          applicationUrl: "https://karunadu.karnataka.gov.in/health"
        },
        {
          _id: "scheme_6",
          title: "Janani Suraksha Yojana",
          description: "Scheme to reduce maternal and infant mortality by promoting institutional deliveries.",
          eligibility: [
            "Pregnant women from BPL families",
            "Age above 19 years"
          ],
          benefits: [
            "Cash assistance for institutional delivery",
            "Free antenatal check-ups",
            "Transportation assistance"
          ],
          startDate: "2005-04-12T00:00:00.000Z",
          endDate: null,
          category: "Women",
          documentationRequired: [
            "BPL card",
            "Aadhaar Card",
            "MCP Card"
          ]
        }
      ];
      
      return mockSchemes;
    } catch (error) {
      console.error("Error fetching schemes:", error);
      throw new Error("Failed to fetch government schemes");
    }
  }

  async subscribeToNotifications(email: string): Promise<boolean> {
    try {
      console.log("Subscribing to notifications:", email);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would save to MongoDB
      // For demo purposes, always return success
      return true;
    } catch (error) {
      console.error("Subscription error:", error);
      return false;
    }
  }
}

// Create and export a singleton instance
export const schemeService = new SchemeService();
