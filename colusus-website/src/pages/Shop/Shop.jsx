import Hero from "./sections/Hero/Hero";
import Categories from "./sections/Categories/Categories";
import Products from "./sections/Products/Products";
import Navbar from "../../components/Navbar/Navbar";
import FeaturedBundle from "./sections/FeaturesBundle/FeaturedBundle";
import WhyBuy from "./sections/WhyBuy/WhyBuy";
import Testimonials from "./sections/Testimonials/Testimonials";
import FAQ from "./sections/FAQ/FAQ";
import CTA from "./sections/CTA/CTA";

const Shop = () => {

    return (

        <>
         
            <Hero />
            <Categories />
            <Products />
            <FeaturedBundle/>
            <WhyBuy/>
            <Testimonials/>
            <FAQ/>
            <CTA/>
        </>

    );

};

export default Shop;