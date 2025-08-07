import { Bars3Icon } from '@heroicons/react/16/solid';
import { PropsWithChildren } from 'react'
import SideBar from './ui/Sidebar';

type Props = PropsWithChildren;

export default function MobileNavbar(props: Props) {
  return (
    <div className="md:hidden">
      <SideBar
        triggerIcon={<Bars3Icon className="w-4" />}
        triggerClassName="absolute top-2 left-2"
      >
        {props.children}
      </SideBar>
    </div>
  );
}
