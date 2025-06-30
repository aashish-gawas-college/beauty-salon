import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Plus, Upload, Link } from "lucide-react";

interface GalleryItem {
  id: string;
  photo_url: string;
  caption: string | null;
}

export const GalleryManager = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [formData, setFormData] = useState({
    photo_url: "",
    caption: "",
  });
  const [imageInputType, setImageInputType] = useState<"url" | "upload">("url");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch gallery",
        variant: "destructive",
      });
    } else {
      setGallery(data || []);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `gallery/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      return null;
    }

    const { data } = supabase.storage.from("images").getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let photoUrl = formData.photo_url;

    if (imageInputType === "upload" && imageFile) {
      const uploadedUrl = await uploadImage(imageFile);
      if (!uploadedUrl) return;
      photoUrl = uploadedUrl;
    }

    if (!photoUrl) {
      toast({
        title: "Error",
        description: "Please provide an image URL or upload a file",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("gallery").insert([
      {
        photo_url: photoUrl,
        caption: formData.caption || null,
      },
    ]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add image",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Image added successfully",
      });
      setFormData({ photo_url: "", caption: "" });
      setImageFile(null);
      fetchGallery();
    }
  };

  const handleDelete = async (id: string, photoUrl: string) => {
    const { error } = await supabase.from("gallery").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
      return;
    }

    // Extract the path from the public URL
    const path = photoUrl.split("/storage/v1/object/public/images/")[1];
    if (path) {
      await supabase.storage.from("images").remove([path]);
    }

    toast({
      title: "Success",
      description: "Image deleted successfully",
    });
    fetchGallery();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Image</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image-input">Gallery Image</Label>
              <div className="flex gap-2 mb-2">
                <Button
                  type="button"
                  variant={imageInputType === "url" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setImageInputType("url")}
                >
                  <Link className="w-4 h-4 mr-1" />
                  URL
                </Button>
                <Button
                  type="button"
                  variant={imageInputType === "upload" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setImageInputType("upload")}
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Upload
                </Button>
              </div>

              {imageInputType === "url" ? (
                <Input
                  placeholder="Image URL"
                  value={formData.photo_url}
                  onChange={(e) =>
                    setFormData({ ...formData, photo_url: e.target.value })
                  }
                />
              ) : (
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              )}
            </div>

            <Input
              placeholder="Caption (optional)"
              value={formData.caption}
              onChange={(e) =>
                setFormData({ ...formData, caption: e.target.value })
              }
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
                alt={item.caption || "Gallery image"}
                className="w-full h-48 object-cover"
              />
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={() => handleDelete(item.id, item.photo_url)}
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
