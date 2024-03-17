const form = document.getElementById('signup-form');

const name_input = document.getElementById('name');
const email_input = document.getElementById('email');
const consent_box = document.getElementById('consent');

const submit_btn = document.getElementById('submit_btn');

const instrument_checkbox = document.getElementsByName("instruments");
const preferred_instrument_select = document.getElementById('preferred_instrument');
const preferred_options = preferred_instrument_select.querySelectorAll('option');

let selected_instruments = [];

instrument_checkbox.forEach(checkbox => {
  checkbox.addEventListener('change', (e) => {
    const { target } = e;

    if(target.checked) {
      selected_instruments.push(target.value);
      update_select();
      return;
    }
    
    selected_instruments = selected_instruments.filter(inst => inst != target.value);
    update_select();
  });
});

form.addEventListener('change', (e) => {
  console.log('Something\'s changed');
  submit_btn.disabled = !(
    name_input.value.length > 2 &&
    email_input.value.length > 2 &&
    selected_instruments.length > 0 &&
    preferred_instrument_select.selectedIndex > 0 &&
    consent_box.checked
  ) 
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const form_data = new FormData(form);

  form.querySelectorAll('input').forEach(input => {
    input.disabled = true;
  })
  preferred_instrument_select.disabled = true;
  submit_btn.value = "Signing up...";

  await fetch('https://script.google.com/macros/s/AKfycbzfd4X0wNt4Ohd7itePP4Br_qw8bGmQn2iyAxkHbuGPgoul3rRR_cQkcQWdytILYFLkPQ/exec', {
    method: 'POST',
    body: form_data
  });
})

const update_select = () => {
  if(selected_instruments.length < 1) {
    preferred_instrument_select.disabled = true;
    preferred_instrument_select.selectedIndex = 0;
    return;
  }

  preferred_instrument_select.disabled = false;

  
  preferred_options.forEach(opt => {
    if(selected_instruments.length > 1 && ['No Preference'].includes(opt.innerText)) return opt.disabled = false;
    opt.disabled = !selected_instruments.includes(opt.value);
  });

  if(!selected_instruments.includes(preferred_instrument_select.value)) {
    preferred_instrument_select.value = selected_instruments[0];
  }
}
