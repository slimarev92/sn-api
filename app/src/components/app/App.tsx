import Header from "../header/Header";
import Main from "../main-content/MainContent";
import Nav from "../nav/Nav";
import classes from "./app.module.scss";

function App() {
    return (
        <div className={classes.app}>
            <Header />
            <Nav />
            <Main />
        </div>
    );
}

export default App;
