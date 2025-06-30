import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Edit, Plus, Upload, Link } from "lucide-react";

interface Service {
  id: string;
  name: string;
  photo_url: string | null;
  short_description: string | null;
  duration: string | null;
  benefits: string[] | null;
}

export const ServicesManager = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    photo_url: "",
    short_description: "",
    duration: "",
    benefits: "",
  });
  const [imageInputType, setImageInputType] = useState<"url" | "upload">("url");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch services",
        variant: "destructive",
      });
    } else {
      setServices(data || []);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `services/${fileName}`;

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

    const serviceData = {
      name: formData.name,
      photo_url: photoUrl || null,
      short_description: formData.short_description || null,
      duration: formData.duration || null,
      benefits: formData.benefits
        ? formData.benefits.split("\n").filter((b) => b.trim())
        : null,
    };

    if (isEditing) {
      const { error } = await supabase
        .from("services")
        .update(serviceData)
        .eq("id", isEditing);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update service",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Service updated successfully",
        });
        setIsEditing(null);
        resetForm();
        fetchServices();
      }
    } else {
      const { error } = await supabase.from("services").insert([serviceData]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create service",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Service created successfully",
        });
        resetForm();
        fetchServices();
      }
    }
  };

  const handleEdit = (service: Service) => {
    setIsEditing(service.id);
    setFormData({
      name: service.name,
      photo_url: service.photo_url || "",
      short_description: service.short_description || "",
      duration: service.duration || "",
      benefits: service.benefits ? service.benefits.join("\n") : "",
    });
    setImageInputType("url");
    setImageFile(null);
  };

  const handleDelete = async (id: string, photoUrl: string | null) => {
    const { error } = await supabase.from("services").delete().eq("id", id);

    if (!error && photoUrl) {
      const path = photoUrl.split("/storage/v1/object/public/images/")[1];
      if (path) {
        await supabase.storage.from("images").remove([path]);
      }
    }

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Service deleted successfully",
      });
      fetchServices();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      photo_url: "",
      short_description: "",
      duration: "",
      benefits: "",
    });
    setImageInputType("url");
    setImageFile(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? "Edit Service" : "Add New Service"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Service Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />

            <div className="space-y-2">
              <Label htmlFor="image-input">Service Image</Label>
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

            <Textarea
              placeholder="Short Description"
              value={formData.short_description}
              onChange={(e) =>
                setFormData({ ...formData, short_description: e.target.value })
              }
            />
            <Input
              placeholder="Duration (e.g., 60-90 minutes)"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
            />
            <Textarea
              placeholder="Benefits (one per line)"
              value={formData.benefits}
              onChange={(e) =>
                setFormData({ ...formData, benefits: e.target.value })
              }
              rows={4}
            />
            <div className="flex gap-2">
              <Button type="submit" className="bg-pink-500 hover:bg-pink-600">
                <Plus className="w-4 h-4 mr-2" />
                {isEditing ? "Update Service" : "Add Service"}
              </Button>
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {services.map((service) => (
          <Card key={service.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{service.name}</h3>
                  {service.short_description && (
                    <p className="text-gray-600 mt-1">
                      {service.short_description}
                    </p>
                  )}
                  {service.duration && (
                    <p className="text-sm text-gray-500 mt-1">
                      Duration: {service.duration}
                    </p>
                  )}
                  {service.benefits && service.benefits.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Benefits:</p>
                      <ul className="text-sm text-gray-600 list-disc list-inside">
                        {service.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { handleEdit(service); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(service.id, service.photo_url)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
