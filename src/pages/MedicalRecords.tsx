import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { FileText, Trash2, FileImage, File } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { recordService } from "@/services/recordService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Record type definition
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

const MedicalRecords = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("view");
  const [isUploading, setIsUploading] = useState(false);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [recordType, setRecordType] = useState("");
  const [recordDate, setRecordDate] = useState("");

  // Load records on component mount
  useState(() => {
    loadRecords();
  });

  const loadRecords = async () => {
    try {
      const userRecords = await recordService.getRecords();
      setRecords(userRecords);
    } catch (error) {
      console.error("Failed to load records:", error);
      toast({
        title: t("somethingWentWrong"),
        description: t("noRecords"),
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !recordType || !recordDate) {
      toast({
        title: t("somethingWentWrong"),
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      await recordService.uploadRecord(selectedFile, recordType, recordDate);
      
      toast({
        title: t("recordUploadSuccess"),
        description: selectedFile.name,
      });
      
      // Reset form
      setSelectedFile(null);
      setRecordType("");
      setRecordDate("");
      
      // Reload records
      loadRecords();
      
      // Switch to view tab
      setActiveTab("view");
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        title: t("somethingWentWrong"),
        description: "Failed to upload record",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (recordId: string) => {
    try {
      await recordService.deleteRecord(recordId);
      setRecords(records.filter(record => record._id !== recordId));
      toast({
        title: t("recordDeleteSuccess"),
      });
    } catch (error) {
      console.error("Delete failed:", error);
      toast({
        title: t("somethingWentWrong"),
        description: "Failed to delete record",
        variant: "destructive",
      });
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) {
      return <File className="h-8 w-8 text-red-500" />;
    } else if (fileType.includes("image")) {
      return <FileImage className="h-8 w-8 text-blue-500" />;
    } else {
      return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t("medicalRecords")}</h1>
          <Link to="/">
            <Button variant="outline">{t("backToHome")}</Button>
          </Link>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="view">{t("viewRecords")}</TabsTrigger>
            <TabsTrigger value="upload">{t("uploadRecord")}</TabsTrigger>
          </TabsList>

          <TabsContent value="view">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {records.length > 0 ? (
                records.map((record) => (
                  <Card key={record._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-start space-y-0 gap-4 pb-2">
                      <div className="mt-1">{getFileIcon(record.fileType)}</div>
                      <div>
                        <CardTitle className="text-lg">{record.fileName}</CardTitle>
                        <CardDescription>
                          {record.recordType} - {new Date(record.recordDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">
                          {new Date(record.uploadDate).toLocaleDateString()}
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={record.fileUrl} target="_blank" rel="noopener noreferrer">View</a>
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(record._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center text-gray-500 py-16">
                  <FileText className="h-16 w-16 mb-4" />
                  <p className="text-xl">{t("noRecords")}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upload">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>{t("uploadRecord")}</CardTitle>
                <CardDescription>{t("supportedFormats")}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpload} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recordType">{t("recordType")}</Label>
                    <Select
                      value={recordType}
                      onValueChange={setRecordType}
                    >
                      <SelectTrigger id="recordType">
                        <SelectValue placeholder="Select record type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lab Test">Lab Test</SelectItem>
                        <SelectItem value="Prescription">Prescription</SelectItem>
                        <SelectItem value="Scan Report">Scan Report</SelectItem>
                        <SelectItem value="Discharge Summary">Discharge Summary</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recordDate">{t("recordDate")}</Label>
                    <Input
                      id="recordDate"
                      type="date"
                      value={recordDate}
                      onChange={(e) => setRecordDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file">{t("uploadFile")}</Label>
                    <Input
                      id="file"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFileChange}
                      required
                    />
                    {selectedFile && (
                      <p className="text-sm text-gray-500">{selectedFile.name}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isUploading || !selectedFile}
                  >
                    {isUploading ? "Uploading..." : t("upload")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MedicalRecords;
