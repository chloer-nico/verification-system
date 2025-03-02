"use client"

import { useState } from "react"
import { Wand2, ListTree } from "lucide-react"
import { cn } from "@/lib/utils"
import StyleTransferTraining from "./style-transfer-training"
import SingleClassificationTraining from "./single-classification-training"

export default function TrainSection() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const trainOptions = [
    {
      id: "style-transfer",
      title: "风格迁移模型训练",
      icon: Wand2,
      description: "训练模型以实现不同风格之间的迁移",
      component: StyleTransferTraining,
    },
    {
      id: "single-classification",
      title: "单一分类模型训练",
      icon: ListTree,
      description: "训练模型进行单一类别的分类任务",
      component: SingleClassificationTraining,
    },
  ]

  if (selectedOption) {
    const option = trainOptions.find((opt) => opt.id === selectedOption)
    if (option) {
      const Component = option.component
      return <Component />
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-primary">模型训练</h1>
        <p className="mt-2 text-muted-foreground">请选择需要训练的模型类型</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {trainOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelectedOption(option.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-4 rounded-xl border-2 p-8 transition-all",
              "hover:border-primary hover:bg-primary/5",
              "text-center",
            )}
          >
            <option.icon className="h-12 w-12 text-primary" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium">{option.title}</h3>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

