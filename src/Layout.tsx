const Layout = ({ children }: { children: React.ReactNode }) => (
    <div className="main-frame bg-black min-h-screen flex flex-col items-center justify-start">
      <h1 className="text-4xl font-bold text-white mt-8">Amélie Pokémon Math GAME</h1>
      <div className="flex max-w-7xl w-full border-8 rounded mt-16 flex items-center justify-center bg-white">
        {children}
      </div>
    </div>
  );

  export default Layout;