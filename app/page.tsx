"use client"

import { useState } from "react"
import { Shield, BookOpen, Brain } from "lucide-react"
import { cn } from "@/lib/utils"
import Logo from "@/components/logo"
import VerifySection from "@/components/verify-section"
import TrainSection from "@/components/train-section"
import ModelInference from "@/components/model-inference"

export default function Home() {
  const [activeSection, setActiveSection] = useState("verify")

  const sections = [
    {
      id: "verify",
      title: "直接鉴伪",
      icon: Shield,
      component: VerifySection,
    },
    {
      id: "train",
      title: "模型训练",
      icon: BookOpen,
      component: TrainSection,
    },
    {
      id: "infer",
      title: "模型推理",
      icon: Brain,
      component: ModelInference,
    },
  ]

  const ActiveComponent = sections.find((s) => s.id === activeSection)?.component || (() => null)

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-muted/30">
        <div className="p-6">
          <Logo className="w-full h-12" />
        </div>
        <div className="space-y-2 px-3">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                activeSection === section.id ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              <section.icon className="h-5 w-5" />
              {section.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <ActiveComponent />
      </div>
    </div>
  )
}

