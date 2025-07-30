function calcular() {
  const preco = parseFloat(document.getElementById("preco").value);
  const multiplicador = parseFloat(document.getElementById("multiplicador").value);
  const total = preco * multiplicador;
  document.getElementById("total").textContent = total.toFixed(2);
}

function guardar() {
  const motar = document.getElementById("motar").value;
  const total = parseFloat(document.getElementById("total").textContent);

  fetch('/api/transaction', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ motar, total })
  })
  .then(res => res.json())
  .then(data => {
    alert("Guardado com sucesso! ID: " + data.id);
  })
  .catch(err => alert("Erro ao guardar"));
}
