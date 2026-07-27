import Hero from "./sections/Hero/Hero";
import FeaturedPost from "./sections/FeaturedPost/FeaturedPost";
import BlogGrid from "./sections/BlogGrid/BlogGrid";
import Newsletter from "./sections/Newsletter/Newsletter";
import Navbar from "../../components/Navbar/Navbar";

const Blog = () => {

    return (

        <>
        <Navbar/>
         
            <FeaturedPost />
            <BlogGrid />
            <Newsletter />
        </>

    );

};

export default Blog;