import { useState } from "react";
import { useListStreamingJobs, getListStreamingJobsQueryKey, useCreateStreamingJob, usePauseStreamingJob, useResumeStreamingJob, useStopStreamingJob } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Square, Upload, Plus } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function Streaming() {
  const { data: jobs, isLoading, refetch } = useListStreamingJobs({ query: { queryKey: getListStreamingJobsQueryKey() } } as any);
  
  const createJob = useCreateStreamingJob();
  const pauseJob = usePauseStreamingJob();
  const resumeJob = useResumeStreamingJob();
  const stopJob = useStopStreamingJob();

  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleAction = (action: any, id: string) => {
    action.mutate({ id }, {
      onSuccess: () => {
        toast.success("Job status updated");
        refetch();
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Streaming Payouts</h1>
          <p className="text-muted-foreground">Automated payroll and bulk disbursements.</p>
        </div>
        <Button className="h-10">
          <Plus className="w-4 h-4 mr-2" /> New Stream
        </Button>
      </div>

      <Card className="bg-card border-dashed">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 bg-secondary/50 rounded-full">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Upload CSV Schedule</h3>
              <p className="text-sm text-muted-foreground mt-1">Format: address, amount, frequency (daily/weekly/monthly)</p>
            </div>
            <div className="flex items-center gap-4">
              <Input type="file" className="hidden" id="csv-upload" onChange={(e) => setCsvFile(e.target.files?.[0] || null)} />
              <Label htmlFor="csv-upload" className="cursor-pointer">
                <Button variant="outline" className="h-10" asChild>
                  <span>Select File</span>
                </Button>
              </Label>
              {csvFile && <span className="text-sm font-mono text-primary">{csvFile.name}</span>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Active Streams</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Name</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Disbursed</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs?.jobs?.map((job: any) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.name}</TableCell>
                    <TableCell>
                      <div className="space-y-2 w-full max-w-[200px]">
                        <Progress value={(job.completedCount / job.totalRecipients) * 100} className="h-2" />
                        <div className="text-xs text-muted-foreground text-right">{job.completedCount} / {job.totalRecipients}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">${job.disbursedAmount?.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${job.status === 'active' ? 'bg-green-500/20 text-green-500' : 
                          job.status === 'paused' ? 'bg-yellow-500/20 text-yellow-500' : 
                          'bg-secondary text-secondary-foreground'}`}>
                        {job.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {job.status === 'active' ? (
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10" onClick={() => handleAction(pauseJob, job.id)}>
                          <Pause className="h-4 w-4" />
                        </Button>
                      ) : job.status === 'paused' ? (
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-green-500/10" onClick={() => handleAction(resumeJob, job.id)}>
                          <Play className="h-4 w-4" />
                        </Button>
                      ) : null}
                      {job.status !== 'stopped' && job.status !== 'completed' && (
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleAction(stopJob, job.id)}>
                          <Square className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {(!jobs?.jobs || jobs.jobs.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No active streams</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
