import { formatINR } from "./currency";

const ORDER_PHONE = "919963814860";

export const buildWhatsAppMessage = ({ customer, cartItems, totalAmount }) => {
  const lines = [
    "Namaste! I would like to place a pre-order with Ranganayaki Godavari Ruchulu.",
    "",
    `Customer Name: ${customer.name}`,
    `Phone Number: ${customer.phone}`,
    "",
    "Items:",
    ...cartItems.map(
      (item, index) =>
        `${index + 1}. ${item.name} (${item.size}) - Qty: ${item.quantity} - ${formatINR(
          item.quantity * item.price
        )}`
    ),
    "",
    `Total Amount: ${formatINR(totalAmount)}`,
    `Delivery / Pickup: ${customer.fulfillmentType}`,
    `Address: ${customer.address || "N/A"}`,
    `Notes: ${customer.notes || "N/A"}`,
    "",
    "Pre-orders only. Thank you!",
  ];

  return lines.join("\n");
};

export const buildWhatsAppUrl = (payload) => {
  const message = buildWhatsAppMessage(payload);
  return `https://wa.me/${ORDER_PHONE}?text=${encodeURIComponent(message)}`;
};
