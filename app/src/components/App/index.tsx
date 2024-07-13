import Header from "../Header"
import Main from "../MainContent"
import Nav from "../Nav"
import classes from "./app.module.scss"

function App() {
  return (
    <div className={classes.app}>
      <Header />
      <Nav />
      <Main />
    </div>
  )
}

export default App
