
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, GraduationCap } from "lucide-react";

interface EducationFormProps {
  resumeData: any;
  setResumeData: (data: any) => void;
}

export const EducationForm = ({ resumeData, setResumeData }: EducationFormProps) => {
  const [currentEducation, setCurrentEducation] = useState({
    school: "",
    degree: "",
    major: "",
    graduationDate: "",
    gpa: "",
    gradeType: "GPA",
    location: "",
    honors: ""
  });

  const degreeTypes = [
    "High School Diploma",
    "SSLC (Secondary School Leaving Certificate)",
    "PUC (Pre-University Course)",
    "Associate Degree",
    "Bachelor's Degree",
    "Master's Degree",
    "Doctorate (PhD)",
    "Certificate",
    "Diploma",
    "Professional Certification"
  ];

  const addEducation = () => {
    if (!currentEducation.school || !currentEducation.degree) return;

    setResumeData({
      ...resumeData,
      education: [...(resumeData.education || []), currentEducation]
    });

    setCurrentEducation({
      school: "",
      degree: "",
      major: "",
      graduationDate: "",
      gpa: "",
      gradeType: "GPA",
      location: "",
      honors: ""
    });
  };

  const removeEducation = (index: number) => {
    const updatedEducation = resumeData.education.filter((_: any, i: number) => i !== index);
    setResumeData({
      ...resumeData,
      education: updatedEducation
    });
  };

  const tips = [
    "List education in reverse chronological order (most recent first)",
    "Include GPA only if it's 3.5 or higher",
    "Mention relevant coursework for entry-level positions",
    "Include honors, awards, or academic achievements"
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
            List your education clearly with institution names, degrees, and graduation dates.
            ATS systems scan for educational qualifications to match job requirements.
          </p>
        </CardContent>
      </Card>

      {/* Current Education */}
      {resumeData.education && resumeData.education.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Education</h3>
          {resumeData.education.map((edu: any, index: number) => (
            <Card key={index} className="border-purple-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {edu.degree} {edu.major && `in ${edu.major}`}
                    </h4>
                    <p className="text-purple-600 font-medium">{edu.school}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      {edu.location && <span>{edu.location}</span>}
                      {edu.graduationDate && <span>Graduated: {edu.graduationDate}</span>}
                      {edu.gpa && <span>{edu.gradeType || 'GPA'}: {edu.gpa}</span>}
                    </div>
                    {edu.honors && (
                      <p className="text-sm font-medium text-yellow-700 mt-1">{edu.honors}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEducation(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add New Education */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5 text-purple-600" />
            <span>Add Education</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="school">School/Institution *</Label>
              <Input
                id="school"
                placeholder="University of California, Berkeley"
                value={currentEducation.school}
                onChange={(e) => setCurrentEducation({...currentEducation, school: e.target.value})}
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="degree">Degree Type *</Label>
              <Select 
                value={currentEducation.degree} 
                onValueChange={(value) => setCurrentEducation({...currentEducation, degree: value})}
              >
                <SelectTrigger className="border-purple-200 focus:border-purple-500">
                  <SelectValue placeholder="Select degree type" />
                </SelectTrigger>
                <SelectContent>
                  {degreeTypes.map((degree) => (
                    <SelectItem key={degree} value={degree}>
                      {degree}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="major">Field of Study/Major</Label>
              <Input
                id="major"
                placeholder="Computer Science"
                value={currentEducation.major}
                onChange={(e) => setCurrentEducation({...currentEducation, major: e.target.value})}
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="graduationDate">Graduation Date</Label>
              <Input
                id="graduationDate"
                placeholder="May 2024"
                value={currentEducation.graduationDate}
                onChange={(e) => setCurrentEducation({...currentEducation, graduationDate: e.target.value})}
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gradeType">Grade Type</Label>
              <Select 
                value={currentEducation.gradeType} 
                onValueChange={(value) => setCurrentEducation({...currentEducation, gradeType: value})}
              >
                <SelectTrigger className="border-purple-200 focus:border-purple-500">
                  <SelectValue placeholder="Select grade type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GPA">GPA</SelectItem>
                  <SelectItem value="CGPA">CGPA</SelectItem>
                  <SelectItem value="Percentage">Percentage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gpa">{currentEducation.gradeType || 'GPA'} (optional)</Label>
              <Input
                id="gpa"
                placeholder={currentEducation.gradeType === 'Percentage' ? '85%' : '3.8'}
                value={currentEducation.gpa}
                onChange={(e) => setCurrentEducation({...currentEducation, gpa: e.target.value})}
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Berkeley, CA"
                value={currentEducation.location}
                onChange={(e) => setCurrentEducation({...currentEducation, location: e.target.value})}
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="honors">Honors/Awards</Label>
              <Input
                id="honors"
                placeholder="Magna Cum Laude"
                value={currentEducation.honors}
                onChange={(e) => setCurrentEducation({...currentEducation, honors: e.target.value})}
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
          </div>

          <Button 
            onClick={addEducation}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Education Tips:</h4>
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
