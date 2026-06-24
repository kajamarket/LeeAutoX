import PageHeader from '../components/PageHeader';
import Testimonials from '../components/Testimonials';
import DeliveriesTimeline from '../components/DeliveriesTimeline';
import { SEO_DATA } from '../seoData';

export default function TestimonialsPage() {
  const data = SEO_DATA['/testimonials/'];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title={data.heading} 
        subtitle={data.description} 
        breadcrumbs={data.breadcrumbs} 
      />

      <Testimonials />
      <DeliveriesTimeline />
    </div>
  );
}
