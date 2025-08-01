import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Briefcase, Calendar, MapPin } from "lucide-react";

interface ExperienceFormProps {
  resumeData: any;
  setResumeData: (data: any) => void;
}

interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string[];
  achievements: string[];
}

export const ExperienceForm = ({ resumeData, setResumeData }: ExperienceFormProps) => {
  const [currentExperience, setCurrentExperience] = useState<Experience>({
    id: Date.now().toString(),
    jobTitle: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    responsibilities: [""],
    achievements: [""]
  });

  const addExperience = () => {
    if (currentExperience.jobTitle && currentExperience.company) {
      const newExperience = { ...currentExperience, id: Date.now().toString() };
      setResumeData({
        ...resumeData,
        experience: [...(resumeData.experience || []), newExperience]
      });
      setCurrentExperience({
        id: Date.now().toString(),
        jobTitle: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        responsibilities: [""],
        achievements: [""]
      });
    }
  };

  const removeExperience = (id: string) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter((exp: Experience) => exp.id !== id)
    });
  };

  const updateCurrentExperience = (field: string, value: any) => {
    setCurrentExperience({
      ...currentExperience,
      [field]: value
    });
  };

  const addBulletPoint = (type: 'responsibilities' | 'achievements') => {
    const updatedArray = [...currentExperience[type], ""];
    updateCurrentExperience(type, updatedArray);
  };

  const updateBulletPoint = (type: 'responsibilities' | 'achievements', index: number, value: string) => {
    const updatedArray = [...currentExperience[type]];
    updatedArray[index] = value;
    updateCurrentExperience(type, updatedArray);
  };

  const removeBulletPoint = (type: 'responsibilities' | 'achievements', index: number) => {
    const updatedArray = currentExperience[type].filter((_, i) => i !== index);
    updateCurrentExperience(type, updatedArray);
  };

  const actionWords = [
    "Achieved", "Implemented", "Managed", "Developed", "Led", "Created", "Increased",
    "Reduced", "Improved", "Streamlined", "Coordinated", "Delivered", "Optimized",
    "Generated", "Supervised", "Collaborated", "Executed", "Established", "Transformed"
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
            Use strong action verbs and quantify your achievements with numbers, percentages, or dollar amounts. 
            List experiences in reverse chronological order (most recent first).
          </p>
        </CardContent>
      </Card>

      {/* Existing Experience */}
      {resumeData.experience && resumeData.experience.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Experience</h3>
          {resumeData.experience.map((exp: Experience) => (
            <Card key={exp.id} className="bg-white border-purple-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-purple-900">{exp.jobTitle}</CardTitle>
                    <p className="text-purple-600 font-medium">{exp.company}</p>
                    <p className="text-sm text-gray-500">
                      {exp.location} • {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExperience(exp.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {exp.responsibilities.map((resp: string, index: number) => (
                    <p key={index} className="text-sm text-gray-600">• {resp}</p>
                  ))}
                  {exp.achievements.map((achievement: string, index: number) => (
                    <p key={index} className="text-sm text-gray-600 font-medium">• {achievement}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add New Experience */}
      <Card className="bg-white border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5 text-purple-600" />
            <span>Add Work Experience</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title *</Label>
              <Input
                id="jobTitle"
                placeholder="Software Engineer"
                value={currentExperience.jobTitle}
                onChange={(e) => updateCurrentExperience("jobTitle", e.target.value)}
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                placeholder="Tech Corp Inc."
                value={currentExperience.company}
                onChange={(e) => updateCurrentExperience("company", e.target.value)}
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="San Francisco, CA"
                value={currentExperience.location}
                onChange={(e) => updateCurrentExperience("location", e.target.value)}
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="month"
                value={currentExperience.startDate}
                onChange={(e) => updateCurrentExperience("startDate", e.target.value)}
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="month"
                value={currentExperience.endDate}
                onChange={(e) => updateCurrentExperience("endDate", e.target.value)}
                disabled={currentExperience.current}
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <Checkbox
                id="current"
                checked={currentExperience.current}
                onCheckedChange={(checked) => updateCurrentExperience("current", checked)}
              />
              <Label htmlFor="current" className="text-sm">I currently work here</Label>
            </div>
          </div>

          {/* Responsibilities */}
          <div className="space-y-3">
            <Label>Key Responsibilities</Label>
            {currentExperience.responsibilities.map((resp, index) => (
              <div key={index} className="flex space-x-2">
                <Textarea
                  placeholder="Describe your key responsibilities and duties..."
                  value={resp}
                  onChange={(e) => updateBulletPoint("responsibilities", index, e.target.value)}
                  className="border-purple-200 focus:border-purple-500 resize-none"
                  rows={2}
                />
                {currentExperience.responsibilities.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBulletPoint("responsibilities", index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => addBulletPoint("responsibilities")}
              className="border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Responsibility
            </Button>
          </div>

          {/* Achievements */}
          <div className="space-y-3">
            <Label>Key Achievements</Label>
            {currentExperience.achievements.map((achievement, index) => (
              <div key={index} className="flex space-x-2">
                <Textarea
                  placeholder="Quantify your achievements with numbers, percentages, or results..."
                  value={achievement}
                  onChange={(e) => updateBulletPoint("achievements", index, e.target.value)}
                  className="border-purple-200 focus:border-purple-500 resize-none"
                  rows={2}
                />
                {currentExperience.achievements.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBulletPoint("achievements", index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => addBulletPoint("achievements")}
              className="border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Achievement
            </Button>
          </div>

          <Button
            onClick={addExperience}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            disabled={!currentExperience.jobTitle || !currentExperience.company}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        </CardContent>
      </Card>

      {/* Action Words */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Powerful Action Words:</h4>
          <div className="flex flex-wrap gap-2">
            {actionWords.map((word, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-purple-50 hover:border-purple-300 text-gray-700"
              >
                {word}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
