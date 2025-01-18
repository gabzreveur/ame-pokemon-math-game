const Layout = ({ children }: { children: React.ReactNode }) => (
    <div className="main-frame bg-gameboy-dgrey min-h-screen flex flex-col items-center justify-start">
      <h1 className="text-4xl font-bold text-white mt-8 ">Amélie Pokémon Math GAME</h1>
      <div className="flex max-w-7xl w-full border-50 rounded mt-8 flex items-center justify-center bg-white">
        {children}
      </div>
    </div>
  );

  export default Layout;