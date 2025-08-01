
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye, Save, Download, CheckCircle2, AlertCircle } from "lucide-react";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { ExperienceForm } from "./ExperienceForm";
import { EducationForm } from "./EducationForm";
import { SkillsForm } from "./SkillsForm";
import { SummaryForm } from "./SummaryForm";
import { ProjectsForm } from "./ProjectsForm";
import { ATSScoreCard } from "./ATSScoreCard";
import { AIAssistant } from "./AIAssistant";
import { useResumeStorage } from "@/hooks/useResumeStorage";
import { useToast } from "@/hooks/use-toast";

interface ResumeBuilderProps {
  resumeData: any;
  setResumeData: (data: any) => void;
  onPreview: () => void;
  onBack: () => void;
  resumeId?: string;
}

export const ResumeBuilder = ({ resumeData, setResumeData, onPreview, onBack, resumeId }: ResumeBuilderProps) => {
  const [currentSection, setCurrentSection] = useState(0);
  const { saveResume, updateResume } = useResumeStorage();
  const { toast } = useToast();

  const sections = [
    { id: "personal", title: "Personal Information", component: PersonalInfoForm, icon: "👤" },
    { id: "summary", title: "Professional Summary", component: SummaryForm, icon: "📝" },
    { id: "experience", title: "Work Experience", component: ExperienceForm, icon: "💼" },
    { id: "education", title: "Education", component: EducationForm, icon: "🎓" },
    { id: "skills", title: "Skills & Expertise", component: SkillsForm, icon: "⚡" },
    { id: "projects", title: "Projects", component: ProjectsForm, icon: "🚀" }
  ];

  const getCurrentSectionCompletion = () => {
    const section = sections[currentSection];
    switch (section.id) {
      case "personal":
        return resumeData.personalInfo.fullName && resumeData.personalInfo.email && resumeData.personalInfo.phone;
      case "summary":
        return resumeData.summary && resumeData.summary.length > 50;
      case "experience":
        return resumeData.experience && resumeData.experience.length > 0;
      case "education":
        return resumeData.education && resumeData.education.length > 0;
      case "skills":
        return resumeData.skills && resumeData.skills.length > 0;
      case "projects":
        return resumeData.projects && resumeData.projects.length > 0;
      default:
        return false;
    }
  };

  const getOverallCompletion = () => {
    const completedSections = sections.filter((_, index) => {
      const completion = sections.map((s, i) => {
        switch (s.id) {
          case "personal":
            return resumeData.personalInfo.fullName && resumeData.personalInfo.email && resumeData.personalInfo.phone;
          case "summary":
            return resumeData.summary && resumeData.summary.length > 50;
          case "experience":
            return resumeData.experience && resumeData.experience.length > 0;
          case "education":
            return resumeData.education && resumeData.education.length > 0;
          case "skills":
            return resumeData.skills && resumeData.skills.length > 0;
          case "projects":
            return resumeData.projects && resumeData.projects.length > 0;
          default:
            return false;
        }
      });
      return completion[index];
    });
    return Math.round((completedSections.length / sections.length) * 100);
  };

  const handleSaveResume = async () => {
    try {
      if (resumeId) {
        await updateResume(resumeId, resumeData);
      } else {
        await saveResume(resumeData);
      }
    } catch (error) {
      console.error('Error saving resume:', error);
    }
  };

  const handleAISuggestion = (suggestion: string) => {
    // Apply AI suggestion to current section
    const section = sections[currentSection];
    if (section.id === "summary") {
      setResumeData({
        ...resumeData,
        summary: suggestion
      });
    }
    // Add more section-specific handling as needed
  };

  const CurrentSectionComponent = sections[currentSection].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="text-purple-600 hover:text-purple-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Resume Builder
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                {getOverallCompletion()}% Complete
              </Badge>
              <Button 
                variant="outline" 
                onClick={handleSaveResume}
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button 
                variant="outline" 
                onClick={onPreview}
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Resume Sections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sections.map((section, index) => {
                  const isCompleted = (() => {
                    switch (section.id) {
                      case "personal":
                        return resumeData.personalInfo.fullName && resumeData.personalInfo.email && resumeData.personalInfo.phone;
                      case "summary":
                        return resumeData.summary && resumeData.summary.length > 50;
                      case "experience":
                        return resumeData.experience && resumeData.experience.length > 0;
                      case "education":
                        return resumeData.education && resumeData.education.length > 0;
                      case "skills":
                        return resumeData.skills && resumeData.skills.length > 0;
                      case "projects":
                        return resumeData.projects && resumeData.projects.length > 0;
                      default:
                        return false;
                    }
                  })();
                  
                  return (
                    <Button
                      key={section.id}
                      variant={currentSection === index ? "default" : "ghost"}
                      className={`w-full justify-start text-left h-auto p-3 ${
                        currentSection === index 
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white" 
                          : "hover:bg-purple-50"
                      }`}
                      onClick={() => setCurrentSection(index)}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <span className="text-lg">{section.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium">{section.title}</div>
                        </div>
                        {isCompleted && (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            {/* ATS Score Card */}
            <div className="mt-6">
              <ATSScoreCard resumeData={resumeData} />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader className="border-b border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center space-x-2">
                      <span className="text-2xl">{sections[currentSection].icon}</span>
                      <span>{sections[currentSection].title}</span>
                    </CardTitle>
                    <p className="text-gray-600 mt-1">
                      Fill out this section to build your professional resume
                    </p>
                  </div>
                  {getCurrentSectionCompletion() && (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CurrentSectionComponent 
                  resumeData={resumeData}
                  setResumeData={setResumeData}
                />
                
                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-purple-100">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                    disabled={currentSection === 0}
                    className="border-purple-200 text-purple-700 hover:bg-purple-50"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex space-x-2">
                    {currentSection < sections.length - 1 ? (
                      <Button
                        onClick={() => setCurrentSection(currentSection + 1)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      >
                        Next Section
                      </Button>
                    ) : (
                      <Button
                        onClick={onPreview}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview Resume
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      <AIAssistant onSuggestionApply={handleAISuggestion} />
    </div>
  );
};
