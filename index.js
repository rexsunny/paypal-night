const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');

const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const payPalClient = require('./payPalClient');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('checkout'));


app.post('/paypal-transaction-complete', async function (req, res) {

  const orderID = req.body.orderID;


  let request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderID);

  let order;
  try {
    order = await payPalClient.client().execute(request);
  } catch (err) {


    console.error(err);
    return res.send(500);
  }


  if (order.result.purchase_units[0].amount.value !== '65.00') {
    return res.send(400);
  }


  return res.send(200);


});


app.get('/success_page', function (req, res) {
  res.render('success_page', { orderID: req.query.orderID, message: 'Successfully purchased The PayPal Wars.'})
});

app.listen(process.env.PORT, () => console.log('Server Started'));
