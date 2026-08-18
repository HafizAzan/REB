import { PropertyForm } from '@/components/property/property-form';

export default function NewPropertyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-xs uppercase tracking-[0.18em] text-gold-dark">Agent</p>
      <h1 className="mt-2 font-display text-4xl">New listing</h1>
      <div className="mt-8">
        <PropertyForm />
      </div>
    </div>
  );
}
