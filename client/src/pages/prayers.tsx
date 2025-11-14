import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BookOpen, Cross, Printer, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";

interface Prayer {
  id: string;
  title: string;
  content: string;
  latinVersion?: string;
}

const traditionalPrayers: Prayer[] = [
  {
    id: "hail-mary",
    title: "Hail Mary",
    content: `Hail Mary, full of grace,
the Lord is with thee.
Blessed art thou among women,
and blessed is the fruit of thy womb, Jesus.

Holy Mary, Mother of God,
pray for us sinners,
now and at the hour of our death.
Amen.`,
    latinVersion: `Ave Maria, gratia plena,
Dominus tecum.
Benedicta tu in mulieribus,
et benedictus fructus ventris tui, Iesus.

Sancta Maria, Mater Dei,
ora pro nobis peccatoribus,
nunc et in hora mortis nostrae.
Amen.`
  },
  {
    id: "our-father",
    title: "Our Father (The Lord's Prayer)",
    content: `Our Father, who art in heaven,
hallowed be thy name.
Thy kingdom come,
thy will be done,
on earth as it is in heaven.

Give us this day our daily bread,
and forgive us our trespasses,
as we forgive those who trespass against us.
And lead us not into temptation,
but deliver us from evil.
Amen.`,
    latinVersion: `Pater noster, qui es in caelis,
sanctificetur nomen tuum.
Adveniat regnum tuum,
fiat voluntas tua,
sicut in caelo et in terra.

Panem nostrum quotidianum da nobis hodie,
et dimitte nobis debita nostra,
sicut et nos dimittimus debitoribus nostris.
Et ne nos inducas in tentationem,
sed libera nos a malo.
Amen.`
  },
  {
    id: "glory-be",
    title: "Glory Be",
    content: `Glory be to the Father,
and to the Son,
and to the Holy Spirit.

As it was in the beginning,
is now, and ever shall be,
world without end.
Amen.`,
    latinVersion: `Gloria Patri,
et Filio,
et Spiritui Sancto.

Sicut erat in principio,
et nunc et semper,
et in saecula saeculorum.
Amen.`
  },
  {
    id: "apostles-creed",
    title: "The Apostles' Creed",
    content: `I believe in God, the Father almighty,
Creator of heaven and earth,
and in Jesus Christ, his only Son, our Lord,
who was conceived by the Holy Spirit,
born of the Virgin Mary,
suffered under Pontius Pilate,
was crucified, died and was buried;
he descended into hell;
on the third day he rose again from the dead;
he ascended into heaven,
and is seated at the right hand of God the Father almighty;
from there he will come to judge the living and the dead.

I believe in the Holy Spirit,
the holy catholic Church,
the communion of saints,
the forgiveness of sins,
the resurrection of the body,
and life everlasting.
Amen.`
  },
  {
    id: "guardian-angel",
    title: "Guardian Angel Prayer",
    content: `Angel of God, my guardian dear,
to whom God's love commits me here,
ever this day be at my side,
to light and guard, to rule and guide.
Amen.`
  }
];

export default function PrayersPage() {
  const [showLatin, setShowLatin] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  const handlePrint = (prayer: Prayer) => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${prayer.title}</title>
            <style>
              body { font-family: Georgia, serif; padding: 40px; line-height: 1.8; }
              h1 { font-size: 24px; margin-bottom: 20px; }
              p { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <h1>${prayer.title}</h1>
            <p>${prayer.content}</p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleShare = (prayer: Prayer) => {
    if (navigator.share) {
      navigator.share({
        title: prayer.title,
        text: prayer.content,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(prayer.content);
      toast({
        title: "Copied to clipboard",
        description: "Prayer text has been copied to your clipboard",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-heading text-5xl md:text-6xl font-bold mb-4" data-testid="text-prayers-page-title">
              Daily Prayers
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find strength and comfort in these timeless Catholic prayers for your daily devotion
            </p>
          </div>

          <Tabs defaultValue="traditional" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8" data-testid="tabs-prayer-categories">
              <TabsTrigger value="traditional" data-testid="tab-traditional">Traditional Prayers</TabsTrigger>
              <TabsTrigger value="rosary" data-testid="tab-rosary">Rosary Guide</TabsTrigger>
            </TabsList>

            <TabsContent value="traditional" className="space-y-8">
              {traditionalPrayers.map((prayer) => (
                <Card key={prayer.id} className="overflow-hidden" data-testid={`card-prayer-${prayer.id}`}>
                  <CardHeader className="bg-card border-b pb-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <Cross className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="font-prayer text-3xl mb-2" data-testid={`text-prayer-title-${prayer.id}`}>
                            {prayer.title}
                          </CardTitle>
                          <CardDescription>
                            Traditional Catholic Prayer
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handlePrint(prayer)}
                          data-testid={`button-print-${prayer.id}`}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleShare(prayer)}
                          data-testid={`button-share-${prayer.id}`}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="prose prose-lg max-w-none">
                      <p className="font-prayer text-lg leading-relaxed whitespace-pre-wrap text-foreground" data-testid={`text-prayer-content-${prayer.id}`}>
                        {prayer.content}
                      </p>
                    </div>
                    
                    {prayer.latinVersion && (
                      <div className="mt-8 pt-6 border-t">
                        <Button
                          variant="ghost"
                          onClick={() => setShowLatin({
                            ...showLatin,
                            [prayer.id]: !showLatin[prayer.id]
                          })}
                          className="mb-4"
                          data-testid={`button-toggle-latin-${prayer.id}`}
                        >
                          {showLatin[prayer.id] ? "Hide" : "Show"} Latin Version
                        </Button>
                        {showLatin[prayer.id] && (
                          <div className="prose prose-lg max-w-none">
                            <p className="font-prayer text-lg leading-relaxed whitespace-pre-wrap text-muted-foreground italic" data-testid={`text-prayer-latin-${prayer.id}`}>
                              {prayer.latinVersion}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="rosary">
              <Card>
                <CardHeader>
                  <CardTitle className="font-prayer text-3xl">The Holy Rosary</CardTitle>
                  <CardDescription>A guide to praying the Rosary</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div>
                    <h3 className="font-heading text-xl font-semibold mb-3">How to Pray the Rosary</h3>
                    <ol className="space-y-3 text-muted-foreground">
                      <li className="flex gap-3">
                        <span className="font-semibold text-foreground">1.</span>
                        <span>Make the Sign of the Cross and say the Apostles' Creed</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-semibold text-foreground">2.</span>
                        <span>Say the Our Father</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-semibold text-foreground">3.</span>
                        <span>Say three Hail Marys for Faith, Hope, and Charity</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-semibold text-foreground">4.</span>
                        <span>Say the Glory Be</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-semibold text-foreground">5.</span>
                        <span>Announce the First Mystery and say the Our Father</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-semibold text-foreground">6.</span>
                        <span>Say ten Hail Marys while meditating on the Mystery</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-semibold text-foreground">7.</span>
                        <span>Say the Glory Be and the Fatima Prayer</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-semibold text-foreground">8.</span>
                        <span>Repeat steps 5-7 for the remaining four decades</span>
                      </li>
                    </ol>
                  </div>

                  <div className="pt-6 border-t">
                    <h3 className="font-heading text-xl font-semibold mb-4">The Mysteries</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2 text-primary">Joyful Mysteries (Mon, Sat)</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>The Annunciation</li>
                          <li>The Visitation</li>
                          <li>The Nativity</li>
                          <li>The Presentation</li>
                          <li>Finding in the Temple</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-primary">Sorrowful Mysteries (Tue, Fri)</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>The Agony in the Garden</li>
                          <li>The Scourging at the Pillar</li>
                          <li>The Crowning with Thorns</li>
                          <li>The Carrying of the Cross</li>
                          <li>The Crucifixion</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-primary">Glorious Mysteries (Wed, Sun)</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>The Resurrection</li>
                          <li>The Ascension</li>
                          <li>The Descent of the Holy Spirit</li>
                          <li>The Assumption</li>
                          <li>The Coronation</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-primary">Luminous Mysteries (Thu)</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>The Baptism of Christ</li>
                          <li>The Wedding at Cana</li>
                          <li>Proclamation of the Kingdom</li>
                          <li>The Transfiguration</li>
                          <li>Institution of the Eucharist</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
