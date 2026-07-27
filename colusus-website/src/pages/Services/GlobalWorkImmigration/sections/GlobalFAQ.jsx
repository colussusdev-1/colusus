import "./GlobalFAQ.css";

const faqs = [

    {
        q: "Do I need a job offer to apply?",
        a: "Not always. Some programs like Express Entry and study pathways do not require a job offer."
    },

    {
        q: "How long does the process take?",
        a: "Processing times vary by program, typically between 3 months to 18 months depending on the pathway."
    },

    {
        q: "Can I apply without IELTS?",
        a: "Some programs require IELTS or language proof, but alternatives may be available depending on your profile."
    },

    {
        q: "What if I don’t qualify?",
        a: "We assess your profile and recommend alternative pathways you may qualify for."
    },

    {
        q: "Do you guarantee visa approval?",
        a: "No one can guarantee approval. However, we maximize your chances through proper documentation and strategy."
    },

];

const GlobalFAQ = () => {

    return (

        <section className="gf">

            <div className="container">

                <div className="gf__header">

                    <span className="gf__tag">FAQ</span>

                    <h2>
                        Frequently Asked
                        <span> Questions</span>
                    </h2>

                </div>

                <div className="gf__list">

                    {faqs.map((item, index) => (

                        <details className="gf__item" key={index}>

                            <summary>
                                {item.q}
                            </summary>

                            <p>
                                {item.a}
                            </p>

                        </details>

                    ))}

                </div>

            </div>

        </section>

    );
};

export default GlobalFAQ;