// FUNCTION: Sorts an array's data alphabetically
function sortData(apiData) {
    return apiData.sort(function (a, b) {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) {
        return -1;
        }
        if (nameA > nameB) {
        return 1;
        }
        return 0;
    });
  }

let objectData = {};

let arrayIdCodeAndName;

await fetch('https://xc-countries-api.fly.dev/api/countries/')
.then(response => response.json())
.then(data => {
    sortData(data);
    arrayIdCodeAndName = data.map(item => {
        return [item.id, item.code, item.name];
    })
})
.catch(error => {
    console.error('There was a problem with the API call:', error);
});

for (const array in arrayIdCodeAndName) {
    let stateNames;
    let singleArrayTriad = arrayIdCodeAndName[array];
    let arrayId = singleArrayTriad[0];
    let arrayCode = singleArrayTriad[1];
    let arrayName = singleArrayTriad[2];
    await fetch(`https://xc-countries-api.fly.dev/api/countries/${arrayCode}/states/`)
    .then(response => response.json())
    .then(data => {
        sortData(data);
        stateNames = data.map(state => {
            return state.name;
        })
        objectData[arrayName] = stateNames;
    })
    .catch(error => {
        console.error('There was a problem with the API call:', error);
    });
};

const countryNames = arrayIdCodeAndName.map(item => {
    return item[2];
});
const countryIds = arrayIdCodeAndName.map(item => {
    return item[0];
})

export { objectData, countryNames, countryIds }