import React from 'react'
import { PosterGenerator } from '@/utils/poster-generator';
import { PosterGallery } from '@/utils/s poster-gallery';
import { Sparkles, Wand2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
const page = () => {
  return (
    <div>
       <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">AI Poster Generator</h1>
            <Wand2 className="h-6 w-6 text-purple-500" />
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Create professional posters in seconds with the power of AI. Just enter your details and let our system
            design the perfect poster for you.
          </p>
          <div className="flex justify-center mt-4">
            <div className="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-900/20 px-3 py-1 text-sm text-purple-700 dark:text-purple-300">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              <span>Powered by advanced AI</span>
            </div>
          </div>
        </header>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-gray-800">
            <TabsTrigger value="create">Create Poster</TabsTrigger>
            <TabsTrigger value="gallery">My Posters</TabsTrigger>
          </TabsList>
          <TabsContent value="create" >
            <PosterGenerator />
          </TabsContent>
          <TabsContent value="gallery">
            <PosterGallery />
          </TabsContent>
        </Tabs>
      </div>
    </main>
    </div>
  )
}

export default page
