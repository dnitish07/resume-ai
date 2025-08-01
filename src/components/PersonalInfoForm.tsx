
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Linkedin, Globe, User } from "lucide-react";

interface PersonalInfoFormProps {
  resumeData: any;
  setResumeData: (data: any) => void;
}

export const PersonalInfoForm = ({ resumeData, setResumeData }: PersonalInfoFormProps) => {
  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData({
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        [field]: value
      }
    });
  };

  const tips = [
    "Use your full legal name as it appears on official documents",
    "Include a professional email address (avoid nicknames)",
    "Add your city and state (full address not necessary)",
    "LinkedIn profile should be customized and complete"
  ];

  return (
    <div className="space-y-6">
      {/* ATS Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Badge className="bg-blue-100 text-blue-700">ATS Tip</Badge>
          </div>
          <p className="text-sm text-blue-700">
            Keep personal information clean and professional. ATS systems scan contact details first,
            so ensure all information is accurate and properly formatted.
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="flex items-center space-x-2">
            <User className="h-4 w-4 text-purple-600" />
            <span>Full Name *</span>
          </Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            value={resumeData.personalInfo.fullName || ""}
            onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
            className="border-purple-200 focus:border-purple-500"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-purple-600" />
            <span>Email Address *</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john.doe@email.com"
            value={resumeData.personalInfo.email || ""}
            onChange={(e) => updatePersonalInfo("email", e.target.value)}
            className="border-purple-200 focus:border-purple-500"
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-purple-600" />
            <span>Phone Number *</span>
          </Label>
          <Input
            id="phone"
            placeholder="(555) 123-4567"
            value={resumeData.personalInfo.phone || ""}
            onChange={(e) => updatePersonalInfo("phone", e.target.value)}
            className="border-purple-200 focus:border-purple-500"
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-purple-600" />
            <span>Location</span>
          </Label>
          <Input
            id="location"
            placeholder="New York, NY"
            value={resumeData.personalInfo.location || ""}
            onChange={(e) => updatePersonalInfo("location", e.target.value)}
            className="border-purple-200 focus:border-purple-500"
          />
        </div>

        {/* LinkedIn */}
        <div className="space-y-2">
          <Label htmlFor="linkedin" className="flex items-center space-x-2">
            <Linkedin className="h-4 w-4 text-purple-600" />
            <span>LinkedIn Profile</span>
          </Label>
          <Input
            id="linkedin"
            placeholder="linkedin.com/in/johndoe"
            value={resumeData.personalInfo.linkedIn || ""}
            onChange={(e) => updatePersonalInfo("linkedIn", e.target.value)}
            className="border-purple-200 focus:border-purple-500"
          />
        </div>

        {/* Website */}
        <div className="space-y-2">
          <Label htmlFor="website" className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-purple-600" />
            <span>Portfolio/Website</span>
          </Label>
          <Input
            id="website"
            placeholder="www.johndoe.com"
            value={resumeData.personalInfo.website || ""}
            onChange={(e) => updatePersonalInfo("website", e.target.value)}
            className="border-purple-200 focus:border-purple-500"
          />
        </div>
      </div>

      {/* Professional Tips */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Professional Tips:</h4>
          <ul className="space-y-2">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                <span className="text-purple-600 mt-1">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
