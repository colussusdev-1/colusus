import { Link } from "react-router-dom";
import { HiOutlineArrowRight, HiOutlineShieldCheck } from "react-icons/hi";

const SecurityStrip = () => (
  <section className="colusus-security-strip">
    <div className="security-icon">
      <HiOutlineShieldCheck />
    </div>

    <div>
      <strong>Your information stays protected</strong>

      <p>
        Your migration documents and application information
        are handled securely.
      </p>
    </div>

    <Link to="/portal/profile">
      Manage your profile
      <HiOutlineArrowRight />
    </Link>
  </section>
);

export default SecurityStrip;
