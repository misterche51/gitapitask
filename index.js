const input = document.querySelector('.main__input');
const URL = "https://api.github.com/search/repositories";
const autocompleteList = document.querySelector('.main__autocomplete');
const favourites = document.querySelector('.main__results');

const debounce = (fn, debounceTime) => {
  let debouncedId;
  return function(){
    const args = arguments;
    const context = this;
    clearTimeout(debouncedId);
    debouncedId = setTimeout(() => fn.apply(context, args),debounceTime);
  }
};

const clearAutoCompleteList = () => {
  while (autocompleteList.firstChild) {
    autocompleteList.removeChild(autocompleteList.firstChild);
  }
}

const addToFavorites = (e) => {
  const data  = {
    name: e.target.textContent,
    owner: e.target.getAttribute('data-owner'),
    stars: e.target.getAttribute('data-stars'),
  };

  let pName = document.createElement('p');
  pName.append(data.name);
  let pOwner = document.createElement('p');
  pOwner.append(data.owner);
  let pStars = document.createElement('p');
  pStars.append(data.stars);
  const dataArr = [pName,pOwner,pStars];
  for (let p of dataArr) {
    p.className = "main__results-item-text";
  }
  let deleteButton = document.createElement('button');
  deleteButton.className = "main__results-item-button-delete";

  let li = document.createElement('li');
  li.addEventListener('click', (e) => {
    if (e.target ==  deleteButton) {
      li.remove();
    }
  })
  li.className = "main__results-item";
  li.append(...dataArr, deleteButton);
  favourites.append(li);
  input.value = '';
  clearAutoCompleteList();
}

const createAutocoplittedResultsArray = (data) => {
  let result = [];
  for (let item of data) {
    let li = document.createElement('li');
    li.className = "main__autocomplete-item";
    li.dataset.stars = `${item.stars}`;
    li.dataset.owner = `${item.owner}`;
    li.append(item.name);
    li.addEventListener('click', (e)=> addToFavorites(e));
    result.push(li);
  }
  return result;
}

const renderAutocomplittedResults = (data) => {
  clearAutoCompleteList();
  autocompleteList.append(...data);
};



const fetchingData = (request) => {
  return fetch(`${URL}?q=${request}`)
    .then(response => response.json())
    .then(data => data.items.slice(0,5))
    .then(arr => arr.map(item => ({'name': item.name, 'owner': item.owner.login, 'stars': item.stargazers_count})))
    .then(data => createAutocoplittedResultsArray(data))
    .then(arr => renderAutocomplittedResults(arr));
}

const debounced = debounce(fetchingData,500);

input.addEventListener('change', (e) => {
  debounced(e.target.value);
})
