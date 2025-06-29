
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Trash2, Plus } from 'lucide-react';

interface GalleryItem {
  id: string;
  photo_url: string;
  caption: string | null;
}

export const GalleryManager = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [formData, setFormData] = useState({
    photo_url: '',
    caption: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      const toastId = toast({
        title: "Error",
        description: "Failed to fetch gallery",
        variant: "destructive",
      });
      setTimeout(() => toastId.dismiss(), 5000);
    } else {
      setGallery(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from('gallery')
      .insert([{
        photo_url: formData.photo_url,
        caption: formData.caption || null
      }]);

    if (error) {
      const toastId = toast({
        title: "Error",
        description: "Failed to add image",
        variant: "destructive",
      });
      setTimeout(() => toastId.dismiss(), 5000);
    } else {
      const toastId = toast({
        title: "Success",
        description: "Image added successfully",
      });
      setTimeout(() => toastId.dismiss(), 5000);
      setFormData({ photo_url: '', caption: '' });
      fetchGallery();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);

    if (error) {
      const toastId = toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
      setTimeout(() => toastId.dismiss(), 5000);
    } else {
      const toastId = toast({
        title: "Success",
        description: "Image deleted successfully",
      });
      setTimeout(() => toastId.dismiss(), 5000);
      fetchGallery();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Image</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Photo URL"
              value={formData.photo_url}
              onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
              required
            />
            <Input
              placeholder="Caption (optional)"
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
            />
            <Button type="submit" className="bg-pink-500 hover:bg-pink-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Image
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {gallery.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative">
              <img 
                src={item.photo_url} 
                alt={item.caption || 'Gallery image'}
                className="w-full h-48 object-cover"
              />
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            {item.caption && (
              <CardContent className="p-3">
                <p className="text-sm text-gray-600">{item.caption}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
