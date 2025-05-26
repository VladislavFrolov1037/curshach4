export const createPaymentForm = (data) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = data.url;

    const fields = {
        paymentType: "PC",
        receiver: data.receiver,
        sum: data.sum,
        "quickpay-form": "button",
        label: data.orderId,
        successURL: data.successURL
    };
    console.log(fields)
    Object.entries(fields).forEach(([name, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
    });
    console.log(form)
    document.body.appendChild(form);

    return form;
}