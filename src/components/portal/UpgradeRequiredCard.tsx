import { Link } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface UpgradeRequiredCardProps {
  feature: string;
  description?: string;
}

const UpgradeRequiredCard = ({ feature, description }: UpgradeRequiredCardProps) => (
  <Card className="bg-white/5 border-white/10 max-w-2xl">
    <CardContent className="p-8 text-center space-y-5">
      <div className="mx-auto w-14 h-14 rounded-full bg-orange-500/15 border border-orange-500/30 flex items-center justify-center">
        <Lock className="h-6 w-6 text-orange-400" />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-white">{feature} requires an upgrade</h2>
        <p className="text-sm text-white/60 mt-2">
          {description ??
            'Reputation Defence features are available on the Individual and PRO plans. Upgrade your package to unlock active removal and suppression workflows.'}
        </p>
      </div>
      <Button asChild className="bg-orange-500 hover:bg-orange-600 text-black font-medium">
        <Link to="/portal/upgrade">
          View upgrade options <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </CardContent>
  </Card>
);

export default UpgradeRequiredCard;
