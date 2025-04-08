"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Toaster,toast } from "sonner"
import {
  Loader2,
  Download,
  Share2,
  Wand2,
  Palette,
  Type,
  ImageIcon,
  Sliders,
  Sparkles,
  RefreshCw,
  Copy,
  CheckCircle,
} from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function PosterGenerator() {
  const [loading, setLoading] = useState(false)
  const [posterGenerated, setPosterGenerated] = useState(false)
  const [image,setImage] = useState("")
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    theme: "professional",
    purpose: "event",
    colorScheme: "auto",
    typographyStyle: "modern",
    imageStyle: "photo",
    designComplexity: 50,
    aiEnhancement: true,
    orientation: "portrait",
    size: "standard",
    tags: "",
  })

  // Handle input changes
  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleGenerate = async() => {
    setLoading(true)
    try{
     const res = await fetch("/api/generate", {
      method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })

    const data = await res.json()
setLoading(false)
    if(data.success){
      setPosterGenerated(true)
      toast.success("Poster generated successfully!")
      setImage(data.data)
    }
    else{
        setLoading(false)
        toast.error("Error generating poster. Please try again.")
    }

    }
    catch (error) {
        console.error("Error generating poster:", error)
        setLoading(false)
        toast.error("Error generating poster. Please try again.")
        return
    }
    // Log all parameters
    console.log("Generating poster with parameters:", formData)

    // Simulate AI generation
    setTimeout(() => {
      setLoading(false)
      setPosterGenerated(true)
   toast.success("Poster generated successfully!");
    }, 2000)
  }

  const handleSave = () => {
    console.log("Saving poster with parameters:", formData)
     let newobj = {...formData,image:image}
     if(localStorage.getItem("posters")){
        let posters = JSON.parse(localStorage.getItem("posters") || "")
        posters.push(newobj)
        localStorage.setItem("posters", JSON.stringify(posters))
     }
     else{
        let posters = [newobj]
        localStorage.setItem("posters", JSON.stringify(posters));
     }
     toast.success("Poster saved to gallery!");
  }

  const handleCopyParams = () => {
    navigator.clipboard.writeText(JSON.stringify(formData, null, 2))
    toast.success("Parameters copied to clipboard!");
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
        <Toaster richColors position="top-right" closeButton={false} />
    
        {/* Top bar */}
      {/* Left side - Form */}
      <div className="lg:col-span-2">
        <Card className="bg-white dark:bg-slate-900 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Poster Details</h2>
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setFormData({
                            title: "",
                            description: "",
                            theme: "professional",
                            purpose: "event",
                            colorScheme: "auto",
                            typographyStyle: "modern",
                            imageStyle: "photo",
                            designComplexity: 50,
                            aiEnhancement: true,
                            orientation: "portrait",
                            size: "standard",
                            tags: "",
                          })
                        }
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reset Form</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="outline" onClick={handleCopyParams}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy Parameters</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <Tabs defaultValue="basic" className="w-full mb-6 ">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Poster Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter the main title for your poster"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what you want in your poster"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select value={formData.theme} onValueChange={(value) => handleInputChange("theme", value)}>
                      <SelectTrigger id="theme">
                        <SelectValue placeholder="Select a theme" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900">
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                        <SelectItem value="elegant">Elegant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose</Label>
                    <Select value={formData.purpose} onValueChange={(value) => handleInputChange("purpose", value)}>
                      <SelectTrigger id="purpose">
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900">
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="promotion">Promotion</SelectItem>
                        <SelectItem value="announcement">Announcement</SelectItem>
                        <SelectItem value="advertisement">Advertisement</SelectItem>
                        <SelectItem value="educational">Educational</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (optional)</Label>
                  <Input
                    id="tags"
                    placeholder="Add tags separated by commas"
                    value={formData.tags}
                    onChange={(e) => handleInputChange("tags", e.target.value)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-6 pt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="colorScheme">Color Scheme</Label>
                      <Palette className="h-4 w-4 text-slate-500" />
                    </div>
                    <Select
                      value={formData.colorScheme}
                      onValueChange={(value) => handleInputChange("colorScheme", value)}
                    >
                      <SelectTrigger id="colorScheme">
                        <SelectValue placeholder="Select colors" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900">
                        <SelectItem value="auto">AI Recommended</SelectItem>
                        <SelectItem value="vibrant">Vibrant</SelectItem>
                        <SelectItem value="pastel">Pastel</SelectItem>
                        <SelectItem value="monochrome">Monochrome</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="typographyStyle">Typography Style</Label>
                      <Type className="h-4 w-4 text-slate-500" />
                    </div>
                    <Select
                      value={formData.typographyStyle}
                      onValueChange={(value) => handleInputChange("typographyStyle", value)}
                    >
                      <SelectTrigger id="typographyStyle">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900">
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="playful">Playful</SelectItem>
                        <SelectItem value="elegant">Elegant</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="imageStyle">Image Style</Label>
                      <ImageIcon className="h-4 w-4 text-slate-500" />
                    </div>
                    <Select
                      value={formData.imageStyle}
                      onValueChange={(value) => handleInputChange("imageStyle", value)}
                    >
                      <SelectTrigger id="imageStyle">
                        <SelectValue placeholder="Select image style" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900">
                        <SelectItem value="photo">Photographic</SelectItem>
                        <SelectItem value="illustration">Illustration</SelectItem>
                        <SelectItem value="abstract">Abstract</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="none">No Images</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="designComplexity">Design Complexity</Label>
                      <Sliders className="h-4 w-4 text-slate-500" />
                    </div>
                    <Slider
                      value={[formData.designComplexity]}
                      max={100}
                      step={1}
                      className="py-2 bg-gray-800 text-white"
                      onValueChange={(value) => handleInputChange("designComplexity", value[0])}
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Simple</span>
                      <span>Complex</span>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <Label>Poster Orientation</Label>
                    <RadioGroup
                      defaultValue={formData.orientation}
                      onValueChange={(value) => handleInputChange("orientation", value)}
                      className="flex space-x-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="portrait" id="portrait" />
                        <Label htmlFor="portrait">Portrait</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="landscape" id="landscape" />
                        <Label htmlFor="landscape">Landscape</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="square" id="square" />
                        <Label htmlFor="square">Square</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size">Poster Size</Label>
                    <Select value={formData.size} onValueChange={(value) => handleInputChange("size", value)}>
                      <SelectTrigger id="size">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900">
                        <SelectItem value="standard">Standard (8.5" x 11")</SelectItem>
                        <SelectItem value="a4">A4 (210 x 297mm)</SelectItem>
                        <SelectItem value="a3">A3 (297 x 420mm)</SelectItem>
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="ai-enhancement">AI Enhancement</Label>
                      <p className="text-xs text-slate-500">Let AI optimize your design</p>
                    </div>
                    <Switch
                      id="ai-enhancement"
                      checked={formData.aiEnhancement}
                      onCheckedChange={(checked) => handleInputChange("aiEnhancement", checked)}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <Button
              onClick={handleGenerate}
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={loading || !formData.title || !formData.description}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Poster
                </>
              )}
            </Button>

            {(!formData.title || !formData.description) && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 text-center">
                Title and description are required
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right side - Preview */}
      <div className="lg:col-span-2">
        <Card className="bg-white dark:bg-slate-900 shadow-sm h-full flex flex-col">
          <CardContent className="p-6 flex-grow flex flex-col">
            {posterGenerated ? (
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Preview</h2>
                  <div className="flex gap-2">
                    <Badge
                      variant="outline"
                      className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                    >
                      {formData.theme}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                    >
                      {formData.purpose}
                    </Badge>
                  </div>
                </div>

                <div className="relative bg-slate-100 dark:bg-slate-800 rounded-lg flex-grow flex items-center justify-center overflow-hidden">
                  <div
                    className={`relative ${formData.orientation === "landscape" ? "w-[600px] h-[400px]" : formData.orientation === "square" ? "w-[500px] h-[500px]" : "w-[400px] h-[600px]"} max-w-full max-h-full shadow-lg overflow-hidden rounded-md`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-slate-900/20"></div>
                    <img
                      src={`data:image/png;base64,${image}`}
                      alt="Generated poster preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="sm" variant="secondary" onClick={()=>{
                            const link = document.createElement("a")
                            link.href = `data:image/png;base64,${image}`
                            link.download = `${formData.title || "poster"}.png`
                            document.body.appendChild(link)
                            link.click()
                            document.body.removeChild(link)
                            toast.success("Poster downloaded successfully!")
                          }}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Download Poster</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="sm" variant="secondary"
                          onClick={()=>{
                            const link = document.createElement("a")
                            link.href = `data:image/png;base64,${image}`
                            link.download = `${formData.title || "poster"}.png`
                            document.body.appendChild(link)
                            link.click()
                            document.body.removeChild(link)
                            toast.success("Poster downloaded successfully!")
                          }}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Share Poster</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <Sheet>
                      <SheetTrigger asChild>
                        <Button size="sm" variant="secondary">
                          <Sliders className="h-4 w-4" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Fine-tune Your Poster</SheetTitle>
                          <SheetDescription>Make adjustments to perfect your design</SheetDescription>
                        </SheetHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Text Size</Label>
                            <Slider defaultValue={[50]} max={100} step={1} />
                          </div>
                          <div className="space-y-2">
                            <Label>Image Brightness</Label>
                            <Slider defaultValue={[50]} max={100} step={1} />
                          </div>
                          <div className="space-y-2">
                            <Label>Layout Balance</Label>
                            <Slider defaultValue={[50]} max={100} step={1} />
                          </div>
                          <Button className="w-full mt-4" onClick={() => {}}>
                            Apply Changes
                          </Button>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>

                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={() => setPosterGenerated(false)}>
                    Start Over
                  </Button>
                  <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Save to Gallery
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
                <div className="w-24 h-24 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  <Sparkles className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-medium text-slate-900 dark:text-white">Your AI-Generated Poster</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md">
                  Fill in the details on the left and click "Generate Poster" to create your custom design. Our AI will
                  create a professional poster based on your inputs.
                </p>

                {formData.title && formData.description && (
                  <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg max-w-md">
                    <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-2">Ready to generate:</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-1">
                      <span className="font-medium">Title:</span> {formData.title}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      <span className="font-medium">Description:</span> {formData.description.substring(0, 100)}
                      {formData.description.length > 100 ? "..." : ""}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
