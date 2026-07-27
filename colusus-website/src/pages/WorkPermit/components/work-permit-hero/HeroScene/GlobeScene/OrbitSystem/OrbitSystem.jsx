import "./OrbitSystem.css";

const OrbitSystem = () => {
    return (
        <div className="orbit-system">

            <div className="orbit orbit-primary">
                <span className="orbit-node"></span>
            </div>

            <div className="orbit orbit-secondary">
                <span className="orbit-node"></span>
            </div>

            <div className="orbit orbit-tertiary">
                <span className="orbit-node"></span>
            </div>

        </div>
    );
};

export default OrbitSystem;