
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, XCircle, Target } from "lucide-react";

interface ATSScoreCardProps {
  resumeData: any;
}

export const ATSScoreCard = ({ resumeData }: ATSScoreCardProps) => {
  const calculateATSScore = () => {
    let score = 0;
    let maxScore = 100;
    
    // Personal Information (20 points)
    if (resumeData.personalInfo?.fullName) score += 5;
    if (resumeData.personalInfo?.email) score += 5;
    if (resumeData.personalInfo?.phone) score += 5;
    if (resumeData.personalInfo?.location) score += 5;
    
    // Professional Summary (15 points)
    if (resumeData.summary) {
      const wordCount = resumeData.summary.split(' ').filter((word: string) => word.length > 0).length;
      if (wordCount >= 25) score += 15;
      else if (wordCount >= 15) score += 10;
      else if (wordCount >= 5) score += 5;
    }
    
    // Work Experience (25 points)
    const experienceCount = resumeData.experience?.length || 0;
    if (experienceCount >= 3) score += 25;
    else if (experienceCount >= 2) score += 18;
    else if (experienceCount >= 1) score += 12;
    
    // Education (15 points)
    const educationCount = resumeData.education?.length || 0;
    if (educationCount >= 1) score += 15;
    
    // Skills (25 points)
    const skillsCount = resumeData.skills?.length || 0;
    if (skillsCount >= 10) score += 25;
    else if (skillsCount >= 7) score += 18;
    else if (skillsCount >= 5) score += 12;
    else if (skillsCount >= 3) score += 6;
    
    return Math.min(score, maxScore);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreStatus = (score: number) => {
    if (score >= 80) return { icon: CheckCircle, text: "Excellent", color: "green" };
    if (score >= 60) return { icon: AlertCircle, text: "Good", color: "yellow" };
    return { icon: XCircle, text: "Needs Work", color: "red" };
  };

  const getRecommendations = () => {
    const recommendations = [];
    
    if (!resumeData.personalInfo?.fullName || !resumeData.personalInfo?.email || !resumeData.personalInfo?.phone) {
      recommendations.push("Complete your contact information");
    }
    
    if (!resumeData.summary || resumeData.summary.split(' ').length < 25) {
      recommendations.push("Add a comprehensive professional summary (25+ words)");
    }
    
    if (!resumeData.experience || resumeData.experience.length === 0) {
      recommendations.push("Add your work experience");
    }
    
    if (!resumeData.education || resumeData.education.length === 0) {
      recommendations.push("Include your education background");
    }
    
    if (!resumeData.skills || resumeData.skills.length < 8) {
      recommendations.push("Add more relevant skills (aim for 8-12)");
    }
    
    return recommendations;
  };

  const score = calculateATSScore();
  const status = getScoreStatus(score);
  const recommendations = getRecommendations();
  const StatusIcon = status.icon;

  return (
    <Card className="bg-white border-purple-200 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Target className="h-5 w-5 text-purple-600" />
          <span>ATS Score</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score Display */}
        <div className="text-center">
          <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
            {score}%
          </div>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <StatusIcon className={`h-4 w-4 text-${status.color}-600`} />
            <Badge 
              className={`bg-${status.color}-100 text-${status.color}-800 border-${status.color}-200`}
            >
              {status.text}
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={score} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Contact Info</span>
            <span className={resumeData.personalInfo?.fullName && resumeData.personalInfo?.email && resumeData.personalInfo?.phone ? "text-green-600" : "text-red-600"}>
              {resumeData.personalInfo?.fullName && resumeData.personalInfo?.email && resumeData.personalInfo?.phone ? "✓" : "✗"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Summary</span>
            <span className={resumeData.summary && resumeData.summary.split(' ').length >= 25 ? "text-green-600" : "text-red-600"}>
              {resumeData.summary && resumeData.summary.split(' ').length >= 25 ? "✓" : "✗"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Experience</span>
            <span className={resumeData.experience?.length > 0 ? "text-green-600" : "text-red-600"}>
              {resumeData.experience?.length > 0 ? "✓" : "✗"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Education</span>
            <span className={resumeData.education?.length > 0 ? "text-green-600" : "text-red-600"}>
              {resumeData.education?.length > 0 ? "✓" : "✗"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Skills</span>
            <span className={resumeData.skills?.length >= 8 ? "text-green-600" : resumeData.skills?.length >= 5 ? "text-yellow-600" : "text-red-600"}>
              {resumeData.skills?.length || 0}/8+
            </span>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 text-sm">Recommendations:</h4>
            <ul className="space-y-1">
              {recommendations.slice(0, 3).map((rec, index) => (
                <li key={index} className="flex items-start space-x-2 text-xs text-gray-600">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Score Explanation */}
        <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
          <p>ATS Score measures how well your resume will perform with Applicant Tracking Systems.</p>
        </div>
      </CardContent>
    </Card>
  );
};
