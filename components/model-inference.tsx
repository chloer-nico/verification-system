"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileUp } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { VerificationDialog } from "@/components/verification-dialog"

export default function ModelInference() {
  const [image, setImage] = useState<string | null>(null)
  const [modelFile, setModelFile] = useState<File | null>(null)
  const [verifyPoint, setVerifyPoint] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [showResults, setShowResults] = useState(false)

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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleImageFile(files[0])
    }
  }

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleImageFile(files[0])
    }
  }

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("请上传图片文件")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleModelInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setModelFile(files[0])
    }
  }

  const handleVerify = () => {
    if (!image || !modelFile || !verifyPoint) {
      alert("请上传图片、加载模型并选择鉴伪点")
      return
    }
    setShowResults(true)
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-primary">模型推理</h1>
        <p className="mt-2 text-muted-foreground">请上传图像并加载模型进行鉴伪</p>
      </div>

      <div
        className={cn(
          "relative min-h-[400px] rounded-xl border-2",
          image ? "border-solid" : "border-dashed",
          isDragging ? "border-primary bg-primary/5" : "border-muted",
        )}
      >
        <input type="file" id="image-upload" className="hidden" accept="image/*" onChange={handleImageInput} />

        {image ? (
          <div
            className="relative flex h-full min-h-[400px] w-full cursor-pointer items-center justify-center"
            onClick={() => document.getElementById("image-upload")?.click()}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt="Uploaded image"
              fill
              className="rounded-xl object-contain p-4"
            />
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/60 opacity-0 transition-opacity hover:opacity-100">
              <p className="text-center text-white">点击或拖拽更换图片</p>
            </div>
          </div>
        ) : (
          <div
            className="flex h-full min-h-[400px] cursor-pointer flex-col items-center justify-center"
            onClick={() => document.getElementById("image-upload")?.click()}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-muted-foreground" />
            <div className="mt-4 space-y-2 text-center">
              <p className="font-medium">拖拽图片到此处或点击上传</p>
              <p className="text-sm text-muted-foreground">支持 PNG, JPG, GIF 格式图片</p>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border p-6">
        <h3 className="mb-4 text-lg font-medium">鉴伪点选择</h3>
        <RadioGroup value={verifyPoint} onValueChange={setVerifyPoint} className="flex flex-wrap gap-6">
          {[
            { id: "texture", label: "皮签纹理" },
            { id: "metal", label: "金属标识" },
            { id: "hardware", label: "五金圆标" },
          ].map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={option.id} />
              <Label htmlFor={option.id}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <div className="flex items-center gap-4">
          <input
            type="file"
            id="model-upload"
            className="hidden"
            accept=".pth,.h5,.model"
            onChange={handleModelInput}
          />
          <Button
            onClick={() => document.getElementById("model-upload")?.click()}
            className="min-w-[200px] rounded-xl border-2 border-primary bg-primary px-8 py-6 text-lg font-semibold text-primary-foreground shadow-lg transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-xl active:scale-100"
          >
            <FileUp className="mr-2 h-5 w-5" />
            加载模型
          </Button>
          {modelFile && <span className="text-sm text-muted-foreground">已加载: {modelFile.name}</span>}
        </div>

        <Button
          onClick={handleVerify}
          className="min-w-[200px] rounded-xl border-2 border-primary bg-primary px-8 py-6 text-lg font-semibold text-primary-foreground shadow-lg transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-xl active:scale-100"
        >
          开始鉴伪
        </Button>
      </div>

      <VerificationDialog open={showResults} onOpenChange={setShowResults} image={image} verifyPoint={verifyPoint} />
    </div>
  )
}

