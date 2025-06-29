
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, X } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string | null;
  body: string | null;
  philosophy: string | null;
  what_sets_apart: string[] | null;
}

export const ContentManager = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    philosophy: '',
    what_sets_apart: [] as string[]
  });
  const [newItem, setNewItem] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .in('id', ['home', 'about']);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch content",
        variant: "destructive",
      });
    } else {
      setContent(data || []);
    }
  };

  const handleEdit = (item: ContentItem) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || '',
      body: item.body || '',
      philosophy: item.philosophy || '',
      what_sets_apart: item.what_sets_apart || []
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingId) return;

    const updateData: any = {
      title: formData.title,
      body: formData.body,
      updated_at: new Date().toISOString()
    };

    if (editingId === 'about') {
      updateData.philosophy = formData.philosophy;
      updateData.what_sets_apart = formData.what_sets_apart;
    }

    const { error } = await supabase
      .from('content')
      .update(updateData)
      .eq('id', editingId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Content updated successfully",
      });
      setEditingId(null);
      setFormData({ title: '', body: '', philosophy: '', what_sets_apart: [] });
      fetchContent();
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: '', body: '', philosophy: '', what_sets_apart: [] });
  };

  const addWhatSetsApart = () => {
    if (newItem.trim()) {
      setFormData({
        ...formData,
        what_sets_apart: [...formData.what_sets_apart, newItem.trim()]
      });
      setNewItem('');
    }
  };

  const removeWhatSetsApart = (index: number) => {
    setFormData({
      ...formData,
      what_sets_apart: formData.what_sets_apart.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      {editingId && (
        <Card>
          <CardHeader>
            <CardTitle>Edit {editingId === 'home' ? 'Home' : 'About Us'} Content</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <Textarea
                placeholder="Content"
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                rows={6}
              />
              
              {editingId === 'about' && (
                <>
                  <Textarea
                    placeholder="Our Philosophy"
                    value={formData.philosophy}
                    onChange={(e) => setFormData({ ...formData, philosophy: e.target.value })}
                    rows={4}
                  />
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">What Sets Us Apart</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add new item"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addWhatSetsApart())}
                      />
                      <Button type="button" onClick={addWhatSetsApart} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {formData.what_sets_apart.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <span className="flex-1">{item}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeWhatSetsApart(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              <div className="flex gap-2">
                <Button type="submit" className="bg-pink-500 hover:bg-pink-600">
                  Update Content
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {content.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{item.id === 'home' ? 'Home Page' : 'About Us'}</CardTitle>
                <Button
                  variant="outline"
                  onClick={() => handleEdit(item)}
                  disabled={editingId === item.id}
                >
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <strong>Title:</strong>
                  <p className="text-gray-600">{item.title || 'No title set'}</p>
                </div>
                <div>
                  <strong>Content:</strong>
                  <p className="text-gray-600">{item.body || 'No content set'}</p>
                </div>
                {item.id === 'about' && (
                  <>
                    <div>
                      <strong>Philosophy:</strong>
                      <p className="text-gray-600">{item.philosophy || 'No philosophy set'}</p>
                    </div>
                    <div>
                      <strong>What Sets Us Apart:</strong>
                      <ul className="list-disc list-inside text-gray-600">
                        {item.what_sets_apart?.map((point, index) => (
                          <li key={index}>{point}</li>
                        )) || <li>No points set</li>}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
