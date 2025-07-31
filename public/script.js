let modifications = { 'Chapas': 0 }; // Initialize with Chapas count at 0
let multipliers = []; // Stores all active multipliers

document.addEventListener("DOMContentLoaded", () => {
  const dateElement = document.getElementById("currentDate");
  const today = new Date();
  dateElement.innerText = today.toLocaleDateString(); // Set the current date
});

function updateItem(item, price, change) {
  // Increase or decrease the count of 'Chapas'
  modifications[item] = (modifications[item] || 0) + change;
  if (modifications[item] < 0) modifications[item] = 0; // Prevent negative values

  // Update the display for the current count of 'Chapas'
  document.getElementById(item).innerText = modifications[item];

  calculateTotal();
}

function updatePrices(classSelected) {
  let fullTune, turbo, motor, transmissao;

  clearAll();

  switch (classSelected) {
    case "A":
      fullTune = 45000;
      turbo = 15000;
      motor = 15000;
      transmissao = 15000;
      break;
    case "B":
      fullTune = 75000;
      turbo = 25000;
      motor = 25000;
      transmissao = 25000;
      break;
    case "C":
      fullTune = 105000;
      turbo = 37000;
      motor = 37000;
      transmissao = 37000;
      break;
    case "D":
      fullTune = 135000;
      turbo = 40000;
      motor = 40000;
      transmissao = 40000;
      break;
    case "E":
      fullTune = 165000;
      turbo = 45000;
      motor = 45000;
      transmissao = 45000;
      break;
    case "F":
      fullTune = 200000;
      turbo = 50000;
      motor = 50000;
      transmissao = 50000;
      break;
    default:
      fullTune = turbo = motor = transmissao = 0;
      break;
  }

  // Update prices in HTML
  document.getElementById("fullTunePrice").innerText = fullTune;
  document.getElementById("turboPrice").innerText = turbo;
  document.getElementById("motorPrice").innerText = motor;
  document.getElementById("transmissaoPrice").innerText = transmissao;

  document.getElementById("fullTuneCheckbox").value = fullTune;
  document.getElementById("turboCheckbox").value = turbo;
  document.getElementById("motorCheckbox").value = motor;
  document.getElementById("transmissaoCheckbox").value = transmissao;

}

function updateCheckboxItem(checkbox, item) {
  // Set item price if checked, remove if unchecked
  if (checkbox.checked) {
    modifications[item] = parseFloat(checkbox.value);
  } else {
    delete modifications[item];
  }
  calculateTotal();
}

function calculateTotal() {
  let baseTotal = 0;

  // Calculate the total for each item in modifications
  for (const [item, qty] of Object.entries(modifications)) {
    if (item === 'Chapas') {
      baseTotal += qty * 5000; // Each Chapas costs 5000
    } else {
      baseTotal += qty; // Other items add their fixed price
    }
  }

  // Apply multipliers
  let finalMultiplier = multipliers.reduce((acc, curr) => acc * curr, 1);
  document.getElementById("totalPrice").innerText = (baseTotal * finalMultiplier).toFixed(2);
  document.getElementById("totalPriceIVA").innerText = (document.getElementById("totalPrice").innerText * 1.15).toFixed(2);
}

function updateMultiplier(checkbox) {
  const value = parseFloat(checkbox.value);
  if (checkbox.checked) {
    multipliers.push(value);
  } else {
    multipliers = multipliers.filter(mult => mult !== value);
  }
  calculateTotal();
}

function clearAll() {
  modifications = { 'Chapas': 0 };
  multipliers = [];
  document.querySelectorAll("#modifications .item span").forEach(span => span.innerText = 0);
  document.querySelectorAll("#modifications input[type='checkbox']").forEach(checkbox => checkbox.checked = false);
  document.querySelectorAll("#multipliers input[type='checkbox']").forEach(checkbox => checkbox.checked = false);
  document.getElementById("motoClass").value = "none";
  document.getElementById("totalPrice").innerText = 0;
  document.getElementById("totalPriceIVA").innerText = 0;
  document.getElementById("motarName").value = '';
}

function saveTotal() {
  const name = document.getElementById("motarName").value;
  const date = document.getElementById("currentDate").innerText;
  const total = document.getElementById("totalPrice").innerText;

  if (name) {
    // Send data to the server
    fetch('/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, date, total }),
    })
      .then(response => {
        if (response.ok) {
          alert("Saved successfully");
        } else {
          alert("Error saving data");
        }
      })
      .catch(error => {
        console.error("Error:", error);
      });
  } else {
    alert("Please fill in the Motar name.");
  }
}

function ifCheck() {
  if (document.getElementById("prospectCheckBox").checked) {
    document.getElementById("fullTuneCheckbox").checked = false;
  }

}

async function sendTotal() {
  if (document.getElementById("motarName").value === '') {
    alert("Por favor preencha o nome do Motar.");
    return;
  }

  const name = document.getElementById('motarName').value;
  const date = document.getElementById('currentDate').innerText;
  const total = (document.getElementById('totalPrice').innerText) * 1;
  const IVA = total * 1.15;
  const referenceID = Math.floor(100000 + Math.random() * 900000);
  let prospect = document.getElementById("prospectCheckBox").checked ? 'Sim' : 'Não';
  let comissao = document.getElementById("comissaoCheckBox").checked ? 'Sim' : 'Não';
  let parceria = document.getElementById("parceriaCheckBox").checked ? 'Sim' : 'Não';

  const webhookURL = 'https://discord.com/api/webhooks/1340051190913826846/E1t-dt7OXXQapVLfqjnJsBXSh9edQ-RqiwfEcFN8OuWWeFJBqtkcecLlvkq4OTes1rN8';
  
  const message = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                  `**🚨 Iron Shores Modification Report 🚨**\n\n` +
                  `🔹 **Detalhes do Motar**\n\n` +
                  `   **Nome**: ${name}\n` +
                  `   **Data**: ${date}\n\n` +
                  `🔹 **Multiplicadores**\n\n` +
                  `   **Prospect**: ${prospect}\n` +
                  `   **Comissão**: ${comissao}\n` +
                  `   **Parceria**: ${parceria}\n\n` +
                  `🔹 **Total Faturado**\n\n` +
                  `   **Total sem IVA**: ${total}\n` +
                  `   **Total com IVA**: ${IVA}\n\n` +
                  `---\n\n` +
                  `📌 *ID*: \`#${referenceID}\`\n\n` +
                  `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

  const payload = {
    content: message
  };

  try {
    const response = await fetch(webhookURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert('Message sent successfully to Discord!');
      // Optionally clear the input fields after sending
      document.getElementById('motarName').value = '';
    } else {
      alert('Failed to send message. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while sending the message.');
  }

  clearAll();
}


document.addEventListener("DOMContentLoaded", function () {
  const bikes = document.querySelectorAll(".bike-display");

  bikes.forEach(bike => {
    const blipPrice = parseFloat(bike.querySelector(".blip-price").textContent);
    const taxPrice = blipPrice * 0.16; // Calcula 16% de imposto
    const totalPrice = blipPrice + taxPrice; // Soma preço e imposto

    bike.querySelector(".tax-price").textContent = taxPrice.toFixed(2);
    bike.querySelector(".total-price").textContent = totalPrice.toFixed(2);
  });
});

function updateList(criteria) {
  const bikes = Array.from(document.querySelectorAll('.menu-section'));
  bikes.sort((a, b) => {
    const aValue = a.querySelector(criteria === 'name' ? '.bike-name' : '.classe').innerText;
    const bValue = b.querySelector(criteria === 'name' ? '.bike-name' : '.classe').innerText;
    return aValue.localeCompare(bValue, undefined, { numeric: true });
  });
  bikes.forEach(bike => document.querySelector('.menu-section-container').appendChild(bike));
}
