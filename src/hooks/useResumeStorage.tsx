
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useResumeStorage = () => {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setResumes([]);
        return;
      }

      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching resumes:', error);
        toast({
          title: "Error",
          description: "Failed to load your resumes",
          variant: "destructive",
        });
        return;
      }

      setResumes(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveResume = async (resumeData: any, title?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to save your resume",
          variant: "destructive",
        });
        return null;
      }

      const resumeToSave = {
        user_id: user.id,
        title: title || resumeData.title || 'Untitled Resume',
        template_id: resumeData.templateId || resumeData.template_id || 'modern',
        personal_info: resumeData.personalInfo || {},
        summary: resumeData.summary || '',
        experience: resumeData.experience || [],
        education: resumeData.education || [],
        skills: resumeData.skills || [],
        projects: resumeData.projects || [],
        certifications: resumeData.certifications || []
      };

      const { data, error } = await supabase
        .from('resumes')
        .insert([resumeToSave])
        .select()
        .single();

      if (error) {
        console.error('Error saving resume:', error);
        toast({
          title: "Error",
          description: "Failed to save your resume",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Success",
        description: "Resume saved successfully",
      });

      await fetchResumes();
      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const updateResume = async (id: string, resumeData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      const resumeToUpdate = {
        title: resumeData.title || 'Untitled Resume',
        template_id: resumeData.templateId || resumeData.template_id || 'modern',
        personal_info: resumeData.personalInfo || {},
        summary: resumeData.summary || '',
        experience: resumeData.experience || [],
        education: resumeData.education || [],
        skills: resumeData.skills || [],
        projects: resumeData.projects || [],
        certifications: resumeData.certifications || [],
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('resumes')
        .update(resumeToUpdate)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating resume:', error);
        toast({
          title: "Error",
          description: "Failed to update your resume",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Success",
        description: "Resume updated successfully",
      });

      await fetchResumes();
      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const deleteResume = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return false;

      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting resume:', error);
        toast({
          title: "Error",
          description: "Failed to delete your resume",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Resume deleted successfully",
      });

      await fetchResumes();
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  return {
    resumes,
    loading,
    saveResume,
    updateResume,
    deleteResume,
    refreshResumes: fetchResumes
  };  
};
