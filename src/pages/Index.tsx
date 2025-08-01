
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Zap, Eye, CheckCircle, Star, Users, ArrowRight, Menu, User, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ResumeBuilder } from "@/components/ResumeBuilder";
import { ResumePreview } from "@/components/ResumePreview";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [currentView, setCurrentView] = useState<'landing' | 'builder' | 'preview'>('landing');
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedIn: "",
      website: ""
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: []
  });
  const [resumeId, setResumeId] = useState<string | undefined>();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (location.state) {
      const { startBuilding, resumeData: stateResumeData, resumeId: stateResumeId, showPreview, templateId } = location.state;
      
      if (stateResumeData) {
        setResumeData({
          ...stateResumeData,
          templateId: templateId || stateResumeData.templateId || 'modern'
        });
      } else if (templateId) {
        setResumeData(prev => ({
          ...prev,
          templateId: templateId
        }));
      }
      
      if (stateResumeId) {
        setResumeId(stateResumeId);
      }
      
      if (startBuilding) {
        setCurrentView('builder');
      } else if (showPreview) {
        setCurrentView('preview');
      }
      
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentView('landing');
  };

  const handleStartBuilding = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setCurrentView('builder');
  };

  const handlePreview = () => {
    setCurrentView('preview');
  };

  const handleBackToBuilder = () => {
    setCurrentView('builder');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setResumeData({
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        linkedIn: "",
        website: ""
      },
      summary: "",
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: []
    });
    setResumeId(undefined);
  };

  if (currentView === 'builder') {
    return (
      <ResumeBuilder
        resumeData={resumeData}
        setResumeData={setResumeData}
        onPreview={handlePreview}
        onBack={handleBackToLanding}
        resumeId={resumeId}
      />
    );
  }

  if (currentView === 'preview') {
    return (
      <ResumePreview
        resumeData={resumeData}
        onEdit={handleBackToBuilder}
        onBack={handleBackToLanding}
      />
    );
  }

  // Landing page
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                ResumeAI
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <Button variant="ghost" onClick={() => navigate("/templates")}>Templates</Button>
              {user && (
                <Button variant="ghost" onClick={() => navigate("/my-resumes")}>My Resumes</Button>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" onClick={() => navigate("/my-resumes")}>
                    <User className="h-4 w-4 mr-2" />
                    My Resumes
                  </Button>
                  <Button variant="ghost" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate("/auth")}>Sign In</Button>
                  <Button 
                    onClick={() => navigate("/auth")}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 bg-purple-100 text-purple-700">
            ✨ AI-Powered Resume Builder
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Build Your Perfect Resume in 
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Minutes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create ATS-optimized resumes that get noticed. Our AI-powered platform helps you craft 
            professional resumes that land interviews at top companies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={handleStartBuilding}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
            >
              <FileText className="mr-2 h-5 w-5" />
              Start Building Now
            </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate("/templates")}
                className="bg-purple-600 text-white hover:bg-purple-700 px-8 py-3 text-lg"
              >
                <Eye className="mr-2 h-5 w-5" />
                Browse Templates
              </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose ResumeAI?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform combines cutting-edge AI technology with professional design 
            to help you create resumes that stand out.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">ATS-Optimized</h3>
            <p className="text-gray-600">
              Our templates are designed to pass through Applicant Tracking Systems, 
              ensuring your resume reaches human recruiters.
            </p>
          </Card>

          <Card className="text-center p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Star className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Professional Templates</h3>
            <p className="text-gray-600">
              Choose from a variety of professionally designed templates that 
              showcase your experience in the best light.
            </p>
          </Card>

          <Card className="text-center p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Real-time Preview</h3>
            <p className="text-gray-600">
              See your resume come to life as you build it with our real-time 
              preview feature. What you see is what you get.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center p-12">
          <CardContent>
            <h2 className="text-3xl font-bold mb-4">Ready to Land Your Dream Job?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of professionals who have successfully landed interviews 
              using our AI-powered resume builder.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={handleStartBuilding}
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              >
                Build Resume Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate("/templates")}
                className="bg-purple-600 text-white hover:bg-purple-700 px-8 py-3 text-lg"
              >
                Browse Templates
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-purple-600 mb-2">50K+</div>
            <p className="text-gray-600">Resumes Created</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
            <p className="text-gray-600">ATS Pass Rate</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 mb-2">4.9/5</div>
            <p className="text-gray-600">User Rating</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-purple-100 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="p-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">ResumeAI</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-600">
              <a href="#" className="hover:text-purple-600">Privacy Policy</a>
              <a href="#" className="hover:text-purple-600">Terms of Service</a>
              <a href="#" className="hover:text-purple-600">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
