const stripe = require('stripe')(
    'sk_test_51LqSUIL8a4GO17VdgRmzCEGuBiILVtkxBFvJavYUMiw1kR2OViNeIkadHgfeE4WYKb5OwjEDoiuD2xVbRMXm9XBz0060Xj7j4c'
);
const express = require("express");
const app = express();
const PORT = 3000;
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const YOUR_DOMAIN = "http://localhost:3000";

app.post("/create-checkout-session", async (req, res) => {
    try {
        const prices = await stripe.prices.list();
        // console.log(prices);
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: prices.data[0].id,
                    // For metered billing, do not pass quantity
                    quantity: 1,
                },
            ],
            mode: "subscription",
            success_url: `${YOUR_DOMAIN}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${YOUR_DOMAIN}/cancel.html`,
        });

        res.redirect(303, session.url);
    } catch (err) {
        console.log(err);
    }
});

app.listen(PORT, console.log("サーバーが起動しました"));