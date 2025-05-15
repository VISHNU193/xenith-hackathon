
// This service handles medical record operations
// In a real application, this would connect to MongoDB for storing records

interface MedicalRecord {
  _id: string;
  userId: string;
  recordType: string;
  recordDate: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
}

class RecordService {
  private getStoredRecords(): MedicalRecord[] {
    try {
      const records = localStorage.getItem("medical_records");
      return records ? JSON.parse(records) : [];
    } catch (error) {
      console.error("Failed to parse stored records:", error);
      return [];
    }
  }

  private saveRecords(records: MedicalRecord[]): void {
    localStorage.setItem("medical_records", JSON.stringify(records));
  }

  async getRecords(): Promise<MedicalRecord[]> {
    // In a real application, this would fetch records from MongoDB
    // For demo purposes, we'll use localStorage
    console.log("Fetching medical records");
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return this.getStoredRecords();
  }

  async uploadRecord(file: File, recordType: string, recordDate: string): Promise<boolean> {
    try {
      console.log("Uploading record:", { file, recordType, recordDate });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would upload the file to a storage service
      // and save the metadata in MongoDB
      
      // Create a fake URL for demo purposes
      const fileUrl = URL.createObjectURL(file);
      
      // Create a new record entry
      const newRecord: MedicalRecord = {
        _id: `record_${Date.now()}`,
        userId: "current_user", // In a real app, this would be the actual user ID
        recordType,
        recordDate,
        fileUrl,
        fileName: file.name,
        fileType: file.type,
        uploadDate: new Date().toISOString()
      };
      
      // Get existing records
      const records = this.getStoredRecords();
      
      // Add the new record
      records.push(newRecord);
      
      // Save records
      this.saveRecords(records);
      
      return true;
    } catch (error) {
      console.error("Upload error:", error);
      return false;
    }
  }

  async deleteRecord(recordId: string): Promise<boolean> {
    try {
      console.log("Deleting record:", recordId);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get existing records
      const records = this.getStoredRecords();
      
      // Filter out the record to delete
      const updatedRecords = records.filter(record => record._id !== recordId);
      
      // Save the updated records
      this.saveRecords(updatedRecords);
      
      return true;
    } catch (error) {
      console.error("Delete error:", error);
      return false;
    }
  }
}

// Create and export a singleton instance
export const recordService = new RecordService();
