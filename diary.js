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
        add_event_element(new_form, event, i);
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

    if(event.type != 'Rehearsal') {
        const type_list = {
            'Concert Rehearsal': '#3f51b5',
            'Concert': 'purple',
            'First Rehearsal': 'Green',
            'Cancelled': 'red'
        }
        const event_tag = document.createElement('div');
        event_tag.innerText = event.type;
        event_tag.classList.add('event_tag');
        event_tag.style.background = type_list[event.type];
        event_details.appendChild(event_tag);
    }

    const event_timestamp = document.createElement('p');
    event_timestamp.innerText = event.date.day;
    const super_text = document.createElement('sup');
    super_text.innerText = event.date.suffix;
    event_timestamp.appendChild(super_text);
    event_timestamp.append(` ${event.date.month} (${event.start_time})`);
    event_timestamp.appendChild(document.createElement('br'));
    event_timestamp.append(`${event.location}`)
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

    if(event.type == 'First Rehearsal') {
        form.appendChild(document.createElement('hr'));
        const next_term = document.createElement('h2');
        next_term.innerText = "Next Term..."
        next_term.style.fontStyle = 'italic'
        next_term.style.color = 'grey';
        next_term.style.marginLeft = '1em';
        form.appendChild(next_term);
    };

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