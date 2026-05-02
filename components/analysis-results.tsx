'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, XCircle, AlertCircle, AlertTriangle, Lightbulb, Shield } from 'lucide-react'

interface Analysis {
  overallFit: 'excellent' | 'good' | 'moderate' | 'poor'
  fitScore: number
  summary: string
  matchingSkills: string[]
  missingSkills: string[]
  resumeImprovements: {
    area: string
    suggestion: string
    priority: 'high' | 'medium' | 'low'
  }[]
  keyStrengths: string[]
  potentialConcerns: string[]
}

interface AnalysisResultsProps {
  analysis: Analysis
}

const fitTextColors = {
  excellent: 'text-emerald-400',
  good: 'text-blue-400',
  moderate: 'text-amber-400',
  poor: 'text-red-400',
}

const fitProgressColors = {
  excellent: '[&>div]:bg-emerald-400',
  good: '[&>div]:bg-blue-400',
  moderate: '[&>div]:bg-amber-400',
  poor: '[&>div]:bg-red-400',
}

export function AnalysisResults({ analysis }: AnalysisResultsProps) {
  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <Card className="border border-border/50 bg-card/50 backdrop-blur-sm transition-all hover-glow-primary-40 hover:border-primary/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Overall Fit Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-baseline justify-between mb-2">
            <span className={`text-4xl font-bold ${fitTextColors[analysis.overallFit]}`}>
              {analysis.fitScore}%
            </span>
            <Badge variant="outline" className={`capitalize ${fitTextColors[analysis.overallFit]}`}>
              {analysis.overallFit} fit
            </Badge>
          </div>
          <Progress value={analysis.fitScore} className={`h-2 ${fitProgressColors[analysis.overallFit]}`} />
          <p className="text-muted-foreground text-sm leading-relaxed">{analysis.summary}</p>
        </CardContent>
      </Card>

      {/* Skills Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Matching Skills */}
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm transition-all hover-glow-primary-40 hover:border-primary/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              Matching Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.matchingSkills.length > 0 ? (
                analysis.matchingSkills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No matching skills found</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Missing Skills */}
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm transition-all hover-glow-primary-40 hover:border-primary/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-400" />
              Missing Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.missingSkills.length > 0 ? (
                analysis.missingSkills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-red-500/10 text-red-400 border-red-500/20">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No critical missing skills</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Strengths */}
      <Card className="border border-border/50 bg-card/50 backdrop-blur-sm transition-all hover-glow-primary-40 hover:border-primary/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-400" />
            Key Strengths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {analysis.keyStrengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Resume Improvements */}
      <Card className="border border-border/50 bg-card/50 backdrop-blur-sm transition-all hover-glow-primary-40 hover:border-primary/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-400" />
            Resume Improvements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.resumeImprovements.map((improvement, index) => (
              <div key={index} className="border-l-2 border-muted pl-4 py-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{improvement.area}</span>
                  <Badge variant="outline" className={`text-xs ${
                    improvement.priority === 'high' ? 'border-red-500/30 text-red-400' :
                    improvement.priority === 'medium' ? 'border-amber-500/30 text-amber-400' :
                    'border-blue-500/30 text-blue-400'
                  }`}>
                    {improvement.priority}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm">{improvement.suggestion}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Potential Concerns */}
      {analysis.potentialConcerns.length > 0 && (
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm transition-all hover-glow-primary-40 hover:border-primary/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              Potential Concerns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.potentialConcerns.map((concern, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                  <span>{concern}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}