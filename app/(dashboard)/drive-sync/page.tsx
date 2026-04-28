"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Cloud,
  FolderOpen,
  FileText,
  Image,
  File,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  Clock,
  HardDrive,
  Link2,
} from "lucide-react"

const connectedDrives = [
  { name: "Google Drive", icon: "🔵", connected: true, files: 156, storage: "2.4 GB" },
  { name: "Dropbox", icon: "📦", connected: false, files: 0, storage: "0 GB" },
  { name: "OneDrive", icon: "☁️", connected: false, files: 0, storage: "0 GB" },
]

const recentFiles = [
  { name: "CS201_Lecture_Notes.pdf", type: "pdf", size: "2.4 MB", synced: true, modified: "2 hours ago" },
  { name: "Physics_Lab_Report.docx", type: "doc", size: "1.1 MB", synced: true, modified: "5 hours ago" },
  { name: "Algorithm_Flowchart.png", type: "image", size: "856 KB", synced: true, modified: "Yesterday" },
  { name: "Calculus_Practice_Problems.pdf", type: "pdf", size: "3.2 MB", synced: false, modified: "2 days ago" },
  { name: "Chemistry_Notes_Ch12.pdf", type: "pdf", size: "1.8 MB", synced: true, modified: "3 days ago" },
  { name: "Study_Schedule.xlsx", type: "sheet", size: "245 KB", synced: true, modified: "1 week ago" },
]

const getFileIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return <FileText className="h-5 w-5 text-rose-500" />
    case "doc":
      return <FileText className="h-5 w-5 text-blue-500" />
    case "image":
      return <Image className="h-5 w-5 text-emerald-500" />
    case "sheet":
      return <File className="h-5 w-5 text-emerald-600" />
    default:
      return <File className="h-5 w-5 text-muted-foreground" />
  }
}

export default function DriveSyncPage() {
  const [syncing, setSyncing] = useState(false)

  const handleSync = () => {
    setSyncing(true)
    setTimeout(() => setSyncing(false), 2000)
  }

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Drive Sync</h1>
          <p className="text-muted-foreground">Connect and manage your cloud storage</p>
        </div>
        <Button className="gap-2 rounded-xl" onClick={handleSync} disabled={syncing}>
          <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing..." : "Sync Now"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {connectedDrives.map((drive, index) => (
          <Card
            key={index}
            className={`rounded-2xl border-border/50 backdrop-blur-sm transition-all ${
              drive.connected ? "bg-card/50" : "bg-muted/30"
            }`}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{drive.icon}</span>
                  <div>
                    <p className="font-medium">{drive.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {drive.connected ? `${drive.files} files - ${drive.storage}` : "Not connected"}
                    </p>
                  </div>
                </div>
                {drive.connected ? (
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                ) : (
                  <Button variant="outline" size="sm" className="gap-1 rounded-lg">
                    <Link2 className="h-3 w-3" />
                    Connect
                  </Button>
                )}
              </div>
              {drive.connected && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Storage Used</span>
                    <span>{drive.storage} / 15 GB</span>
                  </div>
                  <Progress value={16} className="h-1.5" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-primary" />
              Recent Files
            </CardTitle>
            <Button variant="outline" size="sm" className="gap-1 rounded-lg">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                >
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                    {getFileIcon(file.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{file.size}</span>
                      <span>-</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {file.modified}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {file.synced ? (
                      <Badge variant="outline" className="text-emerald-500 border-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Synced
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-500 border-amber-500/20">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5 text-primary" />
                Storage Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-4xl font-bold">2.4 GB</p>
                <p className="text-sm text-muted-foreground">of 15 GB used</p>
              </div>
              <Progress value={16} className="h-2" />
              <div className="grid grid-cols-2 gap-4 text-center pt-4">
                <div>
                  <p className="text-lg font-semibold">156</p>
                  <p className="text-xs text-muted-foreground">Total Files</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">12</p>
                  <p className="text-xs text-muted-foreground">Folders</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2 rounded-xl">
                <Upload className="h-4 w-4" />
                Upload Files
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 rounded-xl">
                <FolderOpen className="h-4 w-4" />
                Create Folder
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 rounded-xl">
                <Link2 className="h-4 w-4" />
                Share Files
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
