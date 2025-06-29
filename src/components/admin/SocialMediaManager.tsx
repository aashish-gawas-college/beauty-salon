
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface SocialMedia {
  id: string;
  platform: string;
  url: string;
  icon_name: string;
  is_active: boolean;
  display_order: number;
}

export const SocialMediaManager = () => {
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    platform: '',
    url: '',
    icon_name: '',
    is_active: true,
    display_order: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSocialMedia();
  }, []);

  const fetchSocialMedia = async () => {
    const { data, error } = await supabase
      .from('social_media')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch social media",
        variant: "destructive",
      });
    } else {
      setSocialMedia(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const { error } = await supabase
        .from('social_media')
        .update(formData)
        .eq('id', editingId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update social media",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Social media updated successfully",
        });
      }
    } else {
      const { error } = await supabase
        .from('social_media')
        .insert([formData]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add social media",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Social media added successfully",
        });
      }
    }

    setIsEditing(false);
    setEditingId(null);
    setFormData({ platform: '', url: '', icon_name: '', is_active: true, display_order: 0 });
    fetchSocialMedia();
  };

  const handleEdit = (item: SocialMedia) => {
    setIsEditing(true);
    setEditingId(item.id);
    setFormData({
      platform: item.platform,
      url: item.url,
      icon_name: item.icon_name,
      is_active: item.is_active,
      display_order: item.display_order
    });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('social_media')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete social media",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Social media deleted successfully",
      });
      fetchSocialMedia();
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ platform: '', url: '', icon_name: '', is_active: true, display_order: 0 });
  };

  return (
    <div className="space-y-6">
      {!isEditing && (
        <Button onClick={() => setIsEditing(true)} className="bg-pink-500 hover:bg-pink-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Social Media
        </Button>
      )}

      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit' : 'Add'} Social Media</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Platform (e.g., Instagram)"
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                required
              />
              <Input
                placeholder="URL"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
              />
              <Input
                placeholder="Icon Name (e.g., Instagram)"
                value={formData.icon_name}
                onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                required
              />
              <Input
                type="number"
                placeholder="Display Order"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                required
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
                <label htmlFor="is_active">Active</label>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-pink-500 hover:bg-pink-600">
                  {editingId ? 'Update' : 'Add'} Social Media
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Platform</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {socialMedia.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.platform}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.url}</TableCell>
                  <TableCell>{item.icon_name}</TableCell>
                  <TableCell>{item.display_order}</TableCell>
                  <TableCell>{item.is_active ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
