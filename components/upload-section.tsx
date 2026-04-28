"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, Cloud, FolderOpen } from "lucide-react"

const recentFiles = [
  { name: "Calculus_Ch5_Notes.pdf", size: "2.4 MB", date: "Today" },
  { name: "Physics_Lab_Report.pdf", size: "1.8 MB", date: "Yesterday" },
  { name: "Data_Structures_HW3.pdf", size: "890 KB", date: "Apr 26" },
]

export function UploadSection() {
  return (
    <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-2/10">
            <FolderOpen className="h-4 w-4 text-chart-2" />
          </div>
          <CardTitle className="text-lg font-semibold">Documents</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl border-2 border-dashed border-border/50 bg-muted/30 p-6 text-center transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 cursor-pointer">
          <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm font-medium">Drag & drop PDFs here</p>
          <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
        </div>
        <Button
          variant="outline"
          className="w-full h-11 rounded-xl border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
        >
          <Cloud className="h-4 w-4 mr-2" />
          Connect Google Drive
        </Button>
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Recent Files
          </h4>
          {recentFiles.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
                <FileText className="h-4 w-4 text-destructive" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {file.size} • {file.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
