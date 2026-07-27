import {
    HiOutlineUsers,
    HiOutlineGlobeAlt,
    HiOutlineBadgeCheck,
} from "react-icons/hi";

import "./HeroStats.css";

const HeroStats = () => {
    return (
        <>
            <div className="hero-stat stat-one">

                <HiOutlineUsers />

                <div>

                    <h4>5,000+</h4>

                    <span>Successful Clients</span>

                </div>

            </div>

            <div className="hero-stat stat-two">

                <HiOutlineGlobeAlt />

                <div>

                    <h4>18+</h4>

                    <span>Countries Served</span>

                </div>

            </div>

            <div className="hero-stat stat-three">

                <HiOutlineBadgeCheck />

                <div>

                    <h4>98%</h4>

                    <span>Approval Success</span>

                </div>

            </div>
        </>
    );
};

export default HeroStats;