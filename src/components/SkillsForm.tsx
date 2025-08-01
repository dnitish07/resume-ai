
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Zap, Code, Briefcase, Users } from "lucide-react";

interface SkillsFormProps {
  resumeData: any;
  setResumeData: (data: any) => void;
}

interface Skill {
  name: string;
  category: string;
  proficiency: string;
}

export const SkillsForm = ({ resumeData, setResumeData }: SkillsFormProps) => {
  const [newSkill, setNewSkill] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Technical");
  const [selectedProficiency, setSelectedProficiency] = useState("Intermediate");

  const skillCategories = [
    { id: "Technical", label: "Technical Skills", icon: Code },
    { id: "Soft", label: "Soft Skills", icon: Users },
    { id: "Industry", label: "Industry Knowledge", icon: Briefcase },
    { id: "Tools", label: "Tools & Software", icon: Zap }
  ];

  const proficiencyLevels = [
    "Beginner",
    "Intermediate", 
    "Advanced",
    "Expert"
  ];

  const suggestedSkills = {
    Technical: [
      "JavaScript", "Python", "React", "Node.js", "SQL", "Git", "HTML/CSS",
      "Java", "C++", "AWS", "Docker", "Kubernetes", "MongoDB", "PostgreSQL"
    ],
    Soft: [
      "Leadership", "Communication", "Problem Solving", "Team Collaboration",
      "Project Management", "Time Management", "Critical Thinking", "Adaptability"
    ],
    Industry: [
      "Digital Marketing", "Data Analysis", "Financial Modeling", "Sales Strategy",
      "Customer Service", "Quality Assurance", "Supply Chain", "Risk Management"
    ],
    Tools: [
      "Microsoft Office", "Google Workspace", "Slack", "Jira", "Trello",
      "Salesforce", "Adobe Creative Suite", "Figma", "Tableau", "Power BI"
    ]
  };

  const addSkill = (skillName?: string) => {
    const skill = skillName || newSkill;
    if (skill.trim()) {
      const newSkillObj: Skill = {
        name: skill.trim(),
        category: selectedCategory,
        proficiency: selectedProficiency
      };
      
      const existingSkills = resumeData.skills || [];
      const skillExists = existingSkills.some((s: Skill) => 
        s.name.toLowerCase() === skill.toLowerCase()
      );
      
      if (!skillExists) {
        setResumeData({
          ...resumeData,
          skills: [...existingSkills, newSkillObj]
        });
      }
      
      setNewSkill("");
    }
  };

  const removeSkill = (skillName: string) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter((skill: Skill) => skill.name !== skillName)
    });
  };

  const getSkillsByCategory = (category: string) => {
    return (resumeData.skills || []).filter((skill: Skill) => skill.category === category);
  };

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case "Expert": return "bg-green-100 text-green-800 border-green-200";
      case "Advanced": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Beginner": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* ATS Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Badge className="bg-blue-100 text-blue-700">ATS Tip</Badge>
          </div>
          <p className="text-sm text-blue-700">
            Include both hard and soft skills that match the job description. Use specific skill names 
            that ATS systems can recognize. Balance technical skills with interpersonal abilities.
          </p>
        </CardContent>
      </Card>

      {/* Add New Skill */}
      <Card className="bg-white border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-purple-600" />
            <span>Add Skills</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="skill">Skill Name</Label>
              <Input
                id="skill"
                placeholder="Enter a skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="border-purple-200 focus:border-purple-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {skillCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Proficiency</Label>
              <Select value={selectedProficiency} onValueChange={setSelectedProficiency}>
                <SelectTrigger className="border-purple-200 focus:border-purple-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {proficiencyLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={() => addSkill()}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            disabled={!newSkill.trim()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
        </CardContent>
      </Card>

      {/* Skills by Category */}
      <div className="grid md:grid-cols-2 gap-6">
        {skillCategories.map((category) => {
          const categorySkills = getSkillsByCategory(category.id);
          const CategoryIcon = category.icon;
          
          return (
            <Card key={category.id} className="bg-white border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <CategoryIcon className="h-5 w-5 text-purple-600" />
                  <span>{category.label}</span>
                  <Badge variant="secondary">{categorySkills.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {categorySkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill: Skill) => (
                      <Badge
                        key={skill.name}
                        className={`${getProficiencyColor(skill.proficiency)} cursor-pointer group relative`}
                      >
                        <span>{skill.name}</span>
                        <span className="ml-1 text-xs opacity-70">({skill.proficiency})</span>
                        <button
                          onClick={() => removeSkill(skill.name)}
                          className="ml-2 opacity-0 group-hover:opacity-100 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm italic">No skills added yet</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Suggested Skills */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 mb-4">Quick Add - Popular Skills</h4>
          <div className="space-y-4">
            {skillCategories.map((category) => (
              <div key={category.id}>
                <h5 className="font-medium text-gray-700 mb-2 flex items-center space-x-2">
                  <category.icon className="h-4 w-4" />
                  <span>{category.label}</span>
                </h5>
                <div className="flex flex-wrap gap-2">
                  {suggestedSkills[category.id as keyof typeof suggestedSkills].map((skill) => {
                    const alreadyAdded = (resumeData.skills || []).some((s: Skill) => 
                      s.name.toLowerCase() === skill.toLowerCase()
                    );
                    return (
                      <Badge
                        key={skill}
                        variant="outline"
                        className={`cursor-pointer hover:bg-purple-50 hover:border-purple-300 text-gray-700 ${
                          alreadyAdded ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() => {
                          if (!alreadyAdded) {
                            setSelectedCategory(category.id);
                            addSkill(skill);
                          }
                        }}
                      >
                        {alreadyAdded ? "✓ " : "+ "}{skill}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills Tips */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Skills Tips:</h4>
          <ul className="space-y-2">
            <li className="flex items-start space-x-2 text-sm text-gray-600">
              <span className="text-purple-600 mt-1">•</span>
              <span>Include 8-12 relevant skills that match the job description</span>
            </li>
            <li className="flex items-start space-x-2 text-sm text-gray-600">
              <span className="text-purple-600 mt-1">•</span>
              <span>Balance technical skills with soft skills</span>
            </li>
            <li className="flex items-start space-x-2 text-sm text-gray-600">
              <span className="text-purple-600 mt-1">•</span>
              <span>Use specific skill names (React vs. Frontend Development)</span>
            </li>
            <li className="flex items-start space-x-2 text-sm text-gray-600">
              <span className="text-purple-600 mt-1">•</span>
              <span>Only include skills you can confidently discuss in an interview</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
