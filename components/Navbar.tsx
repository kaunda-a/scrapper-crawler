// app/components/Navbar.tsx

import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <a className="text-xl font-bold">Scraper App</a>
        </Link>
        <div>
          <Link href="/devices">
            <a className="mr-4">Devices</a>
          </Link>
          <Link href="/about">
            <a>About</a>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
