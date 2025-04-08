"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toaster, toast } from 'sonner'
import { Download, MoreVertical, Pencil, Share2, Trash2, Search, Filter } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Sample poster data
const samplePosters = [
  {
    id: 1,
    title: "Summer Music Festival",
    date: "2 days ago",
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 2,
    title: "Tech Conference 2025",
    date: "1 week ago",
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 3,
    title: "Product Launch",
    date: "2 weeks ago",
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 4,
    title: "Art Exhibition",
    date: "3 weeks ago",
    image: "/placeholder.svg?height=400&width=300",
  },
]

export function PosterGallery() {
  const [posters, setPosters] = useState(samplePosters)
  const [searchQuery, setSearchQuery] = useState("")

  const handleDelete = (id: number) => {
    setPosters(posters.filter((poster) => poster.id !== id))
    toast.success("Poster deleted successfully")
  }

  const handleDownload = (id: number) => {
  toast.success("Poster downloaded successfully")
  }

  const filteredPosters = posters.filter((poster) => poster.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-6">
        <Toaster richColors position="top-right" closeButton={false} />
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
              <DropdownMenuItem>Newest First</DropdownMenuItem>
              <DropdownMenuItem>Oldest First</DropdownMenuItem>
              <DropdownMenuItem>Alphabetical</DropdownMenuItem>
              <DropdownMenuItem>Recently Edited</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {filteredPosters.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPosters.map((poster) => (
            <Card key={poster.id} className="overflow-hidden group">
              <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={poster.image || "/placeholder.svg"}
                  alt={poster.title}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => handleDownload(poster.id)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="secondary">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="secondary">
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
                            <Input id="edit-title" defaultValue={poster.title} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-tags">Tags</Label>
                            <Input id="edit-tags" placeholder="Add tags separated by commas" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Save changes</Button>
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
                    <p className="text-sm text-slate-500 dark:text-slate-400">{poster.date}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDownload(poster.id)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 dark:text-red-400"
                        onClick={() => handleDelete(poster.id)}
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
    </div>
  )
}
