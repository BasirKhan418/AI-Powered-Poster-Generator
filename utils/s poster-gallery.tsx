"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toaster, toast } from 'sonner'
import { Download, MoreVertical, Pencil, Share2, Trash2, Search, Filter, ArrowUpAZ, ArrowDownAZ, Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Define TypeScript interfaces
interface PosterData {
  id?: string;
  title: string;
  description?: string;
  theme?: string;
  purpose?: string;
  colorScheme?: string;
  typographyStyle?: string;
  imageStyle?: string;
  designComplexity?: number;
  aiEnhancement?: boolean;
  orientation?: string;
  size?: string;
  tags?: string;
  image?: string;
  date?: string;
}

type SortOption = "newest" | "oldest" | "alphabetical" | "edited";

export function PosterGallery() {
  // State management
  const [posters, setPosters] = useState<PosterData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [editPoster, setEditPoster] = useState<PosterData | null>(null);
  const [filteredPosters, setFilteredPosters] = useState<PosterData[]>([]);

  // Load posters from localStorage on component mount
  useEffect(() => {
    loadPosters();
  }, []);

  // Filter and sort posters when search query or sort option changes
  useEffect(() => {
    filterAndSortPosters();
  }, [searchQuery, sortOption, posters]);

  // Load posters from localStorage
  const loadPosters = () => {
    try {
      const storedPosters = localStorage.getItem("posters");
      if (storedPosters) {
        const parsedPosters: PosterData[] = JSON.parse(storedPosters);
        // Add generated IDs and dates if missing
        const processedPosters = parsedPosters.map((poster, index) => ({
          ...poster,
          id: poster.id || `poster-${Date.now()}-${index}`,
          date: poster.date || new Date().toLocaleDateString()
        }));
        setPosters(processedPosters);
      }
    } catch (error) {
      console.error("Error loading posters from localStorage:", error);
      toast.error("Failed to load your posters");
    }
  };

  // Filter and sort posters based on search query and sort option
  const filterAndSortPosters = () => {
    let result = [...posters];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(poster => 
        poster.title?.toLowerCase().includes(query) || 
        poster.description?.toLowerCase().includes(query) || 
        poster.tags?.toLowerCase().includes(query)
      );
    }
    
    // Sort based on sort option
    switch (sortOption) {
      case "newest":
        // Sort by newest first (assuming newest is at the end of array)
        result = [...result].reverse();
        break;
      case "oldest":
        // Sort by oldest first (assuming oldest is at the beginning of array)
        // No change needed if posters are already in chronological order
        break;
      case "alphabetical":
        result = [...result].sort((a, b) => 
          (a.title || "").localeCompare(b.title || "")
        );
        break;
      case "edited":
        // If we had edit dates, we'd sort by them here
        // For now, we'll just keep the default order
        break;
    }
    
    setFilteredPosters(result);
  };

  // Handle poster deletion
  const handleDelete = (id: string) => {
    const updatedPosters = posters.filter(poster => poster.id !== id);
    setPosters(updatedPosters);
    localStorage.setItem("posters", JSON.stringify(updatedPosters));
    toast.success("Poster deleted successfully");
  };

  // Handle poster download
  const handleDownload = (poster: PosterData) => {
    if (poster.image) {
      const link = document.createElement("a");
      link.href = `data:image/png;base64,${poster.image}`;
      link.download = `${poster.title || "poster"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Poster downloaded successfully");
    } else {
      toast.error("Cannot download: Image data is missing");
    }
  };

  // Handle poster share
  const handleShare = (poster: PosterData) => {
    if (navigator.share && poster.image) {
      // For mobile devices with Web Share API
      try {
        // Convert base64 to blob for sharing
        const fetchData = async () => {
          const blob = await (await fetch(`data:image/png;base64,${poster.image}`)).blob();
          const file = new File([blob], `${poster.title || "poster"}.png`, { type: "image/png" });
          
          await navigator.share({
            title: poster.title || "My Poster",
            text: "Check out this poster I created!",
            files: [file]
          });
        };
        
        fetchData();
      } catch (error) {
        console.error("Error sharing poster:", error);
        toast.info("Copy link to clipboard instead");
        // Fall back to clipboard copy
        navigator.clipboard.writeText(`Poster: ${poster.title}`);
        toast.success("Poster info copied to clipboard");
      }
    } else {
      // Fall back to clipboard copy for desktop
      navigator.clipboard.writeText(`Poster: ${poster.title}`);
      toast.success("Poster info copied to clipboard");
    }
  };

  // Handle poster edit
  const handleSaveEdit = () => {
    if (!editPoster) return;
    
    const updatedPosters = posters.map(poster => 
      poster.id === editPoster.id ? editPoster : poster
    );
    
    setPosters(updatedPosters);
    localStorage.setItem("posters", JSON.stringify(updatedPosters));
    setEditPoster(null);
    toast.success("Poster updated successfully");
  };

  return (
    <div className="space-y-6">
      <Toaster richColors position="top-right" closeButton={false} />
      
      {/* Search and filter controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search your posters..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortOption("newest")}>
                <Clock className="mr-2 h-4 w-4" />
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("oldest")}>
                <Clock className="mr-2 h-4 w-4 rotate-180" />
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("alphabetical")}>
                <ArrowUpAZ className="mr-2 h-4 w-4" />
                Alphabetical
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("edited")}>
                <Pencil className="mr-2 h-4 w-4" />
                Recently Edited
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => loadPosters()}
            title="Refresh posters"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.7 2.8L21 9" />
              <path d="M21 3v6h-6" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Poster grid */}
      {filteredPosters.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPosters.map((poster) => (
            <Card key={poster.id} className="overflow-hidden group">
              <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={`data:image/png;base64,${poster.image}`}
                  alt={poster.title}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      onClick={() => handleDownload(poster)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => handleShare(poster)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => setEditPoster(poster)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Poster</DialogTitle>
                          <DialogDescription>Make changes to your poster details.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-title">Title</Label>
                            <Input 
                              id="edit-title" 
                              value={editPoster?.title || ""} 
                              onChange={(e) => setEditPoster(prev => 
                                prev ? {...prev, title: e.target.value} : null
                              )}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Input 
                              id="edit-description" 
                              value={editPoster?.description || ""} 
                              onChange={(e) => setEditPoster(prev => 
                                prev ? {...prev, description: e.target.value} : null
                              )}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-tags">Tags</Label>
                            <Input 
                              id="edit-tags" 
                              placeholder="Add tags separated by commas" 
                              value={editPoster?.tags || ""} 
                              onChange={(e) => setEditPoster(prev => 
                                prev ? {...prev, tags: e.target.value} : null
                              )}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" onClick={handleSaveEdit}>Save changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white truncate">{poster.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{poster.date || "No date"}</p>
                    {poster.tags && (
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 truncate">
                        {poster.tags}
                      </p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDownload(poster)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare(poster)}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditPoster(poster)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 dark:text-red-400"
                        onClick={() => poster.id && handleDelete(poster.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
          <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No posters found</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {searchQuery
              ? `No posters match your search "${searchQuery}". Try a different search term.`
              : "You haven't created any posters yet. Generate your first poster to see it here."}
          </p>
          {searchQuery && (
            <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          )}
        </div>
      )}

      {/* Edit Dialog when opened from dropdown menu */}
      {editPoster && (
        <Dialog open={!!editPoster && !document.querySelector('[role="dialog"]')} onOpenChange={(open) => !open && setEditPoster(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Poster</DialogTitle>
              <DialogDescription>Make changes to your poster details.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="popup-edit-title">Title</Label>
                <Input 
                  id="popup-edit-title" 
                  value={editPoster.title || ""} 
                  onChange={(e) => setEditPoster(prev => 
                    prev ? {...prev, title: e.target.value} : null
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="popup-edit-description">Description</Label>
                <Input 
                  id="popup-edit-description" 
                  value={editPoster.description || ""} 
                  onChange={(e) => setEditPoster(prev => 
                    prev ? {...prev, description: e.target.value} : null
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="popup-edit-tags">Tags</Label>
                <Input 
                  id="popup-edit-tags" 
                  placeholder="Add tags separated by commas" 
                  value={editPoster.tags || ""} 
                  onChange={(e) => setEditPoster(prev => 
                    prev ? {...prev, tags: e.target.value} : null
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditPoster(null)}>Cancel</Button>
              <Button type="submit" onClick={handleSaveEdit}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}