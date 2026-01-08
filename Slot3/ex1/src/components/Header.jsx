function Header({setPage}) {
  return (
    <header className="p-3 bg-light">
        <nav>
            <a href="#" onClick={() => setPage('home')}>Home</a> |
            <a href="#" onClick={() => setPage('about')}>About</a> |
            <a href="#" onClick={() => setPage('contact')}>Contact</a>
        </nav>
      <h1>Welcome to website</h1>
      <button style={{ backgroundColor: 'deepskyblue', color: 'white' }}>
       Click Me
      </button>
    </header>
  )
}

export default Header;
