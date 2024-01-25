import { ReactNode } from 'react';

export type BreadcrumbItem = {
  title: ReactNode;
};

type MenuPaths = {
  [key: string]: string;
};

export const menuPaths: MenuPaths = {
  '/': '0',
  '/game-options': '1',
  '/profile': '2',
  '/statistics': '3',
  '/historic': '4',
  '/friend': '5',
  '/message': '6',
};
