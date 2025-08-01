
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Code, Globe } from "lucide-react";

interface ProjectsFormProps {
  resumeData: any;
  setResumeData: (data: any) => void;
}

export const ProjectsForm = ({ resumeData, setResumeData }: ProjectsFormProps) => {
  const [currentProject, setCurrentProject] = useState({
    name: "",
    description: "",
    technologies: "",
    link: "",
    github: "",
    startDate: "",
    endDate: "",
    current: false
  });

  const addProject = () => {
    if (!currentProject.name) return;

    const newProject = {
      ...currentProject,
      technologies: currentProject.technologies.split(",").map(tech => tech.trim()).filter(tech => tech)
    };

    setResumeData({
      ...resumeData,
      projects: [...(resumeData.projects || []), newProject]
    });

    setCurrentProject({
      name: "",
      description: "",
      technologies: "",
      link: "",
      github: "",
      startDate: "",
      endDate: "",
      current: false
    });
  };

  const removeProject = (index: number) => {
    const updatedProjects = resumeData.projects.filter((_: any, i: number) => i !== index);
    setResumeData({
      ...resumeData,
      projects: updatedProjects
    });
  };

  const tips = [
    "Include 2-4 of your most impressive projects",
    "Focus on projects that demonstrate relevant skills",
    "Include both personal and professional projects",
    "Mention the impact or results of your projects"
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
            Projects showcase your practical skills and initiative. Include relevant technologies
            and quantifiable outcomes when possible.
          </p>
        </CardContent>
      </Card>

      {/* Current Projects */}
      {resumeData.projects && resumeData.projects.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Projects</h3>
          {resumeData.projects.map((project: any, index: number) => (
            <Card key={index} className="border-purple-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{project.name}</h4>
                    <p className="text-sm text-gray-600">{project.startDate} - {project.current ? "Present" : project.endDate}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProject(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-700 mb-2">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {project.technologies.map((tech: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex space-x-2">
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700">
                      <Globe className="h-4 w-4" />
                    </a>
                  )}
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700">
                      <Code className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add New Project */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5 text-purple-600" />
            <span>Add Project</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name *</Label>
              <Input
                id="projectName"
                placeholder="E-commerce Website"
                value={currentProject.name}
                onChange={(e) => setCurrentProject({...currentProject, name: e.target.value})}
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="technologies">Technologies (comma-separated)</Label>
              <Input
                id="technologies"
                placeholder="React, Node.js, MongoDB"
                value={currentProject.technologies}
                onChange={(e) => setCurrentProject({...currentProject, technologies: e.target.value})}
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectDescription">Description *</Label>
            <Textarea
              id="projectDescription"
              placeholder="Describe what you built, the problem it solved, and your role..."
              value={currentProject.description}
              onChange={(e) => setCurrentProject({...currentProject, description: e.target.value})}
              className="border-purple-200 focus:border-purple-500 min-h-[100px]"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectLink">Live Demo URL</Label>
              <Input
                id="projectLink"
                placeholder="https://project-demo.com"
                value={currentProject.link}
                onChange={(e) => setCurrentProject({...currentProject, link: e.target.value})}
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="githubLink">GitHub Repository</Label>
              <Input
                id="githubLink"
                placeholder="https://github.com/username/project"
                value={currentProject.github}
                onChange={(e) => setCurrentProject({...currentProject, github: e.target.value})}
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectStartDate">Start Date</Label>
              <Input
                id="projectStartDate"
                type="month"
                value={currentProject.startDate}
                onChange={(e) => setCurrentProject({...currentProject, startDate: e.target.value})}
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectEndDate">End Date</Label>
              <Input
                id="projectEndDate"
                type="month"
                value={currentProject.endDate}
                onChange={(e) => setCurrentProject({...currentProject, endDate: e.target.value})}
                disabled={currentProject.current}
                className="border-purple-200 focus:border-purple-500"
              />
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  id="currentProject"
                  checked={currentProject.current}
                  onChange={(e) => setCurrentProject({...currentProject, current: e.target.checked})}
                  className="rounded border-purple-300"
                />
                <Label htmlFor="currentProject" className="text-sm">Currently working on this</Label>
              </div>
            </div>
          </div>

          <Button 
            onClick={addProject}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Project Tips:</h4>
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
