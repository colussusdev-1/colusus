import "./BenefitCard.css";

const BenefitCard = ({
    benefit
}) => {

    const Icon = benefit.icon;

    return (

        <article className="benefit-card">

            <div className="benefit-icon">

                <Icon />

            </div>

            <h3>

                {benefit.title}

            </h3>

            <p>

                {benefit.description}

            </p>

        </article>

    );

};

export default BenefitCard;