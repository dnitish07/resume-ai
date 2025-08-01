
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, FileText, Target } from "lucide-react";

interface SummaryFormProps {
  resumeData: any;
  setResumeData: (data: any) => void;
}

export const SummaryForm = ({ resumeData, setResumeData }: SummaryFormProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const updateSummary = (value: string) => {
    setResumeData({
      ...resumeData,
      summary: value
    });
  };

  const summaryTemplates = [
    {
      id: "experienced",
      title: "Experienced Professional",
      template: "Results-driven [Your Role] with [X] years of experience in [Industry/Field]. Proven track record of [Key Achievement] and expertise in [Core Skills]. Seeking to leverage [Specific Skills] to drive [Desired Outcome] at [Target Company Type]."
    },
    {
      id: "entry-level",
      title: "Entry-Level/Recent Graduate",
      template: "Motivated [Degree] graduate with strong foundation in [Relevant Skills/Knowledge]. Demonstrated ability to [Key Accomplishment] through [Experience Type]. Eager to apply [Specific Skills] and contribute to [Target Role/Industry] success."
    },
    {
      id: "career-change",
      title: "Career Changer",
      template: "Accomplished professional transitioning from [Previous Field] to [Target Field] with [X] years of transferable experience in [Relevant Skills]. Strong background in [Transferable Skills] with proven ability to [Key Achievement]. Committed to leveraging [Unique Value] in [New Industry]."
    }
  ];

  const keywordSuggestions = [
    "Results-driven", "Detail-oriented", "Strategic", "Innovative", "Collaborative",
    "Leadership", "Problem-solving", "Communication", "Project management", "Data analysis",
    "Customer-focused", "Process improvement", "Team building", "Revenue growth", "Cost reduction"
  ];

  const useTemplate = (template: string) => {
    updateSummary(template);
    setSelectedTemplate("");
  };

  const wordCount = resumeData.summary ? resumeData.summary.split(' ').filter((word: string) => word.length > 0).length : 0;
  const charCount = resumeData.summary ? resumeData.summary.length : 0;

  return (
    <div className="space-y-6">
      {/* ATS Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Badge className="bg-blue-100 text-blue-700">ATS Tip</Badge>
          </div>
          <p className="text-sm text-blue-700">
            Write a compelling summary that includes relevant keywords from the job description. 
            Keep it between 3-4 sentences and focus on your value proposition.
          </p>
        </CardContent>
      </Card>

      {/* Summary Templates */}
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <h4 className="font-semibold text-purple-900">Quick Start Templates</h4>
          </div>
          <div className="grid gap-3">
            {summaryTemplates.map((template) => (
              <div key={template.id} className="p-3 bg-white rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900">{template.title}</h5>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => useTemplate(template.template)}
                    className="text-purple-600 border-purple-300 hover:bg-purple-50"
                  >
                    Use Template
                  </Button>
                </div>
                <p className="text-sm text-gray-600">{template.template}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Input */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="summary" className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-purple-600" />
            <span>Professional Summary</span>
          </Label>
          <div className="flex space-x-4 text-sm text-gray-500">
            <span>{wordCount} words</span>
            <span className={charCount > 500 ? "text-red-500" : ""}>{charCount}/500 characters</span>
          </div>
        </div>
        <Textarea
          id="summary"
          placeholder="Write a compelling professional summary that highlights your key strengths, experience, and career objectives..."
          value={resumeData.summary || ""}
          onChange={(e) => updateSummary(e.target.value)}
          className="min-h-[120px] border-purple-200 focus:border-purple-500 resize-none"
          maxLength={500}
        />
        <div className="flex items-center space-x-2 text-sm">
          {wordCount < 25 && (
            <Badge variant="destructive">Too short - aim for 25+ words</Badge>
          )}
          {wordCount >= 25 && wordCount <= 50 && (
            <Badge className="bg-green-100 text-green-700">Good length</Badge>
          )}
          {wordCount > 50 && (
            <Badge className="bg-yellow-100 text-yellow-700">Consider shortening</Badge>
          )}
        </div>
      </div>

      {/* Keyword Suggestions */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Target className="h-4 w-4 text-gray-600" />
            <h4 className="font-semibold text-gray-900">Power Words & Keywords</h4>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Click to add these impactful keywords to your summary:
          </p>
          <div className="flex flex-wrap gap-2">
            {keywordSuggestions.map((keyword, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-purple-50 hover:border-purple-300 text-gray-700"
                onClick={() => {
                  const currentSummary = resumeData.summary || "";
                  if (!currentSummary.toLowerCase().includes(keyword.toLowerCase())) {
                    updateSummary(currentSummary + (currentSummary ? " " : "") + keyword.toLowerCase());
                  }
                }}
              >
                {keyword}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Writing Tips */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Writing Tips:</h4>
          <ul className="space-y-2">
            <li className="flex items-start space-x-2 text-sm text-gray-600">
              <span className="text-purple-600 mt-1">•</span>
              <span>Start with your most impressive achievement or years of experience</span>
            </li>
            <li className="flex items-start space-x-2 text-sm text-gray-600">
              <span className="text-purple-600 mt-1">•</span>
              <span>Include 2-3 key skills that match the job requirements</span>
            </li>
            <li className="flex items-start space-x-2 text-sm text-gray-600">
              <span className="text-purple-600 mt-1">•</span>
              <span>End with your career goal or what value you bring</span>
            </li>
            <li className="flex items-start space-x-2 text-sm text-gray-600">
              <span className="text-purple-600 mt-1">•</span>
              <span>Use action words and quantify achievements when possible</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
