async function loadCharges() {
  // Load charges from storage
  // charges are denominated in dollars
  const result = await chrome.storage.sync.get("charges");
  console.log("Charges: ", result.charges);
  return result.charges || 0;
}

async function main() {
  let totalCharges = await loadCharges();
  totalCharges = totalCharges.toFixed(2); // format to 2 decimal places
  console.log("Total charges: ", totalCharges);
  document.getElementById("current-charges-numeric").textContent = totalCharges;
}

main();
