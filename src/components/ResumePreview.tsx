
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, Edit, Mail, Phone, MapPin, Linkedin, Globe, Save } from "lucide-react";
import { useResumeStorage } from "@/hooks/useResumeStorage";
import { useToast } from "@/hooks/use-toast";
import { AIAssistant } from "./AIAssistant";
import { SaveResumeDialog } from "./SaveResumeDialog";

interface ResumePreviewProps {
  resumeData: any;
  onEdit: () => void;
  onBack: () => void;
  resumeId?: string;
}

export const ResumePreview = ({ resumeData, onEdit, onBack, resumeId }: ResumePreviewProps) => {
  const { saveResume, updateResume } = useResumeStorage();
  const { toast } = useToast();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  const handleDownload = () => {
    // Hide all UI elements during print
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      @media print {
        body * { visibility: hidden; }
        #resume-content, #resume-content * { visibility: visible; }
        #resume-content { 
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .print-hide { display: none !important; }
      }
    `;
    document.head.appendChild(styleElement);
    
    window.print();
    
    // Remove the style after printing
    setTimeout(() => {
      document.head.removeChild(styleElement);
    }, 1000);
  };

  const handleSave = async (title: string) => {
    try {
      const resumeDataWithTitle = { ...resumeData, title };
      if (resumeId) {
        await updateResume(resumeId, resumeDataWithTitle);
      } else {
        await saveResume(resumeDataWithTitle, title);
      }
      toast({
        title: "Success",
        description: "Resume saved successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatTechnologies = (technologies: string[]) => {
    if (!technologies || technologies.length === 0) return '';
    if (technologies.length === 1) return technologies[0];
    return technologies.map((tech, index) => `${index + 1}. ${tech}`).join(' • ');
  };

  const formatListItems = (items: string[]) => {
    if (!items || items.length === 0) return [];
    return items.filter(item => item.trim());
  };

  const getTemplateStyles = () => {
    const templateId = resumeData.templateId || 'modern';
    
    switch (templateId) {
      case 'classic':
        return {
          container: 'font-serif bg-white',
          headerStyle: 'text-center border-b-2 border-gray-800 pb-4 mb-6',
          sectionTitle: 'text-lg font-bold text-gray-900 border-b-2 border-gray-800 pb-1 mb-3 uppercase tracking-wide',
          nameStyle: 'text-4xl font-bold text-gray-900 mb-2',
          contactStyle: 'text-gray-700 text-sm space-y-1',
          contentStyle: 'text-gray-800 text-sm leading-relaxed',
          experienceStyle: 'border-l-2 border-gray-300 pl-4 ml-2',
          companyStyle: 'text-gray-600 font-medium',
          jobTitleStyle: 'text-lg font-semibold text-gray-900',
          layout: 'single-column'
        };
      case 'minimal':
        return {
          container: 'font-light bg-white',
          headerStyle: 'mb-8 text-left',
          sectionTitle: 'text-lg font-light text-gray-800 mb-3 uppercase tracking-widest',
          nameStyle: 'text-5xl font-thin text-gray-900 mb-2',
          contactStyle: 'text-gray-600 text-sm font-light flex flex-wrap gap-4',
          contentStyle: 'text-gray-700 text-sm leading-loose font-light',
          experienceStyle: 'space-y-4',
          companyStyle: 'text-gray-500 font-light',
          jobTitleStyle: 'text-lg font-light text-gray-900',
          layout: 'single-column'
        };
      case 'creative':
        return {
          container: 'bg-gradient-to-br from-blue-50 to-purple-50 font-sans',
          headerStyle: 'text-center mb-8 p-6 bg-white/50 rounded-lg',
          sectionTitle: 'text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 uppercase',
          nameStyle: 'text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2',
          contactStyle: 'text-gray-700 text-sm flex flex-wrap justify-center gap-3',
          contentStyle: 'text-gray-800 text-sm leading-relaxed',
          experienceStyle: 'bg-white/30 p-4 rounded-lg shadow-sm space-y-3',
          companyStyle: 'text-blue-600 font-medium',
          jobTitleStyle: 'text-lg font-semibold text-gray-900',
          layout: 'two-column'
        };
      case 'modern':
      default:
        return {
          container: 'font-sans bg-white',
          headerStyle: 'text-center mb-8',
          sectionTitle: 'text-xl font-bold text-gray-900 mb-4 border-b-2 border-purple-200 pb-1',
          nameStyle: 'text-4xl font-bold text-gray-900 mb-2',
          contactStyle: 'text-gray-700 text-base flex flex-wrap justify-center gap-4',
          contentStyle: 'text-gray-800 text-base leading-relaxed',
          experienceStyle: 'space-y-4',
          companyStyle: 'text-purple-600 font-medium',
          jobTitleStyle: 'text-lg font-semibold text-gray-900',
          layout: 'single-column'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50 print-hide">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="text-purple-600 hover:text-purple-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Resume Preview
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={() => setSaveDialogOpen(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Resume
              </Button>
              <Button 
                variant="outline" 
                onClick={onEdit}
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Resume
              </Button>
              <Button 
                onClick={handleDownload}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Resume Preview */}
        <Card id="resume-content" className={`max-w-4xl mx-auto shadow-2xl print:shadow-none print:max-w-none ${getTemplateStyles().container}`}>
          <CardContent className="p-8 print:p-6">
            {/* Header Section */}
            <div className={`${getTemplateStyles().headerStyle} print:mb-6`}>
              <h1 className={`${getTemplateStyles().nameStyle} print:text-3xl`}>
                {resumeData.personalInfo?.fullName || "Your Name"}
              </h1>
              <div className={getTemplateStyles().contactStyle}>
                {resumeData.personalInfo?.email && (
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>{resumeData.personalInfo.email}</span>
                  </div>
                )}
                {resumeData.personalInfo?.phone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="h-4 w-4" />
                    <span>{resumeData.personalInfo.phone}</span>
                  </div>
                )}
                {resumeData.personalInfo?.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{resumeData.personalInfo.location}</span>
                  </div>
                )}
                {resumeData.personalInfo?.linkedIn && (
                  <div className="flex items-center space-x-1">
                    <Linkedin className="h-4 w-4" />
                    <span>{resumeData.personalInfo.linkedIn}</span>
                  </div>
                )}
                {resumeData.personalInfo?.website && (
                  <div className="flex items-center space-x-1">
                    <Globe className="h-4 w-4" />
                    <span>{resumeData.personalInfo.website}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Summary */}
            {resumeData.summary && (
              <div className="mb-8 print:mb-6">
                <h2 className={getTemplateStyles().sectionTitle}>
                  PROFESSIONAL SUMMARY
                </h2>
                <p className={getTemplateStyles().contentStyle}>{resumeData.summary}</p>
              </div>
            )}

            {/* Work Experience */}
            {resumeData.experience && resumeData.experience.length > 0 && (
              <div className="mb-8 print:mb-6">
                <h2 className={getTemplateStyles().sectionTitle}>
                  PROFESSIONAL EXPERIENCE
                </h2>
                <div className={getTemplateStyles().experienceStyle}>
                  {resumeData.experience.map((exp: any, index: number) => (
                    <div key={index} className="mb-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className={getTemplateStyles().jobTitleStyle}>{exp.jobTitle}</h3>
                          <p className={getTemplateStyles().companyStyle}>{exp.company}</p>
                        </div>
                        <div className={`text-right text-sm ${getTemplateStyles().contentStyle}`}>
                          <p>{exp.startDate} - {exp.current ? "Present" : exp.endDate}</p>
                          {exp.location && <p>{exp.location}</p>}
                        </div>
                      </div>
                      <div className="ml-0">
                        {exp.responsibilities && formatListItems(exp.responsibilities).length > 0 && (
                          <ul className={`list-disc list-inside space-y-1 ${getTemplateStyles().contentStyle}`}>
                            {formatListItems(exp.responsibilities).map((resp: string, idx: number) => (
                              <li key={idx}>{resp}</li>
                            ))}
                          </ul>
                        )}
                        {exp.achievements && formatListItems(exp.achievements).length > 0 && (
                          <ul className={`list-disc list-inside space-y-1 ${getTemplateStyles().contentStyle} mt-2`}>
                            {formatListItems(exp.achievements).map((achievement: string, idx: number) => (
                              <li key={idx} className="font-medium">{achievement}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {resumeData.projects && resumeData.projects.length > 0 && (
              <div className="mb-8 print:mb-6">
                <h2 className={getTemplateStyles().sectionTitle}>
                  KEY PROJECTS
                </h2>
                <div className="space-y-4">
                  {resumeData.projects.map((project: any, index: number) => (
                    <div key={index} className={resumeData.templateId === 'creative' ? 'bg-white/30 p-4 rounded-lg' : ''}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className={`text-lg font-semibold ${getTemplateStyles().contentStyle}`}>{project.name}</h3>
                          {project.technologies && project.technologies.length > 0 && (
                            <p className="text-sm text-purple-600 font-medium mt-1">
                              <strong>Technologies:</strong> {formatTechnologies(project.technologies)}
                            </p>
                          )}
                        </div>
                        <div className={`text-right text-sm ${getTemplateStyles().contentStyle}`}>
                          <p>{project.startDate} - {project.current ? "Present" : project.endDate}</p>
                        </div>
                      </div>
                      <div className="mb-3">
                        {resumeData.projects.length >= 2 ? (
                          <ul className={`list-disc list-inside space-y-1 ${getTemplateStyles().contentStyle}`}>
                            <li>{project.description}</li>
                          </ul>
                        ) : (
                          <p className={getTemplateStyles().contentStyle}>{project.description}</p>
                        )}
                      </div>
                      {(project.link || project.github) && (
                        <div className="flex space-x-4 text-sm">
                          {project.link && (
                            <a href={project.link} className="text-purple-600 hover:underline" target="_blank" rel="noopener noreferrer">
                              • Live Demo
                            </a>
                          )}
                          {project.github && (
                            <a href={project.github} className="text-purple-600 hover:underline" target="_blank" rel="noopener noreferrer">
                              • GitHub Repository
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {resumeData.education && resumeData.education.length > 0 && (
              <div className="mb-8 print:mb-6">
                <h2 className={getTemplateStyles().sectionTitle}>
                  EDUCATION
                </h2>
                <div className="space-y-4">
                  {resumeData.education.map((edu: any, index: number) => (
                    <div key={index} className={`flex justify-between items-start ${resumeData.templateId === 'creative' ? 'bg-white/30 p-4 rounded-lg' : ''}`}>
                      <div>
                        <h3 className={`text-lg font-semibold ${getTemplateStyles().contentStyle}`}>
                          {edu.degree} {edu.major && `in ${edu.major}`}
                        </h3>
                        <p className="text-purple-600 font-medium">{edu.school}</p>
                        <div className={`flex items-center space-x-4 text-sm ${getTemplateStyles().contentStyle} mt-1`}>
                          {edu.location && <span>• {edu.location}</span>}
                          {edu.gpa && <span>• {edu.gradeType || 'GPA'}: {edu.gpa}</span>}
                          {edu.honors && <span className="font-medium text-yellow-700">• {edu.honors}</span>}
                        </div>
                      </div>
                      {edu.graduationDate && (
                        <div className={`text-right text-sm ${getTemplateStyles().contentStyle}`}>
                          <p>Graduated: {edu.graduationDate}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {resumeData.skills && resumeData.skills.length > 0 && (
              <div className="mb-8 print:mb-6">
                <h2 className={getTemplateStyles().sectionTitle}>
                  SKILLS
                </h2>
                <div className={`space-y-2 ${resumeData.templateId === 'creative' ? 'bg-white/30 p-4 rounded-lg' : ''}`}>
                  {resumeData.skills.length > 5 ? (
                    <ul className={`list-decimal list-inside space-y-1 ${getTemplateStyles().contentStyle}`}>
                      {resumeData.skills.map((skill: any, index: number) => (
                        <li key={index}>{skill.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <ul className={`list-disc list-inside space-y-1 ${getTemplateStyles().contentStyle}`}>
                      {resumeData.skills.map((skill: any, index: number) => (
                        <li key={index}>{skill.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Print Instructions */}
        <div className="max-w-4xl mx-auto mt-6 text-center text-sm text-gray-600 print-hide">
          <p>
            Click "Download PDF" to save your resume. For best results, use Chrome or Edge browser 
            and set margins to "Minimum" in print settings.
          </p>
        </div>
      </div>

      {/* AI Assistant */}
      <div className="print-hide">
        <AIAssistant />
      </div>

      {/* Save Resume Dialog */}
      <SaveResumeDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        onSave={handleSave}
        defaultTitle={resumeData.title || `${resumeData.personalInfo?.fullName || "My"} Resume`}
      />

      {/* Print Styles */}
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; }
          .print-hide { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:max-w-none { max-width: none !important; }
          .print\\:p-6 { padding: 1.5rem !important; }
          .print\\:mb-6 { margin-bottom: 1.5rem !important; }
          .print\\:text-3xl { font-size: 1.875rem !important; }
          @page { margin: 0.5in; }
        }
      `}</style>
    </div>
  );
};
