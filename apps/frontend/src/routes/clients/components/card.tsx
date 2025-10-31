
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function ClientsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Name</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Category</p>
        <p>Vehicles</p>
        <p>Assigned Team</p>
      </CardContent>
      <CardFooter>
        <p>Updated</p>
      </CardFooter>
    </Card>
  );
}
