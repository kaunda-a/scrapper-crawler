// app/components/Sidenav.tsx

import Link from 'next/link';

const Sidenav = () => {
  return (
    <aside className="w-64 bg-gray-700 text-white h-full p-4">
      <nav>
        <Link href="/">
          <a className="block py-2">Home</a>
        </Link>
        <Link href="/devices">
          <a className="block py-2">Devices</a>
        </Link>
        <Link href="/settings">
          <a className="block py-2">Settings</a>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidenav;
