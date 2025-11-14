import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, BookOpen, Church, ArrowDown } from "lucide-react";
import Navigation from "@/components/navigation";
import mariaBackground from "@assets/generated_images/Virgin_Mary_devotional_background_4b2bd53b.png";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <section 
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${mariaBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-wide" data-testid="text-parish-name">
              KARIUA PARISH
            </h1>
            <p className="font-heading text-2xl md:text-3xl text-white/90 font-light tracking-wider" data-testid="text-parish-subtitle">
              by Fr Karani
            </p>
          </div>
          
          <p className="text-lg md:text-xl text-white/95 mb-12 max-w-2xl mx-auto leading-relaxed" data-testid="text-hero-description">
            Experience the beauty of sacred music and the power of traditional Catholic prayers in our spiritual community
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/music">
              <Button 
                size="lg" 
                className="backdrop-blur-sm bg-white/20 text-white border-2 border-white/40 px-8 py-6 text-lg rounded-full font-medium"
                data-testid="button-explore-music"
              >
                <Music className="mr-2 h-5 w-5" />
                Explore Our Music
              </Button>
            </Link>
            <Link href="/prayers">
              <Button 
                size="lg" 
                variant="outline"
                className="backdrop-blur-sm bg-white/10 text-white border-2 border-white/40 px-8 py-6 text-lg rounded-full font-medium"
                data-testid="button-view-prayers"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                View Prayers
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="h-8 w-8 text-white/70" data-testid="icon-scroll-indicator" />
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Church className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h2 className="font-heading text-4xl font-semibold mb-6 text-foreground" data-testid="text-welcome-heading">
            Welcome to Our Parish
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Kariua Parish is a vibrant Catholic community dedicated to worship, prayer, and spiritual growth. 
            Under the guidance of Fr Karani, we celebrate the richness of our faith through sacred music and 
            traditional devotions. Join us in our journey of faith and discover the peace that comes from 
            prayer and communion with God.
          </p>
        </div>
      </section>

      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-heading text-4xl font-semibold text-center mb-16 text-card-foreground">
            Explore Our Content
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="hover-elevate hover:shadow-xl transition-all duration-300" data-testid="card-music">
              <CardHeader className="pb-4">
                <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                  <Music className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-heading text-2xl">Sacred Music</CardTitle>
                <CardDescription className="text-base">
                  Explore our collection of hymns, masses, and devotional music
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Immerse yourself in beautiful Catholic music from our parish community, including recorded masses, 
                  traditional hymns, and contemporary worship songs.
                </p>
                <Link href="/music">
                  <Button className="w-full" data-testid="button-browse-music">
                    Browse Music Library
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover-elevate hover:shadow-xl transition-all duration-300" data-testid="card-prayers">
              <CardHeader className="pb-4">
                <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-heading text-2xl">Daily Prayers</CardTitle>
                <CardDescription className="text-base">
                  Access traditional Catholic prayers for your daily devotion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Find comfort and strength in timeless prayers including the Rosary, traditional prayers, 
                  novenas, and daily devotions to deepen your spiritual life.
                </p>
                <Link href="/prayers">
                  <Button className="w-full" data-testid="button-view-prayer-collection">
                    View Prayer Collection
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-background border-t">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-heading text-lg font-semibold mb-4">Kariua Parish</h3>
              <p className="text-sm text-muted-foreground">
                A Catholic community celebrating faith through music and prayer under the spiritual guidance of Fr Karani.
              </p>
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-home">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/music" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-music">
                    Music
                  </Link>
                </li>
                <li>
                  <Link href="/prayers" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-prayers">
                    Prayers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold mb-4">Contact</h3>
              <p className="text-sm text-muted-foreground">
                For parish information and inquiries, please contact Fr Karani through your local parish office.
              </p>
            </div>
          </div>
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Kariua Parish. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
