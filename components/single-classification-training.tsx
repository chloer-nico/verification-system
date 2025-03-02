"use client"

import type React from "react"

import { useState } from "react"
import { Upload } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export default function SingleClassificationTraining() {
  const [images, setImages] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isTraining, setIsTraining] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImages((prev) => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const startTraining = () => {
    if (images.length === 0) {
      alert("请上传训练图像")
      return
    }
    setIsTraining(true)
    setProgress(0)
    // 模拟训练进度
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsTraining(false), 500)
          return 100
        }
        return prev + 1
      })
    }, 100)
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-primary">单一分类模型训练</h1>
        <p className="mt-2 text-muted-foreground">请上传正类样本进行训练</p>
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-center">请上传正类样本</h2>
          <div
            className={cn(
              "relative min-h-[400px] rounded-xl border-2",
              images.length > 0 ? "border-solid" : "border-dashed",
              isDragging ? "border-primary bg-primary/5" : "border-muted",
            )}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleFileInput}
            />

            <div
              className="h-full min-h-[400px] p-4"
              onClick={() => document.getElementById("file-upload")?.click()}
              onDragEnter={handleDragIn}
              onDragLeave={handleDragOut}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {images.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Training image ${index + 1}`}
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                  ))}
                  <div
                    className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed hover:bg-muted/50"
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center">
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <div className="mt-4 space-y-2 text-center">
                    <p className="font-medium">拖拽图片到此处或点击上传</p>
                    <p className="text-sm text-muted-foreground">支持上传多张图片</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground">已上传 {images.length} 张图片</p>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            onClick={startTraining}
            className="min-w-[200px] rounded-xl border-2 border-primary bg-primary px-8 py-6 text-lg font-semibold text-primary-foreground shadow-lg transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-xl active:scale-100"
          >
            开始训练
          </Button>
        </div>
      </div>

      <Dialog open={isTraining} onOpenChange={setIsTraining}>
        <DialogContent className="sm:max-w-md">
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-center">模型训练中</h2>
            <Progress value={progress} />
            <p className="text-center text-sm text-muted-foreground">已完成 {progress}%</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

