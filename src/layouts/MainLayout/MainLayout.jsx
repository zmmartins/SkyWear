import Navbar from "../Navbar";

const MainLayout = ({ children }) => {
    return (
        <div className="main-layout">
            <Navbar/>

            <main>
                { children }
            </main>
            
            {/* <Footer /> will go here */}
        </div>
    )
}

export default MainLayout;