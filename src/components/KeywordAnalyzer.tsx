
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, Target, TrendingUp, AlertCircle } from "lucide-react";

interface KeywordAnalyzerProps {
  resumeData: any;
}

export const KeywordAnalyzer = ({ resumeData }: KeywordAnalyzerProps) => {
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);

  const analyzeKeywords = () => {
    if (!jobDescription.trim()) return;

    // Extract keywords from job description
    const jobKeywords = extractKeywords(jobDescription);
    
    // Extract keywords from resume
    const resumeText = getResumeText(resumeData);
    const resumeKeywords = extractKeywords(resumeText);

    // Find matches and missing keywords
    const matches = jobKeywords.filter(keyword => 
      resumeKeywords.some(resumeKeyword => 
        resumeKeyword.toLowerCase().includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(resumeKeyword.toLowerCase())
      )
    );

    const missing = jobKeywords.filter(keyword => 
      !resumeKeywords.some(resumeKeyword => 
        resumeKeyword.toLowerCase().includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(resumeKeyword.toLowerCase())
      )
    );

    const matchPercentage = Math.round((matches.length / jobKeywords.length) * 100);

    setAnalysis({
      jobKeywords,
      resumeKeywords,
      matches,
      missing,
      matchPercentage
    });
  };

  const extractKeywords = (text: string) => {
    // Common stop words to filter out
    const stopWords = new Set([
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 
      'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 
      'after', 'above', 'below', 'between', 'among', 'through', 'during',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
      'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
      'must', 'can', 'shall', 'a', 'an', 'this', 'that', 'these', 'those'
    ]);

    // Extract words and phrases
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));

    // Count word frequency
    const wordCount: { [key: string]: number } = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    // Return most frequent words
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([word]) => word);
  };

  const getResumeText = (data: any) => {
    let text = '';
    
    // Add personal info
    if (data.personalInfo) {
      text += Object.values(data.personalInfo).join(' ') + ' ';
    }
    
    // Add summary
    if (data.summary) {
      text += data.summary + ' ';
    }
    
    // Add experience
    if (data.experience) {
      data.experience.forEach((exp: any) => {
        text += `${exp.jobTitle} ${exp.company} `;
        if (exp.responsibilities) {
          text += exp.responsibilities.join(' ') + ' ';
        }
        if (exp.achievements) {
          text += exp.achievements.join(' ') + ' ';
        }
      });
    }
    
    // Add education
    if (data.education) {
      data.education.forEach((edu: any) => {
        text += `${edu.degree} ${edu.major} ${edu.school} `;
      });
    }
    
    // Add skills
    if (data.skills) {
      data.skills.forEach((skill: any) => {
        text += skill.name + ' ';
      });
    }
    
    return text;
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="bg-white border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-purple-600" />
          <span>Keyword Analyzer</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="jobDescription">Paste Job Description</Label>
          <Textarea
            id="jobDescription"
            placeholder="Paste the job description here to analyze keyword matches..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[120px] border-purple-200 focus:border-purple-500"
          />
        </div>
        
        <Button 
          onClick={analyzeKeywords}
          disabled={!jobDescription.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
        >
          <Target className="h-4 w-4 mr-2" />
          Analyze Keywords
        </Button>

        {analysis && (
          <div className="space-y-4 mt-6">
            {/* Match Score */}
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`text-3xl font-bold ${getMatchColor(analysis.matchPercentage)}`}>
                {analysis.matchPercentage}%
              </div>
              <p className="text-sm text-gray-600">Keyword Match Score</p>
            </div>

            {/* Matched Keywords */}
            <div>
              <h4 className="font-semibold text-green-700 mb-2 flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Matched Keywords ({analysis.matches.length})</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.matches.map((keyword: string, index: number) => (
                  <Badge key={index} className="bg-green-100 text-green-800 border-green-200">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Missing Keywords */}
            {analysis.missing.length > 0 && (
              <div>
                <h4 className="font-semibold text-red-700 mb-2 flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>Missing Keywords ({analysis.missing.length})</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.missing.slice(0, 10).map((keyword: string, index: number) => (
                    <Badge key={index} className="bg-red-100 text-red-800 border-red-200">
                      {keyword}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Consider incorporating these keywords naturally into your resume content.
                </p>
              </div>
            )}

            {/* Recommendations */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Recommendations:</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                {analysis.matchPercentage < 60 && (
                  <li>• Add more relevant keywords from the job description</li>
                )}
                {analysis.missing.length > 5 && (
                  <li>• Focus on incorporating the most important missing keywords</li>
                )}
                <li>• Use keywords naturally in your experience descriptions</li>
                <li>• Include both acronyms and full forms (e.g., "AI" and "Artificial Intelligence")</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
