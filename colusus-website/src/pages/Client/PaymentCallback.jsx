import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const reference =
            searchParams.get("reference");

        const trxref =
            searchParams.get("trxref");

        const params = new URLSearchParams();

        if (reference) {
            params.set("reference", reference);
        }

        if (trxref) {
            params.set("trxref", trxref);
        }

        navigate(
            `/portal/finance${params.toString()
                ? `?${params.toString()}`
                : ""
            }`,
            {
                replace: true,
            }
        );
    }, [navigate, searchParams]);

    return (
        <main
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px",
            }}
        >
            <div>
                <h2>Returning to Finance...</h2>

                <p>
                    Confirming your payment.
                </p>
            </div>
        </main>
    );
};

export default PaymentCallback;