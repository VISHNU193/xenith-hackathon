
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { Video, Phone, Star, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { doctorService } from "@/services/doctorService";

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

const VideoConsultation = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCall, setActiveCall] = useState<string | null>(null);
  const [showCallDialog, setShowCallDialog] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsList = await doctorService.getAvailableDoctors();
        setDoctors(doctorsList);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
        toast({
          title: t("somethingWentWrong"),
          description: "Failed to load available doctors",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [toast, t]);

  const handleJoinCall = (doctorId: string) => {
    setActiveCall(doctorId);
    setShowCallDialog(true);
    // In a real implementation, this would initiate the video call
  };

  const handleBookAppointment = (doctorId: string) => {
    // In a real implementation, this would navigate to a booking form or show a booking dialog
    toast({
      title: "Appointment Booking",
      description: `You would now book an appointment with doctor ID: ${doctorId}`,
    });
  };

  // Placeholder function for ending the call
  const endCall = () => {
    setActiveCall(null);
    setShowCallDialog(false);
    toast({
      title: "Call Ended",
      description: "Your consultation has ended",
    });
  };

  // Helper function to render rating stars
  const renderRating = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
    ));
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t("videoConsultation")}</h1>
          <Link to="/">
            <Button variant="outline">{t("backToHome")}</Button>
          </Link>
        </div>

        <h2 className="text-2xl font-semibold mb-6">{t("availableDoctors")}</h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
          </div>
        ) : doctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <Card key={doctor._id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div className="flex gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={doctor.imageUrl} alt={doctor.name} />
                        <AvatarFallback>{doctor.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{doctor.name}</CardTitle>
                        <CardDescription>
                          {doctor.specialization}
                          <div className="flex mt-1">
                            {renderRating(doctor.rating)}
                          </div>
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={doctor.available ? "default" : "outline"}>
                      {doctor.available ? "Available" : "Unavailable"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="gap-1">
                      <Star className="h-3 w-3" /> {doctor.rating.toFixed(1)}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      {doctor.experience} {doctor.experience === 1 ? "year" : "years"}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  {doctor.available ? (
                    <Button onClick={() => handleJoinCall(doctor._id)} className="gap-2 w-full">
                      <Video className="h-4 w-4" /> {t("joinCall")}
                    </Button>
                  ) : (
                    <Button onClick={() => handleBookAppointment(doctor._id)} variant="outline" className="gap-2 w-full">
                      <Calendar className="h-4 w-4" /> {t("bookAppointment")}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Video className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-xl text-gray-500">{t("noAvailableDoctors")}</p>
            <p className="text-gray-400 mt-2">Please check back later or book an appointment</p>
          </div>
        )}

        {/* Video Call Dialog */}
        <Dialog open={showCallDialog} onOpenChange={setShowCallDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Video Consultation</DialogTitle>
            </DialogHeader>
            <div className="bg-black aspect-video rounded-md flex items-center justify-center relative">
              {/* Placeholder for video stream */}
              <div className="text-white">Video stream would appear here</div>
              
              {/* Doctor's small video */}
              <div className="absolute top-4 right-4 w-1/4 aspect-video bg-gray-700 rounded-md flex items-center justify-center">
                <span className="text-white text-xs">Doctor</span>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <Button variant="outline" onClick={endCall}>
                End Call
              </Button>
              <Button variant="destructive">
                <Phone className="h-4 w-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default VideoConsultation;
