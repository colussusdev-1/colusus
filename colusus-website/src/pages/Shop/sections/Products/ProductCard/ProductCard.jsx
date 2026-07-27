import "./ProductCard.css";

import {
    FiDownload,
    FiArrowRight,
    FiStar
} from "react-icons/fi";

const ProductCard = ({ product }) => {

    return (

        <article className="product-card">

            <div className="product-image">

                <img
                    src={product.image}
                    alt={product.title}
                />

                <span className="product-category">

                    {product.category}

                </span>

            </div>

            <div className="product-content">

                <h3>

                    {product.title}

                </h3>

                <div className="product-rating">

                    {

                        [...Array(product.rating)].map((_, index) => (

                            <FiStar
                                key={index}
                                fill="currentColor"
                            />

                        ))

                    }

                </div>

                <div className="product-meta">

                    <FiDownload />

                    <span>

                        {product.downloads}

                    </span>

                </div>

                <div className="product-footer">

                    <strong>

                        {product.price}

                    </strong>

                    <button>

                        <span>

                            Buy

                        </span>

                        <FiArrowRight />

                    </button>

                </div>

            </div>

        </article>

    );

};

export default ProductCard;