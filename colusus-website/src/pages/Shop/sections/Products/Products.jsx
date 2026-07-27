import "./Products.css";

import products from "../../productData";

import ProductCard from "./ProductCard/ProductCard";

const Products = () => {

    return (

        <section className="products-section">

            <div className="products-container">

                <div className="products-header">

                    <h2>

                        Popular Resources

                    </h2>

                    <p>

                        Explore our most downloaded guides,
                        templates and relocation resources.

                    </p>

                </div>

                <div className="products-grid">

                    {

                        products.map(product => (

                            <ProductCard
                                key={product.id}
                                product={product}
                            />

                        ))

                    }

                </div>

            </div>

        </section>

    );

};

export default Products;