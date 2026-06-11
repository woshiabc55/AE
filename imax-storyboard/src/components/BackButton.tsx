import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface BackButtonProps {
  to: string;
  label?: string;
}

export default function BackButton({ to, label = 'BACK TO INDEX' }: BackButtonProps) {
  return (
    <Link to={to} className="back-button">
      <ChevronLeft size={14} />
      <span>{label}</span>
    </Link>
  );
}
