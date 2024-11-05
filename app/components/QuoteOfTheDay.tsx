import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TIMES } from "@/constants";

interface QuoteOfTheDayResponse {
  q: string;
  a: string;
  h: string;
}

export async function QuoteOfTheDay() {
  const quotes: QuoteOfTheDayResponse[] = await fetch(
    "https://zenquotes.io/api/today"
  ).then((data) => data.json());

  const quote = quotes[0];

  return (
    <Card className="md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle>Quote of the Day</CardTitle>
      </CardHeader>
      <CardContent>
        <blockquote className="border-l-2 pl-6">
          <p className="italic">"{quote.q}"</p>
          <footer className="mt-2 text-sm text-muted-foreground">
            ~ {quote.a} ~
          </footer>
        </blockquote>
      </CardContent>
    </Card>
  );
}
