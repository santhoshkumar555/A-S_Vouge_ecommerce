import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const { amount, currency } = req.body;
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"; // ✅ Default to localhost

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency,
                        product_data: { name: "Total Purchase" },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${siteUrl}/success`,  // ✅ Now uses a valid URL
            cancel_url: `${siteUrl}/cancel`,  // ✅ Now uses a valid URL
        });

        console.log("✅ Stripe Checkout Session:", session); // Debugging

        res.status(200).json({ sessionId: session.id }); // ✅ Ensure sessionId is returned
    } catch (error) {
        console.error("Stripe Checkout Error:", error);
        res.status(500).json({ error: error.message });
    }
}
