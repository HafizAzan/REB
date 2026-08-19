import { PropertyForm } from '@/components/property/property-form';
import { Typography } from '@/components/ui/typography';

export default function NewPropertyPage() {
  return (
    <div className="max-w-3xl">
      <Typography variant="heading">New listing</Typography>
      <div className="mt-8">
        <PropertyForm />
      </div>
    </div>
  );
}
