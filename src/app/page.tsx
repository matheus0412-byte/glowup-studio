"use client";

import { useState, useRef, useEffect } from "react";
import {
  Upload,
  Download,
  RotateCcw,
  Sun,
  Contrast,
  Droplet,
  Sparkles,
  Type,
  Sticker,
  Share2,
  Image as ImageIcon,
  Smile,
  Heart,
  Star,
  Zap,
  Camera,
  X,
  FolderOpen,
  LogOut,
  Edit2,
  Move,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface Adjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  beauty: number;
}

interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  fontSize: number;
  fontWeight: string;
  rotation: number;
}

interface StickerOverlay {
  id: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
}

interface SavedPhoto {
  id: string;
  name: string;
  storage_path: string;
  created_at: string;
  url?: string;
}

const FILTERS = [
  { name: "Original", value: "none" },
  { name: "Vintage", value: "sepia(0.5) contrast(1.2)" },
  { name: "B&W", value: "grayscale(1)" },
  { name: "Warm", value: "sepia(0.3) saturate(1.3)" },
  { name: "Cool", value: "hue-rotate(180deg) saturate(1.2)" },
  { name: "Vivid", value: "saturate(2) contrast(1.1)" },
  { name: "Soft", value: "brightness(1.1) contrast(0.9)" },
  { name: "Drama", value: "contrast(1.5) saturate(0.8)" },
];

const STICKERS = ["😊", "❤️", "⭐", "✨", "🌸", "🦋", "🌈", "💫", "🎀", "💖"];

export default function PhotoEditor() {
  const [user, setUser] = useState<any>(null);
  const [image, setImage] = useState<string | null>(null);
  const [adjustments, setAdjustments] = useState<Adjustments>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    beauty: 0,
  });
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [stickerOverlays, setStickerOverlays] = useState<StickerOverlay[]>([]);
  const [newText, setNewText] = useState("");
  const [textColor, setTextColor] = useState("#ffffff");
  const [activeTab, setActiveTab] = useState("filters");
  const [savedPhotos, setSavedPhotos] = useState<SavedPhoto[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingText, setEditingText] = useState<string | null>(null);
  const [draggedText, setDraggedText] = useState<string | null>(null);
  const [draggedSticker, setDraggedSticker] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  // Check authentication
  useEffect(() => {
    checkUser();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          loadPhotos(session.user.id);
        } else {
          setUser(null);
          router.push("/auth");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        await loadPhotos(user.id);
      } else {
        router.push("/auth");
      }
    } catch (error) {
      console.error("Error checking user:", error);
      router.push("/auth");
    } finally {
      setLoading(false);
    }
  };

  const loadPhotos = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get public URLs for each photo
      const photosWithUrls = await Promise.all(
        (data || []).map(async (photo) => {
          const { data: urlData } = supabase.storage
            .from("photos")
            .getPublicUrl(photo.storage_path);
          return { ...photo, url: urlData.publicUrl };
        })
      );

      setSavedPhotos(photosWithUrls);
    } catch (error) {
      console.error("Error loading photos:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        toast.success("Foto carregada com sucesso!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setAdjustments({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      beauty: 0,
    });
    setSelectedFilter("none");
    setTextOverlays([]);
    setStickerOverlays([]);
    toast.info("Edições resetadas");
  };

  const addTextOverlay = () => {
    if (newText.trim()) {
      const newOverlay: TextOverlay = {
        id: Date.now().toString(),
        text: newText,
        x: 50,
        y: 50,
        color: textColor,
        fontSize: 32,
        fontWeight: "bold",
        rotation: 0,
      };
      setTextOverlays([...textOverlays, newOverlay]);
      setNewText("");
      toast.success("Texto adicionado!");
    }
  };

  const updateTextOverlay = (id: string, updates: Partial<TextOverlay>) => {
    setTextOverlays(
      textOverlays.map((text) =>
        text.id === id ? { ...text, ...updates } : text
      )
    );
  };

  const addSticker = (emoji: string) => {
    const newSticker: StickerOverlay = {
      id: Date.now().toString(),
      emoji,
      x: Math.random() * 60 + 20,
      y: Math.random() * 60 + 20,
      size: 48,
    };
    setStickerOverlays([...stickerOverlays, newSticker]);
    toast.success("Adesivo adicionado!");
  };

  const removeText = (id: string) => {
    setTextOverlays(textOverlays.filter((t) => t.id !== id));
    setEditingText(null);
  };

  const removeSticker = (id: string) => {
    setStickerOverlays(stickerOverlays.filter((s) => s.id !== id));
  };

  const handleTextDrag = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setDraggedText(id);
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const container = (moveEvent.target as HTMLElement).closest('.relative');
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const x = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      const y = ((moveEvent.clientY - rect.top) / rect.height) * 100;
      
      updateTextOverlay(id, {
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y)),
      });
    };
    
    const handleMouseUp = () => {
      setDraggedText(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleStickerDrag = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setDraggedSticker(id);
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const container = (moveEvent.target as HTMLElement).closest('.relative');
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const x = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      const y = ((moveEvent.clientY - rect.top) / rect.height) * 100;
      
      setStickerOverlays(
        stickerOverlays.map((sticker) =>
          sticker.id === id
            ? {
                ...sticker,
                x: Math.max(0, Math.min(100, x)),
                y: Math.max(0, Math.min(100, y)),
              }
            : sticker
        )
      );
    };
    
    const handleMouseUp = () => {
      setDraggedSticker(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const getFilterStyle = () => {
    const beautyBlur = adjustments.beauty > 0 ? `blur(${adjustments.beauty * 0.02}px)` : "";
    const filterValue = selectedFilter !== "none" ? selectedFilter : "";
    
    return {
      filter: `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%) ${filterValue} ${beautyBlur}`.trim(),
    };
  };

  const savePhotoToSupabase = async () => {
    if (!image || !canvasRef.current || !user) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Apply filters
      ctx.filter = `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%)`;
      if (adjustments.beauty > 0) {
        ctx.filter += ` blur(${adjustments.beauty * 0.02}px)`;
      }
      if (selectedFilter !== "none") {
        ctx.filter += ` ${selectedFilter}`;
      }

      ctx.drawImage(img, 0, 0);

      // Reset filter for overlays
      ctx.filter = "none";

      // Draw stickers
      stickerOverlays.forEach((sticker) => {
        ctx.font = `${sticker.size}px Arial`;
        ctx.fillText(
          sticker.emoji,
          (sticker.x / 100) * canvas.width,
          (sticker.y / 100) * canvas.height
        );
      });

      // Draw text overlays
      textOverlays.forEach((text) => {
        ctx.save();
        const x = (text.x / 100) * canvas.width;
        const y = (text.y / 100) * canvas.height;
        
        ctx.translate(x, y);
        ctx.rotate((text.rotation * Math.PI) / 180);
        
        ctx.font = `${text.fontWeight} ${text.fontSize}px Arial`;
        ctx.fillStyle = text.color;
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.strokeText(text.text, 0, 0);
        ctx.fillText(text.text, 0, 0);
        
        ctx.restore();
      });

      // Convert to blob
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        try {
          const fileName = `${user.id}/${Date.now()}.png`;
          
          // Get current session to ensure we have a valid token
          const { data: { session } } = await supabase.auth.getSession();
          
          if (!session) {
            throw new Error("Sessão expirada. Faça login novamente.");
          }

          // Upload to Supabase Storage with authenticated request
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("photos")
            .upload(fileName, blob, {
              contentType: "image/png",
              upsert: false,
            });

          if (uploadError) {
            console.error("Storage upload error:", uploadError);
            
            // Provide more specific error messages
            if (uploadError.message.includes("row-level security")) {
              throw new Error(
                "Permissões de armazenamento não configuradas. " +
                "Acesse o dashboard do Supabase > Storage > Bucket 'photos' > " +
                "Policies e adicione uma política que permita INSERT para usuários autenticados. " +
                "Exemplo: CREATE POLICY 'Allow authenticated uploads' ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'photos');"
              );
            } else if (uploadError.message.includes("Bucket not found")) {
              throw new Error(
                "Bucket 'photos' não encontrado. " +
                "Acesse o dashboard do Supabase > Storage e crie um bucket chamado 'photos' com acesso público."
              );
            } else {
              throw new Error(`Erro ao fazer upload: ${uploadError.message}`);
            }
          }

          // Save metadata to database
          const { data: photoData, error: dbError } = await supabase
            .from("photos")
            .insert({
              user_id: user.id,
              name: `glowup-${Date.now()}`,
              storage_path: fileName,
            })
            .select()
            .single();

          if (dbError) {
            console.error("Database error:", dbError);
            throw new Error(`Erro ao salvar no banco: ${dbError.message}`);
          }

          // Reload photos
          await loadPhotos(user.id);
          
          toast.success("Foto salva com sucesso!");
        } catch (error: any) {
          console.error("Error saving photo:", error);
          toast.error(error.message || "Erro ao salvar foto");
        }
      });
    };
    img.src = image;
  };

  const handleDownload = () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Apply filters
      ctx.filter = `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%)`;
      if (adjustments.beauty > 0) {
        ctx.filter += ` blur(${adjustments.beauty * 0.02}px)`;
      }
      if (selectedFilter !== "none") {
        ctx.filter += ` ${selectedFilter}`;
      }

      ctx.drawImage(img, 0, 0);

      // Reset filter for overlays
      ctx.filter = "none";

      // Draw stickers
      stickerOverlays.forEach((sticker) => {
        ctx.font = `${sticker.size}px Arial`;
        ctx.fillText(
          sticker.emoji,
          (sticker.x / 100) * canvas.width,
          (sticker.y / 100) * canvas.height
        );
      });

      // Draw text overlays
      textOverlays.forEach((text) => {
        ctx.save();
        const x = (text.x / 100) * canvas.width;
        const y = (text.y / 100) * canvas.height;
        
        ctx.translate(x, y);
        ctx.rotate((text.rotation * Math.PI) / 180);
        
        ctx.font = `${text.fontWeight} ${text.fontSize}px Arial`;
        ctx.fillStyle = text.color;
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.strokeText(text.text, 0, 0);
        ctx.fillText(text.text, 0, 0);
        
        ctx.restore();
      });

      // Download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `glowup-${Date.now()}.png`;
          a.click();
          URL.revokeObjectURL(url);
          toast.success("Foto baixada com sucesso!");
        }
      });
    };
    img.src = image;
  };

  const handleShare = async () => {
    if (!image) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Minha foto editada",
          text: "Confira minha foto editada no GlowUp Studio!",
          url: window.location.href,
        });
        toast.success("Compartilhado com sucesso!");
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          toast.error("Erro ao compartilhar");
        }
      }
    } else {
      toast.info("Compartilhamento não suportado neste navegador");
    }
  };

  const deletePhoto = async (id: string, storagePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("photos")
        .remove([storagePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from("photos")
        .delete()
        .eq("id", id);

      if (dbError) throw dbError;

      // Reload photos
      await loadPhotos(user.id);
      toast.success("Foto removida da galeria");
    } catch (error: any) {
      console.error("Error deleting photo:", error);
      toast.error(error.message || "Erro ao remover foto");
    }
  };

  const loadPhotoFromGallery = (photo: SavedPhoto) => {
    if (photo.url) {
      setImage(photo.url);
      setShowGallery(false);
      toast.success("Foto carregada da galeria!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gradient-to-br from-pink-400 to-purple-500 p-4 rounded-xl inline-block mb-4 animate-pulse">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-pink-400 to-purple-500 p-2 rounded-xl">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                GlowUp Studio
              </h1>
            </div>
            <div className="flex gap-2 items-center">
              {user && (
                <span className="text-sm text-gray-600 hidden sm:block">
                  {user.email}
                </span>
              )}
              <Button
                onClick={() => setShowGallery(!showGallery)}
                size="sm"
                variant="outline"
                className="border-pink-200 hover:bg-pink-50"
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                Galeria ({savedPhotos.length})
              </Button>
              {image && (
                <>
                  <Button
                    onClick={savePhotoToSupabase}
                    size="sm"
                    variant="outline"
                    className="border-pink-200 hover:bg-pink-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                  <Button
                    onClick={handleDownload}
                    size="sm"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar
                  </Button>
                </>
              )}
              <Button
                onClick={handleLogout}
                size="sm"
                variant="outline"
                className="border-pink-200 hover:bg-pink-50"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Gallery Modal */}
        {showGallery && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-pink-100 flex items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  Galeria de Fotos Editadas
                </h2>
                <Button
                  onClick={() => setShowGallery(false)}
                  size="sm"
                  variant="ghost"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
                {savedPhotos.length === 0 ? (
                  <div className="text-center py-12">
                    <FolderOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Nenhuma foto salva ainda</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Edite uma foto e clique em "Salvar"
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {savedPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className="group relative aspect-square rounded-xl overflow-hidden border-2 border-pink-100 hover:border-pink-300 transition-all"
                      >
                        <img
                          src={photo.url}
                          alt={photo.name}
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => loadPhotoFromGallery(photo)}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            onClick={() => loadPhotoFromGallery(photo)}
                            size="sm"
                            className="bg-white text-gray-900 hover:bg-gray-100"
                          >
                            Carregar
                          </Button>
                          <Button
                            onClick={() => deletePhoto(photo.id, photo.storage_path)}
                            size="sm"
                            variant="destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                          <p className="text-white text-xs truncate">
                            {new Date(photo.created_at).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {!image ? (
          // Upload Section
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="text-center">
              <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md mx-auto border border-pink-100">
                <div className="bg-gradient-to-br from-pink-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ImageIcon className="w-12 h-12 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Comece a Editar
                </h2>
                <p className="text-gray-600 mb-8">
                  Carregue uma foto e transforme-a com nossos filtros e ferramentas de beleza
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Carregar Foto
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Editor Section
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Preview Area */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl p-6 border border-pink-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Preview</h3>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleReset}
                      size="sm"
                      variant="outline"
                      className="border-pink-200 hover:bg-pink-50"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Resetar
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      size="sm"
                      variant="outline"
                      className="border-pink-200 hover:bg-pink-50"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Nova Foto
                    </Button>
                  </div>
                </div>
                
                <div className="relative bg-gray-100 rounded-2xl overflow-hidden aspect-square max-h-[600px] flex items-center justify-center">
                  <img
                    src={image}
                    alt="Preview"
                    style={getFilterStyle()}
                    className="max-w-full max-h-full object-contain"
                  />
                  
                  {/* Text Overlays */}
                  {textOverlays.map((text) => (
                    <div
                      key={text.id}
                      className="absolute group cursor-move select-none"
                      style={{
                        left: `${text.x}%`,
                        top: `${text.y}%`,
                        transform: `translate(-50%, -50%) rotate(${text.rotation}deg)`,
                      }}
                      onMouseDown={(e) => handleTextDrag(text.id, e)}
                    >
                      <span
                        style={{
                          color: text.color,
                          fontSize: `${text.fontSize}px`,
                          fontWeight: text.fontWeight,
                          textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                        }}
                        className="font-bold"
                      >
                        {text.text}
                      </span>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-black/70 rounded-lg p-1">
                        <button
                          onClick={() => setEditingText(text.id)}
                          className="bg-blue-500 text-white rounded p-1 hover:bg-blue-600"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeText(text.id)}
                          className="bg-red-500 text-white rounded p-1 hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Sticker Overlays */}
                  {stickerOverlays.map((sticker) => (
                    <div
                      key={sticker.id}
                      className="absolute group cursor-move select-none"
                      style={{
                        left: `${sticker.x}%`,
                        top: `${sticker.y}%`,
                        transform: "translate(-50%, -50%)",
                        fontSize: `${sticker.size}px`,
                      }}
                      onMouseDown={(e) => handleStickerDrag(sticker.id, e)}
                    >
                      {sticker.emoji}
                      <button
                        onClick={() => removeSticker(sticker.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Controls Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl p-6 border border-pink-100 sticky top-24">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4 mb-6 bg-pink-50">
                    <TabsTrigger value="filters" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                      <Sparkles className="w-4 h-4" />
                    </TabsTrigger>
                    <TabsTrigger value="adjust" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                      <Sun className="w-4 h-4" />
                    </TabsTrigger>
                    <TabsTrigger value="text" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                      <Type className="w-4 h-4" />
                    </TabsTrigger>
                    <TabsTrigger value="stickers" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                      <Smile className="w-4 h-4" />
                    </TabsTrigger>
                  </TabsList>

                  {/* Filters Tab */}
                  <TabsContent value="filters" className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                        Filtros
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {FILTERS.map((filter) => (
                          <button
                            key={filter.name}
                            onClick={() => setSelectedFilter(filter.value)}
                            className={`p-3 rounded-xl border-2 transition-all ${
                              selectedFilter === filter.value
                                ? "border-pink-500 bg-pink-50"
                                : "border-gray-200 hover:border-pink-300"
                            }`}
                          >
                            <div className="text-sm font-medium">{filter.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-pink-100">
                      <div>
                        <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                          <Sparkles className="w-4 h-4 text-pink-500" />
                          Embelezamento
                        </Label>
                        <Slider
                          value={[adjustments.beauty]}
                          onValueChange={([value]) =>
                            setAdjustments({ ...adjustments, beauty: value })
                          }
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                        <div className="text-xs text-gray-500 mt-1 text-right">
                          {adjustments.beauty}%
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Adjust Tab */}
                  <TabsContent value="adjust" className="space-y-6">
                    <div>
                      <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Sun className="w-4 h-4 text-yellow-500" />
                        Brilho
                      </Label>
                      <Slider
                        value={[adjustments.brightness]}
                        onValueChange={([value]) =>
                          setAdjustments({ ...adjustments, brightness: value })
                        }
                        max={200}
                        step={1}
                        className="mt-2"
                      />
                      <div className="text-xs text-gray-500 mt-1 text-right">
                        {adjustments.brightness}%
                      </div>
                    </div>

                    <div>
                      <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Contrast className="w-4 h-4 text-purple-500" />
                        Contraste
                      </Label>
                      <Slider
                        value={[adjustments.contrast]}
                        onValueChange={([value]) =>
                          setAdjustments({ ...adjustments, contrast: value })
                        }
                        max={200}
                        step={1}
                        className="mt-2"
                      />
                      <div className="text-xs text-gray-500 mt-1 text-right">
                        {adjustments.contrast}%
                      </div>
                    </div>

                    <div>
                      <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Droplet className="w-4 h-4 text-blue-500" />
                        Saturação
                      </Label>
                      <Slider
                        value={[adjustments.saturation]}
                        onValueChange={([value]) =>
                          setAdjustments({ ...adjustments, saturation: value })
                        }
                        max={200}
                        step={1}
                        className="mt-2"
                      />
                      <div className="text-xs text-gray-500 mt-1 text-right">
                        {adjustments.saturation}%
                      </div>
                    </div>
                  </TabsContent>

                  {/* Text Tab */}
                  <TabsContent value="text" className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Adicionar Texto
                      </Label>
                      <Input
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        placeholder="Digite seu texto..."
                        className="mb-3"
                      />
                      <div className="flex gap-2 mb-3">
                        <div className="flex-1">
                          <Label className="text-xs text-gray-600 mb-1 block">Cor</Label>
                          <input
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="w-full h-10 rounded-lg border border-gray-200 cursor-pointer"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={addTextOverlay}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                      >
                        <Type className="w-4 h-4 mr-2" />
                        Adicionar Texto
                      </Button>
                    </div>

                    {editingText && textOverlays.find((t) => t.id === editingText) && (
                      <div className="pt-4 border-t border-pink-100">
                        <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                          Editar Texto Selecionado
                        </Label>
                        {(() => {
                          const text = textOverlays.find((t) => t.id === editingText)!;
                          return (
                            <div className="space-y-3">
                              <div>
                                <Label className="text-xs text-gray-600 mb-1 block">Texto</Label>
                                <Input
                                  value={text.text}
                                  onChange={(e) =>
                                    updateTextOverlay(editingText, { text: e.target.value })
                                  }
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-gray-600 mb-1 block">
                                  Tamanho: {text.fontSize}px
                                </Label>
                                <Slider
                                  value={[text.fontSize]}
                                  onValueChange={([value]) =>
                                    updateTextOverlay(editingText, { fontSize: value })
                                  }
                                  min={16}
                                  max={72}
                                  step={1}
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-gray-600 mb-1 block">
                                  Rotação: {text.rotation}°
                                </Label>
                                <Slider
                                  value={[text.rotation]}
                                  onValueChange={([value]) =>
                                    updateTextOverlay(editingText, { rotation: value })
                                  }
                                  min={-180}
                                  max={180}
                                  step={1}
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-gray-600 mb-1 block">Cor</Label>
                                <input
                                  type="color"
                                  value={text.color}
                                  onChange={(e) =>
                                    updateTextOverlay(editingText, { color: e.target.value })
                                  }
                                  className="w-full h-10 rounded-lg border border-gray-200 cursor-pointer"
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-gray-600 mb-1 block">Estilo</Label>
                                <div className="grid grid-cols-2 gap-2">
                                  <button
                                    onClick={() =>
                                      updateTextOverlay(editingText, { fontWeight: "normal" })
                                    }
                                    className={`p-2 rounded-lg border-2 transition-all ${
                                      text.fontWeight === "normal"
                                        ? "border-pink-500 bg-pink-50"
                                        : "border-gray-200"
                                    }`}
                                  >
                                    Normal
                                  </button>
                                  <button
                                    onClick={() =>
                                      updateTextOverlay(editingText, { fontWeight: "bold" })
                                    }
                                    className={`p-2 rounded-lg border-2 transition-all font-bold ${
                                      text.fontWeight === "bold"
                                        ? "border-pink-500 bg-pink-50"
                                        : "border-gray-200"
                                    }`}
                                  >
                                    Negrito
                                  </button>
                                </div>
                              </div>
                              <Button
                                onClick={() => setEditingText(null)}
                                variant="outline"
                                className="w-full"
                              >
                                Concluir Edição
                              </Button>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {textOverlays.length > 0 && (
                      <div className="pt-4 border-t border-pink-100">
                        <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                          Textos Adicionados
                        </Label>
                        <div className="space-y-2">
                          {textOverlays.map((text) => (
                            <div
                              key={text.id}
                              className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                                editingText === text.id
                                  ? "bg-pink-100 border-2 border-pink-300"
                                  : "bg-pink-50"
                              }`}
                            >
                              <span className="text-sm truncate flex-1">{text.text}</span>
                              <div className="flex gap-1">
                                <Button
                                  onClick={() => setEditingText(text.id)}
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  onClick={() => removeText(text.id)}
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  {/* Stickers Tab */}
                  <TabsContent value="stickers" className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                        Adesivos
                      </Label>
                      <div className="grid grid-cols-5 gap-2">
                        {STICKERS.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => addSticker(emoji)}
                            className="aspect-square flex items-center justify-center text-3xl hover:bg-pink-50 rounded-xl border-2 border-transparent hover:border-pink-300 transition-all"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    {stickerOverlays.length > 0 && (
                      <div className="pt-4 border-t border-pink-100">
                        <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                          Adesivos Adicionados
                        </Label>
                        <div className="space-y-2">
                          {stickerOverlays.map((sticker) => (
                            <div
                              key={sticker.id}
                              className="flex items-center justify-between p-2 bg-pink-50 rounded-lg"
                            >
                              <span className="text-2xl">{sticker.emoji}</span>
                              <Button
                                onClick={() => removeSticker(sticker.id)}
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
