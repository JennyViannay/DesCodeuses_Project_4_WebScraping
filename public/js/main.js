console.log('hello from the frontend');

// handle category
document.getElementById('category').addEventListener('change', async (e) => {
    const category = e.target.value;
    const results = await axios.get(`/api?category=${category}`)
    .then(response => response.data)
    .catch(err => console.log('err :', err));
    
    const row_results = document.getElementById('row_results');
    row_results.innerHTML = "";
    results.forEach(result => {
        const container = document.createElement('div');
        const card = document.createElement('div');
        const card_title = document.createElement('h2');
        const card_body = document.createElement('div');
        const card_footer = document.createElement('div');
        const card_img = document.createElement('img');
        console.log(result);
        container.className = 'col-lg-3 col-md-4 col-sm-12';
        card.className = 'card my-3 mx-2';
        card_title.className = 'card-title';
        card_title.innerHTML = result.title;
        card_body.className = 'card-body';
        card_footer.className = 'card-footer';
        card_footer.innerHTML = `<b>Price :</b> ${result.price}`;
        card_img.className = 'card-img-top';
        card_img.src = result.image;
        card_img.alt = result.title;
        card.appendChild(card_img);
        card.appendChild(card_title);
        card.appendChild(card_body);
        result.infos.map(info => {
            const p = document.createElement('p');
            p.innerHTML = `<b>${info.label}</b> : ${info.value}`;
            card_body.appendChild(p);
        });
        card.appendChild(card_footer);
        container.appendChild(card);
        row_results.appendChild(container);
        
    })
});