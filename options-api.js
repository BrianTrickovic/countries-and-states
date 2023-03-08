// FUNCTION: Sorts an array's data alphabetically + handles cases where
// the names may contain special characters or diacritics
function sortData(apiData) {
    return apiData.sort((a, b) => a.name.localeCompare(b.name));
}

async function independentDropdownData(element, value) {
    try {
        const response = await fetch('https://xc-countries-api.fly.dev/api/countries/');
        if (response.ok) {
            const jsonResponse = await response.json();
            sortData(jsonResponse);
            let convertedArrayData;
            switch (value) {
                case 'code':
                    convertedArrayData = jsonResponse.map(item => {
                        return {value: item.code, name: item.name}
                    })
                    break;
                    
                case 'id':
                    convertedArrayData = jsonResponse.map(item => {
                        return {value: item.id, name: item.name}
                    })
                    break;

                default:
                    break;
            }
            element.optionsArray = convertedArrayData;
        }
    } catch (error) {
        console.log('There was a problem with the API call:', error);
    }
}

async function dependentDropdownData(code, element) {
    try {
        const response = await fetch(`https://xc-countries-api.fly.dev/api/countries/${code}/states/`);
        if (response.ok) {
            const jsonResponse = await response.json();
            sortData(jsonResponse);
            element.optionsArray = jsonResponse;
        }
    } catch (error) {
        console.log('There was a problem with the API call:', error);
    }
}


export { independentDropdownData, dependentDropdownData }