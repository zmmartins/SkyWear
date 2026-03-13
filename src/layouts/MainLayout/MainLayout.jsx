import Navbar from "@/layouts/Navbar";
import "./MainLayout.css"; // We will create this small file!

/**
 * MainLayout serves as the root structural wrapper for the application.
 * It ensures the Navbar is persistently rendered across all page routes
 * without unmounting during client-side navigation.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The page content to render below the Navbar.
 */
const MainLayout = ({ children }) => {
    return (
        <div className="main-layout">
            <Navbar />

            {/* The main tag is set to flex-grow so it pushes the footer down */}
            <main className="main-layout__content">
                {children}
            </main>
            
            {/* <Footer /> will go here in the future */}
        </div>
    );
};

export default MainLayout;