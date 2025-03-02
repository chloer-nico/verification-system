"use client"

import type React from "react"

import { useState } from "react"
import { Upload } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export default function StyleTransferTraining() {
  const [imagesA, setImagesA] = useState<string[]>([])
  const [imagesB, setImagesB] = useState<string[]>([])
  const [isDraggingA, setIsDraggingA] = useState(false)
  const [isDraggingB, setIsDraggingB] = useState(false)
  const [isTraining, setIsTraining] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragIn = (side: "A" | "B") => (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (side === "A") setIsDraggingA(true)
    else setIsDraggingB(true)
  }

  const handleDragOut = (side: "A" | "B") => (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (side === "A") setIsDraggingA(false)
    else setIsDraggingB(false)
  }

  const handleDrop = (side: "A" | "B") => async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (side === "A") setIsDraggingA(false)
    else setIsDraggingB(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files, side)
  }

  const handleFileInput = (side: "A" | "B") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files, side)
  }

  const handleFiles = (files: File[], side: "A" | "B") => {
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onloadend = () => {
          if (side === "A") {
            setImagesA((prev) => [...prev, reader.result as string])
          } else {
            setImagesB((prev) => [...prev, reader.result as string])
          }
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const startTraining = () => {
    if (imagesA.length === 0 || imagesB.length === 0) {
      alert("请确保两侧都上传了图像")
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

  const UploadZone = ({
    side,
    images,
    isDragging,
  }: {
    side: "A" | "B"
    images: string[]
    isDragging: boolean
  }) => (
    <div className="flex-1 space-y-4">
      <h2 className="text-lg font-medium text-center">上传{side}域风格图像</h2>
      <div
        className={cn(
          "relative min-h-[300px] rounded-xl border-2",
          images.length > 0 ? "border-solid" : "border-dashed",
          isDragging ? "border-primary bg-primary/5" : "border-muted",
        )}
      >
        <input
          type="file"
          id={`file-upload-${side}`}
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleFileInput(side)}
        />

        <div
          className="h-full min-h-[300px] p-4"
          onClick={() => document.getElementById(`file-upload-${side}`)?.click()}
          onDragEnter={handleDragIn(side)}
          onDragLeave={handleDragOut(side)}
          onDragOver={handleDrag}
          onDrop={handleDrop(side)}
        >
          {images.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Style ${side} image ${index + 1}`}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              ))}
              <div
                className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed hover:bg-muted/50"
                onClick={() => document.getElementById(`file-upload-${side}`)?.click()}
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
  )

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-primary">风格迁移模型训练</h1>
        <p className="mt-2 text-muted-foreground">请上传两个领域的风格图像进行训练</p>
      </div>

      <div className="flex gap-8 flex-col md:flex-row">
        <UploadZone side="A" images={imagesA} isDragging={isDraggingA} />
        <UploadZone side="B" images={imagesB} isDragging={isDraggingB} />
      </div>

      <div className="flex justify-center">
        <Button size="lg" onClick={startTraining} className="px-8 py-6 text-lg">
          开始训练
        </Button>
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

