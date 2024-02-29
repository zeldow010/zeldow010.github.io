const content_element = document.querySelector('.content');
const member_element = document.getElementById('member');

const token = new URLSearchParams(window.location.search).get('token');

const onload = async () => {
    const data = await fetch(`https://script.google.com/macros/s/AKfycbywxmHr7tvUzor3n_Wf7wRBimkiv4inje0kULvMBil11S9zXxc68UCCRdAcu1CRP-IOMg/exec?token=${token}`);

    const response = await data.json();
    
    console.log(response);

    content_element.innerHTML = '';

    if(response.message == "Error") {
        const new_p = document.createElement('p')
        new_p.innerText = `Unable to fetch diary ${ !token ? 'as no identifying token was supplied' : 'as the token supplied may be incorrect or even out of date'}`

        content_element.appendChild(new_p);
        return;
    }

    member_element.innerText = `Hi, ${response.name}`;

    if(response?.events.length < 1) {
        const new_p = document.createElement('p');
        new_p.innerText = 'Unfortunately there are nothing in the calender at the moment, please check again later - Dom'
        content_element.appendChild(new_p);

        return;
    }

    const new_form = document.createElement('form')
    new_form.method = 'POST';
    new_form.addEventListener('submit', handle_submit);


    response?.events.forEach((event, i) => {
        add_event_element(new_form, event, i)
    });

    const submit_btn = document.createElement('input');
    submit_btn.type = "submit";
    submit_btn.value = "Update Diary"
    submit_btn.classList = "submit_btn";
    new_form.appendChild(submit_btn);

    content_element.appendChild(new_form);
}

const add_event_element = (form, event, index) => {
    const event_container = document.createElement('div');
    const event_details = document.createElement('div');
    const event_btns = document.createElement('div');

    event_container.classList = "event_container";
    event_btns.classList = "btn_container";

    if(index == 0) {
        event_container.classList.add('next_event')

        const next_event_span = document.createElement('span');
        next_event_span.innerText = 'Next Event...';
        event_details.appendChild(next_event_span);
    }

    const event_name = document.createElement('h2');
    event_name.innerText = event.name;
    event_details.appendChild(event_name);

    const event_timestamp = document.createElement('p');
    event_timestamp.innerText = `${event.date} (${event.start_time}) - ${event.location}`;
    event_details.appendChild(event_timestamp);

    const event_going_label = document.createElement('label');
    event_going_label.classList = "response_btn";
    
    const event_reject_label = event_going_label.cloneNode(true);
    event_going_label.innerText = "✓"
    event_reject_label.innerText = "✕"

    const event_going_btn = document.createElement('input');
    event_going_btn.type = "radio";
    event_going_btn.name = event.id;
    event_going_btn.value = "true";
    event_going_btn.checked = event?.response?.response == true;
    
    const event_reject_btn = event_going_btn.cloneNode(true);
    event_reject_btn.value = "false";
    event_reject_btn.checked = event?.response?.response == false;

    
    event_going_label.appendChild(event_going_btn)
    event_reject_label.appendChild(event_reject_btn);

    event_going_label.classList.add('going_btn');
    event_reject_label.classList.add('reject_btn');

    event_btns.appendChild(event_going_label);
    event_btns.appendChild(event_reject_label);

    event_container.appendChild(event_details);
    event_container.appendChild(event_btns);

    form.appendChild(event_container);
}

const handle_submit = async (e) => {
    e.preventDefault();
    
    const { target, submitter } = e;

    const event_response = new FormData(target);
    
    const response_btns = document.querySelectorAll('input[type="radio"]');

    submitter.disabled = true;
    submitter.value = 'Updating...';

    response_btns.forEach(btn => { btn.disabled = true });
    
    const data = await fetch(`https://script.google.com/macros/s/AKfycbywxmHr7tvUzor3n_Wf7wRBimkiv4inje0kULvMBil11S9zXxc68UCCRdAcu1CRP-IOMg/exec?token=${token}`, {
        method: 'POST',
        body: event_response
    });
    
    const response = await data.json();
    
    submitter.disabled = false;
    submitter.value = 'Update Diary';

    response_btns.forEach(btn => { btn.disabled = false });

    console.log(response);
}

onload();