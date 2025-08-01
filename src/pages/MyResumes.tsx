
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, ArrowLeft, Eye, Edit, Trash2, Plus, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useResumeStorage } from "@/hooks/useResumeStorage";
import { User } from "@supabase/supabase-js";

const MyResumes = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const { resumes, loading, deleteResume } = useResumeStorage();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (!user) {
        navigate("/auth");
      }
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleEditResume = (resume: any) => {
    const resumeData = {
      personalInfo: resume.personal_info || {},
      summary: resume.summary || '',
      experience: resume.experience || [],
      education: resume.education || [],
      skills: resume.skills || [],
      projects: resume.projects || [],
      certifications: resume.certifications || [],
      templateId: resume.template_id || 'modern',
      title: resume.title
    };

    navigate("/", { 
      state: { 
        resumeData, 
        resumeId: resume.id,
        startBuilding: true 
      } 
    });
  };

  const handlePreviewResume = (resume: any) => {
    const resumeData = {
      personalInfo: resume.personal_info || {},
      summary: resume.summary || '',
      experience: resume.experience || [],
      education: resume.education || [],
      skills: resume.skills || [],
      projects: resume.projects || [],
      certifications: resume.certifications || [],
      templateId: resume.template_id || 'modern'
    };

    navigate("/", { 
      state: { 
        resumeData, 
        showPreview: true 
      } 
    });
  };

  const handleDeleteResume = async (resumeId: string) => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      await deleteResume(resumeId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate("/")} className="text-purple-600 hover:text-purple-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  My Resumes
                </h1>
              </div>
            </div>
            <Button 
              onClick={() => navigate("/", { state: { startBuilding: true } })}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Resume
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-2 text-gray-600">Loading your resumes...</p>
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-8">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No resumes yet</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Start building your professional resume to showcase your skills and experience.
              </p>
            </div>
            <Button 
              onClick={() => navigate("/", { state: { startBuilding: true } })}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Resume
            </Button>
          </div>
        ) : (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Your Resume Collection
              </h2>
              <p className="text-xl text-gray-600">
                Manage and update your professional resumes
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {resumes.map((resume) => (
                <Card key={resume.id} className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-0">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold text-gray-900 mb-2">
                          {resume.title}
                        </CardTitle>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>Updated {formatDate(resume.updated_at)}</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                        {resume.template_id}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Resume Preview Info */}
                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      {resume.personal_info?.fullName && (
                        <p><strong>Name:</strong> {resume.personal_info.fullName}</p>
                      )}
                      {resume.experience?.length > 0 && (
                        <p><strong>Experience:</strong> {resume.experience.length} positions</p>
                      )}
                      {resume.education?.length > 0 && (
                        <p><strong>Education:</strong> {resume.education.length} entries</p>
                      )}
                      {resume.projects?.length > 0 && (
                        <p><strong>Projects:</strong> {resume.projects.length} projects</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleEditResume(resume)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                        size="sm"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handlePreviewResume(resume)}
                        className="border-purple-200 text-purple-700 hover:bg-purple-50"
                        size="sm"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleDeleteResume(resume.id)}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyResumes;
