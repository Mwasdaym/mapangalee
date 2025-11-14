import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, Send, AlertCircle, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { PrayerIntention, InsertPrayerIntention } from "@shared/schema";
import Navigation from "@/components/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPrayerIntentionSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { formatDistanceToNow } from "date-fns";

export default function IntentionsPage() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);

  const { data: intentions, isLoading, error } = useQuery<PrayerIntention[]>({
    queryKey: ["/api/prayer-intentions"],
  });

  const form = useForm<InsertPrayerIntention>({
    resolver: zodResolver(insertPrayerIntentionSchema),
    defaultValues: {
      name: "",
      intention: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertPrayerIntention) => {
      const response = await apiRequest("POST", "/api/prayer-intentions", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prayer-intentions"] });
      form.reset();
      setShowForm(false);
      toast({
        title: "Prayer intention submitted",
        description: "Your prayer request has been added to our community prayer wall.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit prayer intention. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertPrayerIntention) => {
    createMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-heading text-5xl md:text-6xl font-bold mb-4" data-testid="text-intentions-page-title">
              Prayer Intentions
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Share your prayer requests with our parish community and lift each other up in prayer
            </p>
          </div>

          <div className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">Submit Your Prayer Intention</CardTitle>
                <CardDescription>
                  Our community will pray for your intentions. All submissions are visible to the parish family.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!showForm ? (
                  <Button onClick={() => setShowForm(true)} className="w-full" data-testid="button-show-form">
                    <Send className="mr-2 h-4 w-4" />
                    Share a Prayer Request
                  </Button>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your name" 
                                {...field} 
                                data-testid="input-intention-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="intention"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prayer Intention</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Share what you would like us to pray for..."
                                className="min-h-32"
                                {...field}
                                data-testid="textarea-intention"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex gap-3">
                        <Button
                          type="submit"
                          disabled={createMutation.isPending}
                          data-testid="button-submit-intention"
                        >
                          {createMutation.isPending ? (
                            "Submitting..."
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Submit Prayer Request
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowForm(false);
                            form.reset();
                          }}
                          data-testid="button-cancel-form"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="font-heading text-3xl font-semibold mb-6">Community Prayer Wall</h2>
            
            {error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription data-testid="text-error-message">
                  Failed to load prayer intentions. Please try again later.
                </AlertDescription>
              </Alert>
            ) : isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : !intentions || intentions.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-xl text-muted-foreground mb-2" data-testid="text-no-intentions">
                    No prayer intentions yet
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Be the first to share a prayer request with our community
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {intentions.map((intention) => (
                  <Card key={intention.id} className="hover-elevate transition-all" data-testid={`card-intention-${intention.id}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg font-semibold" data-testid={`text-intention-name-${intention.id}`}>
                            {intention.name}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {formatDistanceToNow(new Date(intention.createdAt), { addSuffix: true })}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-1 text-primary">
                          <Heart className="h-4 w-4 fill-current" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed" data-testid={`text-intention-content-${intention.id}`}>
                        {intention.intention}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
