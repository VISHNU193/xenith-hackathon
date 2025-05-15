
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the available languages
export type Language = "kn" |"en" ;

// Define the translation context structure
type TranslationContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

// Create a context for translations
const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// English translations
const enTranslations: Record<string, string> = {
  // Navigation & Auth
  healthcarePortal: "Aayu Sathi",
  login: "Login",
  signup: "Sign Up",
  logout: "Logout",
  medicalRecords: "Medical Records",
  diseaseAnalysis: "Disease Analysis",
  videoConsultation: "Video Consultation",
  govtSchemes: "Government Schemes",
  
  // Home page
  heroTitle: "Your Health, Our Priority",
  heroSubtitle: "Access medical consultations, analyze symptoms, store reports, and stay updated with health schemes.",
  getStarted: "Get Started",
  checkSymptoms: "Check Symptoms",
  ourServices: "Our Services",
  medicalRecordsDesc: "Securely store and access your medical reports anytime, anywhere.",
  diseaseAnalysisDesc: "Analyze your symptoms and get preliminary health insights.",
  videoConsultationDesc: "Connect with healthcare professionals through video calls.",
  govtSchemesDesc: "Stay updated with the latest healthcare schemes and benefits.",
  needHelp: "Need Help Right Away?",
  connectWithDoctors: "Connect with our doctors through video consultation",
  startConsultation: "Start Consultation",
  
  // Footer
  quickLinks: "Quick Links",
  contact: "Contact",
  allRightsReserved: "All Rights Reserved",
  footerDescription: "We provide comprehensive healthcare services to help you manage your health effectively.",
  
  // Auth pages
  enterCredentials: "Enter your credentials to access your account",
  email: "Email",
  password: "Password",
  forgotPassword: "Forgot Password?",
  loggingIn: "Logging in...",
  dontHaveAccount: "Don't have an account?",
  createAccount: "Create Account",
  backToHome: "Back to Home",
  fullName: "Full Name",
  enterFullName: "Enter your full name",
  confirmPassword: "Confirm Password",
  creating: "Creating account...",
  alreadyHaveAccount: "Already have an account?",
  loginHere: "Login here",
  enterDetails: "Enter your details to create an account",
  
  // Validation messages
  nameRequired: "Name is required",
  emailRequired: "Email is required",
  validEmailRequired: "Valid email is required",
  passwordRequired: "Password is required",
  passwordTooShort: "Password must be at least 8 characters",
  passwordsDoNotMatch: "Passwords do not match",
  
  // Notifications
  loginSuccess: "Login Successful",
  welcomeBack: "Welcome back to the Healthcare Portal",
  loginFailed: "Login Failed",
  invalidCredentials: "Invalid email or password",
  somethingWentWrong: "Something went wrong, please try again",
  registrationSuccess: "Registration Successful",
  accountCreated: "Your account has been created successfully",
  registrationFailed: "Registration Failed",
  emailAlreadyExists: "Email already exists",
  
  // Language
  language: "Language",
  english: "English",
  kannada: "ಕನ್ನಡ",
  
  // Medical Records
  uploadRecord: "Upload Record",
  viewRecords: "View Records",
  recordType: "Record Type",
  recordDate: "Record Date",
  uploadFile: "Upload File",
  supportedFormats: "Supported formats: JPG, PNG, PDF",
  upload: "Upload",
  noRecords: "No records found",
  recordDeleteSuccess: "Record deleted successfully",
  recordUploadSuccess: "Record uploaded successfully",
  
  // Disease Analysis
  enterSymptoms: "Enter Your Symptoms",
  analyzeSymptoms: "Analyze Symptoms",
  analyzing: "Analyzing...",
  symptomPlaceholder: "Describe your symptoms here...",
  listenResults: "Listen to Results",
  analysisResults: "Analysis Results",
  possibleConditions: "Possible Conditions",
  disclaimer: "Disclaimer: This is not a medical diagnosis. Please consult a doctor for proper diagnosis.",
  
  // Video Consultation
  availableDoctors: "Available Doctors",
  specialization: "Specialization",
  experience: "Experience",
  rating: "Rating",
  bookAppointment: "Book Appointment",
  joinCall: "Join Call",
  noAvailableDoctors: "No doctors available at the moment",
  
  // Government Schemes
  recentSchemes: "Recent Healthcare Schemes",
  eligibility: "Eligibility",
  benefits: "Benefits",
  learnMore: "Learn More",
  viewAllSchemes: "View All Schemes",
  noSchemes: "No schemes available at the moment",
  
  // Dashboard
  welcome: "Welcome",
  recentActivity: "Recent Activity",
  upcomingAppointments: "Upcoming Appointments",
  viewAll: "View All",
};

// Kannada translations
const knTranslations: Record<string, string> = {
  // Navigation & Auth
  healthcarePortal: "ಆಯು ಸಾಥಿ",
  login: "ಲಾಗಿನ್",
  signup: "ಸೈನ್ ಅಪ್",
  logout: "ಲಾಗ್ ಔಟ್",
  medicalRecords: "ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳು",
  diseaseAnalysis: "ರೋಗ ವಿಶ್ಲೇಷಣೆ",
  videoConsultation: "ವೀಡಿಯೊ ಸಮಾಲೋಚನೆ",
  govtSchemes: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
  
  // Home page
  heroTitle: "ನಿಮ್ಮ ಆರೋಗ್ಯ, ನಮ್ಮ ಆದ್ಯತೆ",
  heroSubtitle: "ವೈದ್ಯಕೀಯ ಸಮಾಲೋಚನೆ, ರೋಗಲಕ್ಷಣಗಳ ವಿಶ್ಲೇಷಣೆ, ವರದಿಗಳ ಸಂಗ್ರಹ ಮತ್ತು ಆರೋಗ್ಯ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಮಾಹಿತಿ ಪಡೆಯಿರಿ.",
  getStarted: "ಶುರು ಮಾಡಿ",
  checkSymptoms: "ರೋಗಲಕ್ಷಣಗಳನ್ನು ಪರಿಶೀಲಿಸಿ",
  ourServices: "ನಮ್ಮ ಸೇವೆಗಳು",
  medicalRecordsDesc: "ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ವರದಿಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಸಂಗ್ರಹಿಸಿ ಮತ್ತು ಯಾವುದೇ ಸಮಯದಲ್ಲಿ, ಎಲ್ಲಿಯಾದರೂ ಪ್ರವೇಶಿಸಿ.",
  diseaseAnalysisDesc: "ನಿಮ್ಮ ರೋಗಲಕ್ಷಣಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿ ಮತ್ತು ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಅಂತರ್ದೃಷ್ಟಿಗಳನ್ನು ಪಡೆಯಿರಿ.",
  videoConsultationDesc: "ವೀಡಿಯೋ ಕರೆಗಳ ಮೂಲಕ ಆರೋಗ್ಯ ವೃತ್ತಿಪರರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸಿ.",
  govtSchemesDesc: "ಇತ್ತೀಚಿನ ಆರೋಗ್ಯ ಯೋಜನೆಗಳು ಮತ್ತು ಪ್ರಯೋಜನಗಳ ಬಗ್ಗೆ ನವೀಕರಿಸಿದ ಮಾಹಿತಿ ಪಡೆಯಿರಿ.",
  needHelp: "ಈಗಲೇ ಸಹಾಯ ಬೇಕೇ?",
  connectWithDoctors: "ವೀಡಿಯೊ ಸಮಾಲೋಚನೆ ಮೂಲಕ ನಮ್ಮ ವೈದ್ಯರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸಿ",
  startConsultation: "ಸಮಾಲೋಚನೆ ಶುರು ಮಾಡಿ",
  
  // Footer
  quickLinks: "ತ್ವರಿತ ಲಿಂಕ್‌ಗಳು",
  contact: "ಸಂಪರ್ಕ",
  allRightsReserved: "ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ",
  footerDescription: "ನಿಮ್ಮ ಆರೋಗ್ಯವನ್ನು ಪರಿಣಾಮಕಾರಿಯಾಗಿ ನಿರ್ವಹಿಸಲು ನಾವು ಸಮಗ್ರ ಆರೋಗ್ಯ ಸೇವೆಗಳನ್ನು ಒದಗಿಸುತ್ತೇವೆ.",
  
  // Auth pages
  enterCredentials: "ನಿಮ್ಮ ಖಾತೆಯನ್ನು ಪ್ರವೇಶಿಸಲು ನಿಮ್ಮ ರುಜುವಾತುಗಳನ್ನು ನಮೂದಿಸಿ",
  email: "ಇಮೇಲ್",
  password: "ಪಾಸ್‌ವರ್ಡ್",
  forgotPassword: "ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?",
  loggingIn: "ಲಾಗಿನ್ ಆಗುತ್ತಿದೆ...",
  dontHaveAccount: "ಖಾತೆ ಇಲ್ಲವೇ?",
  createAccount: "ಖಾತೆ ತೆರೆಯಿರಿ",
  backToHome: "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",
  fullName: "ಪೂರ್ಣ ಹೆಸರು",
  enterFullName: "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
  confirmPassword: "ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ",
  creating: "ಖಾತೆ ರಚಿಸಲಾಗುತ್ತಿದೆ...",
  alreadyHaveAccount: "ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?",
  loginHere: "ಇಲ್ಲಿ ಲಾಗಿನ್ ಮಾಡಿ",
  enterDetails: "ಖಾತೆ ರಚಿಸಲು ನಿಮ್ಮ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ",
  
  // Validation messages
  nameRequired: "ಹೆಸರು ಅಗತ್ಯವಿದೆ",
  emailRequired: "ಇಮೇಲ್ ಅಗತ್ಯವಿದೆ",
  validEmailRequired: "ಮಾನ್ಯವಾದ ಇಮೇಲ್ ಅಗತ್ಯವಿದೆ",
  passwordRequired: "ಪಾಸ್‌ವರ್ಡ್ ಅಗತ್ಯವಿದೆ",
  passwordTooShort: "ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳಿರಬೇಕು",
  passwordsDoNotMatch: "ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುವುದಿಲ್ಲ",
  
  // Notifications
  loginSuccess: "ಲಾಗಿನ್ ಯಶಸ್ವಿಯಾಗಿದೆ",
  welcomeBack: "ಆರೋಗ್ಯ ಪೋರ್ಟಲ್‌ಗೆ ಮರಳಿ ಸ್ವಾಗತ",
  loginFailed: "ಲಾಗಿನ್ ವಿಫಲವಾಗಿದೆ",
  invalidCredentials: "ಅಮಾನ್ಯ ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್",
  somethingWentWrong: "ಏನೋ ತಪ್ಪಾಗಿದೆ, ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
  registrationSuccess: "ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ",
  accountCreated: "ನಿಮ್ಮ ಖಾತೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ",
  registrationFailed: "ನೋಂದಣಿ ವಿಫಲವಾಗಿದೆ",
  emailAlreadyExists: "ಇಮೇಲ್ ಈಗಾಗಲೇ ಅಸ್ತಿತ್ವದಲ್ಲಿದೆ",
  
  // Language
  language: "ಭಾಷೆ",
  english: "English",
  kannada: "ಕನ್ನಡ",
  
  // Medical Records
  uploadRecord: "ರೆಕಾರ್ಡ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
  viewRecords: "ರೆಕಾರ್ಡ್‌ಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
  recordType: "ರೆಕಾರ್ಡ್ ಪ್ರಕಾರ",
  recordDate: "ರೆಕಾರ್ಡ್ ದಿನಾಂಕ",
  uploadFile: "ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
  supportedFormats: "ಬೆಂಬಲಿತ ಫಾರ್ಮ್ಯಾಟ್‌ಗಳು: JPG, PNG, PDF",
  upload: "ಅಪ್‌ಲೋಡ್",
  noRecords: "ಯಾವುದೇ ರೆಕಾರ್ಡ್‌ಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
  recordDeleteSuccess: "ರೆಕಾರ್ಡ್ ಯಶಸ್ವಿಯಾಗಿ ಅಳಿಸಲಾಗಿದೆ",
  recordUploadSuccess: "ರೆಕಾರ್ಡ್ ಯಶಸ್ವಿಯಾಗಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗಿದೆ",
  
  // Disease Analysis
  enterSymptoms: "ನಿಮ್ಮ ರೋಗಲಕ್ಷಣಗಳನ್ನು ನಮೂದಿಸಿ",
  analyzeSymptoms: "ರೋಗಲಕ್ಷಣಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿ",
  analyzing: "ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
  symptomPlaceholder: "ನಿಮ್ಮ ರೋಗಲಕ್ಷಣಗಳನ್ನು ಇಲ್ಲಿ ವಿವರಿಸಿ...",
  listenResults: "ಫಲಿತಾಂಶಗಳನ್ನು ಆಲಿಸಿ",
  analysisResults: "ವಿಶ್ಲೇಷಣೆಯ ಫಲಿತಾಂಶಗಳು",
  possibleConditions: "ಸಂಭವನೀಯ ಪರಿಸ್ಥಿತಿಗಳು",
  disclaimer: "ಗಮನಿಸಿ: ಇದು ವೈದ್ಯಕೀಯ ರೋಗನಿರ್ಣಯವಲ್ಲ. ಸರಿಯಾದ ರೋಗನಿರ್ಣಯಕ್ಕಾಗಿ ದಯವಿಟ್ಟು ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.",
  
  // Video Consultation
  availableDoctors: "ಲಭ್ಯವಿರುವ ವೈದ್ಯರು",
  specialization: "ವಿಶೇಷತೆ",
  experience: "ಅನುಭವ",
  rating: "ರೇಟಿಂಗ್",
  bookAppointment: "ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ",
  joinCall: "ಕರೆಗೆ ಸೇರಿ",
  noAvailableDoctors: "ಪ್ರಸ್ತುತ ಯಾವುದೇ ವೈದ್ಯರು ಲಭ್ಯವಿಲ್ಲ",
  
  // Government Schemes
  recentSchemes: "ಇತ್ತೀಚಿನ ಆರೋಗ್ಯ ಯೋಜನೆಗಳು",
  eligibility: "ಅರ್ಹತೆ",
  benefits: "ಪ್ರಯೋಜನಗಳು",
  learnMore: "ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ",
  viewAllSchemes: "ಎಲ್ಲಾ ಯೋಜನೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
  noSchemes: "ಪ್ರಸ್ತುತ ಯಾವುದೇ ಯೋಜನೆಗಳು ಲಭ್ಯವಿಲ್ಲ",
  
  // Dashboard
  welcome: "ಸ್ವಾಗತ",
  recentActivity: "ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ",
  upcomingAppointments: "ಮುಂಬರುವ ಅಪಾಯಿಂಟ್ಮೆಂಟ್‌ಗಳು",
  viewAll: "ಎಲ್ಲವನ್ನೂ ನೋಡಿ",
};

// Define the translations set
const translations: Record<Language, Record<string, string>> = {
  en: enTranslations,
  kn: knTranslations,
};

// Provider component
export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("language");
    return (savedLanguage as Language) || "kn";
  });

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const contextValue: TranslationContextType = {
    language,
    setLanguage,
    t,
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
};

// Hook for using the translation context
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};
