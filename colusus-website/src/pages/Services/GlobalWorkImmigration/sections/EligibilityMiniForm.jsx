import "./EligibilityMiniForm.css";

import { useState } from "react";

const EligibilityMiniForm = () => {

    const [step, setStep] = useState(1);

    const [form, setForm] = useState({
        age: "",
        education: "",
        country: "",
    });

    const next = () => setStep((s) => Math.min(s + 1, 3));
    const back = () => setStep((s) => Math.max(s - 1, 1));

    return (

        <section className="emf">

            <div className="container">

                <div className="emf__wrap">

                    {/* HEADER */}
                    <div className="emf__header">

                        <span className="emf__tag">
                            INSTANT ELIGIBILITY CHECK
                        </span>

                        <h2>
                            Find Out Your Best Immigration Pathway
                        </h2>

                        <p>
                            Answer a few quick questions and get guided recommendations instantly.
                        </p>

                        <div className="emf__progress">
                            <div className={`emf__bar step-${step}`}></div>
                            <span>Step {step} of 3</span>
                        </div>

                    </div>

                    {/* CARD */}
                    <div className="emf__card">

                        {/* STEP 1 */}
                        {step === 1 && (
                            <div className="emf__step">

                                <label>Age</label>

                                <input
                                    type="number"
                                    placeholder="e.g. 25"
                                    value={form.age}
                                    onChange={(e) =>
                                        setForm({ ...form, age: e.target.value })
                                    }
                                />

                                <p className="emf__hint">
                                    Your age helps determine eligibility score.
                                </p>

                            </div>
                        )}

                        {/* STEP 2 */}
                        {step === 2 && (
                            <div className="emf__step">

                                <label>Highest Education</label>

                                <select
                                    value={form.education}
                                    onChange={(e) =>
                                        setForm({ ...form, education: e.target.value })
                                    }
                                >

                                    <option value="">Select your qualification</option>
                                    <option>High School</option>
                                    <option>Diploma</option>
                                    <option>Bachelor's Degree</option>
                                    <option>Master's Degree</option>

                                </select>

                                <p className="emf__hint">
                                    Education level affects visa pathway options.
                                </p>

                            </div>
                        )}

                        {/* STEP 3 */}
                        {step === 3 && (
                            <div className="emf__step">

                                <label>Preferred Country</label>

                                <select
                                    value={form.country}
                                    onChange={(e) =>
                                        setForm({ ...form, country: e.target.value })
                                    }
                                >

                                    <option value="">Choose destination</option>
                                    <option>Canada</option>
                                    <option>UK</option>
                                    <option>Germany</option>
                                    <option>Australia</option>

                                </select>

                                <p className="emf__hint">
                                    We match you with the fastest available route.
                                </p>

                            </div>
                        )}

                        {/* ACTIONS */}
                        <div className="emf__actions">

                            {step > 1 && (
                                <button className="emf__btn ghost" onClick={back}>
                                    Back
                                </button>
                            )}

                            {step < 3 ? (
                                <button className="emf__btn primary" onClick={next}>
                                    Continue
                                </button>
                            ) : (
                                <button className="emf__btn primary">
                                    Get My Result
                                </button>
                            )}

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );
};

export default EligibilityMiniForm;