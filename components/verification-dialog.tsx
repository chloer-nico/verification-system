import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"

const verifyPointLabels = {
  texture: "皮签纹理",
  metal: "金属标识",
  hardware: "五金圆标",
}

type VerificationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  image: string | null
  verifyPoint: string
}

export function VerificationDialog({ open, onOpenChange, image, verifyPoint }: VerificationDialogProps) {
  // 模拟鉴伪结果
  const result = {
    isAuthentic: Math.random() > 0.5,
    confidence: (Math.random() * 20 + 80).toFixed(2), // 80-100之间的随机数
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <div className="grid gap-6">
          <div className="aspect-video relative overflow-hidden rounded-lg border">
            {image && (
              <Image src={image || "/placeholder.svg"} alt="Verification image" fill className="object-contain p-4" />
            )}
          </div>

          <div className="grid gap-4 rounded-lg border p-6">
            <div className="grid grid-cols-[120px,1fr] items-center gap-4 text-sm">
              <span className="font-medium">当前鉴伪点：</span>
              <span>{verifyPointLabels[verifyPoint as keyof typeof verifyPointLabels]}</span>
            </div>

            <div className="grid grid-cols-[120px,1fr] items-center gap-4 text-sm">
              <span className="font-medium">当前鉴伪结果：</span>
              <span className={result.isAuthentic ? "text-green-600" : "text-red-600"}>
                {result.isAuthentic ? "真品" : "疑似仿冒品"}
              </span>
            </div>

            <div className="grid grid-cols-[120px,1fr] items-center gap-4 text-sm">
              <span className="font-medium">置信度：</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
                <span className="min-w-[4ch]">{result.confidence}%</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

