import "./AboutTeam.css";


import tony from "../../../../assets/images/team/tony.jpg";
import stanley from "../../../../assets/images/team/Stanley.jpg";
import nnamdi from "../../../../assets/images/team/Nnamdi.jpg";
import rosemary from "../../../../assets/images/team/Rosemary.jpg";
import jane from "../../../../assets/images/team/jane.jpg";
import esther from "../../../../assets/images/team/Esther.jpg";
import praise from "../../../../assets/images/team/Praise.jpg";



const founder = {

    name:"Tony Chiugo Josephat",

    role:"Chief Immigration Director",

    badge:"Founder & Immigration Lead",

    desc:
    "Leading global immigration strategies and guiding clients through trusted international pathways, business expansion and migration opportunities.",

    image:tony

};





const leadership = [

    {
        name:"Esther Adeoje",

        role:"Executive Strategist",

        tag:"Strategy & Growth",

        desc:
        "Developing strategic frameworks that strengthen business direction, customer experience and global expansion initiatives.",

        image:esther
    }

];






const operations = [

    {
        name:"Stanley Okonkwo",

        role:"Finance Controller & Account Manager",

        tag:"Finance • Operations",

        desc:
        "Managing financial operations while supporting client relationships and organizational efficiency.",

        image:stanley
    },


    {
        name:"Nnamdi Chinedu C.",

        role:"Head of Operations & Migration",

        tag:"Migration Operations",

        desc:
        "Coordinating migration processes and ensuring smooth execution across client journeys.",

        image:nnamdi
    }

];







const technology = [

    {
        name:"Akosile Olaide J.",

        role:"Web Developer",

        tag:"Digital Development",

        desc:
        "Building digital experiences and technology solutions that support business growth.",

        image:null
    },


    {
        name:"Udeme Sam",

        role:"Website Developer / Software",

        tag:"Technology",

        desc:
        "Supporting software development and digital infrastructure initiatives.",

        image:null
    }

];







const clientExperience = [

    {
        name:"Rosemary O. Effiong",

        role:"Office Admin & Content Creator",

        tag:"Client Experience",

        desc:
        "Managing office coordination and creating engaging content that strengthens client communication.",

        image:rosemary,

        className:"rosemary-photo"

    },


    {
        name:"Praise",

        role:"Digital Marketing Lead",

        tag:"Marketing & Growth",

        desc:
        "Driving digital visibility and marketing strategies to connect with global audiences.",

        image:praise
    },


    {
        name:"Jane Lilian Onyebuchi",

        role:"Admin Manager",

        tag:"Administration",

        desc:
        "Managing internal processes and supporting efficient daily operations.",

        image:jane
    }

];








/*
====================================
 AVATAR
====================================
*/


const Avatar = ({
    member
}) => {


    return (

        <div className="team-avatar">


            {
                member.image

                ?

                <img

                    src={member.image}

                    alt={member.name}

                    className={member.className || ""}

                />

                :

                <div className="avatar-placeholder">

                    {member.name.charAt(0)}

                </div>

            }


        </div>

    );

};









/*
====================================
 FOUNDER SPOTLIGHT
====================================
*/


const FounderCard = () => {


    return (

        <article className="founder-card">


            <div className="founder-background"></div>



            <div className="founder-avatar">


                <img

                    src={founder.image}

                    alt={founder.name}

                />


            </div>





            <div className="founder-content">


                <span className="founder-badge">

                    {founder.badge}

                </span>



                <h3>

                    {founder.name}

                </h3>



                <h4>

                    {founder.role}

                </h4>



                <p>

                    {founder.desc}

                </p>





                <div className="founder-meta">


                    <span>
                        Global Immigration
                    </span>


                    <span>
                        Business Advisory
                    </span>


                    <span>
                        Strategic Growth
                    </span>


                </div>


            </div>



        </article>

    );

};










/*
====================================
 STANDARD TEAM CARD
====================================
*/


const TeamCard = ({
    member
}) => {


    return (

        <article className="team-card">


            <Avatar

                member={member}

            />



            <div className="team-info">


                <span className="team-role-tag">

                    {member.tag}

                </span>




                <h3>

                    {member.name}

                </h3>




                <h4>

                    {member.role}

                </h4>




                <p>

                    {member.desc}

                </p>



            </div>



        </article>

    );

};









/*
====================================
 GROUP
====================================
*/


const TeamGroup = ({
    title,
    data,
    type=""
}) => {


    return (

        <section className={`team-section ${type}`}>


            <h3 className="section-title">

                {title}

            </h3>




            <div className="team-grid">


                {

                    data.map((member,index)=>(


                        <TeamCard

                            key={index}

                            member={member}

                        />


                    ))

                }


            </div>



        </section>

    );

};









/*
====================================
 MAIN
====================================
*/


const AboutTeam = () => {


    return (

        <section className="about-team">


            <div className="team-container">





                <header className="team-header">


                    <span>

                        OUR PEOPLE

                    </span>



                    <h2>

                        The professionals behind your


                        <strong>

                            global journey

                        </strong>


                    </h2>



                    <p>

                        Immigration experts, strategists and technology professionals working together to create trusted international pathways.

                    </p>



                </header>







                <FounderCard />








                <TeamGroup

                    title="Executive Leadership"

                    data={leadership}

                    type="executive-section"

                />






                <TeamGroup

                    title="Operations & Migration"

                    data={operations}

                />






                <TeamGroup

                    title="Technology Team"

                    data={technology}

                />






                <TeamGroup

                    title="Client Experience"

                    data={clientExperience}

                />





            </div>


        </section>

    );

};




export default AboutTeam;