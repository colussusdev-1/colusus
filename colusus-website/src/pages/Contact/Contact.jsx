import Hero from "./sections/Hero/Hero";
import ContactOptions from "./sections/ContactOptions/ContactOptions";
import ContactForm from "./sections/ContactForm/ContactForm";

const Contact = () => {

    return (

        <main className="contact-page">
           
            <Hero />

            <ContactOptions />

            <ContactForm />

        </main>

    );

};

export default Contact;