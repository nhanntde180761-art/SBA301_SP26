function Header({ setPage }) {
  return (
    <header className="p-3 bg-light">
      <nav>
        <a href="#" onClick={(e) => { e.preventDefault(); setPage('home') }}>home</a> |
        <a href="#" onClick={(e) => { e.preventDefault(); setPage('about') }}>about</a> |
        <a href="#" onClick={(e) => { e.preventDefault(); setPage('contact') }}>contact</a>
      </nav>
      <h1>welcome to website</h1>
    </header>
  )
}
export default Header
