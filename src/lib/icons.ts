import {
  Box,
  AlignVerticalSpaceAround,
  Cylinder,
  SquareStack,
  Grid3x3,
  Wrench,
  Package,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Box,
  AlignVerticalSpaceAround,
  Cylinder,
  SquareStack,
  Grid3x3,
  Wrench,
  Package,
};

export function getCategoryIcon(iconName: string): LucideIcon {
  return iconMap[iconName] ?? Package;
}
