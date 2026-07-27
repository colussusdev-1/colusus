import "./Categories.css";

const categories = [

    "All Products",

    "Immigration",

    "Career",

    "Business",

    "Study Abroad",

    "Travel",

    "Templates"

];

const Categories = () => {

    return (

        <section className="shop-categories">

            <div className="shop-categories-container">

                <div className="categories-header">

                    <h2>

                        Browse By Category

                    </h2>

                    <p>

                        Find the exact resources you need for
                        immigration, career growth, education,
                        travel or global business expansion.

                    </p>

                </div>

                <div className="categories-list">

                    {

                        categories.map(category => (

                            <button
                                key={category}
                                className={
                                    category === "All Products"
                                    ? "category-pill active"
                                    : "category-pill"
                                }
                            >

                                {category}

                            </button>

                        ))

                    }

                </div>

            </div>

        </section>

    );

};

export default Categories;