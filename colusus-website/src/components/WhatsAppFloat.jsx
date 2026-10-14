import { FaWhatsapp } from "react-icons/fa";
import "./WhatsAppFloat.css";

const WHATSAPP_NUMBER = "2349026953513";

const WHATSAPP_MESSAGE =
    "Hello Colossus Migration & Tours, I would like to make an enquiry about your services.";

function WhatsAppFloat() {
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        WHATSAPP_MESSAGE
    )}`;

    return (
        <a
            href={whatsappUrl}
            className="whatsapp-float"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Colossus Migration and Tours on WhatsApp"
            title="Chat with us on WhatsApp"
        >
            <FaWhatsapp className="whatsapp-float-icon" />

            <span className="whatsapp-float-tooltip">
                Chat with us
            </span>
        </a>
    );
}

export default WhatsAppFloat;