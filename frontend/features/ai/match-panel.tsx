'use client';

import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/loader';
import { useMatchScore } from '@/hooks/use-ai';
import { pct } from '@/lib/utils';

export function MatchPanel({ internshipId }: { internshipId: string }) {
  const { data, isLoading, isError } = useMatchScore(internshipId);

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <Sparkles className="h-5 w-5 text-primary" />
        <CardTitle className="text-base">Your AI match</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner /> Calculating your fit…
          </div>
        ) : isError || !data ? (
          <p className="text-sm text-muted-foreground">
            Add skills and a resume to unlock your match score.
          </p>
        ) : (
          <>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-bold text-primary">{pct(data.score)}</span>
              <span className="text-sm text-muted-foreground">match</span>
            </div>
            <Progress value={data.score} />

            {data.breakdown && (
              <div className="space-y-2 pt-2">
                {Object.entries(data.breakdown).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="capitalize text-muted-foreground">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="font-medium">{pct(Number(value))}</span>
                    </div>
                    <Progress value={Number(value)} className="h-1.5" />
                  </div>
                ))}
              </div>
            )}

            {Array.isArray(data.matchedSkills) && data.matchedSkills.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                  Matched skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {data.matchedSkills.map((s) => (
                    <Badge key={s} variant="success" className="font-normal">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {Array.isArray(data.missingSkills) && data.missingSkills.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                  Skills to improve
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {data.missingSkills.map((s) => (
                    <Badge key={s} variant="outline" className="font-normal">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {data.explanation && (
              <p className="rounded-lg bg-background/60 p-3 text-sm text-muted-foreground">
                {data.explanation}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
