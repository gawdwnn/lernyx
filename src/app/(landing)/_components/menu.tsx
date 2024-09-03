'use client';

import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';
import { useNavigation } from '@/hooks/use-navigation';
import { cn } from '@/lib/utils';

import { Home, Explore, CreditCard } from '@/icons';

type LandingPageMenuProps = {
  id: number;
  label: string;
  icon: JSX.Element;
  path: string;
  section?: boolean;
  integration?: boolean;
};

const LANDING_PAGE_MENU: LandingPageMenuProps[] = [
  {
    id: 0,
    label: 'Home',
    icon: <Home />,
    path: '/',
    section: true,
  },
  {
    id: 1,
    label: 'Pricing',
    icon: <CreditCard />,
    path: '#pricing',
    section: true,
  },
  {
    id: 2,
    label: 'Explore',
    icon: <Explore />,
    path: '/explore',
  },
];

type MenuProps = {
  orientation: 'mobile' | 'desktop';
};

const Menu = ({ orientation }: MenuProps) => {
  const { section, onSetSection } = useNavigation();

  switch (orientation) {
    case 'desktop':
      return (
        <Card className="bg-themeGray border-themeGray bg-clip-padding backdrop--blur__safari backdrop-filter backdrop-blur-2xl bg-opacity-60 p-1 lg:flex hidden rounded-xl">
          <CardContent className="p-0 flex gap-2">
            {LANDING_PAGE_MENU.map((menuItem) => (
              <div key={menuItem.label}>
                <Link
                  href={menuItem.path}
                  {...(menuItem.section && {
                    onClick: () => onSetSection(menuItem.path),
                  })}
                  className={cn(
                    'rounded-xl flex gap-2 py-2 px-4 items-center',
                    section == menuItem.path
                      ? 'bg-[#09090B] border-[#27272A]'
                      : ''
                  )}
                  // key={menuItem.label}
                >
                  {section == menuItem.path && menuItem.icon}
                  {menuItem.label}
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      );

    case 'mobile':
      return (
        <div className="flex flex-col mt-10">
          {LANDING_PAGE_MENU.map((menuItem) => (
            <Link
              href={menuItem.path}
              {...(menuItem.section && {
                onClick: () => onSetSection(menuItem.path),
              })}
              className={cn(
                'rounded-xl flex gap-2 py-2 px-4 items-center',
                section == menuItem.path ? 'bg-themeGray border-[#27272A]' : ''
              )}
              key={menuItem.id}
            >
              {menuItem.icon}
              {menuItem.label}
            </Link>
          ))}
        </div>
      );
    default:
      return <></>;
  }
};

export default Menu;
