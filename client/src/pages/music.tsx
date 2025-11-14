import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Play, Music, Clock, AlertCircle } from "lucide-react";
import type { YoutubeVideo } from "@shared/schema";
import Navigation from "@/components/navigation";

export default function MusicPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<YoutubeVideo | null>(null);

  const queryUrl = searchQuery 
    ? `/api/youtube/videos?query=${encodeURIComponent(searchQuery)}`
    : "/api/youtube/videos";

  const { data: videos, isLoading, error } = useQuery<YoutubeVideo[]>({
    queryKey: [queryUrl],
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
              <Music className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-heading text-5xl md:text-6xl font-bold mb-4" data-testid="text-music-page-title">
              Sacred Music
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the beauty of Catholic worship through our collection of hymns, masses, and devotional music
            </p>
          </div>

          <div className="mb-12 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for hymns, masses, or songs..."
                className="pl-12 h-12 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-music"
              />
            </div>
          </div>

          {error ? (
            <Alert variant="destructive" className="max-w-2xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription data-testid="text-error-message">
                Failed to load videos. Please check your internet connection and try again.
              </AlertDescription>
            </Alert>
          ) : isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <Skeleton className="aspect-video w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !videos || videos.length === 0 ? (
            <div className="text-center py-16">
              <Music className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-xl text-muted-foreground mb-2" data-testid="text-no-videos">No videos found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "Try a different search term" : "Check back soon for new content"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Card
                  key={video.id}
                  className="hover-elevate active-elevate-2 cursor-pointer group overflow-hidden"
                  onClick={() => setSelectedVideo(video)}
                  data-testid={`card-video-${video.id}`}
                >
                  <div className="relative aspect-video bg-muted overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      data-testid={`img-thumbnail-${video.id}`}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="h-8 w-8 text-primary ml-1" fill="currentColor" />
                      </div>
                    </div>
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {video.duration}
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-base line-clamp-2 mb-1 group-hover:text-primary transition-colors" data-testid={`text-video-title-${video.id}`}>
                      {video.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {video.channelTitle}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl pr-8" data-testid="text-video-dialog-title">
              {selectedVideo?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedVideo?.channelTitle}
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video w-full bg-black rounded-md overflow-hidden">
            {selectedVideo && (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                data-testid="iframe-youtube-player"
              />
            )}
          </div>
          {selectedVideo?.description && (
            <div className="mt-4 max-h-32 overflow-y-auto">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {selectedVideo.description}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
