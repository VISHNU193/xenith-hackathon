
// This service handles doctor-related operations

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  imageUrl: string;
  available: boolean;
  nextAvailable?: string;
}

class DoctorService {
  async getAvailableDoctors(): Promise<Doctor[]> {
    try {
      console.log("Fetching available doctors");
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would fetch from MongoDB
      // For demo purposes, we'll return mock data
      const mockDoctors: Doctor[] = [
        {
          _id: "doc_1",
          name: "Dr. Aishwarya Sharma",
          specialization: "General Physician",
          experience: 8,
          rating: 4.8,
          imageUrl: "https://randomuser.me/api/portraits/women/55.jpg",
          available: true
        },
        {
          _id: "doc_2",
          name: "Dr. Rajesh Kumar",
          specialization: "Cardiologist",
          experience: 12,
          rating: 4.9,
          imageUrl: "https://randomuser.me/api/portraits/men/45.jpg",
          available: false,
          nextAvailable: new Date(Date.now() + 86400000).toISOString() // Tomorrow
        },
        {
          _id: "doc_3",
          name: "Dr. Priya Patel",
          specialization: "Pediatrician",
          experience: 6,
          rating: 4.7,
          imageUrl: "https://randomuser.me/api/portraits/women/65.jpg",
          available: true
        },
        {
          _id: "doc_4",
          name: "Dr. Suresh Reddy",
          specialization: "Neurologist",
          experience: 15,
          rating: 4.9,
          imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
          available: false,
          nextAvailable: new Date(Date.now() + 172800000).toISOString() // Day after tomorrow
        },
        {
          _id: "doc_5",
          name: "Dr. Meena Desai",
          specialization: "Dermatologist",
          experience: 9,
          rating: 4.6,
          imageUrl: "https://randomuser.me/api/portraits/women/28.jpg",
          available: true
        },
        {
          _id: "doc_6",
          name: "Dr. Vikram Singh",
          specialization: "Orthopedic Surgeon",
          experience: 14,
          rating: 4.8,
          imageUrl: "https://randomuser.me/api/portraits/men/22.jpg",
          available: true
        }
      ];
      
      return mockDoctors;
    } catch (error) {
      console.error("Error fetching doctors:", error);
      throw new Error("Failed to fetch available doctors");
    }
  }

  async bookAppointment(doctorId: string, date: string, time: string): Promise<boolean> {
    try {
      console.log("Booking appointment:", { doctorId, date, time });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // In a real app, this would save to MongoDB
      // For demo purposes, always return success
      return true;
    } catch (error) {
      console.error("Booking error:", error);
      return false;
    }
  }
}

// Create and export a singleton instance
export const doctorService = new DoctorService();
